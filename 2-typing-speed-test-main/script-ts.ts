const mensage = document.querySelector<HTMLParagraphElement>("#mensage");
const textInput = document.querySelector<HTMLInputElement>("#textInput");
const correctCount = document.querySelector<HTMLSpanElement>("#correctCount");
const errorCount = document.querySelector<HTMLSpanElement>("#errorCount");

if (!mensage || !textInput || !correctCount || !errorCount) throw new Error("Some element is not linked to the DOM.");
