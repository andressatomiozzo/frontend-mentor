"use strict";
const message = document.querySelector("#message");
const textInput = document.querySelector("#textInput");
const correctCount = document.querySelector("#correctCount");
const errorCount = document.querySelector("#errorCount");
if (!message || !textInput || !correctCount || !errorCount)
    throw new Error("Some element is not linked to the DOM.");
if (message.textContent.length === 0) {
    console.log("ops, não tem messagem");
}
else {
    const messageBroaken = message.textContent.split("");
    message.innerHTML = "";
    messageBroaken.forEach((character) => {
        const spanCharacter = document.createElement("span");
        spanCharacter.innerText = character;
        spanCharacter.classList.add("message-span");
        message.appendChild(spanCharacter);
    });
    const messageSpans = document.querySelectorAll(".message-span");
    textInput.addEventListener("input", () => {
        let correct = 0;
        let error = 0;
        for (let i = 0; i < textInput.value.length; i++) {
            let evaluatedCharacter = messageSpans[i].innerText;
            console.log(evaluatedCharacter);
            if (textInput.value[i] === messageBroaken[i]) {
                messageSpans[i].classList.add("correct");
                correct++;
            }
            else {
                messageSpans[i].classList.add("incorrect");
                error++;
            }
        }
        correctCount.innerText = `Acertos: ${correct}`;
        errorCount.innerText = `Erros: ${error}`;
    });
}
