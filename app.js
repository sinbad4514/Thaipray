// ThaiPray Core App Logic
document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initFontResizer();
  initCounters();
  initSearchAndTabs();
  initFAQ();
  initMeditationTimer();
  initShareButtons();
  initBackToTop();
  initStickySearch();
  initFavorites();
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

// 4. Client Search & Category Tab Filter
function initSearchAndTabs() {
  const searchInput = document.getElementById('prayer-search');
  const tabBtns = document.querySelectorAll('.category-tabs .tab-btn');
  const prayerCards = document.querySelectorAll('.grid-cards .card');

  let activeCategory = 'all';

  function filterCards() {
    const term = searchInput ? searchInput.value.toLowerCase().trim() : '';
    
    prayerCards.forEach(card => {
      const text = card.innerText.toLowerCase();
      const cat = card.getAttribute('data-cat') || '';
      
      const matchSearch = !term || text.includes(term);
      const matchCategory = activeCategory === 'all' || cat.includes(activeCategory);

      if (matchSearch && matchCategory) {
        card.style.display = 'flex';
      } else {
        card.style.display = 'none';
      }
    });
  }

  if (searchInput) {
    searchInput.addEventListener('input', filterCards);
  }

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeCategory = btn.getAttribute('data-category');
      filterCards();
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

// Tibetan Singing Bowl / Temple Bell Sound Synthesizer via Web Audio API
function playTibetanBell(isLong = false) {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    const duration = isLong ? 6.5 : 3.5;
    const baseFreq = 432; // 432Hz Healing Frequency

    // Fundamental + Harmonious Overtones
    const harmonics = [
      { freq: baseFreq, gain: 0.6 },
      { freq: baseFreq * 1.5, gain: 0.3 }, // Perfect Fifth
      { freq: baseFreq * 2.0, gain: 0.15 },
      { freq: baseFreq * 2.76, gain: 0.08 }
    ];

    harmonics.forEach(h => {
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(h.freq, ctx.currentTime);

      gainNode.gain.setValueAtTime(0, ctx.currentTime);
      // Soft strike attack
      gainNode.gain.linearRampToValueAtTime(h.gain, ctx.currentTime + 0.04);
      // Long serene exponential decay
      gainNode.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

      osc.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + duration);
    });
  } catch (e) {
    console.log('Audio playback unavailable:', e);
  }
}

// 6. Meditation Timer with Bell Sound & Haptic Feedback
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
      
      // ตีระฆัง 1 ครั้งตอนเริ่มนั่ง เพื่อรวมสติ
      playTibetanBell(false);

      timerInterval = setInterval(() => {
        if (remainingSeconds > 0) {
          remainingSeconds--;
          updateDisplay();
        } else {
          clearInterval(timerInterval);
          isRunning = false;
          btnToggle.innerText = '✨ ครบเวลาแล้ว (อนุโมทนา)';
          
          // ตีระฆังยาว 3 ครั้งอย่างนุ่มนวล เมื่อครบกำหนดเวลา
          playTibetanBell(true);
          setTimeout(() => playTibetanBell(true), 2500);
          setTimeout(() => playTibetanBell(true), 5000);

          // สั่นเตือนบนมือถือ
          if (navigator.vibrate) {
            navigator.vibrate([200, 100, 200, 100, 400]);
          }
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
      btnToggle.innerText = `เริ่มจับเวลา ${mins} นาที`;
    });
  });
}

// 7. Share Functions (Facebook, LINE, X, Web Share API, Copy Link)
function showToast(msg) {
  let toast = document.getElementById('share-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'share-toast';
    toast.className = 'toast-msg';
    document.body.appendChild(toast);
  }
  toast.innerHTML = `<span>✓</span> <span>${msg}</span>`;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 2500);
}

function copyCurrentUrl() {
  const currentUrl = window.location.href;
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(currentUrl).then(() => {
      showToast('คัดลอกลิงก์บทสวดแล้ว ส่งต่อบุญได้ทันที');
    }).catch(() => {
      fallbackCopyText(currentUrl);
    });
  } else {
    fallbackCopyText(currentUrl);
  }
}

function fallbackCopyText(text) {
  const input = document.createElement('input');
  input.value = text;
  document.body.appendChild(input);
  input.select();
  document.execCommand('copy');
  document.body.removeChild(input);
  showToast('คัดลอกลิงก์บทสวดแล้ว ส่งต่อบุญได้ทันที');
}

window.copyCurrentUrl = copyCurrentUrl;
window.showToast = showToast;

// 8. Back to Top Button
function initBackToTop() {
  let btn = document.getElementById('btn-back-to-top');
  if (!btn) {
    btn = document.createElement('button');
    btn.id = 'btn-back-to-top';
    btn.className = 'btn-back-to-top';
    btn.innerHTML = '↑';
    btn.setAttribute('aria-label', 'กลับสู่ด้านบน');
    btn.title = 'กลับสู่ด้านบน';
    document.body.appendChild(btn);
  }

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      btn.classList.add('show');
    } else {
      btn.classList.remove('show');
    }
  });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// 9. Sticky Search Enhancement on Scroll
function initStickySearch() {
  const searchContainer = document.querySelector('.search-container');
  if (!searchContainer) return;

  const stickyThreshold = searchContainer.offsetTop + 80;

  window.addEventListener('scroll', () => {
    if (window.scrollY > stickyThreshold) {
      searchContainer.classList.add('sticky-active');
    } else {
      searchContainer.classList.remove('sticky-active');
    }
  });
}

// 10. Favorites / Bookmark System (LocalStorage)
function initFavorites() {
  const FAV_KEY = 'thaipray_favorites';
  let favorites = JSON.parse(localStorage.getItem(FAV_KEY) || '[]');

  // Check if we are on a single prayer page
  const prayerBox = document.querySelector('.prayer-actions-bar');
  const currentPath = window.location.pathname;
  const isPrayerPage = currentPath.includes('/prayers/');

  if (isPrayerPage && prayerBox) {
    const filename = currentPath.split('/').pop();
    const favBtn = document.createElement('button');
    favBtn.className = 'btn-pill';
    favBtn.style.marginLeft = 'auto';
    favBtn.style.display = 'inline-flex';
    favBtn.style.alignItems = 'center';
    favBtn.style.gap = '0.4rem';
    favBtn.style.borderColor = 'var(--border-strong)';
    
    const isFav = favorites.includes(filename);
    updatePrayerPageFavBtn(favBtn, isFav);

    favBtn.addEventListener('click', () => {
      let currentFavs = JSON.parse(localStorage.getItem(FAV_KEY) || '[]');
      if (currentFavs.includes(filename)) {
        currentFavs = currentFavs.filter(f => f !== filename);
        showToast('ลบบทสวดนี้ออกจากรายการโปรดแล้ว');
        updatePrayerPageFavBtn(favBtn, false);
      } else {
        currentFavs.push(filename);
        showToast('❤️ บันทึกเข้า "บทสวดที่บันทึกไว้" แล้ว');
        updatePrayerPageFavBtn(favBtn, true);
      }
      localStorage.setItem(FAV_KEY, JSON.stringify(currentFavs));
    });

    prayerBox.appendChild(favBtn);
  }

  // Handle Favorites Tab on Homepage
  const tabContainer = document.querySelector('.category-tabs');
  if (tabContainer && !document.querySelector('.tab-btn[data-category="favorites"]')) {
    const favTab = document.createElement('button');
    favTab.className = 'btn-pill tab-btn';
    favTab.setAttribute('data-category', 'favorites');
    favTab.innerHTML = '❤️ ที่บันทึกไว้';
    tabContainer.appendChild(favTab);

    favTab.addEventListener('click', () => {
      document.querySelectorAll('.category-tabs .tab-btn').forEach(b => b.classList.remove('active'));
      favTab.classList.add('active');
      filterFavoritesOnly();
    });
  }

  function filterFavoritesOnly() {
    const prayerCards = document.querySelectorAll('.grid-cards .card');
    const saved = JSON.parse(localStorage.getItem(FAV_KEY) || '[]');
    let visibleCount = 0;

    prayerCards.forEach(card => {
      const href = card.getAttribute('href') || '';
      const filename = href.split('/').pop();
      if (saved.includes(filename)) {
        card.style.display = 'flex';
        visibleCount++;
      } else {
        card.style.display = 'none';
      }
    });

    let emptyMsg = document.getElementById('fav-empty-msg');
    if (visibleCount === 0) {
      if (!emptyMsg) {
        emptyMsg = document.createElement('div');
        emptyMsg.id = 'fav-empty-msg';
        emptyMsg.style.gridColumn = '1 / -1';
        emptyMsg.style.textAlign = 'center';
        emptyMsg.style.padding = '3rem 1rem';
        emptyMsg.style.color = 'var(--text-secondary)';
        emptyMsg.innerHTML = '<p style="font-size: 1.2rem; margin-bottom: 0.5rem;">ยังไม่มีบทสวดที่บันทึกไว้</p><p style="font-size: 0.9rem; color: var(--text-muted);">กดปุ่ม ❤️ ในหน้าบทสวดเพื่อบันทึกบทสวดที่คุณสวดเป็นประจำไว้ที่นี่ได้เลย</p>';
        const grid = document.querySelector('.grid-cards');
        if (grid) grid.appendChild(emptyMsg);
      } else {
        emptyMsg.style.display = 'block';
      }
    } else if (emptyMsg) {
      emptyMsg.style.display = 'none';
    }
  }

  // Also hook into other tab clicks to hide emptyMsg
  document.querySelectorAll('.category-tabs .tab-btn:not([data-category="favorites"])').forEach(btn => {
    btn.addEventListener('click', () => {
      const emptyMsg = document.getElementById('fav-empty-msg');
      if (emptyMsg) emptyMsg.style.display = 'none';
    });
  });
}

function updatePrayerPageFavBtn(btn, isFav) {
  if (isFav) {
    btn.innerHTML = '❤️ <span>บันทึกแล้ว</span>';
    btn.style.color = '#ef4444';
  } else {
    btn.innerHTML = '🤍 <span>บันทึกบทสวดนี้</span>';
    btn.style.color = 'var(--text-secondary)';
  }
}
