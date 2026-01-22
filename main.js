class LottoBall extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        const number = this.getAttribute('number');
        const color = this.getAttribute('color');

        const wrapper = document.createElement('div');
        wrapper.setAttribute('class', 'ball');
        wrapper.style.backgroundColor = color;

        const numberSpan = document.createElement('span');
        numberSpan.textContent = number;

        const style = document.createElement('style');
        style.textContent = `
            .ball {
                width: 60px;
                height: 60px;
                border-radius: 50%;
                display: flex;
                justify-content: center;
                align-items: center;
                color: white;
                font-size: 1.5rem;
                font-weight: bold;
                box-shadow: inset -5px -5px 10px rgba(0,0,0,0.3), 2px 2px 10px rgba(0,0,0,0.5);
            }
        `;
        
        this.shadowRoot.innerHTML = '';
        this.shadowRoot.appendChild(style);
        this.shadowRoot.appendChild(wrapper);
        wrapper.appendChild(numberSpan);
    }
}

customElements.define('lotto-ball', LottoBall);

const generateButton = document.getElementById('generate-button');
const numbersContainer = document.getElementById('numbers-container');

const ballColors = [
    '#f44336',
    '#e91e63',
    '#9c27b0',
    '#673ab7',
    '#3f51b5',
    '#2196f3',
    '#03a9f4',
    '#00bcd4',
    '#009688',
    '#4caf50',
    '#8bc34a',
    '#cddc39',
    '#ffeb3b',
    '#ffc107',
    '#ff9800',
    '#ff5722',
];

generateButton.addEventListener('click', () => {
    numbersContainer.innerHTML = ''; // Clear previous results

    for (let i = 0; i < 6; i++) {
        const numbers = new Set();
        while (numbers.size < 5) {
            const randomNumber = Math.floor(Math.random() * 45) + 1;
            numbers.add(randomNumber);
        }

        const sortedNumbers = Array.from(numbers).sort((a, b) => a - b);

        const row = document.createElement('div');
        row.classList.add('lotto-row');

        sortedNumbers.forEach(number => {
            const lottoBall = document.createElement('lotto-ball');
            lottoBall.setAttribute('number', number);
            lottoBall.setAttribute('color', ballColors[Math.floor(Math.random() * ballColors.length)]);
            row.appendChild(lottoBall);
        });

        numbersContainer.appendChild(row);
    }
});

const themeToggle = document.getElementById('theme-toggle-checkbox');
const body = document.body;

themeToggle.addEventListener('change', () => {
    if (themeToggle.checked) {
        body.classList.add('dark-mode');
        localStorage.setItem('theme', 'dark');
    } else {
        body.classList.remove('dark-mode');
        localStorage.setItem('theme', 'light');
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        body.classList.add('dark-mode');
        themeToggle.checked = true;
    } else {
        body.classList.remove('dark-mode');
        themeToggle.checked = false;
    }

    const form = document.querySelector('.contact-form-container form');
    const formStatus = document.getElementById('form-status');

    async function handleSubmit(event) {
        event.preventDefault();
        const data = new FormData(event.target);
        try {
            const response = await fetch(event.target.action, {
                method: form.method,
                body: data,
                headers: {
                    'Accept': 'application/json'
                }
            });
            if (response.ok) {
                formStatus.innerHTML = "Thanks for your submission!";
                formStatus.style.color = "green";
                form.reset();
            } else {
                response.json().then(data => {
                    if (Object.hasOwn(data, 'errors')) {
                        formStatus.innerHTML = data["errors"].map(error => error["message"]).join(", ");
                    } else {
                        formStatus.innerHTML = "Oops! There was a problem submitting your form";
                        formStatus.style.color = "red";
                    }
                })
            }
        } catch (error) {
            formStatus.innerHTML = "Oops! There was a problem submitting your form";
            formStatus.style.color = "red";
        }
    }
    form.addEventListener("submit", handleSubmit)
});
