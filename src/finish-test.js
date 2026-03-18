import { resultsContainer, textInput, correct, error, accuracy } from "./main-ts.js";
const finishBaseline = (accuracyContainer, correctCharactersContainer, incorrectCharactersContainer) => {
    if (accuracy >= 95) {
        accuracyContainer.classList.add("correct");
    }
    else {
        accuracyContainer.classList.add("incorrect");
    }
    correctCharactersContainer.classList.add("correct");
    incorrectCharactersContainer.classList.add("incorrect");
};
// baselineContainer.classList.remove("hidden");
// const baselineContainer = root.querySelector<HTMLDivElement>("#baseline-container");
export const finishTest = () => {
    console.log("You have completed the exercise.");
    textInput.disabled = true;
    resultsContainer.forEach((root) => {
        const wpmContainer = document.querySelector(".wpm-container");
        const accuracyContainer = document.querySelector(".accuracy-container");
        const correctCharactersContainer = root.querySelector(".correctCharacters-container");
        const incorrectCharactersContainer = root.querySelector(".incorrectCharacters-container");
        const goAgainBtn = root.querySelector(".goAgain-btn");
        if (!wpmContainer || !accuracyContainer || !correctCharactersContainer || !incorrectCharactersContainer || !goAgainBtn)
            throw new Error("Some element is not linked to the DOM - results.");
        correctCharactersContainer.innerText = `${correct}`;
        incorrectCharactersContainer.innerText = `${error}`;
        finishBaseline(accuracyContainer, correctCharactersContainer, incorrectCharactersContainer);
    });
};
