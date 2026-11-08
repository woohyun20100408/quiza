export const categories = ['일반상식','동물','음식','게임','연예·문화','과학','스포츠','역사','IT·기술','기타'] as const;
export type Category = typeof categories[number];
export type Visibility = 'public' | 'private' | 'draft';
export type Question = { id: string; answer: string; initials: string; hint: string; explanation: string };
export type Quiz = { id: string; title: string; description: string; category: Category; difficulty: '쉬움'|'보통'|'어려움'; visibility: Visibility; ownerUid: string; ownerName: string; questionCount: number; playCount: number; likeCount: number; createdAt: number; questions: Question[]; coverImageUrl?: string };
