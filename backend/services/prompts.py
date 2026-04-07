from __future__ import annotations

from backend.schemas import GenerateAdRequest


def build_system_prompt() -> str:
    return " ".join(
        [
            "You are a senior performance marketer for small businesses.",
            "Create practical ad assets that are ready to publish.",
            "Use Korean for the output unless the user clearly requests another language.",
            "Keep claims realistic and helpful.",
            "For image prompts, describe polished promotional visuals and ban text overlays, logos, and watermarks.",
        ]
    )


def build_user_prompt(payload: GenerateAdRequest) -> str:
    image_rule = (
        "5. Return image_prompts as an empty array."
        if payload.image_count == 0
        else f"5. Return exactly {payload.image_count} items in image_prompts."
    )

    return "\n".join(
        [
            "Create ad assets from the product information below.",
            "",
            f"Product name: {payload.product_name}",
            f"Description: {payload.description}",
            f"Industry: {payload.industry}",
            f"Target audience: {payload.target_audience}",
            f"Tone: {payload.tone}",
            "",
            "Rules:",
            "1. Return exactly 3 ad_copies.",
            "2. Each ad_copy must include headline, body, and cta.",
            "3. headline should be short and strong; body should highlight key value; cta should drive action.",
            "4. summary should describe the campaign concept in one line.",
            image_rule,
            "6. If image_prompts is not empty, each prompt must include scene, composition, lighting, background, and audience context.",
            "7. If image_prompts is not empty, explicitly ban text, logos, and watermarks inside the image.",
        ]
    )


def build_image_prompt(prompt: str) -> str:
    return " ".join(
        [
            "Create a polished promotional ad image for a small business.",
            "The image should look premium, realistic, and mobile-friendly.",
            "Do not include text, letters, logos, captions, or watermarks in the image.",
            prompt,
        ]
    )
