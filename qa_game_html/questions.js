const questions = [
    // {
    //     question: "2 + 2 等于几？",
    //     img: "",
    //     options: ["3", "4", "5"],
    //     answer: "4",
    //     knowledge: "",
    //     difficulty: 1
    // },
    // {
    //     question: "HTTP 的默认端口号是？",
    //     img: "",
    //     options: [],
    //     answer: "80",
    //     knowledge: "http的默认端口号是80",
    //     difficulty: 2
    // }
];

function randomInt(difficulty = 1){
    return Math.floor(Math.random() * Math.pow(10, difficulty))
}

function autoMathQuestions(difficulty = 1, num = 10){
    autoMathAddOrSub(difficulty, num)
    if (difficulty > 2) {
        autoMathMultiDiv(difficulty, num)
    }
}

function autoMathAddOrSub(difficulty = 1, num = 10) {
    for (let i = 0; i < num; i++) {
        let a = randomInt(difficulty);
        let b = randomInt(difficulty);
        let c = a + b;
        if (i%2 == 0){
            questions.push({
                question: `${a} + ${b} = ?`,
                img: "",
                options: [],
                knowledge: "加法",
                answer: c.toString(),
                difficulty: difficulty
            })
        }else{
            questions.push({
                question: `${c} - ${a} = ?`,
                img: "",
                options: [],
                knowledge: "减法",
                answer: b.toString(),
                difficulty: difficulty
            })
        }
    }
}

function autoMathMultiDiv(difficulty = 1, num = 10){
    // let digit = difficulty
    // if (digit > 2){
    //     digit -= 2
    // }
    for (let i = 0; i < num; i++) {
        let a = randomInt(Math.floor(difficulty/2));
        let b = randomInt(Math.floor(difficulty/2));
        
        c = a * b;
        if (i%2 == 0 || (a == 0 && b == 0)){
            questions.push({
                question: `${a} × ${b} = ?`,
                img: "",
                options: [],
                knowledge: "乘法",
                answer: c.toString(),
                difficulty: difficulty
            })
        }else{
            questions.push({
                question: `${c} ÷ ${a} = ?`,
                img: "",
                options: [],
                knowledge: "除法",
                answer: b.toString(),
                difficulty: difficulty
            })
        }
    }
}

const poetrys = [
    {
        title: "山村咏怀",
        dynasty: "宋",
        author: "邵雍",
        difficulty: 1,
        content: ["一去二三里", "烟村四五家", "亭台六七座", "八九十枝花"]
    },
    {
        title: "画",
        dynasty: "唐",
        author: "王维",
        difficulty: 1,
        content: ["远看山有色", "近听水无声", "春去花还在", "人来鸟不惊"]
    },
    {
        title: "画鸡",
        dynasty: "明",
        author: "唐寅",
        difficulty: 1,
        content: ["头上红冠不用裁", "满身雪白走将来", "平生不敢轻言语", "一叫千门万户开"]
    },
    {
        title: "静夜思",
        dynasty: "唐",
        author: "李白",
        difficulty: 1,
        content: ["床前明月光", "疑是地上霜", "举头望明月", "低头思故乡"]
    },
    {
        title: "悯农",
        dynasty: "唐",
        author: "李绅",
        difficulty: 1,
        content: ["锄禾日当午", "汗滴禾下土", "谁知盘中餐", "粒粒皆辛苦"]
    },
    {
        title: "春晓",
        dynasty: "唐",
        author: "孟浩然",
        difficulty: 1,
        content: ["春眠不觉晓", "处处闻啼鸟", "夜来风雨声", "花落知多少"]
    },
    {
        title: "村居",
        dynasty: "清",
        author: "高鼎",
        difficulty: 1,
        content: ["草长莺飞二月天", "拂堤杨柳醉春烟", "儿童散学归来早", "忙趁东风放纸鸢"]
    },
    {
        title: "所见",
        dynasty: "清",
        author: "袁枚",
        difficulty: 1,
        content: ["牧童骑黄牛", "歌声振林樾", "意欲捕鸣蝉", "忽然闭口立"]
    },
    {
        title: "小池",
        dynasty: "宋",
        author: "杨万里",
        difficulty: 1,
        content: ["泉眼无声惜细流", "树阴照水爱晴柔", "小荷才露尖尖角", "早有蜻蜓立上头"]
    },
    {
        title: "赠刘景文",
        dynasty: "宋",
        author: "苏轼",
        difficulty: 2,
        content: ["荷尽已无擎雨盖", "菊残犹有傲霜枝", "一年好景君须记", "正是橙黄橘绿时"]
    },
    {
        title: "回乡偶书",
        dynasty: "唐",
        author: "贺知章",
        difficulty: 2,
        content: ["少小离家老大回", "乡音无改鬓毛衰", "儿童相见不相识", "笑问客从何处来"]
    },
    {
        title: "赠汪伦",
        dynasty: "唐",
        author: "李白",
        difficulty: 2,
        content: ["李白乘舟将欲行", "忽闻岸上踏歌声", "桃花潭水深千尺", "不及汪伦赠我情"]
    },
    {
        title: "七步诗",
        dynasty: "三国",
        author: "曹植",
        difficulty: 2,
        content: ["煮豆持作羹", "漉菽以为汁", "萁在釜下燃", "豆在釜中泣", "本自同根生", "相煎何太急"]
    },
    {
        title: "咏鹅",
        dynasty: "唐",
        author: "骆宾王",
        difficulty: 2,
        content: ["鹅，鹅，鹅", "曲项向天歌", "白毛浮绿水", "红掌拨清波"]
    },
    {
        title: "咏柳",
        dynasty: "唐",
        author: "贺知章",
        difficulty: 2,
        content: ["碧玉妆成一树高", "万条垂下绿丝绦", "不知细叶谁裁出", "莫待金樽空对月"]
    },
    {
        title: "登鹳雀楼",
        dynasty: "唐",
        author: "王之涣",
        difficulty: 2,
        content: ["白日依山尽", "黄河入海流", "欲穷千里目", "更上一层楼"]
    },
    {
        title: "宿建德江",
        dynasty: "唐",
        author: "孟浩然",
        difficulty: 2,
        content: ["移舟泊烟渚", "日暮客愁新", "野旷天低树", "江清月近人"]
    },
    {
        title: "出塞",
        dynasty: "唐",
        author: "王昌龄",
        difficulty: 2,
        content: ["秦时明月汉时关", "万里长征人未还", "但使龙城飞将在", "不教胡马度阴山"]
    },
    {
        title: "从军行",
        dynasty: "唐",
        author: "王昌龄",
        difficulty: 2,
        content: ["青海长云暗雪山", "孤城遥望玉门关", "黄沙百战穿金甲", "不破楼兰终不还"]
    },
    {
        title: "芙蓉楼送辛渐",
        dynasty: "唐",
        author: "王昌龄",
        difficulty: 2,
        content: ["寒雨连江夜入吴", "平明送客楚山孤", "洛阳亲友如相问", "一片冰心在玉壶"]
    },
    {
        title: "鹿柴",
        dynasty: "唐",
        author: "王维",
        difficulty: 2,
        content: ["空山不见人", "但闻人语响", "返景入深林", "复照青苔上"]
    },
    {
        title: "竹里馆",
        dynasty: "唐",
        author: "王维",
        difficulty: 2,
        content: ["独坐幽篁里", "弹琴复长啸", "深林人不知", "明月来相照"]
    },
    {
        title: "送元二使安西",
        dynasty: "唐",
        author: "王维",
        difficulty: 2,
        content: ["渭城朝雨浥轻尘", "客舍青青柳色新", "劝君更尽一杯酒", "西出阳关无故人"]
    },
    {
        title: "九月九日忆山东兄弟",
        dynasty: "唐",
        author: "王维",
        difficulty: 2,
        content: ["独在异乡为异客", "每逢佳节倍思亲", "遥知兄弟登高处", "遍插茱萸少一人"]
    },
    {
        title: "别董大",
        dynasty: "唐",
        author: "高适",
        difficulty: 2,
        content: ["千里黄云白日曛", "北风吹雁雪纷纷", "莫愁前路无知己", "天下谁人不识君"]
    },
    {
        title: "望庐山瀑布",
        dynasty: "唐",
        author: "李白",
        difficulty: 1,
        content: ["日照香炉生紫烟", "遥看瀑布挂前川", "飞流直下三千尺", "疑是银河落九天"]
    },
    {
        title: "独坐敬亭山",
        dynasty: "唐",
        author: "李白",
        difficulty: 2,
        content: ["众鸟高飞尽", "孤云独去闲", "相看两不厌", "只有敬亭山"]
    },
    {
        title: "黄鹤楼送孟浩然之广陵",
        dynasty: "唐",
        author: "李白",
        difficulty: 2,
        content: ["故人西辞黄鹤楼", "烟花三月下扬州", "孤帆远影碧空尽", "唯见长江天际流"]
    },
    {
        title: "早发白帝城",
        dynasty: "唐",
        author: "李白",
        difficulty: 2,
        content: ["朝辞白帝彩云间", "千里江陵一日还", "两岸猿声啼不住", "轻舟已过万重山"]
    },
    {
        title: "秋浦歌",
        dynasty: "唐",
        author: "李白",
        difficulty: 2,
        content:  [
            "白发三千丈",
            "缘愁似个长",
            "不知明镜里",
            "何处得秋霜"
        ]
    },
    {
        title: "望天门山",
        dynasty: "唐",
        author: "李白",
        difficulty: 2,
        content:  [
            "天门中断楚江开",
            "碧水东流至此回",
            "两岸青山相对出",
            "孤帆一片日边来"
        ]
    },
    {
        title: "闻官军收河南河北",
        dynasty: "唐",
        author: "杜甫",
        difficulty: 2,
        content:  [
            "剑外忽传收蓟北",
            "初闻涕泪满衣裳",
            "却看妻子愁何在",
            "漫卷诗书喜欲狂",
            "白日放歌须纵酒",
            "青春作伴好还乡",
            "即从巴峡穿巫峡",
            "便下襄阳向洛阳"
        ]
    },
    {
        title: "赠花卿",
        dynasty: "唐",
        author: "杜甫",
        difficulty: 2,
        content:  [
            "锦城丝管日纷纷",
            "半入江风半入云",
            "此曲只应天上有",
            "人间能得几回闻"
        ]
    },
    {
        title: "江南逢李龟年",
        dynasty: "唐",
        author: "杜甫",
        difficulty: 2,
        content:  [
            "岐王宅里寻常见",
            "崔九堂前几度闻",
            "正是江南好风景",
            "落花时节又逢君"
        ]
    },
    {
        title: "春夜喜雨",
        dynasty: "唐",
        author: "杜甫",
        difficulty: 2,
        content:  [
            "好雨知时节",
            "当春乃发生",
            "随风潜入夜",
            "润物细无声",
            "野径云俱黑",
            "江船火独明",
            "晓看红湿处",
            "花重锦官城"
        ]
    },
    {
        title: "江畔独步寻花",
        dynasty: "唐",
        author: "杜甫",
        difficulty: 2,
        content:  [
            "黄四娘家花满蹊",
            "千朵万朵压枝低",
            "留连戏蝶时时舞",
            "自在娇莺恰恰啼"
        ]
    },
    {
        title: "逢雪宿芙蓉山主人",
        dynasty: "唐",
        author: "刘长卿",
        difficulty: 2,
        content:  [
            "日暮苍山远",
            "天寒白屋贫",
            "柴门闻犬吠",
            "风雪夜归人"
        ]
    },
    {
        title: "江雪",
        dynasty: "唐",
        author: "柳宗元",
        difficulty: 2,
        content:  [
            "千山鸟飞绝",
            "万径人踪灭",
            "孤舟蓑笠翁",
            "独钓寒江雪"
        ]
    },
    {
        title: "寻隐者不遇",
        dynasty: "唐",
        author: "贾岛",
        difficulty: 2,
        content:  [
            "松下问童子",
            "言师采药去",
            "只在此山中",
            "云深不知处"
        ]
    },
    {
        title: "枫桥夜泊",
        dynasty: "唐",
        author: "张继",
        difficulty: 2,
        content:  [
            "月落乌啼霜满天",
            "江枫渔火对愁眠",
            "姑苏城外寒山寺",
            "夜半钟声到客船"
        ]
    },
    {
        title: "渔歌子",
        dynasty: "唐",
        author: "张志和",
        difficulty: 2,
        content:  [
            "西塞山前白鹭飞",
            "桃花流水鳜鱼肥",
            "青箬笠，绿蓑衣",
            "斜风细雨不须归"
        ]
    },
    {
        title: "寒食",
        dynasty: "唐",
        author: "韩翃",
        difficulty: 2,
        content:  [
            "春城无处不飞花",
            "寒食东风御柳斜",
            "日暮汉宫传蜡烛",
            "轻烟散入五侯家"
        ]
    },
    {
        title: "滁州西涧",
        dynasty: "唐",
        author: "韦应物",
        difficulty: 2,
        content:  [
            "独怜幽草涧边生",
            "上有黄鹂深树鸣",
            "春潮带雨晚来急",
            "野渡无人舟自横"
        ]
    },
    {
        title: "游子吟",
        dynasty: "唐",
        author: "孟郊",
        difficulty: 2,
        content:  [
            "慈母手中线",
            "游子身上衣",
            "临行密密缝",
            "意恐迟迟归",
            "谁言寸草心",
            "报得三春晖"
        ]
    },
    {
        title: "竹枝词",
        dynasty: "唐",
        author: "刘禹锡",
        difficulty: 2,
        content:  [
            "杨柳青青江水平",
            "闻郎江上唱歌声",
            "东边日出西边雨",
            "道是无晴却有晴"
        ]
    },
    {
        title: "乌衣巷",
        dynasty: "唐",
        author: "刘禹锡",
        difficulty: 2,
        content:  [
            "朱雀桥边野草花",
            "乌衣巷口夕阳斜",
            "旧时王谢堂前燕",
            "飞入寻常百姓家"
        ]
    },
    {
        title: "望洞庭",
        dynasty: "唐",
        author: "刘禹锡",
        difficulty: 2,
        content:  [
            "湖光秋月两相和",
            "潭面无风镜未磨",
            "遥望洞庭山水翠",
            "白银盘里一青螺"
        ]
    },
    {
        title: "浪淘沙",
        dynasty: "唐",
        author: "刘禹锡",
        difficulty: 2,
        content:  [
            "九曲黄河万里沙",
            "浪淘风簸自天涯",
            "如今直上银河去",
            "同到牵牛织女家"
        ]
    },
    {
        title: "赋得古原草送别",
        dynasty: "唐",
        author: "白居易",
        difficulty: 2,
        content:  [
            "离离原上草",
            "一岁一枯荣",
            "野火烧不尽",
            "春风吹又生",
            "远芳侵古道",
            "晴翠接荒城",
            "又送王孙去",
            "萋萋满别情"
        ]
    },
    {
        title: "忆江南",
        dynasty: "唐",
        author: "白居易",
        difficulty: 2,
        content:  [
            "江南好",
            "风景旧曾谙",
            "日出江花红胜火",
            "春来江水绿如蓝",
            "能不忆江南"
        ]
    },
    {
        title: "山行",
        dynasty: "唐",
        author: "杜牧",
        difficulty: 2,
        content:  [
            "远上寒山石径斜",
            "白云生处有人家",
            "停车坐爱枫林晚",
            "霜叶红于二月花"
        ]
    },
    {
        title: "清明",
        dynasty: "唐",
        author: "杜牧",
        difficulty: 2,
        content:  [
            "清明时节雨纷纷",
            "路上行人欲断魂",
            "借问酒家何处有",
            "牧童遥指杏花村"
        ]
    },
    {
        title: "江南春",
        dynasty: "唐",
        author: "杜牧",
        difficulty: 2,
        content:  [
            "千里莺啼绿映红",
            "水村山郭酒旗风",
            "南朝四百八十寺",
            "多少楼台烟雨中"
        ]
    },
    {
        title: "秋夕",
        dynasty: "唐",
        author: "杜牧",
        difficulty: 2,
        content:  [
            "银烛秋光冷画屏",
            "轻罗小扇扑流萤",
            "天阶夜色凉如水",
            "坐看牵牛织女星"
        ]
    },
    {
        title: "乐游原",
        dynasty: "唐",
        author: "李商隐",
        difficulty: 2,
        content:  [
            "向晚意不适",
            "驱车登古原",
            "夕阳无限好",
            "只是近黄昏"
        ]
    },
    {
        title: "元日",
        dynasty: "宋",
        author: "王安石",
        difficulty: 2,
        content:  [
            "爆竹声中一岁除",
            "春风送暖入屠苏",
            "千门万户曈曈日",
            "总把新桃换旧符"
        ]
    },
    {
        title: "泊船瓜洲",
        dynasty: "宋",
        author: "王安石",
        difficulty: 2,
        content:  [
            "京口瓜洲一水间",
            "钟山只隔数重山",
            "春风又绿江南岸",
            "明月何时照我还"
        ]
    },
    {
        title: "梅花",
        dynasty: "宋",
        author: "王安石",
        difficulty: 2,
        content:  [
            "墙角数枝梅",
            "凌寒独自开",
            "遥知不是雪",
            "为有暗香来"
        ]
    },
    {
        title: "望湖楼醉书",
        dynasty: "宋",
        author: "苏轼",
        difficulty: 2,
        content:  [
            "黑云翻墨未遮山",
            "白雨跳珠乱入船",
            "卷地风来忽吹散",
            "望湖楼下水如天"
        ]
    },
    {
        title: "饮湖上初晴后雨",
        dynasty: "宋",
        author: "苏轼",
        difficulty: 2,
        content:  [
            "水光潋滟晴方好",
            "山色空濛雨亦奇",
            "欲把西湖比西子",
            "淡妆浓抹总相宜"
        ]
    },
    {
        title: "惠崇春江晓景",
        dynasty: "宋",
        author: "苏轼",
        difficulty: 2,
        content:  [
            "竹外桃花三两枝",
            "春江水暖鸭先知",
            "蒌蒿满地芦芽短",
            "正是河豚欲上时"
        ]
    },
    {
        title: "题西林壁",
        dynasty: "宋",
        author: "苏轼",
        difficulty: 2,
        content:  [
            "横看成岭侧成峰",
            "远近高低各不同",
            "不识庐山真面目",
            "只缘身在此山中"
        ]
    },
    {
        title: "夏日绝句",
        dynasty: "宋",
        author: "李清照",
        difficulty: 2,
        content:  [
            "生当作人杰",
            "死亦为鬼雄",
            "至今思项羽",
            "不肯过江东"
        ]
    },
    {
        title: "示儿",
        dynasty: "宋",
        author: "陆游",
        difficulty: 2,
        content:  [
            "死去元知万事空",
            "但悲不见九州同",
            "王师北定中原日",
            "家祭无忘告乃翁"
        ]
    },
    {
        title: "晓出净慈寺送林子方",
        dynasty: "宋",
        author: "杨万里",
        difficulty: 2,
        content:  [
            "毕竟西湖六月中",
            "风光不与四时同",
            "接天莲叶无穷碧",
            "映日荷花别样红"
        ]
    },
    {
        title: "四时田园杂兴",
        dynasty: "宋",
        author: "范成大",
        difficulty: 2,
        content:  [
            "昼出耘田夜绩麻",
            "村庄儿女各当家",
            "童孙未解供耕织",
            "也傍桑阴学种瓜"
        ]
    },
    {
        title: "春日",
        dynasty: "宋",
        author: "朱熹",
        difficulty: 2,
        content:  [
            "胜日寻芳泗水滨",
            "无边光景一时新",
            "等闲识得东风面",
            "万紫千红总是春"
        ]
    },
    {
        title: "题临安邸",
        dynasty: "宋",
        author: "林升",
        difficulty: 2,
        content:  [
            "山外青山楼外楼",
            "西湖歌舞几时休",
            "暖风熏得游人醉",
            "直把杭州作汴州"
        ]
    },
    {
        title: "墨梅",
        dynasty: "元",
        author: "王冕",
        difficulty: 2,
        content:  [
            "吾家洗砚池头树",
            "朵朵花开淡墨痕",
            "不要人夸好颜色",
            "只流清气满乾坤"
        ]
    },
    {
        title: "石灰吟",
        dynasty: "明",
        author: "于谦",
        difficulty: 2,
        content:  [
            "千锤万凿出深山",
            "烈火焚烧若等闲",
            "粉骨碎身浑不怕",
            "要留清白在人间"
        ]
    },
    {
        title: "竹石",
        dynasty: "清",
        author: "郑燮",
        difficulty: 2,
        content:  [
            "咬定青山不放松",
            "立根原在破岩中",
            "千磨万击还坚劲",
            "任尔东西南北风"
        ]
    },
    {
        title: "己亥杂诗",
        dynasty: "清",
        author: "龚自珍",
        difficulty: 2,
        content:  [
            "九州生气恃风雷",
            "万马齐喑究可哀",
            "我劝天公重抖擞",
            "不拘一格降人才"
        ]
    }
];

function poetryQuestionMaker1(poetry, optionAnswer = false){
    let contentIdx = Math.floor(Math.random() * poetry.content.length);
    let res =  {
        question: `请写出《${poetry.title}》的第${contentIdx+1}小句`,
        img: "",
        options: [],
        answer: poetry.content[contentIdx],
        knowledge: poetryKnowledgeMaker(poetry),
        difficulty: poetry.difficulty+2
    }
    if (optionAnswer){
        let options = [...poetry.content];
        shuffle(options);
        options = options.slice(0, 4);
        if (!options.includes(res.answer)){
            options[0] = res.answer;
            shuffle(options);
        }
        res.options = options;
        res.difficulty --;
    }
    return res
}

function shuffle(arr) {
    let i = arr.length;
    while (i) {
        let j = Math.floor(Math.random() * i--);
        [arr[j], arr[i]] = [arr[i], arr[j]];
    }
}

function poetryKnowledgeMaker(poetry){
    let ret = `《${poetry.title}》 ${poetry.dynasty} ${poetry.author}<br/>`;
    for (let i = 0; i < poetry.content.length; i++) {
        ret += `${poetry.content[i]}<br/>`
    }
    return ret
}

function poetryQuestionMaker2(poetry, optionAnswer = false){
    let contentIdx = Math.floor(Math.random() * poetry.content.length);
    if (contentIdx > poetry.content.length-1) {
        contentIdx = poetry.content.length-1
    }
    if (contentIdx%2 == 0){
        if (contentIdx == poetry.content.length-1) {
            contentIdx--;
        }
        let res = {
            question: `请写出《${poetry.title}》中“${poetry.content[contentIdx]}”的下一句`,
            img: "",
            options: [],
            answer: poetry.content[contentIdx+1],
            knowledge: poetryKnowledgeMaker(poetry),
            difficulty: poetry.difficulty+1
        };
        if (optionAnswer){
            let options = [...poetry.content];
            shuffle(options);
            options = options.slice(0, 4);
            if (!options.includes(res.answer)){
                options[0] = res.answer;
                shuffle(options);
            }
            res.options = options;
            res.difficulty --;
        }
        return res
    }else{
        let res = {
            question: `请写出《${poetry.title}》中“${poetry.content[contentIdx]}”的上一句`,
            img: "",
            options: [],
            answer: poetry.content[contentIdx-1],
            knowledge: poetryKnowledgeMaker(poetry),
            difficulty: poetry.difficulty+1
        };
        if (optionAnswer){
            let options = [...poetry.content];
            shuffle(options);
            options = options.slice(0, 4);
            if (!options.includes(res.answer)){
                options[0] = res.answer;
                shuffle(options);
            }
            res.options = options;
            res.difficulty --;
        }
        return res
    }
}

function poetryQuestionMaker3(poetry, options = []){
    let contentIdx = Math.floor(Math.random() * poetry.content.length);
    if (contentIdx >= poetry.content.length-1) {
        contentIdx = poetry.content.length-2
    }
    secs = poetry.content.slice(contentIdx, contentIdx+2).join("，");
    res = {
        question: `${secs}。<br/>请说出此句出自哪首诗？`,
        img: "",
        options: [],
        answer: poetry.title,
        knowledge: poetryKnowledgeMaker(poetry),
        difficulty: poetry.difficulty
    }
    if (options.length > 2){
        shuffle(options);
        options = options.slice(0, 4);
        if (!options.includes(res.answer)){
            options[0] = res.answer;
            shuffle(options);
        }
        res.options = options;
        res.difficulty;
    }
    return res
}

function poetryQuestionMaker4(poetry, options = []){
    let contentIdx = Math.floor(Math.random() * poetry.content.length);
    if (contentIdx >= poetry.content.length-1) {
        contentIdx = poetry.content.length-2
    }
    secs = poetry.content.slice(contentIdx, contentIdx+2).join("，");
    res = {
        question: `${secs}。<br/>请说出此句的作者是谁？`,
        img: "",
        options: [],
        answer: poetry.author,
        knowledge: poetryKnowledgeMaker(poetry),
        difficulty: poetry.difficulty
    }
    if (options.length > 2){
        shuffle(options);
        options = options.slice(0, 4);
        if (!options.includes(res.answer)){
            options[0] = res.answer;
            shuffle(options);
        }
        res.options = options;
        res.difficulty;
    }
    return res
}

function autoPoetryQuestions(difficulty = 1, num = 10){
    let difficultyPoetrys = [];
    let allTitles = [];
    let existTitles = {};
    let allAuthors = [];
    let existAuthors = {};
    for (let i = 0; i < poetrys.length; i++) {
        if (!existTitles[poetrys[i].title]){
            allTitles.push(poetrys[i].title)
        }
        existTitles[poetrys[i].title] = true;
        if (!existAuthors[poetrys[i].author]){
            allAuthors.push(poetrys[i].author)
        }
        existAuthors[poetrys[i].author] = true;
        if (poetrys[i].difficulty == difficulty){
            difficultyPoetrys.push(poetrys[i])
        }
    }
    selectedPoetrys = [];
    if (num > difficultyPoetrys.length){
        selectedPoetrys = difficultyPoetrys
    }else{
        for (let i = 0; i < num; i++) {
            let poetry = difficultyPoetrys[Math.floor(Math.random() * difficultyPoetrys.length)];
            selectedPoetrys.push(poetry)
        }
    }

    for (let i = 0; i < selectedPoetrys.length; i++) {
        let poetry = selectedPoetrys[i];
        questions.push(poetryQuestionMaker1(poetry, true))
        questions.push(poetryQuestionMaker2(poetry, true))
        questions.push(poetryQuestionMaker3(poetry, allTitles))
        questions.push(poetryQuestionMaker4(poetry, allAuthors))
    }
}

autoMathQuestions(1, 10)
autoMathQuestions(2, 10)
autoMathQuestions(3, 10)
autoMathQuestions(4, 10)
autoMathQuestions(5, 10)
autoPoetryQuestions(1, 10)
autoPoetryQuestions(2, 10)
shuffle(questions)
