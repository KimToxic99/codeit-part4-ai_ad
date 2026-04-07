"use client";

import type { FormEvent } from "react";
import { useState } from "react";

import { GeneratorForm } from "@/components/generator-form";
import { ResultsPanel } from "@/components/results-panel";
import type {
  GenerateAdRequest,
  GenerateAdResponse
} from "@/types/ad";
import { generateAdRequestSchema } from "@/types/ad";

const initialFormValues: GenerateAdRequest = {
  productName: "",
  description: "",
  industry: "",
  targetAudience: "",
  tone: "",
  imageCount: 1
};

export function AdStudio() {
  const [values, setValues] = useState(initialFormValues);
  const [result, setResult] = useState<GenerateAdResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastGeneratedAt, setLastGeneratedAt] = useState<string | null>(null);

  const updateField = (
    field: keyof GenerateAdRequest,
    value: GenerateAdRequest[keyof GenerateAdRequest]
  ) => {
    setValues((current) => ({
      ...current,
      [field]: value
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setResult(null);

    const parsedInput = generateAdRequestSchema.safeParse(values);

    if (!parsedInput.success) {
      setError(parsedInput.error.issues[0]?.message ?? "입력값을 확인해 주세요.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(parsedInput.data)
      });

      const data = (await response.json()) as GenerateAdResponse & {
        error?: string;
      };

      if (!response.ok) {
        throw new Error(data.error ?? "광고 생성 요청에 실패했습니다.");
      }

      setResult(data);
      setLastGeneratedAt(
        new Intl.DateTimeFormat("ko-KR", {
          dateStyle: "medium",
          timeStyle: "short"
        }).format(new Date())
      );
    } catch (submissionError) {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : "광고 생성 중 문제가 발생했습니다."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
      <div className="panel p-8">
        <div className="mb-8">
          <span className="inline-flex rounded-full bg-brand-50 px-3 py-1 text-sm font-medium text-brand-600">
            MVP Generator
          </span>
          <h2 className="mt-4 font-display text-3xl text-ink">
            상품 설명만으로 광고 초안을 만드세요
          </h2>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            상품 정보와 원하는 톤을 입력하면 OpenAI가 광고 문구 3개와 광고용
            이미지를 생성합니다. 발표용 MVP에 맞춰 한 화면에서 결과 확인과
            복사, 다운로드까지 바로 이어지도록 구성했습니다.
          </p>
        </div>

        <GeneratorForm
          values={values}
          isLoading={isLoading}
          onChange={updateField}
          onSubmit={handleSubmit}
        />
      </div>

      <ResultsPanel
        result={result}
        error={error}
        isLoading={isLoading}
        lastGeneratedAt={lastGeneratedAt}
      />
    </section>
  );
}
