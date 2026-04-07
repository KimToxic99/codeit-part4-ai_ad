"use client";

import type { FormEvent, ReactNode } from "react";

import type { GenerateAdRequest } from "@/types/ad";

type GeneratorFormProps = {
  values: GenerateAdRequest;
  isLoading: boolean;
  onChange: (
    field: keyof GenerateAdRequest,
    value: GenerateAdRequest[keyof GenerateAdRequest]
  ) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

type FieldProps = {
  label: string;
  hint: string;
  children: ReactNode;
};

function Field({ label, hint, children }: FieldProps) {
  return (
    <label className="block">
      <div className="flex items-center justify-between gap-3">
        <span className="font-medium text-ink">{label}</span>
        <span className="text-xs text-slate-500">{hint}</span>
      </div>
      <div className="field-shell">{children}</div>
    </label>
  );
}

export function GeneratorForm({
  values,
  isLoading,
  onChange,
  onSubmit
}: GeneratorFormProps) {
  return (
    <form className="space-y-5" onSubmit={onSubmit}>
      <div className="grid gap-5 md:grid-cols-2">
        <Field label="상품명" hint="가장 먼저 보일 이름">
          <input
            className="field-input"
            placeholder="예: 수제 딸기 케이크"
            value={values.productName}
            onChange={(event) => onChange("productName", event.target.value)}
          />
        </Field>

        <Field label="업종" hint="광고 맥락을 위한 정보">
          <input
            className="field-input"
            placeholder="예: 디저트 카페"
            value={values.industry}
            onChange={(event) => onChange("industry", event.target.value)}
          />
        </Field>
      </div>

      <Field label="상품 설명" hint="핵심 장점과 차별점을 적어 주세요">
        <textarea
          className="field-input min-h-32 resize-none"
          placeholder="예: 매일 아침 신선한 생딸기와 동물성 생크림으로 만드는 홀케이크입니다. 당일 제작으로 풍미가 진하고, 기념일 선물용으로 인기가 많아요."
          value={values.description}
          onChange={(event) => onChange("description", event.target.value)}
        />
      </Field>

      <div className="grid gap-5 md:grid-cols-[1.1fr_0.9fr]">
        <Field label="타겟 고객" hint="누구에게 보여 줄지">
          <input
            className="field-input"
            placeholder="예: 생일 케이크를 찾는 20~30대 직장인"
            value={values.targetAudience}
            onChange={(event) =>
              onChange("targetAudience", event.target.value)
            }
          />
        </Field>

        <Field label="톤앤매너" hint="원하는 말투와 분위기">
          <input
            className="field-input"
            placeholder="예: 따뜻하고 믿음직한"
            value={values.tone}
            onChange={(event) => onChange("tone", event.target.value)}
          />
        </Field>
      </div>

      <Field label="이미지 수" hint="비용을 생각해 1장부터 시작해도 좋아요">
        <div className="flex gap-3">
          {[1, 2].map((count) => {
            const isActive = values.imageCount === count;

            return (
              <button
                key={count}
                type="button"
                className={`rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                  isActive
                    ? "bg-brand-500 text-white shadow-lg shadow-brand-300/40"
                    : "bg-brand-50 text-brand-600 hover:bg-brand-100"
                }`}
                onClick={() => onChange("imageCount", count)}
              >
                이미지 {count}장
              </button>
            );
          })}
        </div>
      </Field>

      <button
        type="submit"
        disabled={isLoading}
        className="flex w-full items-center justify-center rounded-2xl bg-ink px-5 py-4 font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
      >
        {isLoading ? "광고 자산 생성 중..." : "광고 문구와 이미지 만들기"}
      </button>
    </form>
  );
}
