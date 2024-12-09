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
    return Math.floor(Math.random() * Math.pow(10, difficulty+1))
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
        title: "山行",
        dynasty: "唐",
        author: "杜牧",
        difficulty: 2,
        content: ["远上寒山石径斜", "白云生处有人家", "停车坐爱枫林晚", "霜叶红于二月花"]
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
    secs = poetry.content.slice(contentIdx, contentIdx+2).join("<br/>");
    res = {
        question: `${secs}<br/>请说出此句出自哪首诗？`,
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
    secs = poetry.content.slice(contentIdx, contentIdx+2).join("<br/>");
    res = {
        question: `${secs}<br/>请说出此句的作者是谁？`,
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
    difficultyPoetrys = [];
    allTitles = [];
    allAuthors = [];
    for (let i = 0; i < poetrys.length; i++) {
        allTitles.push(poetrys[i].title)
        allAuthors.push(poetrys[i].author)
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
