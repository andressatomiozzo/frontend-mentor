//Quebrar a frase em pequenos spans

import { message } from "./dom";

let messageBroken: string[] = [];
let messageSpans: HTMLSpanElement[] = [];

export const renderMessage = (text: string) => {
  message.textContent = text;
  messageBroken = text.split("");
  message.innerHTML = "";

  messageBroken.forEach((character) => {
    const spanCharacter = document.createElement("span");
    spanCharacter.innerText = character;
    spanCharacter.classList.add("message-span");
    message.appendChild(spanCharacter);
  });

  messageSpans = Array.from(
    document.querySelectorAll<HTMLSpanElement>(".message-span")
  );
};

export const getMessageBroken = () => messageBroken;
export const getMessageSpans = () => messageSpans;
export const getMessageLength = () => messageSpans.length;