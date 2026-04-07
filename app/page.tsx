import { AdStudio } from "@/components/ad-studio";

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-8 md:px-6 lg:px-8">
      <section className="mb-8 overflow-hidden rounded-[36px] border border-white/70 bg-[#18233A] px-6 py-8 text-white shadow-panel md:px-8 md:py-10">
        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
          <div>
            <span className="inline-flex rounded-full bg-white/10 px-3 py-1 text-sm font-medium text-orange-200">
              Small Business AI Ad Studio
            </span>
            <h1 className="mt-4 max-w-3xl font-display text-4xl leading-tight md:text-5xl">
              입력 한 번으로 광고 문구와 광고 이미지를 동시에 생성하는 MVP
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 md:text-base">
              디자인 툴이 익숙하지 않은 소상공인을 위해, 상품 설명만 입력하면
              발표 가능한 수준의 광고 초안을 빠르게 만드는 서비스 흐름을
              구현했습니다.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-1">
            <div className="rounded-[28px] bg-white/8 p-5">
              <p className="text-xs uppercase tracking-[0.2em] text-orange-200">
                Output
              </p>
              <p className="mt-2 text-2xl font-semibold">3 Ad Copies</p>
            </div>
            <div className="rounded-[28px] bg-white/8 p-5">
              <p className="text-xs uppercase tracking-[0.2em] text-orange-200">
                Visuals
              </p>
              <p className="mt-2 text-2xl font-semibold">1-2 Images</p>
            </div>
            <div className="rounded-[28px] bg-white/8 p-5">
              <p className="text-xs uppercase tracking-[0.2em] text-orange-200">
                Ready
              </p>
              <p className="mt-2 text-2xl font-semibold">Copy + Download</p>
            </div>
          </div>
        </div>
      </section>

      <AdStudio />
    </main>
  );
}
