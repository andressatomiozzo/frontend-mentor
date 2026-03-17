import { timeContainer, textInput } from "./main-ts.js";
let timerInterval;
let elapsedTime;
let formattedTime;
export const stopTimer = () => {
    clearInterval(timerInterval);
};
export const wpmCounter = (startTime) => {
    const now = Date.now();
    elapsedTime = Math.floor((now - startTime) / 1000);
    const elapsedTimeMinutes = elapsedTime / 60;
    let wpmNow = Math.floor(elapsedTime === 0 ? 0 : textInput.value.length / 5 / elapsedTimeMinutes);
    return wpmNow;
};
export const finalTimer = (startTime) => {
    stopTimer();
    return updateTimer(startTime);
};
export const updateTimer = (startTime) => {
    const now = Date.now();
    elapsedTime = Math.floor((now - startTime) / 1000);
    const minutes = Math.floor(elapsedTime / 60);
    const seconds = elapsedTime % 60;
    formattedTime = `${minutes}:${String(seconds).padStart(2, "0")}`;
    return formattedTime;
};
export const startTimerFree = (startTime) => {
    timerInterval = setInterval(() => {
        updateTimer(startTime);
        timeContainer.textContent = formattedTime;
        timeContainer.classList.add("time-container-active");
    }, 1000);
};
export const startTimer60 = (startTime) => {
    timerInterval = setInterval(() => {
        const now = Date.now();
        const remainingTime = Math.floor((startTime + 60000 - now) / 1000);
        const minutes = Math.floor(remainingTime / 60);
        const seconds = remainingTime % 60;
        formattedTime = `${minutes}:${String(seconds).padStart(2, "0")}`;
        timeContainer.textContent = formattedTime;
        timeContainer.classList.add("time-container-active");
        if (remainingTime === 15) {
            timeContainer.classList.remove("time-container-active");
            timeContainer.classList.add("time-container-active2");
        }
        if (remainingTime === 0) {
            stopTimer();
            console.log("o tempo acabou");
        }
    }, 100);
};
