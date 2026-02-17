export function updateDifficulty(state: any, correct: boolean) {
  if (correct) {
    state.streak += 1;
    state.momentum += 1;
    state.confidence += state.current_difficulty * 2;

    if (
      state.streak >= 2 &&
      state.momentum >= 2 &&
      state.confidence >= 10
    ) {
      state.current_difficulty = Math.min(10, state.current_difficulty + 1);
      state.momentum = 0;
      state.confidence = 0;
    }
  } else {
    state.streak = 0;
    state.momentum -= 1;
    state.confidence -= state.current_difficulty;

    if (state.momentum <= -2 || state.confidence <= -10) {
      state.current_difficulty = Math.max(1, state.current_difficulty - 1);
      state.momentum = 0;
      state.confidence = 0;
    }
  }

  return state;
}
