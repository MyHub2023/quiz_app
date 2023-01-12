// Collecting user input as an JavaScript Object in order to send reguest to API
const answer_options = document.querySelectorAll(".option-txt");
const question = document.querySelector(".question");

// answer_options.forEach((option) => {
//     let answer = option.getAttribute("answer");
//     option.addEventListener("click", () => {
//         option.classList.toggle(answer === "yes" ? "right" : "wrong");
//         option.nextElementSibling.classList.toggle("show");
//     });
// });

const getCriteria = window.location.href;
const parameter = getCriteria.split("?")[1].split("&");

const parameter_obj_array = parameter.map((item) => {
    let obj = {};
    let key = item.split("=")[0];
    let value = item.split("=")[1];
    obj[key] = value;

    return obj;
});

const finalObj = {};
parameter_obj_array.forEach((item, i) =>
    Object.assign(finalObj, parameter_obj_array[i])
);

// Making URL for collecting questions data from API
const { questions_amount, category, difficulty, question_type } = finalObj;

const url = (questions_amount, category, difficulty, question_type) => {
    let url = `https://opentdb.com/api.php?amount=${questions_amount}`;

    if (category !== "any") url = url + `&category=${category}`;
    if (difficulty !== "any") url = url + `&difficulty=${difficulty}`;
    if (question_type !== "any") url = url + `&type=${question_type}`;

    console.log(url);
    return url;
};
const api_url = url(questions_amount, category, difficulty, question_type);

// question.html
const nextBtn = document.querySelector(".next");
const question_index = document.querySelector(".question-index");
const totalQuestions = document.querySelector(".total-question");
const progressBar = document.querySelector(".progress-bar");
progressBar.setAttribute("max", questions_amount);
totalQuestions.textContent = questions_amount;
question_index.textContent = 1;

// fetching questions data from API and send it to the QUIZ UI for user to perticipate
fetch(api_url)
    .then((response) => response.json())
    .then((data) => {
        let { results } = data;
        // Add questions_id in the result
        let quizQuestions = results.map((que, i) => {
            let question_id = i + 1;
            return { ...que, question_id };
        });
        console.log(quizQuestions);
        // first question
        let firstQuestion = quizQuestions[0];
        let optionList = shuffle([
            ...firstQuestion.incorrect_answers,
            firstQuestion.correct_answer,
        ]);
        question.innerHTML = firstQuestion.question;
        answer_options.forEach((option, i) => {
            function setClass(className) {
                option.classList.add(className);
                option.nextElementSibling.classList.add("show");
            }
            option.textContent = optionList[i];

            option.textContent === firstQuestion.correct_answer
                ? option.addEventListener("click", () => setClass("right"))
                : option.addEventListener("click", () => setClass("wrong"));

            console.log(option);
        });

        let current = 1;
        nextBtn.addEventListener("click", () => {
            let nextQuestions = quizQuestions[current];
            let optionList = shuffle([
                ...nextQuestions.incorrect_answers,
                nextQuestions.correct_answer,
            ]);

            question.innerHTML = nextQuestions.question;
            question_index.textContent = nextQuestions.question_id;
            progressBar.setAttribute("value", nextQuestions.question_id);

            answer_options.forEach((option, i) => {
                option.nextElementSibling.classList.remove("show");
                option.classList.remove("right");
                option.classList.remove("wrong");
                option.removeEventListener("click", setClass);

                function setClass(className) {
                    option.classList.add(className);
                    option.nextElementSibling.classList.add("show");
                }
                option.textContent = optionList[i];

                option.textContent === nextQuestions.correct_answer
                    ? option.addEventListener("click", () => setClass("right"))
                    : option.addEventListener("click", () => setClass("wrong"));

                console.log(option);
            });

            if (current === +questions_amount - 1) {
                nextBtn.disabled = true;
                return;
            }

            current++;
        });
    });

// const goBack = () =>

// Shuffle Answer options
function shuffle(array) {
    let ctr = array.length,
        temp,
        index;
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
