from __future__ import annotations

import logging

from fastapi import FastAPI, HTTPException
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles

from backend.config import FRONTEND_DIR
from backend.schemas import GenerateAdRequest, GenerateAdResponse
from backend.services.ad_generator import generate_ad_assets

app = FastAPI(
    title="AI Ad Generator MVP",
    description="MVP service for generating ad copy and ad images for small businesses.",
    version="0.1.0",
)
logger = logging.getLogger("ai_ad_generator")

app.mount("/static", StaticFiles(directory=str(FRONTEND_DIR)), name="static")


@app.get("/health")
def health_check() -> dict[str, str]:
    return {"status": "ok"}


@app.get("/", response_class=FileResponse)
def read_index() -> FileResponse:
    return FileResponse(FRONTEND_DIR / "index.html")


@app.post("/api/generate", response_model=GenerateAdResponse)
def generate(payload: GenerateAdRequest) -> GenerateAdResponse:
    try:
        return generate_ad_assets(payload)
    except RuntimeError as exc:
        logger.exception("Runtime error during ad generation")
        raise HTTPException(status_code=500, detail=str(exc)) from exc
    except Exception as exc:  # noqa: BLE001
        logger.exception("Unhandled server error during ad generation")
        raise HTTPException(
            status_code=500,
            detail="Unexpected server error during ad generation.",
        ) from exc
