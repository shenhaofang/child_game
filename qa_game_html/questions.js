const questions = [
    // {
    //     question: "2 + 2 等于几？",
    //     options: ["3", "4", "5"],
    //     answer: "4",
    //     difficulty: 1
    // },
    // {
    //     question: "HTTP 的默认端口号是？",
    //     options: [],
    //     answer: "80",
    //     difficulty: 2
    // },
    // {
    //     question: "Python 的作者是谁？",
    //     options: [],
    //     answer: "Guido van Rossum",
    //     difficulty: 3
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
                options: [],
                answer: c.toString(),
                difficulty: difficulty
            })
        }else{
            questions.push({
                question: `${c} - ${a} = ?`,
                options: [],
                answer: b.toString(),
                difficulty: difficulty
            })
        }
    }
}

function autoMathMultiDiv(difficulty = 1, num = 10){
    let digit = difficulty
    if (digit > 2){
        digit -= 2
    }
    for (let i = 0; i < num; i++) {
        let a = randomInt(digit);
        let b = randomInt(digit);
        let c = a * b;
        if (i%2 == 0 || (a == 0 && b == 0)){
            questions.push({
                question: `${a} × ${b} = ?`,
                options: [],
                answer: c.toString(),
                difficulty: difficulty
            })
        }else{
            questions.push({
                question: `${c} ÷ ${a} = ?`,
                options: [],
                answer: b.toString(),
                difficulty: difficulty
            })
        }
    }
}

autoMathQuestions(1, 10)
autoMathQuestions(2, 10)
autoMathQuestions(3, 10)
autoMathQuestions(4, 10)
autoMathQuestions(5, 10)