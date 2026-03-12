import { levelInput, message, textInput } from "./dom";

// Puxar os dados do data.json pra esse arquivo
export const pullData = async () => {
  const levelArray: ("easy" | "medium" | "hard")[] = ["easy", "medium", "hard"]; // ("easy" | "medium" | "hard") -> os únicos valores aceitos são estes
  let positionLevel = levelArray[0];
  if (levelInput.value === "medium") positionLevel = levelArray[1];
  if (levelInput.value === "hard") positionLevel = levelArray[2];
  try {
    const data = await fetch("src/data.json");
    if (!data.ok) {
      throw new Error("Ops! Something is wrong!");
    }
    const dataJson = (await data.json()) as levelsData;
    const chosenLevel = dataJson[positionLevel];
    const chosenIndex = Math.floor(Math.random() * chosenLevel.length);
    const chosenText = chosenLevel[chosenIndex];
    message.textContent = chosenText.text;
    breakMessage();
  } catch (err) {
    console.log(err);
  }
  textInput.disabled = false;
};












// import type { Difficulty, LevelsData } from "./types";

// export const getSelectedLevel = (value: string): Difficulty => {
//   if (value === "medium") return "medium";
//   if (value === "hard") return "hard";
//   return "easy";
// };

// export const fetchRandomText = async (level: Difficulty): Promise<string> => {
//   const response = await fetch("src/data.json");

//   if (!response.ok) {
//     throw new Error("Ops! Something is wrong!");
//   }

//   const data = (await response.json()) as LevelsData;
//   const chosenLevel = data[level];
//   const chosenIndex = Math.floor(Math.random() * chosenLevel.length);

//   return chosenLevel[chosenIndex].text;
// };