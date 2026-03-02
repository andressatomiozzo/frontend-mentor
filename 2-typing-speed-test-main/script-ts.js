"use strict";
const mensage = document.querySelector("#mensage");
const textInput = document.querySelector("#textInput");
const correctCount = document.querySelector("#correctCount");
const errorCount = document.querySelector("#errorCount");
if (!mensage || !textInput || !correctCount || !errorCount)
    throw new Error("Some element is not linked to the DOM.");
if (mensage.textContent.length === 0) {
    console.log("ops, não tem mensagem");
}
else {
    textInput.addEventListener("input", () => {
        let correct = 0;
        let error = 0;
        for (let i = 0; i < textInput.value.length; i++) {
            if (mensage.textContent[i] === textInput.value[i]) {
                correct++;
            }
            else {
                error++;
            }
        }
        console.log(correct, error);
    });
}
