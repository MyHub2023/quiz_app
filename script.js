const selectedOption = document.querySelectorAll('.option-txt');

console.log(selectedOption[0]);

selectedOption.forEach(option => {
    let answer = option.getAttribute('answer');
    option.addEventListener('click', () => {
            option.classList.toggle(answer === 'yes' ? 'right' : 'wrong');
            option.nextElementSibling.classList.toggle('show');
    });
});

const getCriteria = window.location.href;
const parameter = getCriteria.split('?')[1].split('&')

const parameter_obj_array = parameter.map(item => {
        let obj = {};
        let key = item.split('=')[0];
        let value = item.split('=')[1];
        obj[key] = value;

        return obj;
    }
);
console.log(parameter_obj_array);

const finalObj = {};
parameter_obj_array.forEach((item, i) => Object.assign(finalObj, parameter_obj_array[i]))
console.log(finalObj);

const {questions_amount, category, difficulty, question_type} = finalObj;

const url = (questions_amount, category, difficulty, question_type) => {

    let url = `https://opentdb.com/api.php?amount=${questions_amount}`;

    if (category !== 'any') url = url + `&category=${category}`;
    if (difficulty !== 'any') url = url + `&difficulty=${difficulty}`;
    if (question_type !== 'any') url = url + `&type=${question_type}`;

    return url;
};

const api_url = url(questions_amount, category, difficulty, question_type);
console.log(api_url);

// question.html
const answer_options = document.querySelectorAll('.option-txt');
const question = document.querySelector('.question');
const nextBtn = document.querySelector('.next');
// const prevBtn = document.querySelector('.prev');
//console.log(answer_options, question);

fetch(api_url)
    .then(response => response.json())
    .then(data => {
        console.log(data);
        let {results} = data;
        console.log(results);
        // first question
        let firstQuestion = results[0];
        let optionList = shuffle([ ...firstQuestion.incorrect_answers, firstQuestion.correct_answer]);
        //console.log(firstQuestion, optionList, firstQuestion.correct_answer);
        question.innerHTML = firstQuestion.question;
        answer_options.forEach((item, i) => item.textContent = optionList[i]);
        //console.log(nextBtn);

        let current = 1;
        nextBtn.addEventListener('click', () => {
            let nextQuestions = results[current];
            let optionList = shuffle([ ...nextQuestions.incorrect_answers, nextQuestions.correct_answer]);
            //console.log(nextQuestions, optionList, nextQuestions.correct_answer);
            question.innerHTML = nextQuestions.question;
            answer_options.forEach((item, i) => item.textContent = optionList[i]);

            // if (current < +questions_amount - 1 && current > 0) {
            //     nextBtn.disabled = false;
            //     prevBtn.disabled = false;
            // }

            if (current === +questions_amount - 1) {
                nextBtn.disabled = true;
                return;
            };
        
            current++;
        });

        // prevBtn.addEventListener('click', () => {
        //     let nextQuestions = results[current];
        //     let optionList = shuffle([ ...nextQuestions.incorrect_answers, nextQuestions.correct_answer]);
        //     //console.log(nextQuestions, optionList, nextQuestions.correct_answer);
        //     question.innerHTML = nextQuestions.question;
        //     answer_options.forEach((item, i) => item.textContent = optionList[i]);

        //     if (current < +questions_amount - 1 && current > 0) {
        //         nextBtn.disabled = false;
        //         prevBtn.disabled = false;
        //     }

        //     if (current === 0) {
        //         prevBtn.disabled = true;
        //         return;
        //     };
        
        //     current--;
        // });
    });




// Shuffle Answer options
function shuffle(array) {
    let ctr = array.length, temp, index;
    // While there are elements in the array
    while (ctr > 0) {
        // Pick a random index
        index = Math.floor(Math.random() * ctr);
        // Decrease ctr by 1
        ctr--;
        // And swap the last element with it
        temp = array[ctr];
        array[ctr] = array[index];
        array[index] = temp;
    }
    return array;
}
// let myArray = [0, 1, 2, 3];
//console.log(shuffle(myArray));

// const shuffleArray = array => {
//     for (let i = array.length - 1; i > 0; i--) {
//         const j = Math.floor(Math.random() * (i + 1));

//         const temp = array[i];
//         array[i] = array[j];
//         array[j] = temp;
//     }
//     return array;
// };
//console.log(shuffleArray(myArray));