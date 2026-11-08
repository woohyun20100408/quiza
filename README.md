# 초성퀴즈 커뮤니티

React + TypeScript + Vite 기반의 초성퀴즈 커뮤니티입니다. Firebase 설정을 넣으면 Google 로그인, Firestore 저장, 공개 퀴즈 탐색이 활성화됩니다. 설정 전에는 브라우저 로컬 저장 기반 제작·플레이를 사용할 수 있습니다. 로컬 저장 콘텐츠는 해당 브라우저에만 저장되며 다른 사용자와 공유되지 않습니다.

## 시작하기

1. Node.js 20 이상을 설치한 뒤 `npm install`을 실행합니다.
2. `.env.example`을 `.env.local`로 복사하고 Firebase 웹 앱 값을 채웁니다.
3. `npm run dev`로 개발 서버를 시작합니다.
4. `npm run build`로 정적 배포 빌드를 생성합니다.

## Firebase 설정

Firebase Console에서 프로젝트와 웹 앱을 만든 뒤 Authentication의 Google 제공업체를 켭니다. Authentication 설정의 승인된 도메인에 `localhost`와 배포할 `username.github.io` 또는 커스텀 도메인을 추가합니다. Firestore Database와 Storage를 생성하고 `firestore.rules`, `storage.rules`, `firestore.indexes.json`을 Firebase CLI 또는 콘솔에서 배포합니다. 클라이언트 API 설정은 공개 클라이언트 설정입니다. 서비스 계정 JSON과 관리자 비밀키는 프런트엔드에 넣지 마세요.

`.env.local`에는 `VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_AUTH_DOMAIN`, `VITE_FIREBASE_PROJECT_ID`, `VITE_FIREBASE_STORAGE_BUCKET`, `VITE_FIREBASE_MESSAGING_SENDER_ID`, `VITE_FIREBASE_APP_ID`를 설정합니다. GitHub 저장소 Settings → Secrets and variables → Actions에도 동일한 이름으로 등록합니다.

## GitHub Pages

`main` 브랜치에 푸시하면 `.github/workflows/deploy.yml`이 빌드와 Pages 배포를 수행합니다. 저장소 Settings → Pages → Build and deployment에서 GitHub Actions를 선택하세요. 프로젝트 저장소 경로는 저장소 이름을 기준으로 Vite base에 자동 반영되고, 앱은 HashRouter를 사용해 새로고침 시 경로 404를 피합니다. 커스텀 도메인 사용 시 Vite base를 `/`로 지정하고 DNS와 Pages 도메인을 설정하세요.

## 검색 및 구현 한계

Firestore 기본 검색은 전체 텍스트 검색이 없으므로 최신 공개 퀴즈 최대 100개를 가져온 뒤 제목·설명을 브라우저에서 필터링합니다. 대규모 검색에는 Algolia/Typesense 등 별도 인덱스가 필요합니다. 초기 버전에서 좋아요, 즐겨찾기, 닉네임 편집, 플레이 기록은 전체 서비스 기능으로 연결되지 않았습니다. 플레이 수는 클라이언트 transaction으로 증가하므로 악용 방지와 신뢰할 수 있는 집계를 위해 Cloud Functions로 이전해야 합니다. 이미지 업로드 UI도 아직 연결되지 않았습니다. Firestore Emulator Suite를 이용해 규칙을 배포 전 검증하세요.
