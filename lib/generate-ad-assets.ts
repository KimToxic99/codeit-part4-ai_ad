import { zodTextFormat } from "openai/helpers/zod";

import {
  getOpenAIClient,
  OPENAI_IMAGE_MODEL,
  OPENAI_TEXT_MODEL
} from "@/lib/openai";
import {
  buildAdSystemPrompt,
  buildAdUserPrompt,
  buildImagePrompt
} from "@/lib/prompts";
import type {
  GenerateAdRequest,
  GenerateAdResponse,
  GeneratedImage
} from "@/types/ad";
import { generatedAdSchema } from "@/types/ad";

export async function generateAdAssets(
  input: GenerateAdRequest
): Promise<GenerateAdResponse> {
  const openai = getOpenAIClient();

  const textResponse = await openai.responses.parse({
    model: OPENAI_TEXT_MODEL,
    input: [
      {
        role: "system",
        content: buildAdSystemPrompt()
      },
      {
        role: "user",
        content: buildAdUserPrompt(input)
      }
    ],
    text: {
      format: zodTextFormat(generatedAdSchema, "ad_generation_result")
    }
  });

  const content = textResponse.output_parsed;

  if (!content) {
    throw new Error("광고 문구 생성에 실패했습니다.");
  }

  const warnings: string[] = [];
  const prompts = content.imagePrompts.slice(0, input.imageCount);

  const generatedImages = await Promise.all(
    prompts.map(async (prompt) => {
      try {
        const imageResponse = await openai.images.generate({
          model: OPENAI_IMAGE_MODEL,
          prompt: buildImagePrompt(prompt),
          size: "1536x1024",
          quality: "medium",
          output_format: "png"
        });

        const base64Image = imageResponse.data?.[0]?.b64_json;

        if (!base64Image) {
          throw new Error("이미지 데이터가 비어 있습니다.");
        }

        const image: GeneratedImage = {
          prompt,
          dataUrl: `data:image/png;base64,${base64Image}`,
          mimeType: "image/png"
        };

        return image;
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "이미지 생성 중 알 수 없는 오류";
        warnings.push(`이미지 ${warnings.length + 1}: ${message}`);
        return null;
      }
    })
  );

  const images = generatedImages.filter(
    (image): image is GeneratedImage => image !== null
  );

  if (images.length === 0) {
    throw new Error("광고 이미지를 생성하지 못했습니다.");
  }

  return {
    content: {
      ...content,
      imagePrompts: prompts
    },
    images,
    warnings: warnings.length > 0 ? warnings : undefined
  };
}
