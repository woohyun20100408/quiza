const CHOSEONG = ['ㄱ','ㄲ','ㄴ','ㄷ','ㄸ','ㄹ','ㅁ','ㅂ','ㅃ','ㅅ','ㅆ','ㅇ','ㅈ','ㅉ','ㅊ','ㅋ','ㅌ','ㅍ','ㅎ'] as const;
export function toChoseong(input: string): string {
  return Array.from(input, (char) => {
    const code = char.codePointAt(0)!;
    if (code >= 0xac00 && code <= 0xd7a3) return CHOSEONG[Math.floor((code - 0xac00) / 588)];
    return char;
  }).join('');
}
