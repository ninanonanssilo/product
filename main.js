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
        inquiryTitle: "Partnership Inquiry",
        inquiryHint: "We will respond within 1-2 business days.",
        emailLabel: "Email",
        messageLabel: "Message",
        submitButton: "Send Inquiry",
        formSuccess: "Thanks for your submission!",
        formError: "Oops! There was a problem submitting your form",
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
        inquiryTitle: "제휴 문의",
        inquiryHint: "영업일 기준 1~2일 내 답변드립니다.",
        emailLabel: "이메일",
        messageLabel: "문의 내용",
        submitButton: "문의하기",
        formSuccess: "문의가 접수되었습니다!",
        formError: "전송 중 문제가 발생했습니다.",
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
        setStatus(dict.formError);
    }
    initDisqus();
});
