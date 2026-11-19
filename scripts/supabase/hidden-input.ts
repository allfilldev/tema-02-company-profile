export type HiddenInputState = {
  value: string;
  done: boolean;
  cancelled: boolean;
};

export const INITIAL_HIDDEN_INPUT: HiddenInputState = { value: "", done: false, cancelled: false };

const CTRL_C = "\u0003";
const ESCAPE_SEQUENCE = /\u001b\[[0-9;?]*[ -/]*[@-~]/g;

export function applyKeystrokes(state: HiddenInputState, chunk: string): HiddenInputState {
  if (state.done) {
    return state;
  }

  let value = state.value;

  for (const character of chunk.replace(ESCAPE_SEQUENCE, "")) {
    if (character === CTRL_C) {
      return { value, done: true, cancelled: true };
    }
    if (character === "\r" || character === "\n") {
      if (value.length === 0) {
        continue;
      }
      return { value, done: true, cancelled: false };
    }
    value = character === "\u007f" || character === "\b" ? value.slice(0, -1) : value + character;
  }

  return { value, done: false, cancelled: false };
}
