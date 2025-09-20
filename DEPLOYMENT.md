# 배포 가이드 (Deployment Guide)

이 프로젝트를 Netlify 또는 Vercel에 배포하는 방법을 안내합니다.

## 🚀 배포 플랫폼

### Netlify 배포

1. **GitHub에 코드 푸시**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin <your-repo-url>
   git push -u origin main
   ```

2. **Netlify에서 배포**
   - [Netlify](https://netlify.com)에 로그인
   - "New site from Git" 클릭
   - GitHub 저장소 선택
   - 빌드 설정은 자동 감지됨 (`netlify.toml` 파일 기반)
   - Deploy site 클릭

### Vercel 배포

1. **GitHub에 코드 푸시** (위와 동일)

2. **Vercel에서 배포**
   - [Vercel](https://vercel.com)에 로그인
   - "New Project" 클릭
   - GitHub 저장소 선택
   - 빌드 설정은 자동 감지됨 (`vercel.json` 파일 기반)
   - Deploy 클릭

## 🔧 환경변수 설정

배포 후 다음 환경변수를 설정해야 합니다:

### 필수 환경변수

| 변수명 | 설명 | 획득 방법 |
|--------|------|-----------|
| `GEMINI_API_KEY` | Google Gemini AI API 키 | [Google AI Studio](https://makersuite.google.com/app/apikey)에서 생성 |

### Netlify에서 환경변수 설정

1. Netlify 대시보드 → Site settings → Environment variables
2. "Add a variable" 클릭
3. Key: `GEMINI_API_KEY`, Value: 실제 API 키 입력
4. Save 클릭
5. Site를 다시 배포 (Deploys → Trigger deploy → Deploy site)

### Vercel에서 환경변수 설정

1. Vercel 대시보드 → Project settings → Environment Variables
2. Name: `GEMINI_API_KEY`, Value: 실제 API 키 입력
3. Add 클릭
4. 새로운 배포 트리거 또는 Redeploy

## 📋 배포 전 체크리스트

- [ ] `.env.local` 파일이 `.gitignore`에 포함되어 있는지 확인
- [ ] Gemini API 키가 유효한지 로컬에서 테스트
- [ ] `npm run build`가 성공적으로 실행되는지 확인
- [ ] GitHub 저장소가 public 또는 Netlify/Vercel에서 접근 가능한지 확인

## 🔗 추가 설정

### 커스텀 도메인 (선택사항)

**Netlify:**
1. Site settings → Domain management → Add custom domain

**Vercel:**
1. Project settings → Domains → Add domain

### HTTPS 설정

Netlify와 Vercel 모두 자동으로 HTTPS를 제공합니다.

## 🚨 주의사항

1. **API 키 보안**: 환경변수로만 설정하고, 코드에 직접 포함하지 마세요
2. **YouTube API 키**: 앱 내 설정에서 사용자가 직접 입력하므로 배포 시 필요하지 않음
3. **빌드 에러**: Node.js 버전을 18 이상으로 설정하세요

## 📞 문제 해결

### 빌드 실패 시
1. `package.json`의 dependencies 확인
2. Node.js 버전 확인 (18 이상)
3. 로컬에서 `npm run build` 테스트

### 배포 후 앱이 작동하지 않을 시
1. 브라우저 콘솔에서 에러 확인
2. 환경변수 설정 확인
3. API 키 유효성 확인

배포가 완료되면 사용자는 앱 내 설정에서 YouTube API 키를 입력하여 모든 기능을 사용할 수 있습니다.