import { z } from "zod";

export const generateAdRequestSchema = z.object({
  productName: z.string().trim().min(1, "상품명을 입력해 주세요.").max(80),
  description: z
    .string()
    .trim()
    .min(10, "상품 설명을 10자 이상 입력해 주세요.")
    .max(600),
  industry: z.string().trim().min(1, "업종을 입력해 주세요.").max(60),
  targetAudience: z
    .string()
    .trim()
    .min(1, "타겟 고객을 입력해 주세요.")
    .max(120),
  tone: z.string().trim().min(1, "원하는 톤앤매너를 입력해 주세요.").max(80),
  imageCount: z.number().int().min(1).max(2)
});

export const generatedAdSchema = z.object({
  summary: z.string().min(1).max(200),
  adCopies: z
    .array(
      z.object({
        headline: z.string().min(1).max(60),
        body: z.string().min(1).max(180),
        cta: z.string().min(1).max(30)
      })
    )
    .length(3),
  imagePrompts: z.array(z.string().min(1).max(500)).min(1).max(2)
});

export type GenerateAdRequest = z.infer<typeof generateAdRequestSchema>;
export type GeneratedAdData = z.infer<typeof generatedAdSchema>;

export type GeneratedImage = {
  prompt: string;
  dataUrl: string;
  mimeType: string;
};

export type GenerateAdResponse = {
  content: GeneratedAdData;
  images: GeneratedImage[];
  warnings?: string[];
};
