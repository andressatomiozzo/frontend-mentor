import { message, textInput, levelInput } from "./dom";

let messageBroken: string[] = [];
let messageSpans: HTMLSpanElement[] = [];

// * Quebrar a mensagem em spans
const breakMessage = () => {
  //Se não tiver uma mensagem como desafio ele solta um erro
  if (!message!.textContent) {
    console.log("ops, não tem messagem");
  } else {
    //Quebra a mensagem em pequenos spans
    messageBroken = message!.textContent.split("");
    message!.innerHTML = "";
    messageBroken.forEach((character) => {
      const spanCharacter = document.createElement("span");
      spanCharacter.innerText = character;
      spanCharacter.classList.add("message-span");
      message!.appendChild(spanCharacter);
    });
    //Pega todos os spans e transforma em array
    messageSpans = Array.from(document.querySelectorAll<HTMLSpanElement>(".message-span"));
    reset();
  }
};

// ! Deixar claro qual o tipo de dado que o data.json vai retornar
type levels = {
  id: string;
  text: string;
};
type levelsData = {
  easy: levels[];
  medium: levels[];
  hard: levels[];
};

// Puxar os dados do data.json pra esse arquivo
const pullData = async () => {
  const levelArray: ("easy" | "medium" | "hard")[] = ["easy", "medium", "hard"]; // ("easy" | "medium" | "hard") -> os únicos valores aceitos são estes
  let positionLevel = levelArray[0];
  if (levelInput!.value === "medium") positionLevel = levelArray[1];
  if (levelInput!.value === "hard") positionLevel = levelArray[2];
  try {
    const data = await fetch("src/data.json");
    if (!data.ok) {
      throw new Error("Ops! Something is wrong!");
    }
    const dataJson = (await data.json()) as levelsData;
    const chosenLevel = dataJson[positionLevel];
    const chosenIndex = Math.floor(Math.random() * chosenLevel.length);
    const chosenText = chosenLevel[chosenIndex];
    message!.textContent = chosenText.text;
    breakMessage();
  } catch (err) {
    console.log(err);
  }
  textInput!.disabled = false;
};