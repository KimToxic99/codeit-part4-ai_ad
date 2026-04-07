from __future__ import annotations

from pydantic import BaseModel, ConfigDict, Field


class GenerateAdRequest(BaseModel):
    model_config = ConfigDict(extra="forbid", str_strip_whitespace=True)

    product_name: str = Field(min_length=1, max_length=80)
    description: str = Field(min_length=10, max_length=600)
    industry: str = Field(min_length=1, max_length=60)
    target_audience: str = Field(min_length=1, max_length=120)
    tone: str = Field(min_length=1, max_length=80)
    image_count: int = Field(default=1, ge=0, le=2)


class AdCopy(BaseModel):
    headline: str = Field(min_length=1, max_length=60)
    body: str = Field(min_length=1, max_length=180)
    cta: str = Field(min_length=1, max_length=30)


class StructuredAdResult(BaseModel):
    summary: str = Field(min_length=1, max_length=200)
    ad_copies: list[AdCopy] = Field(min_length=3, max_length=3)
    image_prompts: list[str] = Field(min_length=0, max_length=2)


class GeneratedImage(BaseModel):
    prompt: str
    data_url: str
    mime_type: str


class GenerateAdResponse(BaseModel):
    content: StructuredAdResult
    images: list[GeneratedImage]
    warnings: list[str] | None = None
