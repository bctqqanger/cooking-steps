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
let currentTab = 'home'; // 当前底部导航标签

// ==================== localStorage 数据管理 ====================
const LS_KEYS = {
  favorites: 'cooking_favorites',
  comments: 'cooking_comments',
  cooked: 'cooking_cooked',
  nickname: 'cooking_nickname',
  photos: 'cooking_photos'
};

function lsGet(key) {
  try { return JSON.parse(localStorage.getItem(key)) || {}; } catch(e) { return {}; }
}
function lsSet(key, val) {
  localStorage.setItem(key, JSON.stringify(val));
}

function isFavorited(id) { return !!lsGet(LS_KEYS.favorites)[id]; }
function toggleFavorite(id) {
  const favs = lsGet(LS_KEYS.favorites);
  if (favs[id]) delete favs[id]; else favs[id] = true;
  lsSet(LS_KEYS.favorites, favs);
  renderRecipes();
  renderFavorites();
  updateTopbarFav();
  updateProfileStats();
}

// ==================== 我的作品（照片）====================
function getPhotos(id) {
  return lsGet(LS_KEYS.photos)[id] || [];
}

function handlePhotoUpload(event) {
  if (!currentRecipe) return;
  const files = event.target.files;
  if (!files.length) return;

  const all = lsGet(LS_KEYS.photos);
  if (!all[currentRecipe.id]) all[currentRecipe.id] = [];

  let processed = 0;
  const maxPhotos = 9;
  const remaining = maxPhotos - all[currentRecipe.id].length;
  const filesToProcess = Array.from(files).slice(0, remaining);

  if (filesToProcess.length === 0) {
    alert('最多只能上传 9 张照片');
    event.target.value = '';
    return;
  }

  filesToProcess.forEach(file => {
    compressImage(file, (base64) => {
      all[currentRecipe.id].push({ data: base64, time: Date.now() });
      processed++;
      if (processed === filesToProcess.length) {
        lsSet(LS_KEYS.photos, all);
        renderPhotos();
      }
    });
  });

  event.target.value = '';
}

function compressImage(file, callback) {
  const reader = new FileReader();
  reader.onload = function(e) {
    const img = new Image();
    img.onload = function() {
      const canvas = document.createElement('canvas');
      const maxSize = 800;
      let width = img.width;
      let height = img.height;

      if (width > maxSize || height > maxSize) {
        if (width > height) {
          height = Math.round(height * maxSize / width);
          width = maxSize;
        } else {
          width = Math.round(width * maxSize / height);
          height = maxSize;
        }
      }

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);
      callback(canvas.toDataURL('image/jpeg', 0.7));
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
}

function deletePhoto(index) {
  if (!currentRecipe) return;
  const all = lsGet(LS_KEYS.photos);
  if (!all[currentRecipe.id]) return;
  all[currentRecipe.id].splice(index, 1);
  if (all[currentRecipe.id].length === 0) delete all[currentRecipe.id];
  lsSet(LS_KEYS.photos, all);
  renderPhotos();
}

function renderPhotos() {
  if (!currentRecipe) return;
  const container = document.getElementById('photoGallery');
  if (!container) return;
  const photos = getPhotos(currentRecipe.id);

  if (photos.length === 0) {
    container.innerHTML = `
      <div class="photos-empty">
        <svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="#D9A48A" stroke-width="1.5">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
          <circle cx="8.5" cy="8.5" r="1.5"/>
          <polyline points="21 15 16 10 5 21"/>
        </svg>
        <p>还没有作品照片</p>
        <span>做完这道菜后，拍张照记录一下吧</span>
      </div>
    `;
  } else {
    container.innerHTML = `
      <div class="photo-grid">
        ${photos.map((p, i) => `
          <div class="photo-item">
            <img src="${p.data}" alt="作品照片 ${i + 1}" onclick="openLightbox(this.src)">
            <button class="photo-delete" onclick="event.stopPropagation();deletePhoto(${i})" title="删除">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
            <span class="photo-time">${formatTime(p.time)}</span>
          </div>
        `).join('')}
      </div>
    `;
  }
}

function openLightbox(src) {
  const lightbox = document.getElementById('photoLightbox');
  const img = document.getElementById('lightboxImg');
  img.src = src;
  lightbox.style.display = 'flex';
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  const lightbox = document.getElementById('photoLightbox');
  lightbox.style.display = 'none';
  document.body.style.overflow = '';
}

// ==================== 页面切换 ====================
function switchTab(tab) {
  currentTab = tab;
  
  // 隐藏所有页面
  document.querySelectorAll('.page').forEach(p => {
    p.classList.remove('active');
    p.style.display = 'none';
  });
  
  // 显示目标页面
  const pageMap = {
    home: 'homePage',
    category: 'categoryPage',
    favorites: 'favoritesPage',
    profile: 'profilePage'
  };
  
  const targetPage = document.getElementById(pageMap[tab]);
  if (targetPage) {
    targetPage.style.display = 'block';
    targetPage.classList.add('active');
  }
  
  // 更新底部导航状态
  document.querySelectorAll('.nav-item').forEach(item => {
    item.classList.toggle('active', item.dataset.tab === tab);
  });
  
  // 隐藏详情页，恢复底部导航
  document.getElementById('detailPage').style.display = 'none';
  document.getElementById('bottomNav').style.display = '';
  
  // 停止计时器
  stopTimer();
  
  // 渲染对应页面数据
  if (tab === 'home') renderRecipes();
  if (tab === 'category') renderCategoryGrid();
  if (tab === 'favorites') renderFavorites();
  if (tab === 'profile') updateProfileStats();
  
  // 滚动到顶部
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ==================== 分类页渲染 ====================
function renderCategoryGrid() {
  const grid = document.getElementById('categoryGrid');
  if (!grid) return;
  
  const categories = [
    { name: '家常菜', icon: '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>' },
    { name: '快手菜', icon: '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>' },
    { name: '汤羹', icon: '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/></svg>' },
    { name: '甜品', icon: '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8h1a4 4 0 0 1 0 8h-1M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/></svg>' },
    { name: '早餐', icon: '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>' }
  ];
  
  grid.innerHTML = categories.map(cat => {
    const count = RECIPES.filter(r => r.category === cat.name).length;
    return `
      <button class="category-card" onclick="goToCategory('${cat.name}')">
        <div class="category-card-icon">${cat.icon}</div>
        <div class="category-card-name">${cat.name}</div>
        <div class="category-card-count">${count} 道菜</div>
      </button>
    `;
  }).join('');
}

function goToCategory(cat) {
  currentCategory = cat;
  switchTab('home');
  updateCategoryPills();
  renderRecipes();
}

// ==================== 收藏页渲染 ====================
function renderFavorites() {
  const list = document.getElementById('favoritesList');
  const empty = document.getElementById('favoritesEmpty');
  if (!list || !empty) return;
  
  const favorites = RECIPES.filter(r => isFavorited(r.id));
  
  if (favorites.length === 0) {
    list.innerHTML = '';
    empty.style.display = 'block';
  } else {
    empty.style.display = 'none';
    list.innerHTML = favorites.map((r, i) => renderRecipeCard(r, i)).join('');
  }
}

// ==================== 我的页面统计 ====================
function updateProfileStats() {
  const favCount = document.getElementById('myFavorites');
  const noteCount = document.getElementById('myNotes');
  const cookedCount = document.getElementById('myCooked');
  const nicknameEl = document.getElementById('profileNickname');
  if (!favCount || !noteCount) return;
  
  const favs = lsGet(LS_KEYS.favorites);
  favCount.textContent = Object.keys(favs).length;
  
  const comments = lsGet(LS_KEYS.comments);
  const totalNotes = Object.values(comments).reduce((sum, arr) => sum + arr.length, 0);
  noteCount.textContent = totalNotes;
  
  // 做过的菜数量
  const cooked = lsGet(LS_KEYS.cooked);
  if (cookedCount) cookedCount.textContent = Object.keys(cooked).length;
  
  // 昵称
  const nickname = localStorage.getItem(LS_KEYS.nickname);
  if (nicknameEl) {
    nicknameEl.textContent = nickname || '点击设置昵称';
  }
  
  // 渲染做过的菜列表
  renderCookedList();
}

// ==================== 做过的菜 ====================
function markAsCooked(id) {
  const cooked = lsGet(LS_KEYS.cooked);
  if (!cooked[id]) {
    cooked[id] = { time: Date.now() };
    lsSet(LS_KEYS.cooked, cooked);
  }
}

function renderCookedList() {
  const list = document.getElementById('cookedList');
  const empty = document.getElementById('cookedEmpty');
  if (!list || !empty) return;
  
  const cooked = lsGet(LS_KEYS.cooked);
  const cookedRecipes = Object.keys(cooked).map(id => {
    const recipe = RECIPES.find(r => r.id === parseInt(id));
    if (recipe) {
      return { ...recipe, cookedTime: cooked[id].time };
    }
    return null;
  }).filter(Boolean).sort((a, b) => b.cookedTime - a.cookedTime);
  
  if (cookedRecipes.length === 0) {
    list.style.display = 'none';
    empty.style.display = 'block';
  } else {
    list.style.display = 'grid';
    empty.style.display = 'none';
    list.innerHTML = cookedRecipes.map(r => `
      <div class="cooked-item" onclick="openRecipe(${r.id})">
        <div class="cooked-item-image">
          ${getRecipeSVG(r)}
        </div>
        <div class="cooked-item-info">
          <div class="cooked-item-title">${r.title}</div>
          <div class="cooked-item-time">${formatCookedTime(r.cookedTime)}</div>
        </div>
      </div>
    `).join('');
  }
}

function formatCookedTime(ts) {
  const d = new Date(ts);
  const now = new Date();
  const diff = Math.floor((now - d) / 1000 / 60); // 分钟
  if (diff < 60) return '刚刚';
  if (diff < 1440) return `${Math.floor(diff / 60)} 小时前`;
  return `${d.getMonth() + 1}月${d.getDate()}日`;
}

// ==================== 昵称 ====================
function changeNickname() {
  const current = localStorage.getItem(LS_KEYS.nickname) || '';
  const nickname = prompt('请输入你的昵称：', current);
  if (nickname !== null && nickname.trim()) {
    localStorage.setItem(LS_KEYS.nickname, nickname.trim());
    updateProfileStats();
  }
}

// ==================== 首页：渲染菜谱列表 ====================
function renderRecipes() {
  const list = document.getElementById('recipeList');
  const empty = document.getElementById('emptyState');
  const isFavFilter = currentCategory === 'favorites';
  const filtered = RECIPES.filter(r => {
    const matchCat = isFavFilter ? isFavorited(r.id) : (currentCategory === 'all' || r.category === currentCategory);
    const matchSearch = !currentSearch ||
      r.title.toLowerCase().includes(currentSearch.toLowerCase()) ||
      r.ingredients.some(i => i.name.toLowerCase().includes(currentSearch.toLowerCase()));
    return matchCat && matchSearch;
  });

  if (filtered.length === 0) {
    list.innerHTML = '';
    empty.style.display = 'block';
  } else {
    empty.style.display = 'none';
    list.innerHTML = filtered.map((r, i) => renderRecipeCard(r, i)).join('');
  }

  document.getElementById('sectionCount').textContent = `${filtered.length} 道`;
  const titleMap = { all: '全部菜谱', '家常菜': '家常菜', '快手菜': '快手菜', '汤羹': '汤羹', '甜品': '甜品', '早餐': '早餐', favorites: '我的收藏' };
  document.getElementById('sectionTitle').textContent = titleMap[currentCategory] || '全部菜谱';
}

function renderRecipeCard(r, i) {
  return `
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
        <div class="card-actions-row">
          <div class="card-meta">
            <span class="card-meta-item">
              <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
              </svg>
              ${r.difficulty}
            </span>
            <span class="card-steps-count">${r.steps.length} 步</span>
          </div>
          <div class="card-quick-actions">
            <button class="card-action-btn fav-btn ${isFavorited(r.id) ? 'active' : ''}" onclick="event.stopPropagation();toggleFavorite(${r.id})" title="${isFavorited(r.id) ? '取消收藏' : '收藏'}">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="${isFavorited(r.id) ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
}

// ==================== 筛选与搜索 ====================
function filterCategory(cat) {
  currentCategory = cat;
  updateCategoryPills();
  renderRecipes();
}

function updateCategoryPills() {
  document.querySelectorAll('.category-pill').forEach(pill => {
    pill.classList.toggle('active', pill.dataset.cat === currentCategory);
  });
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

  // 隐藏所有页面
  document.querySelectorAll('.page').forEach(p => {
    p.classList.remove('active');
    p.style.display = 'none';
  });
  
  // 显示详情页
  const detailPage = document.getElementById('detailPage');
  detailPage.style.display = 'block';
  detailPage.classList.add('active');
  
  // 隐藏底部导航
  document.getElementById('bottomNav').style.display = 'none';

  // 填充头部信息
  const heroImage = document.getElementById('detailHeroImage');
  heroImage.innerHTML = getRecipeSVG(currentRecipe) + '<div class="detail-hero-overlay"></div>';
  document.getElementById('detailCategory').textContent = currentRecipe.category;
  document.getElementById('detailTitle').textContent = currentRecipe.title;
  document.getElementById('detailDesc').textContent = currentRecipe.desc;
  document.getElementById('detailTime').textContent = `${currentRecipe.time} 分钟`;
  document.getElementById('detailDifficulty').textContent = currentRecipe.difficulty;
  document.getElementById('detailServings').textContent = currentRecipe.servings;
  document.getElementById('topbarTitle').textContent = currentRecipe.title;

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
  updateTopbarFav();
  renderNotes();
  renderPhotos();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function updateTopbarFav() {
  if (!currentRecipe) return;
  const btn = document.getElementById('topbarFav');
  if (!btn) return;
  const isActive = isFavorited(currentRecipe.id);
  btn.classList.toggle('active', isActive);
  const svg = btn.querySelector('svg');
  if (svg) {
    svg.setAttribute('fill', isActive ? 'currentColor' : 'none');
  }
}

// ==================== 渲染步骤 ====================
function renderSteps(shouldScroll = true) {
  const timeline = document.getElementById('stepsScroll');
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
    nextBtn.innerHTML = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>';
  } else {
    nextBtn.innerHTML = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>';
  }

  // 检查是否全部完成
  const banner = document.getElementById('completionBanner');
  const allDone = done === total;
  banner.style.display = allDone ? 'flex' : 'none';
  if (allDone && !completionSoundPlayed) {
    completionSoundPlayed = true;
    playCompletionSound();
  }

  // 滚动到当前步骤
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
      // 记录做过的菜
      markAsCooked(currentRecipe.id);
      // 延时 1.5 秒后自动跳回首页
      setTimeout(() => {
        switchTab(currentTab);
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

// ==================== 做菜笔记 ====================
function getComments(id) {
  return lsGet(LS_KEYS.comments)[id] || [];
}

function addNote() {
  if (!currentRecipe) return;
  const input = document.getElementById('noteInput');
  const text = input.value.trim();
  if (!text) return;

  const all = lsGet(LS_KEYS.comments);
  if (!all[currentRecipe.id]) all[currentRecipe.id] = [];
  all[currentRecipe.id].unshift({ text, time: Date.now() });
  lsSet(LS_KEYS.comments, all);

  input.value = '';
  renderNotes();
  updateProfileStats();
}

function deleteNote(index) {
  if (!currentRecipe) return;
  const all = lsGet(LS_KEYS.comments);
  if (!all[currentRecipe.id]) return;
  all[currentRecipe.id].splice(index, 1);
  if (all[currentRecipe.id].length === 0) delete all[currentRecipe.id];
  lsSet(LS_KEYS.comments, all);
  renderNotes();
  updateProfileStats();
}

function formatTime(ts) {
  const d = new Date(ts);
  const now = new Date();
  const diff = Math.floor((now - d) / 1000);
  if (diff < 60) return '刚刚';
  if (diff < 3600) return `${Math.floor(diff / 60)} 分钟前`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} 小时前`;
  return `${d.getMonth() + 1}月${d.getDate()}日 ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

function renderNotes() {
  if (!currentRecipe) return;
  const container = document.getElementById('notesList');
  if (!container) return;
  const notes = getComments(currentRecipe.id);

  if (notes.length === 0) {
    container.innerHTML = `
      <div class="notes-empty">
        <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="#D9A48A" stroke-width="1.5">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14 2 14 8 20 8"/>
          <line x1="16" y1="13" x2="8" y2="13"/>
          <line x1="16" y1="17" x2="8" y2="17"/>
        </svg>
        <p>还没有笔记</p>
        <span>做完这道菜后，记录下你的心得吧</span>
      </div>
    `;
  } else {
    container.innerHTML = notes.map((n, i) => `
      <div class="note-item">
        <div class="note-content">${escapeHtml(n.text)}</div>
        <div class="note-meta">
          <span class="note-time">${formatTime(n.time)}</span>
          <button class="note-delete" onclick="deleteNote(${i})">删除</button>
        </div>
      </div>
    `).join('');
  }
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// ==================== 键盘快捷键 ====================
document.addEventListener('keydown', (e) => {
  // ESC 优先关闭灯箱
  if (e.key === 'Escape') {
    const lightbox = document.getElementById('photoLightbox');
    if (lightbox && lightbox.style.display !== 'none') {
      closeLightbox();
      return;
    }
  }
  if (document.getElementById('detailPage').style.display === 'none') return;
  if (e.key === 'ArrowLeft') navigateStep(-1);
  if (e.key === 'ArrowRight') navigateStep(1);
  if (e.key === 'Escape') switchTab(currentTab);
});

// ==================== 初始化 ====================
document.addEventListener('DOMContentLoaded', () => {
  // 初始化首页
  switchTab('home');
});
