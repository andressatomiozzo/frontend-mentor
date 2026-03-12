"use strict";
const message = document.querySelector("#message");
const startContainer = document.querySelector(".start-container");
const startBtn = document.querySelector(".start");
const levelInput = document.querySelector("#level");
const restartBtn = document.querySelector(".restart");
const textInput = document.querySelector("#textInput");
const correctCount = document.querySelector("#correctCount");
const errorCount = document.querySelector("#errorCount");
const timeContainer = document.querySelector("#time-container");
const wpmContainer = document.querySelector("#wpm-container");
const accuracyContainer = document.querySelector("#accuracy-container");
if (!message ||
    !levelInput ||
    !textInput ||
    !correctCount ||
    !errorCount ||
    !timeContainer ||
    !accuracyContainer ||
    !wpmContainer ||
    !restartBtn ||
    !startBtn || !startContainer)
    throw new Error("Some element is not linked to the DOM.");
// ! Para iniciar o teste
startBtn.addEventListener("click", () => {
    startContainer.classList.add("escondido");
    textInput.focus();
});
document.addEventListener("keydown", () => {
    startContainer.classList.add("escondido");
    textInput.focus();
});
message.addEventListener("click", () => textInput.focus());
// ! Variáveis
// * Quebrar a mensagem em spans e depois pegar os spans
let messageBroaken = [];
let messageSpans = [];
// * Começar o tempo
let started = false;
let startTime = 0;
let endTime = 0;
// * Calcular os erros e acertos
let errorTotal = [];
let correct = 0;
let error = 0;
// !Funções
// * Resetar os valores iniciais
const reset = () => {
    textInput.value = "";
    started = false;
    startTime = 0;
    endTime = 0;
    errorTotal = [];
    correct = 0;
    error = 0;
    messageSpans[0].classList.add("active");
    correctCount.innerText = `Number of correct characters: ${correct}`;
    errorCount.innerText = `Number of incorrect characters: ${error} Total number of incorrect characters: ${errorTotal.length}`;
    timeContainer.innerText = `0:00`;
    wpmContainer.innerText = `0`;
    accuracyContainer.innerText = `100%`;
};
// * Quebrar a mensagem em spans
const breakMessage = () => {
    //Se não tiver uma mensagem como desafio ele solta um erro
    if (message.textContent.length === 0) {
        console.log("ops, não tem messagem");
    }
    else {
        //Quebra a mensagem em pequenos spans
        messageBroaken = message.textContent.split("");
        message.innerHTML = "";
        messageBroaken.forEach((character) => {
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
// Puxar os dados do data.json pra esse arquivo
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
};
// A cada letra teclada no input vai rodar isso aqui:
textInput.addEventListener("input", () => {
    if (started === false) {
        // Na primeira letra digitada cai aqui e marca o tempo de início
        startTime = Date.now();
        started = true;
    }
    let totalLength = messageSpans.length;
    correct = 0;
    error = 0;
    // * Mostra o tempo real
    let nowTimeTotalSeconds = Math.floor((Date.now() - startTime) / 1000);
    let nowTimeMinutes = nowTimeTotalSeconds / 60;
    let nowTimeSeconds = nowTimeTotalSeconds % 60;
    let nowTimeSecondsString = `${nowTimeSeconds}`.padStart(2, "0");
    let nowTimeString = `${Math.floor(nowTimeMinutes)}:${nowTimeSecondsString}`;
    let wpmNow = Math.floor(nowTimeMinutes === 0 ? 0 : textInput.value.length / 5 / nowTimeMinutes);
    timeContainer.innerText = `${nowTimeString}`;
    wpmContainer.innerText = `${wpmNow}`;
    // Remove todas as classes de tudo, pois quando entrar no for ele vai adicionar
    messageSpans.forEach((span) => span.classList.remove("active", "correct", "incorrect"));
    if (textInput.value.length === 0) {
        messageSpans[0].classList.add("active");
    }
    // Pra cada caractere que está e já foi adicionado ele verifica se está correto ou não comparando os spans
    for (let i = 0; i < textInput.value.length; i++) {
        if (textInput.value[i] === messageBroaken[i]) {
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
        let accuracy = Math.floor(((totalLength - errorTotal.length) / totalLength) * 100);
        accuracyContainer.innerText = `${accuracy < 0 ? 0 : accuracy}%`;
    }
    // Acabou o exercício
    if (textInput.value.length >= totalLength) {
        finishTest();
    }
    //Mostra na tela o que foi feito sempre atualizando os dados
    correctCount.innerText = `Number of correct characters: ${correct}`;
    errorCount.innerText = `Number of incorrect characters: ${error} Total number of incorrect characters: ${errorTotal.length}`;
});
const finishTest = () => {
    console.log("You have completed the exercise.");
    endTime = Date.now();
    let elapsedTimeTotalSeconds = Math.floor((endTime - startTime) / 1000);
    let elapsedTimeMinutes = elapsedTimeTotalSeconds / 60;
    let elapsedTimeSeconds = elapsedTimeTotalSeconds % 60;
    let elapsedTimeSecondsString = `${elapsedTimeSeconds}`.padStart(2, "0");
    let elapsedTimeString = `${Math.floor(elapsedTimeMinutes)}:${elapsedTimeSecondsString}`;
    let wpmTotal = Math.floor(elapsedTimeMinutes === 0 ? 0 : textInput.value.length / 5 / elapsedTimeMinutes);
    timeContainer.innerText = `Final time: ${elapsedTimeString}`;
    wpmContainer.innerText = `Final WPM: ${wpmTotal}`;
    textInput.disabled = true;
};
restartBtn.addEventListener("click", () => pullData());
pullData();
