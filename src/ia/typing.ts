import {
  textInput,
  correctCount,
  errorCount,
  timeContainer,
  wpmContainer,
  accuracyContainer,
} from "./dom";
import { getMessageBroken, getMessageLength, getMessageSpans } from "./message";
import { calculateAccuracy, calculateWPM, formatTime } from "./stats";

type TypingState = {
  started: boolean;
  startTime: number;
  endTime: number;
  errorTotal: number[];
  correct: number;
  error: number;
};

const state: TypingState = {
  started: false,
  startTime: 0,
  endTime: 0,
  errorTotal: [],
  correct: 0,
  error: 0,
};

export const resetTypingState = () => {
  state.started = false;
  state.startTime = 0;
  state.endTime = 0;
  state.errorTotal = [];
  state.correct = 0;
  state.error = 0;

  textInput.value = "";
  textInput.disabled = false;

  const messageSpans = getMessageSpans();
  messageSpans.forEach((span) => span.classList.remove("active", "correct", "incorrect"));

  if (messageSpans.length > 0) {
    messageSpans[0].classList.add("active");
  }

  correctCount.innerText = `Number of correct characters: 0`;
  errorCount.innerText = `Number of incorrect characters: 0 Total number of incorrect characters: 0`;
  timeContainer.innerText = `0:00`;
  wpmContainer.innerText = `0`;
  accuracyContainer.innerText = `100%`;
};

export const finishTest = () => {
  state.endTime = Date.now();

  const elapsedSeconds = Math.floor((state.endTime - state.startTime) / 1000);
  const finalTime = formatTime(elapsedSeconds);
  const finalWPM = calculateWPM(textInput.value.length, elapsedSeconds);

  timeContainer.innerText = `Final time: ${finalTime}`;
  wpmContainer.innerText = `Final WPM: ${finalWPM}`;
  textInput.disabled = true;
};

export const handleTyping = () => {
  const messageBroken = getMessageBroken();
  const messageSpans = getMessageSpans();
  const totalLength = getMessageLength();

  if (!state.started) {
    state.startTime = Date.now();
    state.started = true;
  }

  state.correct = 0;
  state.error = 0;

  const elapsedSeconds = Math.floor((Date.now() - state.startTime) / 1000);
  timeContainer.innerText = formatTime(elapsedSeconds);
  wpmContainer.innerText = `${calculateWPM(textInput.value.length, elapsedSeconds)}`;

  messageSpans.forEach((span) => span.classList.remove("active", "correct", "incorrect"));

  if (textInput.value.length === 0 && messageSpans.length > 0) {
    messageSpans[0].classList.add("active");
  }

  for (let i = 0; i < textInput.value.length; i++) {
    if (textInput.value[i] === messageBroken[i]) {
      messageSpans[i].classList.add("correct");
      state.correct++;
    } else {
      messageSpans[i].classList.add("incorrect");
      state.error++;

      if (!state.errorTotal.includes(i)) {
        state.errorTotal.push(i);
      }
    }

    if (i === textInput.value.length - 1 && i !== totalLength - 1) {
      messageSpans[i + 1].classList.add("active");
    }
  }

  const accuracy = calculateAccuracy(totalLength, state.errorTotal.length);
  accuracyContainer.innerText = `${accuracy}%`;

  if (textInput.value.length >= totalLength) {
    finishTest();
  }

  correctCount.innerText = `Number of correct characters: ${state.correct}`;
  errorCount.innerText =
    `Number of incorrect characters: ${state.error} Total number of incorrect characters: ${state.errorTotal.length}`;
};