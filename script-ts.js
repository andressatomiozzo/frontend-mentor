"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const message = document.querySelector("#message");
const restartBtn = document.querySelector(".restart");
const textInput = document.querySelector("#textInput");
const correctCount = document.querySelector("#correctCount");
const errorCount = document.querySelector("#errorCount");
const timeContainer = document.querySelector("#time-container");
const wpmContainer = document.querySelector("#wpm-container");
const accuracyContainer = document.querySelector("#accuracy-container");
if (!message || !textInput || !correctCount || !errorCount || !timeContainer || !accuracyContainer || !wpmContainer || !restartBtn)
    throw new Error("Some element is not linked to the DOM.");
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
    timeContainer.innerText = `Tempo: 0:00`;
    wpmContainer.innerText = `WPM: 0`;
    accuracyContainer.innerText = `Accuracy: 100%`;
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
const levelArray = ["easy", "medium", "hard"]; // ("easy" | "medium" | "hard") -> os únicos valores aceitos são estes
const randomLevel = levelArray[Math.floor(Math.random() * 3)]; // Sortear um dos índices
// Puxar os dados do data.json pra esse arquivo
const pullData = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield fetch("data.json");
        if (!data.ok) {
            throw new Error("Ops! Something is wrong!");
        }
        const dataJson = (yield data.json());
        const chosenLevel = dataJson[randomLevel];
        const chosenIndex = Math.floor(Math.random() * chosenLevel.length);
        const chosenText = chosenLevel[chosenIndex];
        message.textContent = chosenText.text;
        breakMessage();
    }
    catch (err) {
        console.log(err);
    }
});
// A cada letra teclada no input vai rodar isso aqui:
textInput.addEventListener("input", () => {
    if (started === false) {
        // Na primeira letra digitada cai aqui e marca o tempo de início
        startTime = Date.now();
        started = true;
    }
    let totalLenght = messageSpans.length;
    correct = 0;
    error = 0;
    // Mostra o tempo real
    let nowTimeSeconds = Math.floor((Date.now() - startTime) / 1000);
    let nowTimeMinutes = Math.floor(nowTimeSeconds / 60) + (nowTimeSeconds % 60) * 0.01;
    let wpmNow = Math.floor(nowTimeMinutes === 0 ? 0 : totalLenght / 5 / nowTimeMinutes);
    timeContainer.innerText = `Tempo: ${nowTimeMinutes}`;
    wpmContainer.innerText = `WPM: ${wpmNow}`;
    // Remove todas as classes de tudo, pois quando entrar no for ele vai adicionar
    messageSpans.forEach((span) => span.classList.remove("active", "correct", "incorrect"));
    // Pra cada caractere que está e já foi adicionado ele verifica se está correto ou não comparando os spans
    for (let i = 0; i < textInput.value.length; i++) {
        if (i !== totalLenght) {
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
            if (i === textInput.value.length - 1 && i !== totalLenght - 1) {
                messageSpans[i + 1].classList.add("active");
            }
            //Accuracy
            let accuracy = Math.floor(((totalLenght - errorTotal.length) / totalLenght) * 100);
            accuracyContainer.innerText = `Accuracy: ${accuracy < 0 ? 0 : accuracy}%`;
        }
        else {
            console.log("You have completed the exercise.");
            textInput.remove();
            endTime = Date.now();
            let elapsedTimeSeconds = Math.floor((endTime - startTime) / 1000);
            let elapsedTimeMinutes = Math.floor(elapsedTimeSeconds / 60) + (elapsedTimeSeconds % 60) * 0.01;
            let wpmTotal = elapsedTimeMinutes === 0 ? 0 : totalLenght / 5 / elapsedTimeMinutes;
            timeContainer.innerText = `Final time: ${elapsedTimeMinutes}`;
        }
    }
    //Mostra na tela o que foi feito sempre atualizando os dados
    correctCount.innerText = `Number of correct characters:: ${correct}`;
    errorCount.innerText = `Number of incorrect characters:: ${error} Total number of incorrect characters:: ${errorTotal.length}`;
});
restartBtn.addEventListener("click", () => pullData());
pullData();
