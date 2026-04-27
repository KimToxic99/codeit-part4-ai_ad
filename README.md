# AI Ad Generator

소상공인이 상품 정보를 입력하면 광고 문구와 광고 이미지를 빠르게 생성할 수 있는 웹 서비스 MVP버전 입니다.
[보고서](https://raw.githubusercontent.com/KimToxic99/codeit-part4-ai_ad/blob/main/AI_Ad_Generator_Project_Report.pdf)
## Demo

- Live URL: `https://codeit-part4-ai-ad.onrender.com`
- Render Free 플랜 특성상, 오랜 시간 미접속 후 첫 요청은 30~60초 정도 지연될 수 있습니다.

## 프로젝트 목표

- 디자인 툴이 익숙하지 않은 사용자도 광고 초안을 바로 만들 수 있게 하기
- 입력 → 생성 → 확인 → 복사/다운로드까지 한 화면에서 끝내는 실사용 흐름 만들기
- 과도한 기능 확장 없이 발표 가능한 MVP 완성하기

## 주요 기능

- 상품명, 상품 설명, 업종, 타겟 고객, 톤앤매너 입력
- 광고 문구 3개 생성 (헤드라인/본문/CTA)
- 광고 이미지 생성 수 선택: `0장`, `1장`, `2장`
- 문구 복사, TXT 다운로드, 이미지 다운로드
- 로딩/오류/빈 상태 처리

## 기술 스택

- Backend: FastAPI
- Frontend: HTML/CSS/JavaScript (Vanilla)
- AI Text: OpenAI Responses API
- AI Image: OpenAI Images API
- Deployment: Render (Docker)

## 아키텍처

1. 브라우저에서 폼 입력 후 `/api/generate` 요청
2. FastAPI 서버가 OpenAI API 호출
3. 텍스트 결과와 이미지 결과를 조합해 클라이언트에 반환
4. 프론트에서 결과 카드 렌더링 + 복사/다운로드 제공

보안 원칙:
- OpenAI API 키는 서버 환경변수에서만 사용
- 프론트 코드에는 API 키를 넣지 않음

## 프로젝트 구조

```text
.
├─ backend
│  ├─ services
│  │  ├─ ad_generator.py
│  │  └─ prompts.py
│  ├─ config.py
│  ├─ main.py
│  └─ schemas.py
├─ frontend
│  ├─ app.js
│  ├─ index.html
│  └─ styles.css
├─ Dockerfile
├─ docker-compose.yml
├─ requirements.txt
└─ .env
```

## 환경변수

프로젝트 루트에 `.env` 파일을 만들고 아래 값을 설정합니다.

```bash
OPENAI_API_KEY=your_openai_api_key
OPENAI_TEXT_MODEL=gpt-5-mini
OPENAI_IMAGE_MODEL=gpt-image-1-mini
OPENAI_IMAGE_SIZE=1024x1024
OPENAI_IMAGE_QUALITY=auto
```

## 로컬 실행

```bash
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn backend.main:app --reload
```

- 접속: `http://127.0.0.1:8000`

## Docker 실행

```bash
docker compose up -d --build
```

- 접속: `http://127.0.0.1:8000`
- 로그: `docker compose logs -f`
- 중지: `docker compose down`

## API

### `POST /api/generate`

요청 예시:

```json
{
  "product_name": "수제 딸기 케이크",
  "description": "당일 제작 생딸기 케이크로 기념일 선물에 인기가 높습니다.",
  "industry": "디저트 카페",
  "target_audience": "20~30대 직장인",
  "tone": "따뜻하고 믿음직한",
  "image_count": 1
}
```

응답 예시(요약):

```json
{
  "content": {
    "summary": "...",
    "ad_copies": [{ "headline": "...", "body": "...", "cta": "..." }],
    "image_prompts": ["..."]
  },
  "images": [{ "prompt": "...", "data_url": "data:image/png;base64,...", "mime_type": "image/png" }],
  "warnings": null
}
```

## 트러블슈팅

- `Invalid OpenAI API key`: `.env`의 `OPENAI_API_KEY` 확인
- 이미지 생성 실패: 계정의 이미지 모델 접근 권한/모델명 확인
- 배포 서비스 첫 요청 지연: Render Free 인스턴스 슬립 동작 (정상)

## 향후 개선 아이디어

- 간단한 사용자 인증 + 사용량 제한
- 광고 채널별 템플릿 (인스타/배달앱/상세페이지)
- 생성 히스토리 저장 및 재사용
