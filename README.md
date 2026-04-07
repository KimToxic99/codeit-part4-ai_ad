# AI Ad Generator MVP

소상공인이 상품 정보를 입력하면 광고 문구 3개와 광고 이미지 0~2개를 생성하는 웹 서비스 MVP입니다.

## Stack

- Backend: FastAPI
- Frontend: HTML/CSS/JavaScript
- AI Text: OpenAI Responses API
- AI Image: OpenAI Images API

## Project Structure

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

## Environment Variables

프로젝트 루트에 `.env` 파일을 두고 아래 값을 설정합니다.

```bash
OPENAI_API_KEY=your_openai_api_key
OPENAI_TEXT_MODEL=gpt-5-mini
OPENAI_IMAGE_MODEL=gpt-image-1-mini
OPENAI_IMAGE_SIZE=1024x1024
OPENAI_IMAGE_QUALITY=auto
```

## Local Run

```bash
pip install -r requirements.txt
uvicorn backend.main:app --reload
```

접속: `http://127.0.0.1:8000`

## Docker Run

```bash
docker compose up -d --build
```

접속: `http://127.0.0.1:8000`

로그 확인:

```bash
docker compose logs -f
```

중지:

```bash
docker compose down
```

## Notes

- 이미지 수는 `0`, `1`, `2`를 선택할 수 있습니다.
- `image_count=0`이면 문구만 생성합니다.
- API 키는 서버 환경 변수(`.env`)에만 두고, 프론트 코드에는 두지 않습니다.
