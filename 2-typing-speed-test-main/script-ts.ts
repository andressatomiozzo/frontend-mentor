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

  let started = false;
  let startTime = 0;
  let endTime = 0;

  textInput.addEventListener("input", () => {
    if (started === false) {
      startTime = Date.now();
      started = true;
    }
    // console.log(startTime);
    let correct = 0;
    let error = 0;
    messageSpans.forEach((span) => span.classList.remove("active", "correct", "incorrect"));
    for (let i = 0; i < textInput.value.length; i++) {
      if (i < messageSpans.length) {
        if (i !== messageSpans.length) {
          if (textInput.value[i] === messageBroaken[i]) {
            messageSpans[i].classList.add("correct");
            correct++;
          } else {
            messageSpans[i].classList.add("incorrect");
            error++;
// --------------------------- Isso aqui foi incrível ------------------
            i === textInput.value.length - 1 ? (errorTotal = errorTotal + 1) : errorTotal;
// ---------------------------------------------------------------------
          }
          if (i === textInput.value.length - 1 && i !== messageSpans.length - 1) {
            messageSpans[i + 1].classList.add("active");
          }
        } else {
          endTime = Date.now();
          let elapsedTime = (endTime - startTime)/1000;
        }
      } else {
        console.log("You have completed the exercise.");
      }
    }

    correctCount.innerText = `Acertos: ${correct}`;
    errorCount.innerText = `Erros: ${error} Erros totais: ${errorTotal}`;
  });
}
