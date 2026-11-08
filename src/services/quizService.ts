import { collection, doc, getDocs, limit, orderBy, query, runTransaction, serverTimestamp, setDoc, where, increment } from 'firebase/firestore';
import type { User } from 'firebase/auth';
import { db } from './firebase';
import type { Quiz } from '../types';
import { toChoseong } from '../utils/hangul';
const localKey = 'choseong-quizzes-v1';
function readLocal(): Quiz[] { try { return JSON.parse(localStorage.getItem(localKey) ?? '[]') as Quiz[]; } catch { return []; } }
function writeLocal(quizzes: Quiz[]) { localStorage.setItem(localKey, JSON.stringify(quizzes)); }
export async function listQuizzes(): Promise<Quiz[]> {
  if (!db) return readLocal().filter((quiz) => quiz.visibility === 'public');
  const snapshot = await getDocs(query(collection(db, 'quizSets'), where('visibility', '==', 'public'), orderBy('createdAt', 'desc'), limit(100)));
  return Promise.all(snapshot.docs.map(async (item) => {
    const questions = await getDocs(query(collection(db!, 'quizSets', item.id, 'questions'), orderBy('order')));
    return { ...item.data(), id: item.id, questions: questions.docs.map((question) => ({ ...question.data(), id: question.id })) } as Quiz;
  }));
}
export async function saveQuiz(input: Omit<Quiz, 'id'|'createdAt'|'questionCount'>, user: User | null): Promise<void> {
  const questions = input.questions.map((q) => ({ ...q, initials: toChoseong(q.answer) }));
  if (!db) { const quizzes = readLocal(); const item: Quiz = { ...input, ownerUid: user?.uid ?? 'local', ownerName: user?.displayName ?? '나', questions, questionCount: questions.length, createdAt: Date.now(), id: crypto.randomUUID() }; writeLocal([item, ...quizzes]); return; }
  if (!user) throw new Error('Authentication required');
  const ref = doc(collection(db, 'quizSets'));
  await setDoc(ref, { title: input.title, titleLower: input.title.toLocaleLowerCase(), description: input.description, category: input.category, difficulty: input.difficulty, visibility: input.visibility, ownerUid: user.uid, ownerName: user.displayName ?? '사용자', questionCount: questions.length, playCount: 0, likeCount: 0, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
  await runTransaction(db, async (tx) => { questions.forEach((question, order) => tx.set(doc(ref, 'questions', question.id), { ...question, order })); });
}
export async function incrementPlay(quizId: string): Promise<void> { if (db) await runTransaction(db, async (tx) => tx.update(doc(db!, 'quizSets', quizId), { playCount: increment(1) })); }
