const form = document.getElementById("generator-form");
const resultsPanel = document.getElementById("results-panel");
const submitButton = document.getElementById("submit-button");
const loadingTemplate = document.getElementById("loading-template");
const errorTemplate = document.getElementById("error-template");

const initialValues = {
  product_name: "수제 딸기 케이크",
  description:
    "당일 아침 만든 생딸기와 동물성 생크림으로 만든 홀케이크입니다. 기념일 선물용으로 인기가 높고 예약 주문 비중이 높아요.",
  industry: "디저트 카페",
  target_audience: "생일 선물을 준비하는 20~30대 직장인",
  tone: "따뜻하고 믿음직한",
  image_count: "1"
};

function hydrateDemoValues() {
  Object.entries(initialValues).forEach(([key, value]) => {
    const field = form.elements.namedItem(key);

    if (!field) {
      return;
    }

    if (field instanceof RadioNodeList) {
      [...field].forEach((radio) => {
        radio.checked = radio.value === value;
      });
      return;
    }

    field.value = value;
  });
}

function createButton(label, className, onClick) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = className;
  button.textContent = label;
  button.addEventListener("click", onClick);
  return button;
}

function copyText(text, button) {
  navigator.clipboard.writeText(text).then(() => {
    const original = button.textContent;
    button.textContent = "복사 완료";
    window.setTimeout(() => {
      button.textContent = original;
    }, 1600);
  });
}

function downloadDataUrl(dataUrl, fileName) {
  const link = document.createElement("a");
  link.href = dataUrl;
  link.download = fileName;
  link.click();
}

function sanitizeFileName(input) {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9가-힣]+/gi, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
}

function buildAllCopiesText(result) {
  return result.content.ad_copies
    .map(
      (copy, index) =>
        `${index + 1}. ${copy.headline}\n${copy.body}\nCTA: ${copy.cta}`
    )
    .join("\n\n");
}

function setLoadingState(isLoading) {
  submitButton.disabled = isLoading;
  submitButton.textContent = isLoading
    ? "광고 자산 생성 중..."
    : "광고 문구와 이미지 만들기";
}

function renderLoading() {
  resultsPanel.innerHTML = "";
  resultsPanel.appendChild(loadingTemplate.content.cloneNode(true));
}

function renderError(message) {
  resultsPanel.innerHTML = "";
  const fragment = errorTemplate.content.cloneNode(true);
  fragment.querySelector("[data-error-message]").textContent = message;
  resultsPanel.appendChild(fragment);
}

function renderResult(result) {
  resultsPanel.innerHTML = "";

  const wrapper = document.createElement("div");
  const copiesText = buildAllCopiesText(result);
  const firstHeadline = result.content.ad_copies[0]?.headline ?? "ad-result";
  const safeBaseName = sanitizeFileName(firstHeadline || "ad-result");

  const header = document.createElement("div");
  header.className = "result-header";

  const headerCopy = document.createElement("div");
  headerCopy.innerHTML = `
    <span class="pill">생성 완료</span>
    <h3>${result.content.summary}</h3>
    <p class="result-meta">문구 3개와 이미지 ${result.images.length}개가 준비되었습니다.</p>
  `;

  const actionRow = document.createElement("div");
  actionRow.className = "action-row";
  actionRow.appendChild(
    createButton("광고 문구 전체 복사", "secondary-button", (event) => {
      copyText(copiesText, event.currentTarget);
    })
  );
  actionRow.appendChild(
    createButton("문구 TXT 다운로드", "ghost-button", () => {
      downloadDataUrl(
        `data:text/plain;charset=utf-8,${encodeURIComponent(copiesText)}`,
        `${safeBaseName}-copies.txt`
      );
    })
  );

  header.appendChild(headerCopy);
  header.appendChild(actionRow);
  wrapper.appendChild(header);

  if (result.warnings && result.warnings.length > 0) {
    const warnings = document.createElement("div");
    warnings.className = "warning-box";
    warnings.textContent = result.warnings.join(" / ");
    wrapper.appendChild(warnings);
  }

  const copiesSection = document.createElement("section");
  copiesSection.className = "result-section";
  copiesSection.innerHTML = `<h3 class="section-title">광고 문구 3안</h3>`;

  const copyGrid = document.createElement("div");
  copyGrid.className = "copy-grid";

  result.content.ad_copies.forEach((copy, index) => {
    const card = document.createElement("article");
    card.className = "copy-card";
    card.innerHTML = `
      <small>Ad Copy ${index + 1}</small>
      <h4>${copy.headline}</h4>
      <p>${copy.body}</p>
      <div class="cta-chip">CTA. ${copy.cta}</div>
    `;

    const button = createButton("이 문구 복사", "ghost-button", (event) => {
      copyText(
        `${copy.headline}\n${copy.body}\nCTA: ${copy.cta}`,
        event.currentTarget
      );
    });

    card.appendChild(button);
    copyGrid.appendChild(card);
  });

  copiesSection.appendChild(copyGrid);
  wrapper.appendChild(copiesSection);

  const imageSection = document.createElement("section");
  imageSection.className = "result-section";
  imageSection.innerHTML = `<h3 class="section-title">광고 이미지</h3>`;

  if (!result.images || result.images.length === 0) {
    const emptyImage = document.createElement("div");
    emptyImage.className = "warning-box";
    emptyImage.textContent =
      "이미지 수를 0장으로 선택하여 이미지 생성을 건너뛰었습니다.";
    imageSection.appendChild(emptyImage);
    wrapper.appendChild(imageSection);
    resultsPanel.appendChild(wrapper);
    return;
  }

  const imageGrid = document.createElement("div");
  imageGrid.className = "image-grid";

  result.images.forEach((image, index) => {
    const card = document.createElement("article");
    card.className = "image-card";
    card.innerHTML = `
      <img src="${image.data_url}" alt="광고 이미지 ${index + 1}" />
      <div class="image-card-body">
        <p>${image.prompt}</p>
      </div>
    `;

    const downloadButton = createButton(
      "이미지 다운로드",
      "ghost-button",
      () => {
        downloadDataUrl(image.data_url, `${safeBaseName}-image-${index + 1}.png`);
      }
    );

    card.querySelector(".image-card-body").appendChild(downloadButton);
    imageGrid.appendChild(card);
  });

  imageSection.appendChild(imageGrid);
  wrapper.appendChild(imageSection);
  resultsPanel.appendChild(wrapper);
}

async function handleSubmit(event) {
  event.preventDefault();

  setLoadingState(true);
  renderLoading();

  const formData = new FormData(form);
  const payload = {
    product_name: String(formData.get("product_name") || "").trim(),
    description: String(formData.get("description") || "").trim(),
    industry: String(formData.get("industry") || "").trim(),
    target_audience: String(formData.get("target_audience") || "").trim(),
    tone: String(formData.get("tone") || "").trim(),
    image_count: Number(formData.get("image_count") || 1)
  };

  try {
    const response = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.detail || "광고 생성 요청에 실패했습니다.");
    }

    renderResult(data);
  } catch (error) {
    renderError(
      error instanceof Error
        ? error.message
        : "광고 생성 중 알 수 없는 오류가 발생했습니다."
    );
  } finally {
    setLoadingState(false);
  }
}

hydrateDemoValues();
form.addEventListener("submit", handleSubmit);
