export const useWriteWords = (words: Ref<string[]>) => {
  if (!words.value || words.value.length === 0) {
    throw new Error("No words provided");
  }

  const currentWord = ref(words.value[0] || "");
  const currentClass = ref(words.value[0] || "");

  function write(nextIndex: number, delay: number, callback: () => void) {
    const word = words.value[nextIndex] || "";
    const wordLetters = word.split("");
    const assembleWord: string[] = [];
    const interval = setInterval(() => {
      if (wordLetters.length > 0) {
        assembleWord.push(wordLetters[0] || "");
        wordLetters.shift();
        currentWord.value = assembleWord.join("");
      } else {
        clearInterval(interval);
        callback();
      }
    }, delay);
  }

  function erase(delay: number, callback: () => void) {
    const wordLetters = currentWord.value.split("");
    const interval = setInterval(() => {
      if (wordLetters.length > 0) {
        wordLetters.pop();
        currentWord.value = wordLetters.join("");
      } else {
        clearInterval(interval);
        callback();
      }
    }, delay);
  }

  function wordsInterval(delay = 1500) {
    const currentIndex = words.value.indexOf(currentWord.value);
    const nextIndex =
      currentIndex + 1 > words.value.length - 1 ? 0 : currentIndex + 1;

    setTimeout(() => {
      erase(100, () => {
        currentClass.value = words.value[nextIndex] || "";
        write(nextIndex, 100, () => {
          wordsInterval();
        });
      });
    }, delay);
  }

  return {
    currentWord,
    currentClass,
    wordsInterval,
  };
};
