// ==================== 全局状态 ====================
let currentCategory = 'all';
let currentSearch = '';
let currentRecipe = null;
let currentStepIndex = 0;
let completedSteps = new Set();
let timerInterval = null;
let timerSeconds = 0;
let timerPaused = false;
let timerTargetStep = null;
let completionSoundPlayed = false;

// ==================== 首页：渲染菜谱卡片 ====================
function renderRecipes() {
  const grid = document.getElementById('recipeGrid');
  const empty = document.getElementById('emptyState');
  const filtered = RECIPES.filter(r => {
    const matchCat = currentCategory === 'all' || r.category === currentCategory;
    const matchSearch = !currentSearch ||
      r.title.toLowerCase().includes(currentSearch.toLowerCase()) ||
      r.ingredients.some(i => i.name.toLowerCase().includes(currentSearch.toLowerCase()));
    return matchCat && matchSearch;
  });

  if (filtered.length === 0) {
    grid.innerHTML = '';
    empty.style.display = 'block';
  } else {
    empty.style.display = 'none';
    grid.innerHTML = filtered.map((r, i) => `
      <div class="recipe-card" style="animation-delay:${i * 60}ms" onclick="openRecipe(${r.id})">
        <div class="card-image">
          ${getRecipeSVG(r)}
          <span class="card-category-tag">${r.category}</span>
          <span class="card-time-tag">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
            </svg>
            ${r.time} 分钟
          </span>
        </div>
        <div class="card-body">
          <h3 class="card-title">${r.title}</h3>
          <p class="card-desc">${r.desc}</p>
          <div class="card-meta">
            <span class="card-meta-item">
              <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
              </svg>
              ${r.difficulty}
            </span>
            <span class="card-steps-count">${r.steps.length} 步</span>
          </div>
        </div>
      </div>
    `).join('');
  }

  document.getElementById('sectionCount').textContent = `共 ${filtered.length} 道菜`;
  const titleMap = { all: '全部菜谱', '家常菜': '家常菜', '快手菜': '快手菜', '汤羹': '汤羹', '甜品': '甜品', '早餐': '早餐' };
  document.getElementById('sectionTitle').textContent = titleMap[currentCategory] || '全部菜谱';
}

// ==================== 筛选与搜索 ====================
function filterCategory(cat) {
  currentCategory = cat;
  document.querySelectorAll('.chip').forEach(c => {
    c.classList.toggle('active', c.textContent.trim() === catNameMap(cat));
  });
  document.querySelectorAll('.nav-link').forEach(l => {
    l.classList.toggle('active', l.getAttribute('onclick')?.includes(`'${cat}'`));
  });
  renderRecipes();
}

function catNameMap(cat) {
  const m = { all: '全部', '家常菜': '家常菜', '快手菜': '快手菜', '汤羹': '汤羹', '甜品': '甜品', '早餐': '早餐' };
  return m[cat] || '全部';
}

function handleSearch(val) {
  currentSearch = val.trim();
  renderRecipes();
}

// ==================== 打开菜谱详情 ====================
function openRecipe(id) {
  currentRecipe = RECIPES.find(r => r.id === id);
  if (!currentRecipe) return;

  currentStepIndex = 0;
  completedSteps.clear();
  completionSoundPlayed = false;

  // 切换视图
  document.getElementById('homeView').style.display = 'none';
  document.getElementById('detailView').style.display = 'block';

  // 填充头部信息
  const heroImage = document.getElementById('detailHeroImage');
  heroImage.innerHTML = getRecipeSVG(currentRecipe) + '<div class="detail-hero-overlay"></div>';
  document.getElementById('detailCategory').textContent = currentRecipe.category;
  document.getElementById('detailTitle').textContent = currentRecipe.title;
  document.getElementById('detailDesc').textContent = currentRecipe.desc;
  document.getElementById('detailTime').textContent = `${currentRecipe.time} 分钟`;
  document.getElementById('detailDifficulty').textContent = currentRecipe.difficulty;
  document.getElementById('detailServings').textContent = currentRecipe.servings;

  // 填充食材
  document.getElementById('ingredientsGrid').innerHTML = currentRecipe.ingredients.map(ing => `
    <div class="ingredient-item">
      <span class="ingredient-dot"></span>
      <span class="ingredient-name">${ing.name}</span>
      <span class="ingredient-amount">${ing.amount}</span>
    </div>
  `).join('');

  // 渲染步骤
  renderSteps();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ==================== 渲染步骤 ====================
function renderSteps(shouldScroll = true) {
  const timeline = document.getElementById('stepsTimeline');
  const dots = document.getElementById('stepDots');

  timeline.innerHTML = currentRecipe.steps.map((step, i) => {
    const isCurrent = i === currentStepIndex;
    const isDone = completedSteps.has(i);
    return `
      <div class="step-card ${isCurrent ? 'current' : ''} ${isDone ? 'done' : ''}" id="step-${i}">
        <div class="step-number">${isDone ? '\u2713' : i + 1}</div>
        <div class="step-content">
          <h3 class="step-title">${step.title}</h3>
          <p class="step-desc">${step.desc}</p>
          ${step.tip ? `<div class="step-tip">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" style="flex-shrink:0;margin-top:2px;">
              <path d="M9 21h6M12 17v4M12 3a6 6 0 016 6c0 3-3 4-3 7H9c0-3-3-4-3-7a6 6 0 016-6z"/>
            </svg>
            <span>${step.tip}</span>
          </div>` : ''}
          <div class="step-actions">
            ${step.timer ? `<button class="step-timer-btn" onclick="startTimer(${step.timer}, ${i})">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="13" r="8"/><path d="M12 9v4l2 2M9 2h6"/>
              </svg>
              ${formatTimerLabel(step.timer)}
            </button>` : ''}
            <button class="step-done-btn ${isDone ? 'checked' : ''}" onclick="toggleStepDone(${i})">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              ${isDone ? '已完成' : '标记完成'}
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');

  // 渲染步骤圆点
  dots.innerHTML = currentRecipe.steps.map((_, i) => `
    <span class="step-dot ${i === currentStepIndex ? 'current' : ''} ${completedSteps.has(i) ? 'done' : ''}"
          onclick="jumpToStep(${i})"></span>
  `).join('');

  // 更新进度条
  const total = currentRecipe.steps.length;
  const done = completedSteps.size;
  document.getElementById('progressFill').style.width = `${(done / total) * 100}%`;
  document.getElementById('progressText').textContent = `${done} / ${total}`;

  // 更新导航按钮
  document.getElementById('prevBtn').disabled = currentStepIndex === 0;
  const nextBtn = document.getElementById('nextBtn');
  if (currentStepIndex === total - 1) {
    nextBtn.innerHTML = '完成烹饪';
  } else {
    nextBtn.innerHTML = `下一步<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>`;
  }

  // 检查是否全部完成
  const banner = document.getElementById('completionBanner');
  const allDone = done === total;
  banner.style.display = allDone ? 'flex' : 'none';
  if (allDone && !completionSoundPlayed) {
    completionSoundPlayed = true;
    playCompletionSound();
  }

  // 滚动到当前步骤（仅在手动跳转或打开菜谱时）
  if (shouldScroll) {
    const currentEl = document.getElementById(`step-${currentStepIndex}`);
    if (currentEl) {
      currentEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }
}

// ==================== 步骤导航 ====================
function navigateStep(dir) {
  const total = currentRecipe.steps.length;
  if (dir === 1) {
    if (currentStepIndex < total - 1) {
      if (!completedSteps.has(currentStepIndex)) {
        completedSteps.add(currentStepIndex);
        playStepDoneSound();
      }
      currentStepIndex++;
    } else {
      // 最后一步点完成
      if (!completedSteps.has(currentStepIndex)) {
        completedSteps.add(currentStepIndex);
        playStepDoneSound();
      }
      renderSteps(false);
      // 延时 1.5 秒后自动跳回首页
      setTimeout(() => {
        goHome();
      }, 1500);
      return;
    }
  } else {
    if (currentStepIndex > 0) currentStepIndex--;
  }
  renderSteps(false);
}

function jumpToStep(i) {
  currentStepIndex = i;
  renderSteps();
}

function toggleStepDone(i) {
  if (completedSteps.has(i)) {
    completedSteps.delete(i);
  } else {
    completedSteps.add(i);
    playStepDoneSound();
  }
  renderSteps(false);
}

// ==================== 计时器 ====================
function startTimer(seconds, stepIndex) {
  stopTimer();
  timerTargetStep = stepIndex;
  timerSeconds = seconds;
  timerPaused = false;

  const widget = document.getElementById('timerWidget');
  widget.style.display = 'block';
  document.getElementById('timerToggle').textContent = '暂停';
  document.getElementById('timerLabel').textContent = '倒计时中';

  playTimerStartSound();
  updateTimerDisplay();
  timerInterval = setInterval(() => {
    if (!timerPaused) {
      timerSeconds--;
      updateTimerDisplay();
      if (timerSeconds <= 0) {
        clearInterval(timerInterval);
        document.getElementById('timerLabel').textContent = '时间到！';
        document.getElementById('timerToggle').textContent = '关闭';
        playTimerEndSound();
      }
    }
  }, 1000);
}

function updateTimerDisplay() {
  const m = Math.floor(timerSeconds / 60);
  const s = timerSeconds % 60;
  document.getElementById('timerDisplay').textContent =
    `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

function toggleTimer() {
  if (timerSeconds <= 0) {
    stopTimer();
    return;
  }
  timerPaused = !timerPaused;
  document.getElementById('timerToggle').textContent = timerPaused ? '继续' : '暂停';
  document.getElementById('timerLabel').textContent = timerPaused ? '已暂停' : '倒计时中';
}

function stopTimer() {
  if (timerInterval) clearInterval(timerInterval);
  timerInterval = null;
  document.getElementById('timerWidget').style.display = 'none';
  timerSeconds = 0;
  timerPaused = false;
}

function playTimerStartSound() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = 'sine';
    osc.frequency.setValueAtTime(659, ctx.currentTime);
    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
    osc.start();
    osc.stop(ctx.currentTime + 0.2);
  } catch(e) {}
}

function playTimerEndSound() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const now = ctx.currentTime;
    // 三声渐强和弦提示
    [523, 659, 784].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'sine';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0, now + i * 0.15);
      gain.gain.linearRampToValueAtTime(0.2, now + i * 0.15 + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.15 + 0.4);
      osc.start(now + i * 0.15);
      osc.stop(now + i * 0.15 + 0.4);
    });
  } catch(e) {}
}

function playStepDoneSound() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const now = ctx.currentTime;

    // 清脆的双音提示
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = 'sine';
    osc.frequency.setValueAtTime(784, now);
    osc.frequency.setValueAtTime(1047, now + 0.08);
    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
    osc.start(now);
    osc.stop(now + 0.25);
  } catch(e) {}
}

function playCompletionSound() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const now = ctx.currentTime;

    // 上行琶音
    [523, 659, 784, 1047].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'sine';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0, now + i * 0.12);
      gain.gain.linearRampToValueAtTime(0.18, now + i * 0.12 + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.12 + 0.35);
      osc.start(now + i * 0.12);
      osc.stop(now + i * 0.12 + 0.35);
    });

    // 最终和弦
    [523, 659, 784, 1047].forEach((freq) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'triangle';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0, now + 0.55);
      gain.gain.linearRampToValueAtTime(0.12, now + 0.6);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 1.4);
      osc.start(now + 0.55);
      osc.stop(now + 1.4);
    });
  } catch(e) {}
}

// ==================== 辅助函数 ====================
function formatTimerLabel(seconds) {
  if (seconds >= 3600) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    return `计时 ${h}小时${m}分`;
  }
  if (seconds >= 60) {
    const m = Math.floor(seconds / 60);
    return `计时 ${m} 分钟`;
  }
  return `计时 ${seconds} 秒`;
}

function goHome() {
  document.getElementById('detailView').style.display = 'none';
  document.getElementById('homeView').style.display = 'block';
  stopTimer();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ==================== 导航栏滚动效果 ====================
window.addEventListener('scroll', () => {
  document.getElementById('navbar').classList.toggle('scrolled', window.scrollY > 10);
});

// ==================== 键盘快捷键 ====================
document.addEventListener('keydown', (e) => {
  if (document.getElementById('detailView').style.display === 'none') return;
  if (e.key === 'ArrowLeft') navigateStep(-1);
  if (e.key === 'ArrowRight') navigateStep(1);
  if (e.key === 'Escape') goHome();
});

// ==================== 初始化 ====================
document.getElementById('recipeCount').textContent = RECIPES.length;
renderRecipes();
