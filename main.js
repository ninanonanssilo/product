const MODEL_URL = "https://teachablemachine.withgoogle.com/models/smNjPb8GN/";

let model;
let labelContainer;
let maxPredictions;

const imageUpload = document.getElementById("image-upload");
const previewImage = document.getElementById("preview-image");
const placeholder = document.getElementById("placeholder");
const statusEl = document.getElementById("status");
const themeToggle = document.getElementById("theme-toggle");
const languageToggle = document.getElementById("language-toggle");
const form = document.getElementById("inquiry-form");
const formStatus = document.getElementById("form-status");

const themeKey = "animal-face-theme";
const languageKey = "animal-face-lang";

const translations = {
    en: {
        kicker: "AI Animal Face Test",
        title: "Dog vs Cat Face",
        subtitle: "Upload a photo to see your animal vibe.",
        uploadTitle: "Upload Photo",
        uploadHint: "Use a front-facing photo with good lighting.",
        placeholder: "Choose a photo file",
        statusLoading: "Loading model...",
        statusReady: "Ready! Choose a photo.",
        modelError: "We couldn't load the model. Please try again later.",
        inquiryTitle: "Partnership Inquiry",
        inquiryHint: "We will respond within 1-2 business days.",
        emailLabel: "Email",
        messageLabel: "Message",
        submitButton: "Send Inquiry",
        formSuccess: "Thanks for your submission!",
        formError: "Oops! There was a problem submitting your form",
        aboutTitle: "What this test is",
        aboutBody: "This page offers a playful, AI-powered face vibe test using a small image model.",
        aboutItem1: "Original content written for this site, not copied from elsewhere.",
        aboutItem2: "Clear purpose: help users get a quick, fun result.",
        aboutItem3: "Focus on usability with straightforward navigation.",
        howTitle: "How it works",
        howItem1: "You upload a photo from your device.",
        howItem2: "The model runs in your browser and predicts labels.",
        howItem3: "Results appear immediately below the preview.",
        howNote: "We do not claim scientific accuracy. This is for entertainment.",
        qualityTitle: "Quality principles",
        qualityItem1: "Provide substantial value and clear information.",
        qualityItem2: "Avoid duplicate or thin pages.",
        qualityItem3: "Keep ads secondary to content and user experience.",
        qualityItem4: "Make it easy to find what the page promises.",
        privacyTitle: "Privacy",
        privacyBody: "Your photo is processed in the browser for predictions. We do not store or upload your image to our servers.",
        privacyNote: "If you contact us, only the information you submit via the inquiry form is sent.",
        faqTitle: "FAQ",
        faqQ1: "Why do I see different results?",
        faqA1: "Lighting, angles, and camera quality can affect predictions.",
        faqQ2: "Is this medically accurate?",
        faqA2: "No. It is a playful demo and not a diagnostic tool.",
        faqQ3: "Which photos work best?",
        faqA3: "Use a well-lit, front-facing photo with your face clearly visible.",
        transparencyTitle: "Transparency",
        transparencyBody: "This site uses Google AdSense ads to support ongoing maintenance. Ads are kept separate from core content.",
        transparencyNote: "We focus on clear content, simple navigation, and a helpful experience.",
        commentsTitle: "Comments",
        commentsNoscript: "Please enable JavaScript to view the comments powered by Disqus.",
        footer: "Powered by Teachable Machine",
    },
    ko: {
        kicker: "AI 동물상 테스트",
        title: "나는 강아지상? 고양이상?",
        subtitle: "사진을 업로드하면 동물상 결과를 알려드려요.",
        uploadTitle: "사진 업로드",
        uploadHint: "정면 사진과 좋은 조명을 사용해주세요.",
        placeholder: "사진 파일을 선택하세요",
        statusLoading: "모델 로딩 중...",
        statusReady: "준비 완료! 사진을 선택하세요.",
        modelError: "모델을 불러오지 못했습니다. 잠시 후 다시 시도해주세요.",
        inquiryTitle: "제휴 문의",
        inquiryHint: "영업일 기준 1~2일 내 답변드립니다.",
        emailLabel: "이메일",
        messageLabel: "문의 내용",
        submitButton: "문의하기",
        formSuccess: "문의가 접수되었습니다!",
        formError: "전송 중 문제가 발생했습니다.",
        aboutTitle: "이 테스트는 무엇인가요?",
        aboutBody: "이 페이지는 작은 이미지 모델로 동물상 분위기를 재미로 알려주는 테스트입니다.",
        aboutItem1: "이 사이트를 위해 작성한 오리지널 콘텐츠입니다.",
        aboutItem2: "빠르고 즐거운 결과를 제공하는 것이 목적입니다.",
        aboutItem3: "간단한 구조로 누구나 쉽게 사용할 수 있어요.",
        howTitle: "작동 방식",
        howItem1: "기기에서 사진 파일을 업로드합니다.",
        howItem2: "모델이 브라우저에서 실행되어 라벨을 예측합니다.",
        howItem3: "결과는 미리보기 아래에 바로 표시됩니다.",
        howNote: "과학적 정확성을 주장하지 않으며 재미를 위한 테스트입니다.",
        qualityTitle: "품질 원칙",
        qualityItem1: "명확한 정보와 충분한 가치를 제공합니다.",
        qualityItem2: "중복되거나 얇은 콘텐츠는 피합니다.",
        qualityItem3: "광고는 콘텐츠와 사용자 경험보다 우선하지 않습니다.",
        qualityItem4: "페이지가 약속한 내용을 쉽게 찾을 수 있게 합니다.",
        privacyTitle: "개인정보",
        privacyBody: "사진은 브라우저에서만 처리되며 서버에 저장하거나 업로드하지 않습니다.",
        privacyNote: "제휴 문의 시 입력한 정보만 전송됩니다.",
        faqTitle: "자주 묻는 질문",
        faqQ1: "결과가 달라질 수 있나요?",
        faqA1: "조명, 각도, 카메라 품질에 따라 결과가 달라질 수 있습니다.",
        faqQ2: "의학적으로 정확한가요?",
        faqA2: "아니요. 재미를 위한 데모이며 진단 목적이 아닙니다.",
        faqQ3: "어떤 사진이 좋나요?",
        faqA3: "얼굴이 잘 보이는 정면 사진이 가장 좋습니다.",
        transparencyTitle: "투명성",
        transparencyBody: "사이트 운영을 위해 Google AdSense 광고를 사용합니다. 광고는 핵심 콘텐츠와 분리합니다.",
        transparencyNote: "명확한 콘텐츠와 쉬운 탐색을 우선합니다.",
        commentsTitle: "댓글",
        commentsNoscript: "댓글을 보려면 JavaScript를 활성화하세요.",
        footer: "Teachable Machine 제공",
    },
};

function setStatus(message) {
    statusEl.textContent = message;
}

function getCurrentLang() {
    return document.documentElement.lang === "ko" ? "ko" : "en";
}

function applyLanguage(lang) {
    const dict = translations[lang];
    document.documentElement.lang = lang;
    document.querySelectorAll("[data-i18n]").forEach(node => {
        const key = node.dataset.i18n;
        if (dict[key]) {
            node.textContent = dict[key];
        }
    });
    languageToggle.textContent = lang === "ko" ? "EN" : "KR";
}

function applyTheme(isDark) {
    document.body.classList.toggle("dark", isDark);
    themeToggle.checked = isDark;
}

async function loadModel() {
    const modelURL = `${MODEL_URL}model.json`;
    const metadataURL = `${MODEL_URL}metadata.json`;
    model = await tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();
    labelContainer = document.getElementById("label-container");
    labelContainer.innerHTML = "";
    for (let i = 0; i < maxPredictions; i += 1) {
        labelContainer.appendChild(document.createElement("div"));
    }
    const dict = translations[getCurrentLang()];
    setStatus(dict.statusReady);
}

async function predict(imageElement) {
    const prediction = await model.predict(imageElement);
    for (let i = 0; i < maxPredictions; i += 1) {
        const classPrediction = `${prediction[i].className}: ${prediction[i].probability.toFixed(2)}`;
        labelContainer.childNodes[i].textContent = classPrediction;
    }
}

imageUpload.addEventListener("change", event => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
        previewImage.src = reader.result;
        previewImage.onload = () => {
            placeholder.style.display = "none";
            previewImage.style.display = "block";
            predict(previewImage);
        };
    };
    reader.readAsDataURL(file);
});

themeToggle.addEventListener("change", () => {
    const next = themeToggle.checked;
    applyTheme(next);
    localStorage.setItem(themeKey, next ? "dark" : "light");
});

languageToggle.addEventListener("click", () => {
    const next = getCurrentLang() === "ko" ? "en" : "ko";
    applyLanguage(next);
    localStorage.setItem(languageKey, next);
    if (model) {
        const dict = translations[next];
        setStatus(dict.statusReady);
    }
});

form.addEventListener("submit", async event => {
    event.preventDefault();
    const data = new FormData(event.target);
    const dict = translations[getCurrentLang()];

    try {
        const response = await fetch(event.target.action, {
            method: form.method,
            body: data,
            headers: { Accept: "application/json" },
        });
        if (response.ok) {
            formStatus.textContent = dict.formSuccess;
            formStatus.classList.add("success");
            form.reset();
        } else {
            formStatus.textContent = dict.formError;
            formStatus.classList.remove("success");
        }
    } catch (error) {
        console.error(error);
        formStatus.textContent = dict.formError;
        formStatus.classList.remove("success");
    }
});

function initPreferences() {
    const savedTheme = localStorage.getItem(themeKey);
    const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    applyTheme(savedTheme ? savedTheme === "dark" : prefersDark);

    const savedLang = localStorage.getItem(languageKey);
    applyLanguage(savedLang || "en");
}

function initDisqus() {
    const d = document;
    const s = d.createElement("script");
    s.src = "https://https-product-2m0-pages-dev-1.disqus.com/embed.js";
    s.setAttribute("data-timestamp", String(+new Date()));
    (d.head || d.body).appendChild(s);
}

window.addEventListener("DOMContentLoaded", async () => {
    initPreferences();
    const dict = translations[getCurrentLang()];
    setStatus(dict.statusLoading);
    try {
        await loadModel();
    } catch (error) {
        console.error(error);
        setStatus(dict.modelError);
    }
    initDisqus();
});
