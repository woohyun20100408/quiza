import { describe, expect, it } from 'vitest';
import { toChoseong } from './hangul';
import { isCorrectAnswer } from './answer';
describe('toChoseong',()=>{it('추출한다',()=>{expect(toChoseong('바나나')).toBe('ㅂㄴㄴ');expect(toChoseong('대한민국')).toBe('ㄷㅎㅁㄱ');expect(toChoseong('사과')).toBe('ㅅㄱ');});it('공백과 비한글 문자를 유지한다',()=>{expect(toChoseong('초성 quiz 12!')).toBe('ㅊㅅ quiz 12!');});});
describe('isCorrectAnswer',()=>{it('앞뒤 공백을 제거하고 영문 대소문자를 무시한다',()=>{expect(isCorrectAnswer('  OpenAI ','openai')).toBe(true);expect(isCorrectAnswer('사과 ','사과')).toBe(true);expect(isCorrectAnswer('사과','배')).toBe(false);});});
