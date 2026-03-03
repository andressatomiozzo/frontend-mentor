const message = document.querySelector<HTMLParagraphElement>("#message");
const textInput = document.querySelector<HTMLInputElement>("#textInput");
const correctCount = document.querySelector<HTMLSpanElement>("#correctCount");
const errorCount = document.querySelector<HTMLSpanElement>("#errorCount");

if (!message || !textInput || !correctCount || !errorCount) throw new Error("Some element is not linked to the DOM.");

if (message.textContent.length === 0) {
  console.log("ops, não tem messagem");
} else {
  const messageBroaken = message.textContent.split("");
  message.innerHTML = "";
  messageBroaken.forEach((character) => {
    const spanCharacter = document.createElement("span");
    spanCharacter.innerText = character;
    spanCharacter.classList.add("message-span");
    message.appendChild(spanCharacter);
  });

  const messageSpans = document.querySelectorAll<HTMLSpanElement>(".message-span");

  let errorTotal = 0;

  textInput.addEventListener("input", () => {
    let correct = 0;
    let error = 0;
    messageSpans.forEach((span) => span.classList.remove("active", "correct", "incorrect"));
    for (let i = 0; i < textInput.value.length; i++) {
      if (textInput.value[i] === messageBroaken[i]) {
        messageSpans[i].classList.add("correct");
        correct++;
      } else {
        messageSpans[i].classList.add("incorrect");
        error++;
        errorTotal++;
      }
      if (i === textInput.value.length - 1) {
        messageSpans[i + 1].classList.add("active");
      }
    }

    correctCount.innerText = `Acertos: ${correct}`;
    errorCount.innerText = `Erros: ${error} Erros totais: ${errorTotal}`;

  });
}
