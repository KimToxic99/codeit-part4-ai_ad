from __future__ import annotations

from openai import (
    APIConnectionError,
    APIError,
    AuthenticationError,
    BadRequestError,
    OpenAI,
    RateLimitError,
)

from backend.config import (
    OPENAI_API_KEY,
    OPENAI_IMAGE_MODEL,
    OPENAI_IMAGE_QUALITY,
    OPENAI_IMAGE_SIZE,
    OPENAI_TEXT_MODEL,
)
from backend.schemas import (
    GenerateAdRequest,
    GenerateAdResponse,
    GeneratedImage,
    StructuredAdResult,
)
from backend.services.prompts import (
    build_image_prompt,
    build_system_prompt,
    build_user_prompt,
)

_client: OpenAI | None = None


def _normalized_image_settings() -> tuple[str, str, str]:
    model = OPENAI_IMAGE_MODEL.strip().lower()
    size = OPENAI_IMAGE_SIZE.strip()
    quality = OPENAI_IMAGE_QUALITY.strip().lower()

    if model.startswith("gpt-image-1"):
        if quality not in {"low", "medium", "high", "auto"}:
            quality = "auto"
        if not size:
            size = "1024x1024"
        return model, size, quality

    if model == "dall-e-3":
        if quality not in {"standard", "hd"}:
            quality = "standard"
        if not size:
            size = "1024x1024"
        return model, size, quality

    # Unknown model fallback
    return model, "1024x1024", "auto"


def get_openai_client() -> OpenAI:
    global _client

    if not OPENAI_API_KEY:
        raise RuntimeError("OPENAI_API_KEY is not set.")

    if _client is None:
        _client = OpenAI(
            api_key=OPENAI_API_KEY,
            max_retries=1,
            timeout=60.0,
        )

    return _client


def _map_text_error(exc: Exception) -> RuntimeError:
    if isinstance(exc, AuthenticationError):
        return RuntimeError("Invalid OpenAI API key.")
    if isinstance(exc, RateLimitError):
        return RuntimeError("OpenAI rate limit or quota issue.")
    if isinstance(exc, APIConnectionError):
        return RuntimeError(
            "Failed to connect to OpenAI API. Check network, DNS, firewall, or proxy."
        )
    if isinstance(exc, BadRequestError):
        return RuntimeError("OpenAI request was rejected.")
    if isinstance(exc, APIError):
        return RuntimeError("OpenAI API error during text generation.")
    return RuntimeError("Unexpected error during text generation.")


def generate_ad_assets(payload: GenerateAdRequest) -> GenerateAdResponse:
    client = get_openai_client()
    image_model, image_size, image_quality = _normalized_image_settings()

    try:
        text_response = client.responses.parse(
            model=OPENAI_TEXT_MODEL,
            input=[
                {"role": "system", "content": build_system_prompt()},
                {"role": "user", "content": build_user_prompt(payload)},
            ],
            text_format=StructuredAdResult,
        )
    except Exception as exc:  # noqa: BLE001
        raise _map_text_error(exc) from exc

    structured = text_response.output_parsed

    if not structured:
        raise RuntimeError("Failed to parse generated ad text.")

    prompts = structured.image_prompts[: payload.image_count]
    warnings: list[str] = []
    images: list[GeneratedImage] = []

    if payload.image_count == 0:
        structured.image_prompts = []
        return GenerateAdResponse(
            content=structured,
            images=[],
            warnings=None,
        )

    for index, prompt in enumerate(prompts, start=1):
        try:
            image_response = client.images.generate(
                model=image_model,
                prompt=build_image_prompt(prompt),
                size=image_size,
                quality=image_quality,
            )

            image_base64 = image_response.data[0].b64_json if image_response.data else None

            if not image_base64:
                raise RuntimeError("Image data is empty.")

            images.append(
                GeneratedImage(
                    prompt=prompt,
                    data_url=f"data:image/png;base64,{image_base64}",
                    mime_type="image/png",
                )
            )
        except Exception as exc:  # noqa: BLE001
            # Some models reject specific size/quality combos. Retry with safe defaults.
            if isinstance(exc, BadRequestError) and image_model.startswith("gpt-image-1"):
                try:
                    retry_response = client.images.generate(
                        model=image_model,
                        prompt=build_image_prompt(prompt),
                        size="1024x1024",
                        quality="auto",
                    )
                    retry_b64 = (
                        retry_response.data[0].b64_json if retry_response.data else None
                    )
                    if retry_b64:
                        images.append(
                            GeneratedImage(
                                prompt=prompt,
                                data_url=f"data:image/png;base64,{retry_b64}",
                                mime_type="image/png",
                            )
                        )
                        continue
                except Exception as retry_exc:  # noqa: BLE001
                    warnings.append(
                        f"Image {index} generation failed after retry: {retry_exc}"
                    )
                    continue

            warnings.append(f"Image {index} generation failed: {exc}")

    if payload.image_count > 0 and not images:
        raise RuntimeError("All image generations failed.")

    structured.image_prompts = prompts

    return GenerateAdResponse(
        content=structured,
        images=images,
        warnings=warnings or None,
    )
