package main

import (
	"fmt"
	"math"
	"time"

	"github.com/hajimehoshi/ebiten/v2"
	"golang.org/x/exp/rand"
)

func init() {
	rand.Seed(uint64(time.Now().Unix()))
}

type DefaultTankController struct {
}

// calculateDirection 根据当前位置和目标位置计算移动方向。
func (c *DefaultTankController) calculateDirection(x1, y1, x2, y2 float32) BaseItemID {
	if math.Abs(float64(x1-x2)) > math.Abs(float64(y1-y2)) {
		if x2 > x1 {
			return MoveRight
		}
		return MoveLeft
	}
	if y2 > y1 {
		return MoveDown
	}
	return MoveUp
}

// calculateDirectionBFS 使用 BFS 查找路径并返回下一步的方向。
func calculateDirectionBFS(self Tank, target *Tank, f BattlefieldInfo) BaseItemID {
	type Point struct {
		X, Y   float32
		Parent *Point
		Dir    BaseItemID
	}

	visited := make(map[string]bool)
	queue := []Point{{X: self.X, Y: self.Y, Parent: nil, Dir: BaseItemNone}}

	// BFS 搜索
	for len(queue) > 0 {
		current := queue[0]
		queue = queue[1:]

		// 如果到达目标位置，回溯得到方向
		if CheckCollision(current.X, current.Y, self.Width, self.Height, target.X, target.Y, target.Width, target.Height) {
			for current.Parent != nil && current.Parent.Parent != nil {
				current = *current.Parent
			}
			return current.Dir
		}

		// 标记为访问过
		key := fmt.Sprintf("%f,%f", current.X, current.Y)
		if visited[key] {
			continue
		}
		visited[key] = true

		// 遍历所有可能的移动方向
		possibleDirections := []BaseItemID{MoveUp, MoveDown, MoveLeft, MoveRight}
		for _, dir := range possibleDirections {
			nextX, nextY := self.simulateMove(dir)
			nextKey := fmt.Sprintf("%f,%f", nextX, nextY)

			// 检查是否遇到障碍物
			obs := MatchObstacle(nextX, nextY, self.Width, self.Height, f.Obstacles)
			if (obs != nil && !obs.Destructible) || visited[nextKey] {
				continue
			}
			// 检测是否越界或
			if nextX < 0 || nextX > f.Width || nextY < 0 || nextY > f.Height {
				continue
			}

			// 将下一个点加入队列
			queue = append(queue, Point{X: nextX, Y: nextY, Parent: &current, Dir: dir})
		}
	}

	// 如果找不到路径，返回停止
	return BaseItemNone
}

// simulateMove 模拟下一步移动的位置。
func (t Tank) simulateMove(dir BaseItemID) (float32, float32) {
	switch dir {
	case MoveUp:
		return t.X, t.Y - blockSize
	case MoveDown:
		return t.X, t.Y + blockSize
	case MoveLeft:
		return t.X - blockSize, t.Y
	case MoveRight:
		return t.X + blockSize, t.Y
	default:
		return t.X, t.Y
	}
}

// randomMove 随机移动的行为。
func (c *DefaultTankController) randomMove(self Tank, f BattlefieldInfo) TankAction {
	possibleDirections := []BaseItemID{MoveUp, MoveDown, MoveLeft, MoveRight}
	var validDirections []BaseItemID
	res := TankAction{}
	// 检查每个方向是否无障碍
	for _, dir := range possibleDirections {
		nextX, nextY := self.simulateMove(dir)
		obs := MatchObstacle(nextX, nextY, self.Width, self.Height, f.Obstacles)
		if obs == nil {
			validDirections = append(validDirections, dir)
		} else if obs.Destructible {
			validDirections = append(validDirections, dir)
			res.Fire = true
		}
	}
	// 如果没有可行方向，则保持不动
	if len(validDirections) == 0 {
		return res
	}

	res.Foward = validDirections[rand.Intn(len(validDirections))]
	return res
}

func (c *DefaultTankController) Action(self Tank, f BattlefieldInfo) TankAction {
	// 找到最近的敌方坦克
	var target *Tank
	minDistance := float32(math.MaxFloat32)

	for _, other := range f.AllTanks {
		if other.ID != self.ID && !self.AttckChanel.Match(other.AttckChanel) {
			distance := Distance(self.X, self.Y, other.X, other.Y)
			if distance < minDistance {
				minDistance = distance
				target = other
			}
		}
	}

	// 如果没有目标，随机移动
	if target == nil {
		return c.randomMove(self, f)
	}

	// 计算朝向目标的方向
	// dir := c.calculateDirection(self.X, self.Y, target.X, target.Y)
	dir := calculateDirectionBFS(self, target, f)
	// fire := minDistance < 100 // 距离小于100时开火
	fire := false
	// 如果朝向方向正前方有敌人则开火
	if dir == MoveUp && self.Y > target.Y && self.X < target.X+target.Width && self.X+self.Width > target.X {
		fire = true
	} else if dir == MoveDown && self.Y < target.Y && self.X < target.X+target.Width && self.X+self.Width > target.X {
		fire = true
	} else if dir == MoveLeft && self.X > target.X && self.Y < target.Y+target.Height && self.Y+self.Height > target.Y {
		fire = true
	} else if dir == MoveRight && self.X < target.X && self.Y < target.Y+target.Height && self.Y+self.Height > target.Y {
		fire = true
	}
	// 如果朝向方向正前方5BlockSize之内有可破坏的障碍物则开火
	fireBlockRangeX := self.X
	fireBlockRangeY := self.Y
	fireBlockRangeWidth := self.Width
	fireBlockRangeHeight := self.Height
	if dir == MoveUp {
		fireBlockRangeY -= 5 * blockSize
		fireBlockRangeHeight = 5 * blockSize
	} else if dir == MoveDown {
		fireBlockRangeY += self.Height
		fireBlockRangeHeight = 5 * blockSize
	} else if dir == MoveLeft {
		fireBlockRangeX -= 5 * blockSize
		fireBlockRangeWidth += 5 * blockSize
	} else if dir == MoveRight {
		fireBlockRangeX += self.Width
		fireBlockRangeWidth += 5 * blockSize
	}

	for _, obs := range f.Obstacles {
		if obs.Destructible && CheckCollision(fireBlockRangeX, fireBlockRangeY, fireBlockRangeWidth, fireBlockRangeHeight, obs.X, obs.Y, obs.Width, obs.Height) {
			fire = true
			break
		}
	}

	return TankAction{
		Foward: dir,
		Fire:   fire,
	}
}

func NewDefaultTankController() TankController {
	return &DefaultTankController{}
}

type DefaultKeyboadTankController struct {
	PlayerID int
}

func (c *DefaultKeyboadTankController) Action(self Tank, f BattlefieldInfo) TankAction {
	act := TankAction{}
	if c.PlayerID == 1 {
		// 玩家1
		switch {
		case ebiten.IsKeyPressed(ebiten.KeyW):
			act.Foward = MoveUp
		case ebiten.IsKeyPressed(ebiten.KeyS):
			act.Foward = MoveDown
		case ebiten.IsKeyPressed(ebiten.KeyA):
			act.Foward = MoveLeft
		case ebiten.IsKeyPressed(ebiten.KeyD):
			act.Foward = MoveRight
		}
		if ebiten.IsKeyPressed(ebiten.KeySpace) {
			act.Fire = true
		}
		return act
	}
	// 玩家2
	switch {
	case ebiten.IsKeyPressed(ebiten.KeyUp):
		act.Foward = MoveUp
	case ebiten.IsKeyPressed(ebiten.KeyDown):
		act.Foward = MoveDown
	case ebiten.IsKeyPressed(ebiten.KeyLeft):
		act.Foward = MoveLeft
	case ebiten.IsKeyPressed(ebiten.KeyRight):
		act.Foward = MoveRight
	}
	if ebiten.IsKeyPressed(ebiten.KeyEnter) {
		act.Fire = true
	}

	return act
}

func NewDefaultKeyboadTankController(tankID int) TankController {
	return &DefaultKeyboadTankController{
		PlayerID: tankID,
	}
}

type PyScriptController struct {
	Script string
}
