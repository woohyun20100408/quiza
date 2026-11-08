import { onDisconnect, onValue, push, ref, remove, set, update } from 'firebase/database';
import type { User } from 'firebase/auth';
import { rtdb } from './firebase';

export type Player = { uid: string; name: string; photoURL?: string | null; score: number; ready: boolean; online: boolean };
export type Room = { info: { name: string; hostUid: string; maxPlayers: number; rounds: number; duration: number; isPrivate: boolean; status: 'lobby'|'playing'|'finished'; code: string }; players: Record<string, Player>; state?: { drawerUid: string; round: number; endsAt: number }; drawing?: { revision: number; strokes?: Record<string, Stroke> }; guesses?: Record<string, Guess>; scoreboard?: Record<string, number> };
export type Stroke = { points: Array<[number, number]>; color: string; width: number; mode?: 'draw'|'erase' };
export type Guess = { uid: string; name: string; text: string; at: number; correct?: boolean };
const id = () => crypto.randomUUID?.() ?? `${Date.now()}${Math.random().toString(36).slice(2)}`;
export const roomPath = (roomId: string) => `rooms/${roomId}`;
export async function createRoom(user: User, name: string, options = { maxPlayers: 8, rounds: 0, duration: 60, isPrivate: false }) {
  if (!rtdb) throw new Error('Realtime Database 설정이 필요합니다.');
  const roomId = id(); const code = roomId.slice(0, 6).toUpperCase();
  const player: Player = { uid: user.uid, name: user.displayName || '플레이어', photoURL: user.photoURL, score: 0, ready: true, online: true };
  await set(ref(rtdb, roomPath(roomId)), { info: { ...options, name: name || '새 게임방', hostUid: user.uid, status: 'lobby', code }, players: { [user.uid]: player }, drawing: { revision: 0 }, scoreboard: { [user.uid]: 0 } });
  return roomId;
}
export async function joinRoom(roomId: string, user: User) {
  if (!rtdb) throw new Error('Realtime Database 설정이 필요합니다.');
  const playerRef = ref(rtdb, `${roomPath(roomId)}/players/${user.uid}`);
  await set(playerRef, { uid: user.uid, name: user.displayName || '플레이어', photoURL: user.photoURL, score: 0, ready: false, online: true });
  await onDisconnect(playerRef).update({ online: false });
}
export const watchRoom = (roomId: string, handler: (room: Room | null) => void) => rtdb ? onValue(ref(rtdb, roomPath(roomId)), s => handler(s.val())) : () => {};
export const watchRooms = (handler: (rooms: Record<string, Room>) => void) => rtdb ? onValue(ref(rtdb, 'rooms'), s => handler(s.val() || {})) : () => {};
export async function setReady(roomId: string, uid: string, ready: boolean) { if (rtdb) await update(ref(rtdb, `${roomPath(roomId)}/players/${uid}`), { ready }); }
export async function submitStroke(roomId: string, uid: string, stroke: Stroke) { if (rtdb) await set(ref(rtdb, `${roomPath(roomId)}/drawing/strokes/${id()}`), { ...stroke, uid }); }
export async function clearDrawing(roomId: string) { if (rtdb) await set(ref(rtdb, `${roomPath(roomId)}/drawing`), { revision: Date.now() }); }
export async function sendGuess(roomId: string, user: User, text: string) { if (rtdb && text.trim()) await push(ref(rtdb, `${roomPath(roomId)}/guesses`), { uid: user.uid, name: user.displayName || '플레이어', text: text.trim().slice(0, 80), at: Date.now() }); }
export async function leaveRoom(roomId: string, uid: string) { if (rtdb) await remove(ref(rtdb, `${roomPath(roomId)}/players/${uid}`)); }
