import pygame
import json
import random
import sys

# 游戏初始化
pygame.init()

# 屏幕设置
WIDTH, HEIGHT = 800, 600
screen = pygame.display.set_mode((WIDTH, HEIGHT))
pygame.display.set_caption("黑学霸-悟空")

# 颜色定义
WHITE = (255, 255, 255)
BLACK = (0, 0, 0)
RED = (255, 0, 0)
GREEN = (0, 255, 0)

# 加载支持中文的字体
try:
    CHINESE_FONT = pygame.font.Font("FZWBJW.ttf", 36)  # 使用微软雅黑
except FileNotFoundError:
    print("字体文件 未找到，请确保字体文件存在！")
    sys.exit()

BIG_FONT = pygame.font.Font(None, 72)

# 加载问题
def load_questions(file):
    with open(file, 'r', encoding='utf-8') as f:
        return json.load(f)

questions = load_questions("questions.json")

# 玩家和Boss数据
player_hp = 100
boss_hp = 50
level = 1

# 动画相关
def draw_health_bar(x, y, hp, max_hp, color):
    pygame.draw.rect(screen, BLACK, (x, y, 200, 20), 2)
    pygame.draw.rect(screen, color, (x, y, 200 * (hp / max_hp), 20))

def show_message(text, size, color, y_offset=0):
    font = BIG_FONT if size == "big" else FONT
    message = font.render(text, True, color)
    rect = message.get_rect(center=(WIDTH // 2, HEIGHT // 2 + y_offset))
    screen.blit(message, rect)

def attack_animation():
    for _ in range(3):
        pygame.draw.circle(screen, RED, (WIDTH // 2 - 200, HEIGHT // 2), 30)
        pygame.display.flip()
        pygame.time.delay(100)
        screen.fill(WHITE)
        pygame.display.flip()

# 获取随机题目
def get_question(level):
    difficulty = min(level, 3)
    filtered_questions = [q for q in questions if q['difficulty'] == difficulty]
    return random.choice(filtered_questions)

# 游戏循环
running = True
current_question = get_question(level)
player_answer = ""
while running:
    screen.fill(WHITE)

    # 显示血条和状态
    draw_health_bar(50, 50, player_hp, 100, GREEN)
    draw_health_bar(550, 50, boss_hp, 50 + level * 20, RED)
    screen.blit(FONT.render("玩家", True, BLACK), (50, 30))
    screen.blit(FONT.render(f"Boss (关卡 {level})", True, BLACK), (550, 30))

    # 显示题目
    screen.blit(FONT.render(current_question['question'], True, BLACK), (50, 150))
    if 'options' in current_question and current_question['options']:
        for i, option in enumerate(current_question['options']):
            screen.blit(FONT.render(f"{i + 1}. {option}", True, BLACK), (50, 200 + i * 40))
    else:
        screen.blit(FONT.render(f"输入答案: {player_answer}", True, BLACK), (50, 200))

    # 检测事件
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False
        elif event.type == pygame.KEYDOWN:
            if event.key == pygame.K_BACKSPACE:
                player_answer = player_answer[:-1]
            elif event.key == pygame.K_RETURN:
                if 'options' in current_question and current_question['options']:
                    try:
                        answer_index = int(player_answer) - 1
                        if current_question['options'][answer_index] == current_question['answer']:
                            boss_hp -= 10
                            attack_animation()
                        else:
                            # global player_hp
                            player_hp -= 10
                    except (ValueError, IndexError):
                        player_hp -= 10  # 处理非法输入
                else:
                    if player_answer.strip().lower() == current_question['answer'].strip().lower():
                        boss_hp -= 10
                        attack_animation()
                    else:
                        player_hp -= 10

                current_question = get_question(level)
                player_answer = ""
            else:
                player_answer += event.unicode

    # 检查胜负条件
    if player_hp <= 0:
        screen.fill(WHITE)
        show_message("你输了！", "big", RED)
        pygame.display.flip()
        pygame.time.delay(2000)
        running = False
    elif boss_hp <= 0:
        screen.fill(WHITE)
        show_message("击败了Boss！", "big", GREEN)
        pygame.display.flip()
        pygame.time.delay(2000)
        level += 1
        boss_hp = 50 + level * 20
        player_hp = min(player_hp + 20, 100)

    pygame.display.flip()
    pygame.time.Clock().tick(30)

pygame.quit()
sys.exit()
