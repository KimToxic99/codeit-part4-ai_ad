import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { generateAdAssets } from "@/lib/generate-ad-assets";
import { generateAdRequestSchema } from "@/types/ad";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const input = generateAdRequestSchema.parse(body);
    const result = await generateAdAssets(input);

    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof ZodError) {
      const message = error.issues[0]?.message ?? "입력 값을 다시 확인해 주세요.";

      return NextResponse.json(
        {
          error: message,
          issues: error.flatten()
        },
        { status: 400 }
      );
    }

    const message =
      error instanceof Error
        ? error.message
        : "광고 생성 중 예상치 못한 오류가 발생했습니다.";

    console.error("Ad generation failed:", error);

    return NextResponse.json(
      {
        error: message
      },
      { status: 500 }
    );
  }
}
