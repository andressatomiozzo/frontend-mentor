// Variáveis ligadas ao DOM
const message = document.querySelector<HTMLParagraphElement>("#message");
const startContainer = document.querySelector<HTMLDivElement>(".start-container");
const startBtn = document.querySelector<HTMLButtonElement>(".start");
const levelInput = document.querySelector<HTMLSelectElement>("#level");
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
  !textInput ||
  !correctCount ||
  !errorCount ||
  !timeContainer ||
  !accuracyContainer ||
  !wpmContainer ||
  !restartBtn ||
  !startBtn ||
  !startContainer
) {
  throw new Error("Some element is not linked to the DOM.");
}

export {
  message,
  startContainer,
  startBtn,
  levelInput,
  restartBtn,
  textInput,
  correctCount,
  errorCount,
  timeContainer,
  wpmContainer,
  accuracyContainer,
};
