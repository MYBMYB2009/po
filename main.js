// 全局变量：特效配置
window.effectType = 'star';
window.effectCount = 30;
window.effectSize = 8;
window.effectSpeed = 5;
window.effectEnabled = true;

// 特效样式配置
window.EFFECT_CONFIG = {
  star: { symbol: '★', color: '#fff', speed: 5 },
  sakura: { symbol: '🌸', color: '#ffb6c1', speed: 4 },
  snow: { symbol: '❄️', color: '#e6f7ff', speed: 3 }, // 新增雪花
  firefly: { symbol: '✨', color: '#fff9c4', speed: 6, glow: true }, // 新增萤火虫
  petal: { symbol: '🍂', color: '#f4a460', speed: 4 } // 新增落叶
};

// 页面加载初始化
window.addEventListener('DOMContentLoaded', () => {
  // 随机背景视频
  const video = document.getElementById('bgVideo');
  const videos = ['1.mp4', '3.mp4', '1.mp4', '3.mp4', '1.mp4', 
                  '3.mp4', '1.mp4', '3.mp4', '1.mp4', '3.mp4'];
  video.src = videos[Math.floor(Math.random() * videos.length)];
  video.play().catch(err => console.warn('自动播放失败:', err));

  // 恢复按钮颜色设置
  const savedColor = localStorage.getItem('savedBtnColor');
  if (savedColor) {
    document.querySelectorAll('.main-btn, .sub-btn').forEach(btn => {
      btn.style.backgroundColor = savedColor;
    });
    document.getElementById('btnColorPicker').value = savedColor;
  }
});

// 关闭公告弹窗
function closeAnnouncement(announcementId) {
  const announcement = document.getElementById(announcementId);
  if (announcement) {
    announcement.style.display = 'none';
    document.querySelector('.main-buttons').style.display = 'grid';
  }
}

// 显示主页面
function showMainPage() {
  document.querySelector('.main-buttons').style.display = 'grid';
  document.getElementById('sub-page').style.display = 'none';
  localStorage.removeItem('isPasswordVerified');
}

// 密码验证相关
const correctPwd = "3990036468";
function showPasswordModal() {
  const isVerified = localStorage.getItem('isPasswordVerified') === 'true';
  if (isVerified) {
    document.getElementById('sub-page').style.display = 'block';
    document.querySelector('.main-buttons').style.display = 'none';
  } else {
    document.getElementById('passwordModal').style.display = 'flex';
  }
}

function checkPassword() {
  const inputPwd = document.getElementById('passwordInput').value;
  if (inputPwd === correctPwd) {
    localStorage.setItem('isPasswordVerified', 'true');
    document.getElementById('passwordModal').style.display = 'none';
    document.getElementById('sub-page').style.display = 'block';
    document.querySelector('.main-buttons').style.display = 'none';
  } else {
    alert('密码错误，请重试');
  }
}

function closePasswordModal() {
  document.getElementById('passwordModal').style.display = 'none';
}

// 设置面板开关
function toggleSettings() {
  const panel = document.getElementById('settingsPanel');
  panel.classList.toggle('active');
}

// 保存设置
function saveSettings() {
  alert('设置已保存');
}

// 切换背景视频
function changeVideo() {
  const video = document.getElementById('bgVideo');
  video.src = document.getElementById('videoSelect').value;
  video.play().catch(err => console.warn('视频播放失败:', err));
}

// 更改按钮颜色
function changeBtnColor() {
  const color = document.getElementById('btnColorPicker').value;
  document.querySelectorAll('.main-btn, .sub-btn').forEach(btn => {
    btn.style.backgroundColor = color;
  });
  localStorage.setItem('savedBtnColor', color);
}

// 创建特效元素
function createEffect() {
  const effect = document.createElement('div');
  effect.className = 'effect';
  const config = window.EFFECT_CONFIG[window.effectType];
  
  effect.innerHTML = config.symbol;
  effect.style.color = config.color;
  effect.style.fontSize = window.effectSize + 'px';
  effect.style.left = Math.random() * 100 + 'vw'; 
  effect.style.top = '-20px'; 
  effect.style.opacity = Math.random() * 0.5 + 0.5;

  document.getElementById('effect-container').appendChild(effect);

  // 特效下落动画
  const animate = setInterval(() => {
    if (!window.effectEnabled) {
      clearInterval(animate);
      effect.remove();
      return;
    }
    const top = parseInt(effect.style.top) || 0;
    effect.style.top = (top + config.speed) + 'px';

    if (top > window.innerHeight) {
      clearInterval(animate);
      effect.remove();
    }
  }, 50);
}

// 重置特效
function resetEffect() {
  const container = document.getElementById('effect-container');
  container.innerHTML = '';
  if (window.effectEnabled) {
    for (let i = 0; i < window.effectCount; i++) {
      createEffect();
    }
  }
}

// 特效数量调整（顶部控制）
function updateEffectCount(step) {
  const countEl = document.getElementById('effectCount');
  let count = parseInt(countEl.innerText);
  count = Math.max(0, Math.min(100, count + step));
  countEl.innerText = count;
  window.effectCount = count;
  resetEffect();
}

// 特效数量调整（底部控制）
function changeEffectCount(step) {
  window.effectCount = Math.max(0, window.effectCount + step);
  document.getElementById('effect-count').innerText = window.effectCount;
  resetEffect();
}

// 特效大小调整
function changeEffectSize(step) {
  window.effectSize = Math.max(1, window.effectSize + step);
  document.getElementById('effect-size').innerText = window.effectSize;
  document.querySelectorAll('.effect').forEach(el => {
    el.style.fontSize = window.effectSize + 'px';
  });
}

// 特效开关
function toggleEffectEnabled() {
  window.effectEnabled = !window.effectEnabled;
  document.getElementById('effect-switch-text').innerText = window.effectEnabled ? '开启' : '关闭';
  resetEffect();
}

// 切换特效类型
function setEffectType(type) {
  window.effectType = type;
  resetEffect();
}

// 重置设置
function resetSettings() {
  // 重置按钮颜色
  document.querySelectorAll('.main-btn, .sub-btn').forEach(btn => {
    btn.style.backgroundColor = '';
  });
  document.getElementById('btnColorPicker').value = '#4CAF50';
  localStorage.removeItem('savedBtnColor');

  // 重置特效
  window.effectType = 'star';
  window.effectCount = 30;
  window.effectSize = 8;
  window.effectEnabled = true;
  document.querySelector('select[onchange="setEffectType(this.value)"]').value = 'star';
  document.getElementById('effectCount').innerText = '30';
  document.getElementById('effect-count').innerText = '30';
  document.getElementById('effect-size').innerText = '8';
  document.getElementById('effect-switch-text').innerText = '开启';
  resetEffect();

  // 重置背景视频
  const videos = ['1.mp4', '3.mp4', '1.mp4', '3.mp4', '1.mp4', '3.mp4', '1.mp4', '3.mp4', '1.mp4', '3.mp4'];
  document.getElementById('bgVideo').src = videos[0];
  document.getElementById('videoSelect').value = videos[0];

  alert('已重置为默认设置');
}

// 鼠标拖尾效果（修正位置计算）
document.addEventListener('mousemove', (e) => {
  const trail = document.createElement('div');
  trail.className = 'trail';
  
  const shapes = ['★', '●', '○', '🌸', '✨'];
  trail.innerHTML = shapes[Math.floor(Math.random() * shapes.length)];
  
  const size = Math.random() * 15 + 5;
  trail.style.fontSize = size + 'px';
  trail.style.color = `hsl(${Math.random() * 360}, 80%, 60%)`;
  trail.style.left = e.clientX + 'px'; 
  trail.style.top = e.clientY + 'px';

  document.body.appendChild(trail);

  setTimeout(() => {
    trail.style.transition = 'opacity 0.5s, transform 0.5s';
    trail.style.opacity = '0';
    trail.style.transform = 'translate(-50%, -50%) scale(0.5)';
    setTimeout(() => trail.remove(), 500);
  }, 100);
});

// 点击爆炸特效（彻底修复版）
document.addEventListener('click', (e) => {
  const explosion = document.createElement('div');
  explosion.className = 'explosion';
  explosion.style.left = e.clientX + 'px';
  explosion.style.top = e.clientY + 'px';
  explosion.style.transform = 'translate(-50%, -50%)';
  explosion.style.pointerEvents = 'none';
  explosion.style.zIndex = 99999;

  for (let i = 0; i < 12; i++) {
    const fragment = document.createElement('span');
    fragment.innerHTML = '◆';
    const size = Math.random() * 10 + 5;
    fragment.style.fontSize = size + 'px';
    fragment.style.color = `hsl(${Math.random() * 360}, 100%, 60%)`;

    const angle = Math.random() * Math.PI * 2;
    const distance = Math.random() * 50 + 20;
    const x = Math.cos(angle) * distance;
    const y = Math.sin(angle) * distance;

    fragment.style.left = '0';
    fragment.style.top = '0';
    fragment.style.transform = 'translate(0, 0)';
    fragment.style.transition = 'all 0.5s cubic-bezier(0.68, -0.55, 0.27, 1.55)';

    explosion.appendChild(fragment);
    setTimeout(() => {
      fragment.style.transform = `translate(${x}px, ${y}px)`;
      fragment.style.opacity = '0';
    }, 10);
  }

  document.body.appendChild(explosion);
  setTimeout(() => explosion.remove(), 600);
});

// 启动特效循环
function startEffectLoop() {
  setInterval(() => {
    if (window.effectEnabled && document.querySelectorAll('.effect').length < window.effectCount) {
      createEffect();
    }
  }, 100);
}

// 页面加载完成后启动特效
window.onload = startEffectLoop;
// 页面加载后执行动画流程
window.addEventListener('load', () => {
  const patentBottom = document.getElementById('patentBottom');
  const patentBall = document.getElementById('patentBall');
  const patentContent = document.getElementById('patentContent');




  // 步骤①→②：滑出圆球
  setTimeout(() => {
    patentBottom.classList.add('active');
  }, 500);

  // 步骤②→③：展开长条
  setTimeout(() => {
    patentBottom.classList.add('expanded');
  }, 1000);

  // 点击事件：步骤④→⑦
  patentBall.addEventListener('click', () => {
    // 步骤④→⑤：开始回缩
    patentBottom.classList.add('closing');
    
    // 步骤⑤→⑥：完成回缩后，缩到底部外
    setTimeout(() => {
      patentBottom.classList.add('hidden');
    }, 500);
  });
});



// 你原有的其他 JS 代码...
// 比如可能有这些：
// window.onload = startEffectLoop; 
// 其他功能函数...

// 专利提示动画逻辑（新增，追加到尾部）
document.addEventListener('DOMContentLoaded', () => {
  const patentBottom = document.getElementById('patentBottom');
  const patentBall = document.getElementById('patentBall');

  if (!patentBottom || !patentBall) {
    console.warn('专利提示容器或圆球未找到，请检查 ID 拼写');
    return;
  }

  // 步骤①→②：500ms 后滑出圆球
  setTimeout(() => {
    patentBottom.classList.add('active');
  }, 500);

  // 步骤②→③：1000ms 后展开长条
  setTimeout(() => {
    patentBottom.classList.add('expanded');
  }, 1000);

  // 点击事件：步骤④→⑦
  patentBall.addEventListener('click', () => {
    patentBottom.classList.add('closing');
    
    setTimeout(() => {
      patentBottom.classList.add('hidden');
    }, 500);
  });
});

