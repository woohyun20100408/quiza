export function normalizeAnswer(value: string): string { return value.trim().toLocaleLowerCase('ko-KR'); }
export function isCorrectAnswer(guess: string, answer: string): boolean { return normalizeAnswer(guess) === normalizeAnswer(answer); }
