"use client";

import { useState } from "react";

import type { GenerateAdResponse, GeneratedImage } from "@/types/ad";

type ResultsPanelProps = {
  result: GenerateAdResponse | null;
  error: string | null;
  isLoading: boolean;
  lastGeneratedAt: string | null;
};

function createSafeFilename(input: string) {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9가-힣]+/gi, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
}

function triggerDownload(href: string, fileName: string) {
  const link = document.createElement("a");
  link.href = href;
  link.download = fileName;
  link.click();
}

function buildCopyPayload(result: GenerateAdResponse) {
  return result.content.adCopies
    .map(
      (copy, index) =>
        `${index + 1}. ${copy.headline}\n${copy.body}\nCTA: ${copy.cta}`
    )
    .join("\n\n");
}

function ImageCard({
  image,
  index,
  productLabel
}: {
  image: GeneratedImage;
  index: number;
  productLabel: string;
}) {
  return (
    <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
      <div className="aspect-[4/3] bg-slate-100">
        <img
          src={image.dataUrl}
          alt={`${productLabel} 광고 이미지 ${index + 1}`}
          className="h-full w-full object-cover"
        />
      </div>
      <div className="space-y-4 p-5">
        <p className="text-sm leading-6 text-slate-600">{image.prompt}</p>
        <button
          type="button"
          className="rounded-2xl bg-brand-50 px-4 py-3 text-sm font-semibold text-brand-600 transition hover:bg-brand-100"
          onClick={() =>
            triggerDownload(
              image.dataUrl,
              `${createSafeFilename(productLabel)}-image-${index + 1}.png`
            )
          }
        >
          이미지 다운로드
        </button>
      </div>
    </div>
  );
}

export function ResultsPanel({
  result,
  error,
  isLoading,
  lastGeneratedAt
}: ResultsPanelProps) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyToClipboard = async (key: string, value: string) => {
    await navigator.clipboard.writeText(value);
    setCopiedKey(key);
    window.setTimeout(() => setCopiedKey(null), 1800);
  };

  if (isLoading) {
    return (
      <div className="panel flex min-h-[520px] flex-col justify-between p-8">
        <div className="space-y-4">
          <span className="inline-flex rounded-full bg-brand-50 px-3 py-1 text-sm font-medium text-brand-600">
            생성 중
          </span>
          <h3 className="font-display text-3xl text-ink">
            광고 문구와 이미지를 준비하고 있습니다
          </h3>
          <p className="max-w-xl text-sm leading-7 text-slate-600">
            상품 정보를 바탕으로 문구 톤을 맞추고, 바로 쓸 수 있는 광고
            비주얼을 생성하고 있어요. 이미지 생성까지 포함되므로 최대 20~40초
            정도 걸릴 수 있습니다.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {["문구 초안 정리", "광고 카피 3안 구성", "광고 이미지 생성"].map(
            (step) => (
              <div
                key={step}
                className="rounded-[28px] border border-slate-200 bg-white/80 p-5"
              >
                <div className="mb-4 h-2 w-24 rounded-full bg-brand-100" />
                <p className="font-medium text-ink">{step}</p>
                <p className="mt-2 text-sm text-slate-500">
                  잠시만 기다리면 결과가 오른쪽 화면에 채워집니다.
                </p>
              </div>
            )
          )}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="panel flex min-h-[520px] flex-col justify-center p-8">
        <span className="inline-flex w-fit rounded-full bg-rose-100 px-3 py-1 text-sm font-medium text-rose-700">
          오류 발생
        </span>
        <h3 className="mt-4 font-display text-3xl text-ink">
          생성 중 문제가 생겼습니다
        </h3>
        <p className="mt-3 max-w-xl text-sm leading-7 text-slate-600">{error}</p>
        <p className="mt-5 text-sm text-slate-500">
          입력값을 조금 더 구체적으로 쓰거나 OpenAI API 키 설정을 다시 확인해
          주세요.
        </p>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="panel flex min-h-[520px] flex-col justify-between p-8">
        <div className="space-y-4">
          <span className="inline-flex rounded-full bg-white px-3 py-1 text-sm font-medium text-slate-500">
            결과 미리보기
          </span>
          <h3 className="font-display text-3xl text-ink">
            한 번의 입력으로 광고 초안을 완성합니다
          </h3>
          <p className="max-w-xl text-sm leading-7 text-slate-600">
            왼쪽에 상품 정보를 입력하면 광고 문구 3개와 이미지가 이 영역에
            표시됩니다. 복사해서 SNS, 배달앱, 상세페이지 제작에 바로 활용할 수
            있도록 구성했습니다.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-[28px] border border-dashed border-slate-300 bg-white/70 p-6">
            <p className="text-sm font-semibold text-ink">광고 문구</p>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              헤드라인, 본문, CTA가 카드 형식으로 정리됩니다.
            </p>
          </div>
          <div className="rounded-[28px] border border-dashed border-slate-300 bg-white/70 p-6">
            <p className="text-sm font-semibold text-ink">광고 이미지</p>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              결과 이미지는 즉시 확인하고 개별 다운로드할 수 있습니다.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const productLabel = result.content.adCopies[0]?.headline || "ad-asset";

  return (
    <div className="panel space-y-8 p-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <span className="inline-flex rounded-full bg-brand-50 px-3 py-1 text-sm font-medium text-brand-600">
            생성 완료
          </span>
          <h3 className="mt-4 font-display text-3xl text-ink">
            {result.content.summary}
          </h3>
          <p className="mt-3 text-sm text-slate-500">
            {lastGeneratedAt ? `마지막 생성 시각: ${lastGeneratedAt}` : ""}
          </p>
        </div>

        <button
          type="button"
          className="rounded-2xl bg-ink px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          onClick={() =>
            copyToClipboard("all-copies", buildCopyPayload(result))
          }
        >
          {copiedKey === "all-copies" ? "전체 문구 복사 완료" : "광고 문구 전체 복사"}
        </button>
      </div>

      {result.warnings && result.warnings.length > 0 ? (
        <div className="rounded-[24px] border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          {result.warnings.join(" / ")}
        </div>
      ) : null}

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="font-display text-2xl text-ink">광고 문구 3안</h4>
          <button
            type="button"
            className="rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-ink shadow-sm transition hover:bg-slate-50"
            onClick={() =>
              triggerDownload(
                `data:text/plain;charset=utf-8,${encodeURIComponent(
                  buildCopyPayload(result)
                )}`,
                `${createSafeFilename(productLabel)}-copies.txt`
              )
            }
          >
            문구 TXT 다운로드
          </button>
        </div>

        <div className="grid gap-4 xl:grid-cols-3">
          {result.content.adCopies.map((copy, index) => {
            const copyValue = `${copy.headline}\n${copy.body}\nCTA: ${copy.cta}`;
            const copyKey = `copy-${index}`;

            return (
              <article
                key={copyKey}
                className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-500">
                  Ad Copy {index + 1}
                </p>
                <h5 className="mt-4 font-display text-2xl leading-tight text-ink">
                  {copy.headline}
                </h5>
                <p className="mt-4 text-sm leading-7 text-slate-600">
                  {copy.body}
                </p>
                <div className="mt-6 rounded-2xl bg-sand px-4 py-3 text-sm font-semibold text-ink">
                  CTA. {copy.cta}
                </div>
                <button
                  type="button"
                  className="mt-6 rounded-2xl bg-brand-50 px-4 py-3 text-sm font-semibold text-brand-600 transition hover:bg-brand-100"
                  onClick={() => copyToClipboard(copyKey, copyValue)}
                >
                  {copiedKey === copyKey ? "복사 완료" : "이 문구 복사"}
                </button>
              </article>
            );
          })}
        </div>
      </section>

      <section className="space-y-4">
        <h4 className="font-display text-2xl text-ink">광고 이미지</h4>
        <div className="grid gap-4 xl:grid-cols-2">
          {result.images.map((image, index) => (
            <ImageCard
              key={`${image.prompt}-${index}`}
              image={image}
              index={index}
              productLabel={productLabel}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
