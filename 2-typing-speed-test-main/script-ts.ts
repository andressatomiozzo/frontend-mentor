const message = document.querySelector<HTMLParagraphElement>("#message");
const textInput = document.querySelector<HTMLInputElement>("#textInput");
const correctCount = document.querySelector<HTMLSpanElement>("#correctCount");
const errorCount = document.querySelector<HTMLSpanElement>("#errorCount");
const timeContainer = document.querySelector<HTMLSpanElement>("#time-container");
const wpmContainer = document.querySelector<HTMLSpanElement>("#wpm-container");
const accuracyContainer = document.querySelector<HTMLSpanElement>("#accuracy-container");

if (!message || !textInput || !correctCount || !errorCount || !timeContainer || !accuracyContainer || !wpmContainer)
  throw new Error("Some element is not linked to the DOM.");

// Deixar claro qual o tipo de dado que o data.json vai retornar
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
  try {
    const data = await fetch("data.json");
    const dataJson = await data.json() as levelsData;
    console.log(dataJson.easy);
    console.log(dataJson.medium);
    console.log(dataJson.hard);
    if (!data.ok) {
      throw new Error("Ops! Something is wrong!");
    }
    console.log("Dados: ", dataJson);
  } catch (err) {
    console.log(err);
  }
};
pullData();

//Se não tiver uma mensagem como desafio ele solta um erro
if (message.textContent.length === 0) {
  console.log("ops, não tem messagem");
} else {
  //Quebra a mensagem em pequenos spans
  const messageBroaken = message.textContent.split("");
  message.innerHTML = "";
  messageBroaken.forEach((character) => {
    const spanCharacter = document.createElement("span");
    spanCharacter.innerText = character;
    spanCharacter.classList.add("message-span");
    message.appendChild(spanCharacter);
  });

  //Pega todos os spans
  const messageSpans = document.querySelectorAll<HTMLSpanElement>(".message-span");
  const totalLenght = messageSpans.length;

  let errorTotal = 0;

  //Para começar o tempo
  let started = false;
  let startTime = 0;
  let endTime = 0;

  textInput.addEventListener("input", () => {
    if (started === false) {
      //Na primeira letra digitada cai aqui e marca o tempo de início
      startTime = Date.now();
      started = true;
    }
    let correct = 0;
    let error = 0;

    //Mostra o tempo real
    let nowTimeSeconds = Math.floor((Date.now() - startTime) / 1000);
    let nowTimeMinutes = Math.floor(nowTimeSeconds / 60) + (nowTimeSeconds % 60) * 0.01;
    let wpmNow = Math.floor(nowTimeMinutes === 0 ? 0 : totalLenght / 5 / nowTimeMinutes);
    timeContainer.innerText = `${"tempo: " + nowTimeMinutes + " wpm:" + wpmNow}`;

    // Remove todas as classes de tudo, pois quando entrar no for ele vai adicionar
    messageSpans.forEach((span) => span.classList.remove("active", "correct", "incorrect"));
    // Pra cada caractere que está e já foi adicionado ele verifica se está correto ou não comparando os spans
    for (let i = 0; i < textInput.value.length; i++) {
      if (i !== totalLenght) {
        if (textInput.value[i] === messageBroaken[i]) {
          messageSpans[i].classList.add("correct");
          correct++;
        } else {
          messageSpans[i].classList.add("incorrect");
          error++;
          //// --------------------------- Isso aqui foi incrível ------------------
          i === textInput.value.length - 1 ? (errorTotal = errorTotal + 1) : errorTotal;
          //// ---------------------------------------------------------------------
        }

        // Atualizar cursor
        if (i === textInput.value.length - 1 && i !== totalLenght - 1) {
          messageSpans[i + 1].classList.add("active");
        }

        //Accuracy
        let accuracy = Math.floor(((totalLenght - errorTotal) / totalLenght) * 100);
        accuracyContainer.innerText = `Accuracy: ${accuracy < 0 ? 0 : accuracy}%`;
      } else {
        console.log("You have completed the exercise.");
        textInput.remove();
        endTime = Date.now();
        let elapsedTimeSeconds = Math.floor((endTime - startTime) / 1000);
        let elapsedTimeMinutes = Math.floor(elapsedTimeSeconds / 60) + (elapsedTimeSeconds % 60) * 0.01;
        let wpmTotal = elapsedTimeMinutes === 0 ? 0 : totalLenght / 5 / elapsedTimeMinutes;

        timeContainer.innerText = `Final time: ${elapsedTimeMinutes}`;
      }
    }

    //Mostra na tela o que foi feito
    correctCount.innerText = `Number of correct characters:: ${correct}`;
    errorCount.innerText = `Number of incorrect characters:: ${error} Total number of incorrect characters:: ${errorTotal}`;
  });
}
