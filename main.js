// More API functions here:
// https://github.com/googlecreativelab/teachablemachine-community/tree/master/libraries/image

// the link to your model provided by Teachable Machine export panel
const URL = "https://teachablemachine.withgoogle.com/models/smNjPb8GN/";

let model, labelContainer, maxPredictions;

const imageUpload = document.getElementById("image-upload");
const previewImage = document.getElementById("preview-image");
const placeholder = document.getElementById("placeholder");
const statusEl = document.getElementById("status");

async function loadModel() {
    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";
    model = await tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();
    labelContainer = document.getElementById("label-container");
    labelContainer.innerHTML = "";
    for (let i = 0; i < maxPredictions; i++) {
        labelContainer.appendChild(document.createElement("div"));
    }
    statusEl.textContent = "준비 완료! 사진을 선택하세요.";
}

async function predict(imageElement) {
    const prediction = await model.predict(imageElement);
    for (let i = 0; i < maxPredictions; i++) {
        const classPrediction =
            prediction[i].className + ": " + prediction[i].probability.toFixed(2);
        labelContainer.childNodes[i].innerHTML = classPrediction;
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

window.addEventListener("DOMContentLoaded", async () => {
    try {
        await loadModel();
    } catch (error) {
        console.error(error);
        statusEl.textContent = "모델을 불러오지 못했습니다.";
    }
});
