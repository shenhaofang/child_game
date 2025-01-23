package main

import (
	"image/color"
	"log"
	"math"
	"math/rand/v2"
	"sort"
	"strconv"
	"sync"

	"github.com/hajimehoshi/ebiten/v2"
	"github.com/hajimehoshi/ebiten/v2/ebitenutil"
	"github.com/hajimehoshi/ebiten/v2/vector"
)

const (
	screenWidth  = 800
	screenHeight = 600

	blockSize = 25

	bulletSize = 10

	maxLevel = 5
)

type DetectChanel int

const (
	AttackChannel1 DetectChanel = 1 << iota
	AttackChannel2
	AttackChannel3
)

const (
	CollisionChanelWall DetectChanel = 1 << iota
	CollisionChanelRiver
)

func (c DetectChanel) Match(objColCh DetectChanel) bool {
	return c&objColCh > 0
}

func CombineDetectChanel(chs ...DetectChanel) DetectChanel {
	c := DetectChanel(0)
	for _, ch := range chs {
		c |= ch
	}
	return c
}

type TankLevel struct {
	Level      int
	SubFrameID BaseItemID
	EquipSlot  BaseItemID
	Cooldown   int
	Hp         int
	Damage     int
	Speed      float32
}

type TankSeries struct {
	TankKind  string
	KindID    BaseItemID
	Levels    map[BaseItemID]TankLevel
	FrameImgs map[BaseItemID]string
}

var TankKinds = map[BaseItemID]TankSeries{}

type PlayerInfo struct {
	ID        int
	Name      string
	KillCount int
	Score     int
}

type TankAttrFixer interface {
	FixTankAttr(tank *Tank)
}

type AttackFixer interface {
	FixAttack(tank *Tank)
}

type TankEquip struct {
	Name      string
	Level     int
	Img       *ebiten.Image
	EquipSlot BaseItemID
	AttrFixer TankAttrFixer
}

type BaseItemID int

const (
	BaseItemNone BaseItemID = 0

	// 动作 低5位 1~16
	MoveUp BaseItemID = 1 << (iota - 1)
	MoveDown
	MoveLeft
	MoveRight
	Fire
	// 装备插槽 中低12位 64~65536
	EquipMainGun
	EquipEngine
	EquipArmor
	EquipShip
	EquipSecondGun
	EquipResourceCollector
	Equip7
	Equip8
	Equip9
	Equip10
	Equip11
	Equip12
	// 等级 中高5位 131072~2097152
	Level1
	Level2
	Level3
	Level4
	Level5
	// 坦克种类 高10位 4194304~2147483648
	TankKind1
	TankKind2
	TankKind3
	TankKind4
	TankKind5
	TankKind6
	TankKind7
	TankKind8
	TankKind9
	TankKind10

	FullBaseItemID BaseItemID = 1<<32 - 1
	NoMoveMask     BaseItemID = (FullBaseItemID << 4) & FullBaseItemID
	NoFireMask     BaseItemID = (^Fire) & FullBaseItemID

	MoveUpMask    BaseItemID = NoMoveMask | MoveUp
	MoveDownMask  BaseItemID = NoMoveMask | MoveDown
	MoveLeftMask  BaseItemID = NoMoveMask | MoveLeft
	MoveRightMask BaseItemID = NoMoveMask | MoveRight
)

var TankFrameImgs = map[BaseItemID]*ebiten.Image{}

func init() {
	// 坦克系列
	TankSeriesInit()

	for _, tankSer := range TankKinds {
		for frameID, frameImg := range tankSer.FrameImgs {
			// 默认为向上的图片
			img, _, err := ebitenutil.NewImageFromFile(frameImg)
			if err != nil {
				log.Fatal(err)
			}
			TankFrameImgs[frameID] = img
			// 不断顺时针旋转90度，得到剩余三个方向的图片
			rightImg := ebiten.NewImage(img.Bounds().Dy(), img.Bounds().Dx())
			op := &ebiten.DrawImageOptions{}
			op.GeoM.Rotate(-math.Pi / 2)
			rightImg.DrawImage(img, op)
			frameID = frameID | MoveRight
			TankFrameImgs[frameID] = img

			downImg := ebiten.NewImage(img.Bounds().Dx(), img.Bounds().Dy())
			op = &ebiten.DrawImageOptions{}
			op.GeoM.Rotate(math.Pi)
			downImg.DrawImage(img, op)
			frameID = frameID | MoveDown
			TankFrameImgs[frameID] = downImg

			leftImg := ebiten.NewImage(img.Bounds().Dy(), img.Bounds().Dx())
			op = &ebiten.DrawImageOptions{}
			op.GeoM.Rotate(math.Pi / 2)
			leftImg.DrawImage(img, op)
			frameID = frameID | MoveLeft
			TankFrameImgs[frameID] = leftImg
		}
	}
}

type Tank struct {
	PlayerInfo
	Kind              BaseItemID
	Level             BaseItemID
	X, Y              float32
	Speed             float32
	Equips            BaseItemID
	Direction         BaseItemID
	Foward            bool
	Fire              BaseItemID
	Width             float32
	Height            float32
	Damage            int
	HP                int
	MaxHP             int
	Cooldown          int
	MaxBulletCooldown int
	AttckChanel       DetectChanel // 攻击通道
	CollisionChanel   DetectChanel // 碰撞通道
	Controller        TankController
}

type TankAction struct {
	Foward BaseItemID
	Fire   bool
}

func (g *Game) ControlTank(act TankAction, tank *Tank) {
	tank.Foward = act.Foward > 0
	tank.Direction = act.Foward
	if act.Fire {
		tank.ShootBullet(g.BulletImg)
	}
}

// MatchObstacle 检查给定位置是否是障碍物。
func MatchObstacle(x, y, w, h float32, obstacles []*Obstacle) *Obstacle {
	for _, o := range obstacles {
		if CheckCollision(x, y, w, h, o.X, o.Y, o.Width, o.Height) {
			return o
		}
	}
	return nil
}

type TankController interface {
	Action(self Tank, f BattlefieldInfo) TankAction
}

type Bullet struct {
	X, Y            float32
	Speed           float32
	Dir             BaseItemID
	Image           *ebiten.Image
	Damage          int
	AttckChanel     DetectChanel // 攻击通道
	CollisionChanel DetectChanel // 碰撞通道
	Owner           int
}

type Obstacle struct {
	X, Y            float32
	Width, Height   float32
	Img             *ebiten.Image
	Color           color.Color
	Destructible    bool         // 是否可破坏
	CollisionChanel DetectChanel // 碰撞通道
	HP              int          // 剩余生命值，仅对可破坏的障碍物有效
}

type BattlefieldInfo struct {
	Width      float32
	Height     float32
	AllTanks   []*Tank
	Bullets    []*Bullet
	Obstacles  []*Obstacle
	Explosions []*Explosion
}

type Game struct {
	mutx    sync.RWMutex
	Player1 *Tank
	Player2 *Tank
	BattlefieldInfo
	BulletImg         *ebiten.Image
	ExplosionImg      *ebiten.Image
	TankIDIncreament  int
	MaxAddedTankCount int
	MaxAliveTankCount int
	GameOver          bool
	Winner            string
}

// 创建坦克
func NewTank(id int, x, y float32, tankSeriesID BaseItemID, level BaseItemID, ctrl TankController) *Tank {
	width := float32(2 * blockSize)
	height := float32(2 * blockSize)
	tankseries := TankKinds[tankSeriesID]
	levelInfo, levelValid := tankseries.Levels[level]
	if !levelValid {
		panic("level not valid")
	}
	if ctrl == nil {
		ctrl = NewDefaultTankController()
	}
	return &Tank{
		PlayerInfo:        PlayerInfo{ID: id, Name: "Player " + strconv.Itoa(id)},
		Kind:              tankSeriesID,
		Level:             level,
		X:                 x,
		Y:                 y,
		Speed:             levelInfo.Speed,
		Direction:         MoveUp,
		Width:             width,
		Height:            height,
		HP:                levelInfo.Hp,
		MaxHP:             levelInfo.Hp,
		Damage:            levelInfo.Damage,
		MaxBulletCooldown: levelInfo.Cooldown,
		AttckChanel:       AttackChannel3,
		CollisionChanel:   CombineDetectChanel(CollisionChanelWall, CollisionChanelRiver),
		Controller:        ctrl,
	}
}

// 创建子弹
func (t *Tank) ShootBullet(img *ebiten.Image) []*Bullet {
	if t.Cooldown > 0 {
		return []*Bullet{}
	}
	t.Fire = Fire
	t.Cooldown = t.MaxBulletCooldown

	bX := t.X + t.Width/2 - float32(bulletSize/2)
	bY := t.Y + t.Height/2 - float32(bulletSize/2)

	res := []*Bullet{
		{
			X:               bX,
			Y:               bY,
			Speed:           10,
			Dir:             t.Direction,
			Image:           img,
			Owner:           t.ID,
			Damage:          t.Damage,
			AttckChanel:     t.AttckChanel,
			CollisionChanel: CollisionChanelWall,
		},
	}
	if t.Equips&EquipSecondGun > 0 {
		switch t.Direction {
		case MoveUp:
			bY -= blockSize
		case MoveDown:
			bY += blockSize
		case MoveLeft:
			bX -= blockSize
		case MoveRight:
			bX += blockSize
		}
		res = append(res, &Bullet{
			X:               bX,
			Y:               bY,
			Speed:           10,
			Dir:             t.Direction,
			Image:           img,
			Owner:           t.ID,
			Damage:          int(math.Ceil(float64(t.Damage) / 2)),
			AttckChanel:     t.AttckChanel,
			CollisionChanel: CollisionChanelWall,
		})
	}
	return res
}

// 创建障碍物
func NewObstacle(x, y, width, height float32, col color.Color, destructible bool, collisionChanel DetectChanel, hp int, img string) *Obstacle {
	ob := &Obstacle{
		X:               x,
		Y:               y,
		Width:           width,
		Height:          height,
		Color:           col,
		Destructible:    destructible,
		CollisionChanel: collisionChanel,
		HP:              hp,
	}
	if img != "" {
		ob.Img, _, _ = ebitenutil.NewImageFromFile(img)
	}
	return ob
}

// 碰撞检测
func CheckCollision(aX, aY, aW, aH, bX, bY, bW, bH float32) bool {
	return aX < bX+bW &&
		aX+aW > bX &&
		aY < bY+bH &&
		aY+aH > bY
}

type Explosion struct {
	X, Y     float32
	Frame    int
	MaxFrame int
	Image    *ebiten.Image
}

func NewExplosion(x, y float32, img *ebiten.Image) *Explosion {
	return &Explosion{
		X:        x,
		Y:        y,
		Frame:    0,
		MaxFrame: 10, // 假设爆炸动画有10帧
		Image:    img,
	}
}

// 加载图像资源
func LoadImage(path string) *ebiten.Image {
	img, _, err := ebitenutil.NewImageFromFile(path)
	if err != nil {
		log.Fatalf("failed to load image: %v", err)
	}
	return img
}

type XRangeList [][]float32

func (x XRangeList) Len() int {
	return len(x)
}

func (x XRangeList) Less(i, j int) bool {
	return x[i][0] < x[j][0]
}

func (x XRangeList) Swap(i, j int) {
	x[i], x[j] = x[j], x[i]
}

func (g *Game) AIBirthPosition() (positionY float32, avaliablePos XRangeList) {
	tankSize := float32(2 * blockSize)
	avaliablePos = make(XRangeList, 0, len(g.Obstacles))
	for positionY = 0; positionY < g.BattlefieldInfo.Height-tankSize; positionY += tankSize {
		// 当前行的障碍物x坐标范围
		obstacleXRanges := make(XRangeList, 0, len(g.Obstacles))
		for _, obstacle := range g.Obstacles {
			if obstacle.Y > positionY+tankSize || obstacle.Y+obstacle.Height < positionY {
				continue
			}
			obstacleXRanges = append(obstacleXRanges, []float32{obstacle.X, obstacle.X + obstacle.Width})
		}
		// 排序障碍物x坐标范围
		sort.Sort(obstacleXRanges)
		var positionXStart float32
		for _, obXRange := range obstacleXRanges {
			if positionXStart+tankSize >= obXRange[0] {
				positionXStart = obXRange[1] + 1
				continue
			}

			avaliablePos = append(avaliablePos, []float32{positionXStart, obXRange[0] - 1})
			positionXStart = obXRange[1] + 1
		}
		if len(avaliablePos) > 0 {
			return positionY, avaliablePos
		}
	}
	return 0, avaliablePos
}

func LevelBaseItemID(level int) BaseItemID {
	switch level {
	case 1:
		return Level1
	case 2:
		return Level2
	case 3:
		return Level3
	case 4:
		return Level4
	case 5:
		return Level5
	}
	return Level1
}

// 更新游戏逻辑
func (g *Game) Update() error {
	if g.GameOver {
		return nil
	}

	// 加入新的ai坦克
	if len(g.AllTanks) < g.MaxAliveTankCount && g.TankIDIncreament < g.MaxAddedTankCount {
		positionY, avalialbePos := g.AIBirthPosition()
		if len(avalialbePos) > 0 {
			// 随机选择一个可用位置区域
			randIndex := rand.IntN(len(avalialbePos))
			selectedRange := avalialbePos[randIndex]
			// 随机选一个坦克系列
			tankSeriesSlice := make([]BaseItemID, 0, len(TankKinds))
			for tankKind, _ := range TankKinds {
				tankSeriesSlice = append(tankSeriesSlice, tankKind)
			}
			tankSeriesID := tankSeriesSlice[rand.IntN(len(tankSeriesSlice))]
			// 随机等级
			level := LevelBaseItemID(rand.IntN(len(TankKinds[tankSeriesID].Levels)))

			g.addAI(AttackChannel3, tankSeriesID, level, positionY, selectedRange[0], selectedRange[1])
		}
	}

	// 更新坦克位置（避免进入障碍物）
	for _, tank := range g.AllTanks {
		// 坦克操作逻辑
		tankAct := tank.Controller.Action(*tank, g.BattlefieldInfo)
		g.ControlTank(tankAct, tank)

		// 处理坦克的开火逻辑
		if tank.Cooldown < int(math.Max(float64(tank.MaxBulletCooldown-2), 1)) && tank.Fire > 0 {
			tank.Fire = 0
		}
		if tank.Cooldown > 0 {
			tank.Cooldown--
		}

		if !tank.Foward {
			continue
		}

		newX, newY := tank.X, tank.Y
		switch tank.Direction {
		case MoveUp:
			newY -= tank.Speed
		case MoveDown:
			newY += tank.Speed
		case MoveLeft:
			newX -= tank.Speed
		case MoveRight:
			newX += tank.Speed
		}

		// 检测与障碍物的碰撞
		collides := false
		for _, obstacle := range g.Obstacles {
			if obstacle.CollisionChanel.Match(tank.CollisionChanel) && CheckCollision(newX, newY, tank.Width, tank.Height, obstacle.X, obstacle.Y, obstacle.Width, obstacle.Height) {
				collides = true
				break
			}
		}
		// 检测与其他坦克的碰撞
		for _, otherTank := range g.AllTanks {
			if otherTank != tank && CheckCollision(newX, newY, tank.Width, tank.Height, otherTank.X, otherTank.Y, otherTank.Width, otherTank.Height) {
				collides = true
				break
			}
		}

		// 检测与边界的碰撞
		if newX < -tank.Width || newX > g.Width || newY < -tank.Height || newY > g.Height {
			collides = true
		}

		// 如果没有碰撞，更新位置
		if !collides {
			tank.X = newX
			tank.Y = newY
		}
	}

	remainingBullets := make([]*Bullet, 0, len(g.Bullets))
	// 更新子弹位置
	for i := 0; i < len(g.Bullets); i++ {
		bullet := g.Bullets[i]
		switch bullet.Dir {
		case MoveUp:
			bullet.Y -= bullet.Speed
		case MoveDown:
			bullet.Y += bullet.Speed
		case MoveLeft:
			bullet.X -= bullet.Speed
		case MoveRight:
			bullet.X += bullet.Speed
		}
		hit := false
		// 检测子弹是否出界
		if bullet.X < -blockSize || bullet.X > g.Width || bullet.Y < -blockSize || bullet.Y > g.Height {
			hit = true
		}

		// 检测子弹与其他坦克的碰撞
		for _, oneTank := range g.AllTanks {
			if bullet.AttckChanel.Match(oneTank.AttckChanel) {
				// 同一阵营，不处理
				continue
			}
			if CheckCollision(bullet.X, bullet.Y, 10, 10, oneTank.X, oneTank.Y, oneTank.Width, oneTank.Height) {
				// 坦克受到伤害
				hit = true
				oneTank.HP -= bullet.Damage
				if oneTank.HP <= 0 {
					// 这里可以添加敌人被击中的动画和音效
					log.Printf("%s 被击败！", oneTank.Name)
					// 添加爆炸效果
					explosion := NewExplosion(oneTank.X, oneTank.Y, g.ExplosionImg)
					g.Explosions = append(g.Explosions, explosion)
				}
				break
			}
		}

		// 检测子弹与障碍物的碰撞
		for j, obstacle := range g.Obstacles {
			if CheckCollision(bullet.X, bullet.Y, 10, 10, obstacle.X, obstacle.Y, obstacle.Width, obstacle.Height) {
				if !obstacle.CollisionChanel.Match(bullet.CollisionChanel) {
					continue // 子弹可以穿过，不销毁
				}
				if obstacle.Destructible {
					obstacle.HP--
					if obstacle.HP <= 0 {
						// 移除已破坏的障碍物
						g.Obstacles = append(g.Obstacles[:j], g.Obstacles[j+1:]...)
					}
				}
				// 子弹销毁
				hit = true
				break
			}
		}

		if !hit {
			remainingBullets = append(remainingBullets, bullet)
		}
	}
	g.Bullets = remainingBullets

	attackChannelTankCount := make(map[DetectChanel]int, 3)
	// 移除HP为0的坦克
	var activeTanksAfterHit []*Tank
	for _, enemy := range g.AllTanks {
		if enemy.HP > 0 {
			activeTanksAfterHit = append(activeTanksAfterHit, enemy)
			attackChannelTankCount[enemy.AttckChanel]++
		}
	}
	g.AllTanks = activeTanksAfterHit

	// 移除HP为0的障碍物
	var activeObstaclesAfterHit []*Obstacle
	for _, obstacle := range g.Obstacles {
		if obstacle.HP > 0 {
			activeObstaclesAfterHit = append(activeObstaclesAfterHit, obstacle)
		}
	}
	g.Obstacles = activeObstaclesAfterHit

	// 更新爆炸动画
	var activeExplosions []*Explosion
	for _, explosion := range g.Explosions {
		explosion.Frame++
		if explosion.Frame > explosion.MaxFrame {
			continue
		}
		activeExplosions = append(activeExplosions, explosion)
	}
	g.Explosions = activeExplosions

	if g.TankIDIncreament >= g.MaxAddedTankCount {
		if len(attackChannelTankCount) <= 1 {
			g.GameOver = true
			if len(g.AllTanks) > 0 {
				g.Winner = g.AllTanks[0].Name
			}
		}
	}

	return nil
}

// 绘制游戏
func (g *Game) Draw(screen *ebiten.Image) {
	// 绘制坦克
	for _, tank := range g.AllTanks {
		op := &ebiten.DrawImageOptions{}
		op.GeoM.Translate(float64(tank.X), float64(tank.Y))
		imgFrameID := tank.Kind | tank.Equips | tank.Level | tank.Direction | tank.Fire
		screen.DrawImage(TankFrameImgs[imgFrameID], op)

		// 绘制HP条
		vector.DrawFilledRect(screen, tank.X, tank.Y-10, tank.Width, 5, color.RGBA{255, 0, 0, 255}, true)
		vector.DrawFilledRect(screen, tank.X, tank.Y-10, (float32(tank.HP)/float32(tank.MaxHP))*tank.Width, 5, color.RGBA{0, 255, 0, 255}, true)
	}

	// 绘制子弹
	for _, bullet := range g.Bullets {
		op := &ebiten.DrawImageOptions{}
		op.GeoM.Translate(float64(bullet.X), float64(bullet.Y))
		screen.DrawImage(bullet.Image, op)
	}

	// 绘制障碍物
	for _, obstacle := range g.Obstacles {
		op := &ebiten.DrawImageOptions{}
		op.GeoM.Translate(float64(obstacle.X), float64(obstacle.Y))
		obstacleImg := obstacle.Img
		if obstacleImg == nil {
			obstacleImg = ebiten.NewImage(int(obstacle.Width), int(obstacle.Height))
		}
		obstacleImg.Fill(obstacle.Color)
		screen.DrawImage(obstacleImg, op)
	}

	// 绘制爆炸效果
	for _, explosion := range g.Explosions {
		op := &ebiten.DrawImageOptions{}
		op.GeoM.Translate(float64(explosion.X), float64(explosion.Y))
		// 可以根据当前帧数调整爆炸大小或透明度
		scale := 1.0 + float64(explosion.Frame)/float64(explosion.MaxFrame)
		op.GeoM.Scale(scale, scale)
		// op.GeoM.Rotate(float64(explosion.Frame) * 0.1)
		alpha := 1.0 - float32(explosion.Frame)/float32(explosion.MaxFrame)
		op.ColorScale.Scale(1, 1, 1, alpha)
		screen.DrawImage(explosion.Image, op)
	}

	// 绘制 HUD
	if g.Player1 != nil {
		ebitenutil.DebugPrintAt(screen, "Player 1 HP: "+strconv.Itoa(g.Player1.HP), 10, 10)
	}
	if g.Player2 == nil {
		ebitenutil.DebugPrintAt(screen, "Player 2 HP: "+strconv.Itoa(g.Player2.HP), int(g.Width)-150, 10)
	}

	// 游戏结束画面
	if g.GameOver {
		if g.Winner != "" {
			ebitenutil.DebugPrintAt(screen, "Game Over! "+g.Winner+" Wins!", int(g.Width)/2-80, int(g.Height)/2)
		} else {
			ebitenutil.DebugPrintAt(screen, "Game Over!", int(g.Width)/2-80, int(g.Height)/2)
		}
		ebitenutil.DebugPrintAt(screen, "Press R to Restart", int(g.Width)/2-60, int(g.Height)/2+20)
	}
}

// 布局
func (g *Game) Layout(outsideWidth, outsideHeight int) (int, int) {
	return int(g.Width), int(g.Height)
}

func (g *Game) addPlayer(playerName string, attackChannel DetectChanel, tankSeriesID BaseItemID, ctrl TankController) {
	g.mutx.Lock()
	defer g.mutx.Unlock()
	if g.TankIDIncreament >= 2 {
		return
	}
	g.TankIDIncreament++
	if ctrl == nil {
		ctrl = NewDefaultKeyboadTankController(g.TankIDIncreament)
	}
	if g.TankIDIncreament == 1 {
		g.Player1 = NewTank(g.TankIDIncreament, g.Width/2-4*blockSize, g.Height-100, tankSeriesID, Level1, ctrl)
		g.Player1.AttckChanel = attackChannel
		g.AllTanks = append(g.AllTanks, g.Player1)
		return
	}
	g.Player2 = NewTank(g.TankIDIncreament, g.Width/2+2*blockSize, g.Height-100, tankSeriesID, Level1, ctrl)
	g.Player2.AttckChanel = attackChannel
	g.AllTanks = append(g.AllTanks, g.Player2)
}

func (g *Game) addAI(attackChannel DetectChanel, tankSeriesID BaseItemID, level BaseItemID, positionY, positionXStart, positionXEnd float32) {
	g.mutx.Lock()
	defer g.mutx.Unlock()
	if g.TankIDIncreament >= 2 {
		return
	}
	g.TankIDIncreament++
	// TODO 随机生成位置，并确保不会与玩家坦克和障碍物重叠
	positionX := rand.Float32()*(positionXEnd-positionXStart) + positionXStart
	tank := NewTank(g.TankIDIncreament, positionX, positionY, tankSeriesID, level, NewDefaultTankController())
	tank.AttckChanel = attackChannel
	g.AllTanks = append(g.AllTanks, tank)
}

// Distance 计算两个点之间的距离。
func Distance(x1, y1, x2, y2 float32) float32 {
	return float32(math.Sqrt(float64((x2-x1)*(x2-x1) + (y2-y1)*(y2-y1))))
}

func main() {
	bulletImg := ebiten.NewImage(bulletSize, bulletSize)
	bulletImg.Fill(color.RGBA{255, 215, 0, 255})

	obstacles := []*Obstacle{
		NewObstacle(200, 200, blockSize, blockSize, color.RGBA{128, 128, 128, 255}, true, CollisionChanelWall, 3, ""),
		NewObstacle(400, 300, blockSize, blockSize, color.RGBA{0, 128, 0, 255}, false, CollisionChanelRiver, 0, ""),
	}

	game := &Game{
		mutx:      sync.RWMutex{},
		BulletImg: bulletImg,
		BattlefieldInfo: BattlefieldInfo{
			Width:      screenWidth,
			Height:     screenHeight,
			AllTanks:   make([]*Tank, 0),
			Bullets:    make([]*Bullet, 0),
			Obstacles:  obstacles,
			Explosions: make([]*Explosion, 0),
		},
		ExplosionImg:     LoadImage("./assets/explosion/tank0.png"),
		TankIDIncreament: 0,
	}

	ebiten.SetWindowSize(int(game.Width), int(game.Height))
	ebiten.SetWindowTitle("坦克大战")

	// 注册玩家1
	game.addPlayer("Player 1", AttackChannel1, TankKind1, nil)
	// 注册玩家2
	game.addPlayer("Player 2", AttackChannel1, TankKind1, nil)

	if err := ebiten.RunGame(game); err != nil {
		log.Fatal(err)
	}
}
