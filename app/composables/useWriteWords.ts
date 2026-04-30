export const useWriteWords = (words: Ref<string[]>) => {
  if (!words.value || words.value.length === 0) {
    throw new Error("No words provided");
  }

  const currentIndex = ref(0);
  const currentWord = ref(words.value[0] || "");

  function write(index: number, delay: number, callback: () => void) {
    const word = words.value[index] || "";
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
    const nextIndex =
      currentIndex.value + 1 > words.value.length - 1
        ? 0
        : currentIndex.value + 1;

    setTimeout(() => {
      erase(100, () => {
        currentIndex.value = nextIndex;
        write(nextIndex, 100, () => {
          wordsInterval();
        });
      });
    }, delay);
  }

  return {
    currentWord,
    currentIndex,
    wordsInterval,
  };
};
