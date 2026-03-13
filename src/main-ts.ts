const message = document.querySelector<HTMLParagraphElement>("#message");
const startContainer = document.querySelector<HTMLDivElement>(".start-container");
const startBtn = document.querySelector<HTMLButtonElement>(".start");
const levelInput = document.querySelector<HTMLSelectElement>("#level");
const timeSelect = document.querySelector<HTMLSelectElement>("#time");
const restartBtn = document.querySelector<HTMLButtonElement>(".restart");
const textInput = document.querySelector<HTMLInputElement>("#textInput");
const correctCount = document.querySelector<HTMLSpanElement>("#correctCount");
const errorCount = document.querySelector<HTMLSpanElement>("#errorCount");
const timeContainer = document.querySelector<HTMLSpanElement>("#time-container");
const wpmContainer = document.querySelector<HTMLSpanElement>("#wpm-container");
const accuracyContainer = document.querySelector<HTMLSpanElement>("#accuracy-container");

if (
  !message ||
  !levelInput ||
  !timeSelect ||
  !textInput ||
  !correctCount ||
  !errorCount ||
  !timeContainer ||
  !accuracyContainer ||
  !wpmContainer ||
  !restartBtn ||
  !startBtn ||
  !startContainer
)
  throw new Error("Some element is not linked to the DOM.");

// ! Variáveis para exportar
export { textInput, timeContainer };

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

// ! Resetar os valores iniciais
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
  stopTimer();
};

// ! Quebrar a mensagem e transformar em span
// * Quebrar a mensagem em spans e depois pegar os spans
let messageBroken: string[] = [];
let messageSpans: HTMLSpanElement[] = [];

// * Quebrar a mensagem em spans
const breakMessage = () => {
  //Se não tiver uma mensagem como desafio ele solta um erro
  if (!message.textContent) {
    console.log("ops, não tem messagem");
  } else {
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
    messageSpans = Array.from(document.querySelectorAll<HTMLSpanElement>(".message-span"));
    reset();
  }
};

// ! Puxar os dados do data.json pra esse arquivo
// Deixar claro qual o tipo de dado que o data.json vai retornar
type levels = {
  id: string;
  text: string;
};
type levelsData = {
  easy: levels[];
  medium: levels[];
  hard: levels[];
};

const pullData = async () => {
  const levelArray: ("easy" | "medium" | "hard")[] = ["easy", "medium", "hard"]; // ("easy" | "medium" | "hard") -> os únicos valores aceitos são estes
  let positionLevel = levelArray[0];
  if (levelInput.value === "medium") positionLevel = levelArray[1];
  if (levelInput.value === "hard") positionLevel = levelArray[2];
  try {
    const data = await fetch("src/data.json");
    if (!data.ok) {
      throw new Error("Ops! Something is wrong!");
    }
    const dataJson = (await data.json()) as levelsData;
    const chosenLevel = dataJson[positionLevel];
    const chosenIndex = Math.floor(Math.random() * chosenLevel.length);
    const chosenText = chosenLevel[chosenIndex];
    message.textContent = chosenText.text;
    breakMessage();
  } catch (err) {
    console.log(err);
  }
  textInput.disabled = false;
};

// ! Váriáveis do tempo, acertos e erros, além do fim do teste
// * Começar o tempo
let started = false;
let startTime = 0;
let endTime = 0;

// * Calcular os erros e acertos
let errorTotal: number[] = [];
let correct = 0;
let error = 0;

import { startTimerFree, startTimer60, stopTimer, wpmCounter, finalTimer } from "./timer.js";

const finishTest = () => {
  console.log("You have completed the exercise.");
  timeContainer.innerText = `Final time: ${finalTimer(startTime)}`;
  wpmContainer.innerText = `Final WPM: ${wpmCounter(startTime)}`;
  textInput.disabled = true;
};

// ! A cada letra teclada no input vai rodar isso aqui:
textInput.addEventListener("input", () => {
  if (started === false) {
    startTime = Date.now();
    // Na primeira letra digitada cai aqui e marca o tempo de início
    if (timeSelect.value === "true") {
      startTimer60(startTime);
    } else {
      startTimerFree(startTime);
    }
    started = true;
  }

  let totalLength = messageSpans.length;
  correct = 0;
  error = 0;

  // * Mostra o WPM ao vivo
  wpmContainer.innerText = `${wpmCounter(startTime)}`;

  // Remove todas as classes de tudo, pois quando entrar no for ele vai adicionar
  messageSpans.forEach((span) => span.classList.remove("active", "correct", "incorrect"));
  if (textInput.value.length === 0) {
    messageSpans[0].classList.add("active");
  }

  // Pra cada caractere que está e já foi adicionado ele verifica se está correto ou não comparando os spans
  for (let i: number = 0; i < textInput.value.length; i++) {
    if (textInput.value[i] === messageBroken[i]) {
      messageSpans[i].classList.add("correct");
      correct++;
    } else {
      messageSpans[i].classList.add("incorrect");
      error++;
      if (!errorTotal.includes(i)) errorTotal.push(i);
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

restartBtn.addEventListener("click", () => pullData());

pullData();
