const message = document.querySelector("#message");
const alert = document.querySelector("#alert");
const startContainer = document.querySelector(".start-container");
const startBtn = document.querySelector(".start");
const levelInput = document.querySelector("#level");
const timeSelect = document.querySelector("#time");
const restartBtn = document.querySelector(".restart");
const textInput = document.querySelector("#textInput");
const timeContainer = document.querySelector(".time-container");
const wpmContainer = document.querySelector(".wpm-container");
const accuracyContainer = document.querySelector(".accuracy-container");
const resultsContainer = document.querySelectorAll(".results");
const bestWpmResult = document.querySelector("#best-wpm-result");
const baselineContainer = document.querySelector("#baseline-container");
const highScoreSmashed = document.querySelector("#high-score-smashed");
const testComplete = document.querySelector("#test-complete");
if (!message ||
    !alert ||
    !levelInput ||
    !timeSelect ||
    !textInput ||
    !timeContainer ||
    !accuracyContainer ||
    !wpmContainer ||
    !restartBtn ||
    !startBtn ||
    !startContainer ||
    !resultsContainer ||
    !bestWpmResult ||
    !baselineContainer ||
    !highScoreSmashed ||
    !testComplete)
    throw new Error("Some element is not linked to the DOM.");
// ! Variáveis para exportar
export { textInput, timeContainer, resultsContainer, correct, error, accuracy, wpmNow, pullData, bestWpmResult, baselineContainer, highScoreSmashed, testComplete, alert, messageSpans };
import { startTimerFree, startTimer60, stopTimer, wpmCounter } from "./timer.js";
import { finishTest } from "./finish-test.js";
// ! Para iniciar o teste
startBtn.addEventListener("click", () => {
    startContainer.classList.add("hidden");
    pullData();
});
startContainer.addEventListener("keydown", () => {
    startContainer.classList.add("hidden");
    pullData();
});
message.addEventListener("click", () => textInput.focus());
// ! Adicionar ou remover classe active caso o textInput estiver ou não focado
textInput.addEventListener("focus", () => {
    messageSpans[textInput.value.length].classList.add("active");
});
textInput.addEventListener("blur", () => {
    if (textInput.disabled === false) {
        messageSpans[textInput.value.length].classList.remove("active");
    }
});
// ! Resetar os valores iniciais
const reset = () => {
    textInput.value = "";
    alert.innerText = "";
    started = false;
    startTime = 0;
    endTime = 0;
    errorTotal = [];
    correct = 0;
    error = 0;
    timeContainer.innerText = `0:00`;
    wpmContainer.innerText = `0`;
    accuracyContainer.innerText = `100%`;
    stopTimer();
    textInput.focus();
    messageSpans[0].classList.add("active");
};
let wpmNow = 0;
// ! Quebrar a mensagem e transformar em span
// * Quebrar a mensagem em spans e depois pegar os spans
let messageBroken = [];
let messageSpans = [];
// * Quebrar a mensagem em spans
const breakMessage = () => {
    //Se não tiver uma mensagem como desafio ele solta um erro
    if (!message.textContent) {
        console.log("ops, não tem messagem");
    }
    else {
        //Quebra a mensagem em pequenos spans
        messageBroken = message.textContent.split("");
        message.innerHTML = "";
        messageBroken.forEach((character) => {
            const spanCharacter = document.createElement("span");
            spanCharacter.innerText = character;
            spanCharacter.classList.add("message-span");
            message.appendChild(spanCharacter);
        });
        //Pega todos os spans e transforma em array
        messageSpans = Array.from(document.querySelectorAll(".message-span"));
        reset();
    }
};
const pullData = async () => {
    const levelArray = ["easy", "medium", "hard"]; // ("easy" | "medium" | "hard") -> os únicos valores aceitos são estes
    let positionLevel = levelArray[0];
    if (levelInput.value === "medium")
        positionLevel = levelArray[1];
    if (levelInput.value === "hard")
        positionLevel = levelArray[2];
    try {
        const data = await fetch("src/data.json");
        if (!data.ok) {
            throw new Error("Ops! Something is wrong!");
        }
        const dataJson = (await data.json());
        const chosenLevel = dataJson[positionLevel];
        const chosenIndex = Math.floor(Math.random() * chosenLevel.length);
        const chosenText = chosenLevel[chosenIndex];
        message.textContent = chosenText.text;
        breakMessage();
    }
    catch (err) {
        console.log(err);
    }
    textInput.disabled = false;
    textInput.focus();
};
// ! Váriáveis do tempo, acertos e erros, além do fim do teste
// * Começar o tempo
let started = false;
let startTime = 0;
let endTime = 0;
// * Calcular os erros e acertos
let errorTotal = [];
let correct = 0;
let error = 0;
let accuracy = 100;
// const finishBaseline = () => {
//   baselineContainer.classList.remove("hidden");
//   if (accuracy >= 95) {
//     accuracyContainer[1].classList.add("correct");
//   } else {
//     accuracyContainer[1].classList.add("incorrect");
//   }
//   correctCharactersContainer.classList.add("correct");
//   incorrectCharactersContainer.classList.add("incorrect");
// };
// const finishTest = () => {
//   console.log("You have completed the exercise.");
//   correctCharactersContainer.innerText = `${correct}`;
//   incorrectCharactersContainer.innerText = `${error}`;
//   textInput.disabled = true;
//   finishBaseline();
// };
// ! A cada letra teclada no input vai rodar isso aqui:
textInput.addEventListener("input", () => {
    if (started === false) {
        startTime = Date.now();
        // Na primeira letra digitada cai aqui e marca o tempo de início
        if (timeSelect.value === "true") {
            startTimer60(startTime);
        }
        else {
            startTimerFree(startTime);
        }
        started = true;
    }
    let totalLength = messageSpans.length;
    correct = 0;
    error = 0;
    // * Mostra o WPM ao vivo
    wpmContainer.innerText = `${wpmCounter(startTime)}`;
    wpmNow = wpmCounter(startTime);
    // Remove todas as classes de tudo, pois quando entrar no for ele vai adicionar
    messageSpans.forEach((span) => span.classList.remove("active", "correct", "incorrect"));
    if (textInput.value.length === 0) {
        messageSpans[0].classList.add("active");
    }
    // Pra cada caractere que está e já foi adicionado ele verifica se está correto ou não comparando os spans
    for (let i = 0; i < textInput.value.length; i++) {
        if (textInput.value[i] === messageBroken[i]) {
            messageSpans[i].classList.add("correct");
            correct++;
        }
        else {
            messageSpans[i].classList.add("incorrect");
            error++;
            if (!errorTotal.includes(i))
                errorTotal.push(i);
        }
        // Atualizar cursor
        if (i === textInput.value.length - 1 && i !== totalLength - 1) {
            messageSpans[i + 1].classList.add("active");
        }
        // Accuracy
        accuracy = Math.floor(((totalLength - errorTotal.length) / totalLength) * 100);
        accuracyContainer.innerText = `${accuracy < 0 ? 0 : accuracy}%`;
    }
    // Acabou o exercício
    if (textInput.value.length >= totalLength) {
        finishTest();
    }
});
restartBtn.addEventListener("click", () => pullData());
