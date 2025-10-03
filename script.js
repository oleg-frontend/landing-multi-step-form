// =================== Таймер 15 хв ===================
const timerEl = document.getElementById('hero-timer');
const heroBtn = document.getElementById('hero-cta');
const stickyBtn = document.querySelector('.sticky-cta button');

let remainingTime = 15 * 60;

const timerInterval = setInterval(() => {
  const minutes = Math.floor(remainingTime / 60);
  const seconds = remainingTime % 60;
  timerEl.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;

  if (remainingTime <= 0) {
    clearInterval(timerInterval);
    [heroBtn, stickyBtn].forEach(btn => {
      btn.textContent = "Останній шанс";
      btn.classList.add('last-chance');
    });
  }
  remainingTime--;
}, 1000);

// =================== Sticky CTA ===================
const stickyCta = document.getElementById('sticky-cta');
window.addEventListener('scroll', () => {
  stickyCta.classList.toggle('show', window.scrollY > 300);
});

// =================== Reviews Slider ===================
const reviewsContainer = document.querySelector('.reviews-container');
const reviews = [...document.querySelectorAll('.review')];
const prevBtn = document.querySelector('.prev');
const nextBtn = document.querySelector('.next');
const dotsContainer = document.querySelector('.dots');

let currentIndex = 0;
const totalReviews = reviews.length;

const getVisibleReviews = () => window.innerWidth < 768 ? 1 : 3;

function renderDots() {
  dotsContainer.innerHTML = '';
  const totalDots = Math.ceil(totalReviews / getVisibleReviews());
  for (let i = 0; i < totalDots; i++) {
    const dot = document.createElement('span');
    if (i === 0) dot.classList.add('active');
    dot.addEventListener('click', () => goToSlide(i));
    dotsContainer.appendChild(dot);
  }
}
renderDots();
window.addEventListener('resize', () => { renderDots(); updateSlider(); });

function updateSlider() {
  const slideWidth = reviews[0].offsetWidth + 30;
  reviewsContainer.style.transform = `translateX(-${currentIndex * slideWidth * getVisibleReviews()}px)`;
  document.querySelectorAll('.dots span').forEach(dot => dot.classList.remove('active'));
  const activeDot = document.querySelectorAll('.dots span')[currentIndex];
  if (activeDot) activeDot.classList.add('active');
}

prevBtn.addEventListener('click', () => {
  currentIndex = Math.max(currentIndex - 1, 0);
  updateSlider();
});

nextBtn.addEventListener('click', () => {
  const maxIndex = Math.ceil(totalReviews / getVisibleReviews()) - 1;
  currentIndex = Math.min(currentIndex + 1, maxIndex);
  updateSlider();
});

function goToSlide(index) {
  currentIndex = index;
  updateSlider();
}

// Swipe
let startX = 0;
reviewsContainer.addEventListener('touchstart', e => startX = e.touches[0].clientX);
reviewsContainer.addEventListener('touchend', e => {
  const endX = e.changedTouches[0].clientX;
  if (endX < startX - 50) nextBtn.click();
  if (endX > startX + 50) prevBtn.click();
});

// =================== FAQ ===================
document.querySelectorAll('.faq-item').forEach(item => {
  item.querySelector('.faq-question').addEventListener('click', () => {
    document.querySelectorAll('.faq-item').forEach(i => i !== item && i.classList.remove('active'));
    item.classList.toggle('active');
  });
});

// =================== Multi-step Form ===================
const form = document.getElementById('multi-step-form');
const steps = [...form.querySelectorAll('.step')];
const nextStepBtn = form.querySelector('.form-next');
const modal = document.getElementById('success-modal');
const closeModal = document.getElementById('close-modal');
const phoneInput = document.getElementById('phone');
const nameInput = form.querySelector('input[type="text"]');
const emailInput = form.querySelector('input[type="email"]');
const checkbox = document.getElementById('agree');
const leadFormSection = document.querySelector('.lead-form');

// Scroll to form
[heroBtn, stickyBtn].forEach(btn => {
  btn.addEventListener('click', () => {
    leadFormSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    nameInput.focus();
  });
});

// Intl-tel-input
const iti = window.intlTelInput(phoneInput, {
  initialCountry: "ua",
  separateDialCode: true,
  utilsScript: "https://cdn.jsdelivr.net/npm/intl-tel-input@17.0.19/build/js/utils.js"
});

// Validation
const isValidEmail = email => /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(email);
const isValidName = name => name.trim().length > 1;
const isValidPhone = () => iti.isValidNumber();

// Real-time validation
nameInput.addEventListener('input', () => nameInput.style.borderColor = isValidName(nameInput.value) ? 'green' : 'red');
emailInput.addEventListener('input', () => emailInput.style.borderColor = isValidEmail(emailInput.value.trim()) ? 'green' : 'red');
phoneInput.addEventListener('input', () => phoneInput.style.borderColor = isValidPhone() ? 'green' : 'red');

// Next step
nextStepBtn.addEventListener('click', () => {
  if (!isValidName(nameInput.value) || !isValidEmail(emailInput.value.trim())) {
    return alert("Будь ласка, введіть правильне ім'я та email.");
  }
  steps[0].classList.remove('active');
  steps[1].classList.add('active');
  phoneInput.focus();
});

// Form submit
form.addEventListener('submit', e => {
  e.preventDefault();
  if (!isValidName(nameInput.value) || !isValidEmail(emailInput.value.trim())) {
    return alert("Будь ласка, введіть правильне ім'я та email.");
  }
  if (!isValidPhone() || !checkbox.checked) {
    return alert("Будь ласка, введіть правильний номер телефону та погодьтесь з умовами.");
  }

  modal.querySelector('p').textContent = `Заявка прийнята! Ваш номер: ${iti.getNumber()}`;
  modal.classList.add('show');

  const content = modal.querySelector('.modal-content');
  content.style.transform = 'scale(0.8)';
  content.style.opacity = '0';
  setTimeout(() => {
    content.style.transition = 'all 0.3s ease';
    content.style.transform = 'scale(1)';
    content.style.opacity = '1';
  }, 10);

  form.reset();
  [nameInput, emailInput, phoneInput].forEach(input => input.style.borderColor = '');
  steps[0].classList.add('active');
  steps[1].classList.remove('active');
});

// Close modal
closeModal.addEventListener('click', () => modal.classList.remove('show'));
