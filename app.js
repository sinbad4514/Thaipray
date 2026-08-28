// ThaiPray Core App Logic
document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initFontResizer();
  initCounters();
  initSearch();
  initFAQ();
  initMeditationTimer();
});

// 1. Dark/Light Theme Support
function initThemeToggle() {
  const themeBtn = document.getElementById('theme-toggle');
  if (!themeBtn) return;
  
  const savedTheme = localStorage.getItem('thaipray_theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeIcon(themeBtn, savedTheme);

  themeBtn.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('thaipray_theme', newTheme);
    updateThemeIcon(themeBtn, newTheme);
  });
}

function updateThemeIcon(btn, theme) {
  btn.innerHTML = theme === 'dark' ? '☀️' : '🌙';
  btn.setAttribute('aria-label', theme === 'dark' ? 'เปลี่ยนเป็นโหมดสว่าง' : 'เปลี่ยนเป็นโหมดกลางคืน');
}

// 2. Font Resizer for Prayer Texts
function initFontResizer() {
  const prayerBox = document.querySelector('.prayer-content');
  if (!prayerBox) return;

  const btnIncrease = document.getElementById('font-increase');
  const btnDecrease = document.getElementById('font-decrease');
  const btnReset = document.getElementById('font-reset');

  let currentSize = parseFloat(localStorage.getItem('thaipray_fontsize')) || 1.3;
  applyFontSize(prayerBox, currentSize);

  if (btnIncrease) {
    btnIncrease.addEventListener('click', () => {
      if (currentSize < 2.2) {
        currentSize += 0.15;
        applyFontSize(prayerBox, currentSize);
      }
    });
  }

  if (btnDecrease) {
    btnDecrease.addEventListener('click', () => {
      if (currentSize > 1.0) {
        currentSize -= 0.15;
        applyFontSize(prayerBox, currentSize);
      }
    });
  }

  if (btnReset) {
    btnReset.addEventListener('click', () => {
      currentSize = 1.3;
      applyFontSize(prayerBox, currentSize);
    });
  }
}

function applyFontSize(el, size) {
  el.style.fontSize = `${size}rem`;
  localStorage.setItem('thaipray_fontsize', size);
}

// 3. Interactive Prayer Counter
function initCounters() {
  const counterWidget = document.querySelector('.counter-widget');
  if (!counterWidget) return;

  const counterNum = document.getElementById('counter-current');
  const counterTarget = document.getElementById('counter-target');
  const btnCount = document.getElementById('btn-count');
  const btnReset = document.getElementById('btn-counter-reset');
  const targetPills = document.querySelectorAll('.target-pill');

  let count = 0;
  let target = parseInt(counterTarget ? counterTarget.innerText : '9', 10);

  if (btnCount && counterNum) {
    btnCount.addEventListener('click', () => {
      count++;
      counterNum.innerText = count;

      if (navigator.vibrate) {
        navigator.vibrate(40);
      }

      if (count === target) {
        btnCount.innerText = '✨ ครบจบแล้ว (แตะเพื่อสวดต่อ)';
        if (navigator.vibrate) {
          navigator.vibrate([100, 50, 100]);
        }
      }
    });
  }

  if (btnReset && counterNum) {
    btnReset.addEventListener('click', () => {
      count = 0;
      counterNum.innerText = count;
      if (btnCount) btnCount.innerText = 'แตะเพื่อนับ (+1)';
    });
  }

  targetPills.forEach(pill => {
    pill.addEventListener('click', () => {
      targetPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      target = parseInt(pill.getAttribute('data-target'), 10);
      if (counterTarget) counterTarget.innerText = target;
      count = 0;
      if (counterNum) counterNum.innerText = count;
      if (btnCount) btnCount.innerText = 'แตะเพื่อนับ (+1)';
    });
  });
}

// 4. Client Search Filter
function initSearch() {
  const searchInput = document.getElementById('prayer-search');
  if (!searchInput) return;

  const prayerCards = document.querySelectorAll('.grid-cards .card');
  searchInput.addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase().trim();
    prayerCards.forEach(card => {
      const text = card.innerText.toLowerCase();
      if (text.includes(term)) {
        card.style.display = 'flex';
      } else {
        card.style.display = 'none';
      }
    });
  });
}

// 5. Accordion FAQ
function initFAQ() {
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    if (!question || !answer) return;

    question.addEventListener('click', () => {
      const isOpen = answer.style.display === 'block';
      answer.style.display = isOpen ? 'none' : 'block';
      const icon = question.querySelector('.faq-icon');
      if (icon) icon.innerText = isOpen ? '+' : '−';
    });
  });
}

// 6. Meditation Timer
function initMeditationTimer() {
  const display = document.getElementById('timer-display');
  const btnToggle = document.getElementById('btn-timer-toggle');
  const btnReset = document.getElementById('btn-timer-reset');
  const presets = document.querySelectorAll('.timer-preset');

  if (!display || !btnToggle) return;

  let totalSeconds = 5 * 60;
  let remainingSeconds = totalSeconds;
  let timerInterval = null;
  let isRunning = false;

  function formatTime(sec) {
    const mins = Math.floor(sec / 60).toString().padStart(2, '0');
    const secs = (sec % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  }

  function updateDisplay() {
    display.innerText = formatTime(remainingSeconds);
  }

  btnToggle.addEventListener('click', () => {
    if (isRunning) {
      clearInterval(timerInterval);
      isRunning = false;
      btnToggle.innerText = 'สวด/นั่ง ต่อ';
    } else {
      isRunning = true;
      btnToggle.innerText = '⏸️ หยุดชั่วคราว';
      timerInterval = setInterval(() => {
        if (remainingSeconds > 0) {
          remainingSeconds--;
          updateDisplay();
        } else {
          clearInterval(timerInterval);
          isRunning = false;
          btnToggle.innerText = '✨ เสร็จสิ้น';
          if (navigator.vibrate) {
            navigator.vibrate([200, 100, 200, 100, 400]);
          }
          alert('ครบกำหนดเวลานั่งสมาธิแล้ว ขออนุโมทนาบุญครับ');
        }
      }, 1000);
    }
  });

  if (btnReset) {
    btnReset.addEventListener('click', () => {
      clearInterval(timerInterval);
      isRunning = false;
      remainingSeconds = totalSeconds;
      updateDisplay();
      btnToggle.innerText = 'เริ่มจับเวลา';
    });
  }

  presets.forEach(p => {
    p.addEventListener('click', () => {
      presets.forEach(b => b.classList.remove('active'));
      p.classList.add('active');
      clearInterval(timerInterval);
      isRunning = false;
      const mins = parseInt(p.getAttribute('data-minutes'), 10);
      totalSeconds = mins * 60;
      remainingSeconds = totalSeconds;
      updateDisplay();
      btnToggle.innerText = 'เริ่มจับเวลา';
    });
  });
}
