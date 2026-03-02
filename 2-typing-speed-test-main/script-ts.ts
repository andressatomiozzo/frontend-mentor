const message = document.querySelector<HTMLParagraphElement>("#message");
const textInput = document.querySelector<HTMLInputElement>("#textInput");
const correctCount = document.querySelector<HTMLSpanElement>("#correctCount");
const errorCount = document.querySelector<HTMLSpanElement>("#errorCount");

if (!message || !textInput || !correctCount || !errorCount) throw new Error("Some element is not linked to the DOM.");

if (message.textContent.length === 0) {
  console.log("ops, não tem messagem");
} else {
  const messageBroaken = message.textContent.split("");
  const menssageSpan = messageBroaken.map((letter) => `<span>${letter}</span>`).join("");

  message.innerHTML = menssageSpan;

  textInput.addEventListener("input", () => {
    let correct = 0;
    let error = 0;
    for (let i = 0; i < textInput.value.length; i++) {
      if (messageText[i] === textInput.value[i]) {
        correct++;
      } else {
        error++;
      }
    }
    correctCount.innerText = `Acertos: ${correct}`;
    errorCount.innerText = `Erros: ${error}`;
  });
}
