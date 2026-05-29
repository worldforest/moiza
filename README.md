# 💍 청첩장 모임 날짜 조율

청첩장 전달을 위한 모임 날짜를 그룹별로 조율하는 웹앱입니다.

## 주요 기능
- 그룹 생성 및 초대 링크 + 비밀번호 발급
- 멤버들이 가능한 날짜를 캘린더에서 선택
- 히트맵으로 다른 멤버의 선택 날짜 실시간 확인
- 날짜 확정 기능
- 멤버 주소 기반 중간 지점 AI 추천

---

## 로컬 실행 방법

### 1. 패키지 설치
```bash
npm install
```

### 2. Firebase 설정
`.env.example` 파일을 복사해서 `.env.local` 파일 생성:
```bash
cp .env.example .env.local
```

`.env.local` 파일을 열어 Firebase 콘솔에서 복사한 값 입력:
```
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

### 3. 개발 서버 실행
```bash
npm run dev
```
→ http://localhost:5173 에서 확인

---

## Vercel 배포 방법

### 1. GitHub에 코드 올리기
```bash
git init
git add .
git commit -m "초기 커밋"
git remote add origin https://github.com/YOUR_USERNAME/wedding-scheduler.git
git push -u origin main
```

### 2. Vercel 연결
1. [vercel.com](https://vercel.com) → GitHub으로 로그인
2. **Add New Project** → 방금 만든 저장소 선택
3. **Environment Variables** 섹션에서 `.env.local`의 값들을 그대로 입력
4. **Deploy** 클릭

### 3. 환경변수 추가 (중요!)
Vercel 대시보드 → Settings → Environment Variables에서
`.env.local`의 6개 변수를 모두 추가해야 합니다.

배포 완료 후 생성된 URL (예: `https://wedding-scheduler.vercel.app`)을
방장 화면의 초대 링크에 자동으로 반영됩니다.

---

## Firebase Firestore 보안 규칙

배포 후 Firebase 콘솔 → Firestore → Rules에서 아래 규칙으로 변경하세요.
(테스트 모드의 30일 제한을 해제합니다.)

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /groups/{groupId} {
      allow read, write: if true;
    }
  }
}
```

> ⚠️ 이 앱은 비밀번호 기반 접근 제어를 사용합니다.
> 더 강력한 보안이 필요하면 Firebase Authentication 추가를 고려하세요.

---

## 기술 스택
- React 18 + Vite
- Firebase Firestore (실시간 DB)
- Claude API (장소 추천)
- Vercel (호스팅)
