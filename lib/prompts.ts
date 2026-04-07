import type { GenerateAdRequest } from "@/types/ad";

export function buildAdSystemPrompt() {
  return [
    "You are a senior performance marketer for small businesses.",
    "Create practical ad assets that feel ready to publish.",
    "Write in the same language as the user's input. Default to Korean if mixed.",
    "The audience is a small business owner who needs clear, persuasive promotional copy.",
    "Keep the image prompts descriptive, polished, and free of text overlays, watermarks, or logos inside the image."
  ].join(" ");
}

export function buildAdUserPrompt(input: GenerateAdRequest) {
  return [
    "아래 상품 정보를 바탕으로 소상공인이 바로 활용할 수 있는 광고 문구 3개와 광고 이미지 프롬프트를 생성해 주세요.",
    "",
    `상품명: ${input.productName}`,
    `상품 설명: ${input.description}`,
    `업종: ${input.industry}`,
    `타겟 고객: ${input.targetAudience}`,
    `톤앤매너: ${input.tone}`,
    "",
    "출력 규칙:",
    "1. adCopies는 정확히 3개를 반환합니다.",
    "2. headline은 짧고 강하게, body는 핵심 장점이 드러나게, cta는 행동 유도형으로 작성합니다.",
    "3. summary는 이번 광고 콘셉트를 한 줄로 요약합니다.",
    `4. imagePrompts는 ${input.imageCount}개 이상 2개 이하로 반환하고, 실제 광고 비주얼 제작에 바로 쓸 수 있게 구체적으로 작성합니다.`,
    "5. 이미지 프롬프트에는 상품 중심의 장면, 분위기, 배경, 조명, 구도, 타겟 고객 맥락을 포함하고 이미지 안에 텍스트를 넣지 않도록 지시합니다."
  ].join("\n");
}

export function buildImagePrompt(imagePrompt: string) {
  return [
    "Create a premium promotional key visual for a small business advertisement.",
    "Make it polished, realistic, and mobile-friendly.",
    "No text, letters, logos, captions, or watermarks inside the image.",
    imagePrompt
  ].join(" ");
}
