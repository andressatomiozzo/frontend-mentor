import { timeContainer } from "./main-ts.js";
let startTime;
let timerInterval;
let elapsedTime;
export const stopTimer = () => {
    clearInterval(timerInterval);
};
export const startTimerFree = () => {
    startTime = Date.now();
    timerInterval = setInterval(() => {
        const now = Date.now();
        elapsedTime = Math.floor((now - startTime) / 1000);
        console.log(elapsedTime);
        const minutes = Math.floor(elapsedTime / 60);
        const seconds = elapsedTime % 60;
        const formattedTime = `${minutes}:${String(seconds).padStart(2, "0")}`;
        timeContainer.textContent = formattedTime;
    }, 1000);
};
export const startTimer60 = () => {
    const startTime = Date.now() + 60000;
    timerInterval = setInterval(() => {
        const now = Date.now();
        const remainingTime = Math.floor((startTime - now) / 1000);
        const minutes = Math.floor(remainingTime / 60);
        const seconds = remainingTime % 60;
        const formattedTime = `${minutes}:${String(seconds).padStart(2, "0")}`;
        timeContainer.textContent = formattedTime;
        if (remainingTime === 0) {
            stopTimer();
            console.log("o tempo acabou");
        }
    }, 100);
};
