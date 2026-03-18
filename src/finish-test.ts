import {
  resultsContainer,
  textInput,
  correct,
  error,
  accuracy,
  wpmNow,
  bestWpmResult,
  pullData,
  baselineContainer,
  highScoreSmashed,
  testComplete,
} from "./main-ts.js";

let bestWPM: number | null = null;

const showResults = (
  wpmContainer: HTMLSpanElement,
  accuracyContainer: HTMLSpanElement,
  correctCharactersContainer: HTMLSpanElement,
  incorrectCharactersContainer: HTMLSpanElement,
) => {
  wpmContainer.innerText = `${wpmNow}`;
  accuracyContainer.innerText = `${accuracy < 0 ? 0 : accuracy}%`;
  correctCharactersContainer.innerText = `${correct}`;
  incorrectCharactersContainer.innerText = `${error}`;
  if (accuracy >= 95) {
    accuracyContainer.classList.add("correct");
  } else {
    accuracyContainer.classList.add("incorrect");
  }
  correctCharactersContainer.classList.add("correct");
  incorrectCharactersContainer.classList.add("incorrect");
};

export const finishTest = () => {
  console.log("You have completed the exercise.");
  textInput!.disabled = true;
  resultsContainer.forEach((root, i) => {
    const wpmContainer = root.querySelector<HTMLSpanElement>(".wpm-container");
    const accuracyContainer = root.querySelector<HTMLSpanElement>(".accuracy-container");
    const correctCharactersContainer = root.querySelector<HTMLSpanElement>(".correctCharacters-container");
    const incorrectCharactersContainer = root.querySelector<HTMLSpanElement>(".incorrectCharacters-container");
    const goAgainBtn = root.querySelector<HTMLButtonElement>(".goAgain-btn");

    if (!wpmContainer || !accuracyContainer || !correctCharactersContainer || !incorrectCharactersContainer || !goAgainBtn)
      throw new Error("Some element is not linked to the DOM - results.");

    if (i === 0) {
      goAgainBtn.addEventListener("click", () => {
        baselineContainer!.classList.add("hidden");
        pullData();
      });
    } else if (i === 1) {
      goAgainBtn.addEventListener("click", () => {
        testComplete!.classList.add("hidden");
        pullData();
      });
    } else {
      goAgainBtn.addEventListener("click", () => {
        highScoreSmashed!.classList.add("hidden");
        pullData();
      });
    }

    showResults(wpmContainer, accuracyContainer, correctCharactersContainer, incorrectCharactersContainer);
  });
  if (bestWPM === null) {
    bestWPM = wpmNow;
    baselineContainer!.classList.remove("hidden");
  } else if (bestWPM >= wpmNow) {
    testComplete!.classList.remove("hidden");
  } else {
    bestWPM = wpmNow;
    highScoreSmashed!.classList.remove("hidden");
  }
  bestWpmResult!.innerText = ` ${bestWPM} WPM`;
};
