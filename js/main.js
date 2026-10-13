/* Browser-local enhancements. The page remains readable without JavaScript. */
(() => {
  'use strict';
  const root = document.documentElement;
  const storage = {
    get(key) { try { return localStorage.getItem(key); } catch { return null; } },
    set(key, value) { try { localStorage.setItem(key, value); } catch { /* Theme still works in this tab. */ } }
  };
  const themeButton = document.getElementById('theme-toggle');
  const themeLabel = document.getElementById('theme-label');
  function setTheme(theme) {
    const dark = theme === 'dark';
    root.dataset.theme = dark ? 'dark' : 'light';
    themeButton.setAttribute('aria-pressed', String(dark));
    themeButton.setAttribute('aria-label', dark ? '切换到浅色主题' : '切换到深色主题');
    themeLabel.textContent = dark ? '浅色' : '暗色';
  }
  setTheme(storage.get('theme') === 'dark' ? 'dark' : 'light');
  themeButton.addEventListener('click', () => {
    const theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
    setTheme(theme);
    storage.set('theme', theme);
  });
  const year = new Date().getFullYear();
  document.getElementById('currentYear').textContent = year;
  document.getElementById('hero-year').textContent = year;

  const menu = document.querySelector('.navbar');
  const burger = document.querySelector('.burger');
  function setMenu(open, returnFocus = false) {
    menu.classList.toggle('active', open);
    burger.classList.toggle('active', open);
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? '关闭导航菜单' : '打开导航菜单');
    if (returnFocus) burger.focus();
  }
  burger.addEventListener('click', () => setMenu(burger.getAttribute('aria-expanded') !== 'true'));
  menu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && burger.getAttribute('aria-expanded') === 'true') setMenu(false, true);
  });
  document.addEventListener('click', event => {
    if (!event.target.closest('.header') && burger.getAttribute('aria-expanded') === 'true') setMenu(false);
  });
  matchMedia('(min-width:761px)').addEventListener('change', event => { if (event.matches) setMenu(false); });

  const status = document.getElementById('copy-status');
  let statusTimer;
  function showStatus(message) {
    clearTimeout(statusTimer);
    status.textContent = message;
    status.classList.add('visible');
    statusTimer = setTimeout(() => status.classList.remove('visible'), 3500);
  }
  document.querySelectorAll('[data-copy]').forEach(button => {
    button.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(button.dataset.copy);
        showStatus(button.dataset.copy.includes('@') ? '邮箱已复制。期待你的消息。' : '微信号已复制。');
      } catch {
        showStatus('复制未完成，请直接选中页面上的邮箱或微信号。');
      }
    });
  });

  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const terminalGrid = document.querySelector('.terminal-grid');
  let terminalInView = true;
  function syncTerminalMotion() {
    terminalGrid.style.setProperty('--terminal-play-state', terminalInView && !document.hidden && !reducedMotion.matches ? 'running' : 'paused');
  }
  if ('IntersectionObserver' in window) {
    const terminalObserver = new IntersectionObserver(entries => {
      terminalInView = entries[0].isIntersecting;
      syncTerminalMotion();
    });
    terminalObserver.observe(terminalGrid);
  }
  document.addEventListener('visibilitychange', syncTerminalMotion);
  reducedMotion.addEventListener('change', syncTerminalMotion);
  const introParts = document.querySelectorAll('.hero-eyebrow,.hero-greeting,.hero-subtitle,.hero-tagline,.hero-actions,.hero-social,.visual-meta,.visual-footer,.hero-bottom');
  introParts.forEach((element, index) => element.style.setProperty('--intro-delay', `${Math.min(index * 55, 330)}ms`));
  if (!reducedMotion.matches) {
    root.classList.add('intro-pending');
    const portrait = document.getElementById('portrait-avatar');
    const ready = Promise.allSettled([document.fonts.ready, portrait.decode()]);
    Promise.race([ready, new Promise(resolve => setTimeout(resolve, 350))]).then(() => {
      root.classList.remove('intro-pending');
      if (!reducedMotion.matches) {
        root.classList.add('motion-ready');
      }
    });
  }
  document.querySelectorAll('.section-heading,.contact-main,.contact-links').forEach(element => element.classList.add('scroll-reveal'));
  document.querySelectorAll('.bento-grid,.project-list,.timeline-track').forEach(group => {
    group.querySelectorAll(':scope > .scroll-reveal').forEach((element, index) => {
      element.style.setProperty('--reveal-delay', `${Math.min(index * 65, 130)}ms`);
    });
  });
  document.querySelectorAll('.voice-wave > i').forEach((bar, index) => {
    bar.style.setProperty('--wave-delay', `${-index * 85}ms`);
  });
  let progressFrame = 0;
  function updateProgress() {
    progressFrame = 0;
    if (reducedMotion.matches) return;
    const distance = document.documentElement.scrollHeight - innerHeight;
    root.style.setProperty('--read-progress', distance > 0 ? Math.min(1, Math.max(0, scrollY / distance)) : 0);
  }
  function queueProgress() {
    if (!progressFrame && !reducedMotion.matches) progressFrame = requestAnimationFrame(updateProgress);
  }
  window.addEventListener('scroll', queueProgress, { passive: true });
  window.addEventListener('resize', queueProgress, { passive: true });
  queueProgress();
  const pointerMotion = matchMedia('(min-width:761px) and (hover:hover) and (pointer:fine)');
  const visual = document.querySelector('.hero-visual');
  const stage = document.querySelector('.portrait-stage');
  let pointerFrame = 0;
  let pointerX = 0;
  let pointerY = 0;
  function resetPortrait() {
    cancelAnimationFrame(pointerFrame);
    pointerFrame = 0;
    stage.style.removeProperty('--portrait-x');
    stage.style.removeProperty('--portrait-y');
  }
  visual.addEventListener('pointermove', event => {
    if (reducedMotion.matches || !pointerMotion.matches || event.pointerType !== 'mouse') return;
    pointerX = event.clientX;
    pointerY = event.clientY;
    if (pointerFrame) return;
    pointerFrame = requestAnimationFrame(() => {
      pointerFrame = 0;
      const bounds = visual.getBoundingClientRect();
      const x = Math.max(-1, Math.min(1, (pointerX - bounds.left) / bounds.width * 2 - 1));
      const y = Math.max(-1, Math.min(1, (pointerY - bounds.top) / bounds.height * 2 - 1));
      stage.style.setProperty('--portrait-x', `${x * 4}px`);
      stage.style.setProperty('--portrait-y', `${y * 4}px`);
    });
  }, { passive: true });
  visual.addEventListener('pointerleave', resetPortrait);
  pointerMotion.addEventListener('change', resetPortrait);
  reducedMotion.addEventListener('change', event => {
    resetPortrait();
    if (event.matches) {
      root.classList.remove('intro-pending', 'motion-ready');
      cancelAnimationFrame(progressFrame);
      progressFrame = 0;
      root.style.removeProperty('--read-progress');
    } else queueProgress();
  });
  const revealElements = document.querySelectorAll('.scroll-reveal');
  if ('IntersectionObserver' in window && !reducedMotion.matches) {
    const reveal = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          reveal.unobserve(entry.target);
        }
      });
    }, { threshold: 0.06 });
    root.classList.add('js-enhanced');
    revealElements.forEach(element => reveal.observe(element));
    document.addEventListener('focusin', event => {
      const element = event.target.closest('.scroll-reveal');
      if (element) {
        element.classList.add('visible');
        reveal.unobserve(element);
      }
    });
    reducedMotion.addEventListener('change', event => {
      if (event.matches) {
        reveal.disconnect();
        revealElements.forEach(element => element.classList.add('visible'));
      }
    });
  } else {
    root.classList.add('js-enhanced');
    revealElements.forEach(element => element.classList.add('visible'));
  }
  if ('IntersectionObserver' in window) {
    const navLinks = Array.from(menu.querySelectorAll('a[href^="#"]'));
    const navObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        navLinks.forEach(link => {
          const active = link.getAttribute('href') === '#' + entry.target.id;
          link.classList.toggle('active', active);
          if (active) link.setAttribute('aria-current', 'location');
          else link.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-15% 0px -65% 0px', threshold: 0 });
    ['home', 'about', 'timeline', 'projects', 'contact'].forEach(id => navObserver.observe(document.getElementById(id)));
  }
  document.querySelectorAll('[data-js-only]').forEach(element => { element.hidden = false; });

  const statsStatus = document.getElementById('stats-status');
  statsStatus.textContent = '正在读取 GitHub 公开数据…';
  const abort = new AbortController();
  const timeout = setTimeout(() => abort.abort(), 6500);
  fetch('https://api.github.com/users/QingJ01', { signal: abort.signal })
    .then(response => { if (!response.ok) throw new Error('GitHub unavailable'); return response.json(); })
    .then(data => {
      if (!Number.isFinite(data.public_repos) || !Number.isFinite(data.followers)) throw new Error('Invalid profile data');
      document.getElementById('repo-count').textContent = data.public_repos.toLocaleString('en-US');
      document.getElementById('follower-count').textContent = data.followers.toLocaleString('en-US');
      statsStatus.textContent = 'GitHub 实时公开数据';
    })
    .catch(() => { statsStatus.textContent = '数据暂不可用，可前往 GitHub 查看。'; })
    .finally(() => clearTimeout(timeout));
})();
