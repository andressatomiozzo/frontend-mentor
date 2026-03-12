// Calcular o formato dos minutos, WPM e da accuracy

export const formatTime = (totalSeconds: number): string => {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${minutes}:${String(seconds).padStart(2, "0")}`;
};

export const calculateWPM = (typedLength: number, totalSeconds: number): number => {
  const minutes = totalSeconds / 60;
  if (minutes === 0) return 0;

  return Math.floor(typedLength / 5 / minutes);
};

export const calculateAccuracy = (totalLength: number, totalErrors: number): number => {
  const accuracy = Math.floor(((totalLength - totalErrors) / totalLength) * 100);
  return accuracy < 0 ? 0 : accuracy;
};