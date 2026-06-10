document.addEventListener('DOMContentLoaded', function () {
    // 设置当前年份
    document.getElementById('currentYear').textContent = new Date().getFullYear();

    // 几何装饰元素
    const geoShapes = ['geo-triangle', 'geo-square', 'geo-diamond', 'geo-circle', 'geo-cross', 'geo-ring', 'geo-dots'];

    function createGeoElements(selector, count) {
        const section = document.querySelector(selector);
        if (!section) return;
        const container = document.createElement('div');
        container.className = 'geo-container';
        for (let i = 0; i < count; i++) {
            const shape = document.createElement('div');
            const type = geoShapes[Math.floor(Math.random() * geoShapes.length)];
            shape.className = 'geo ' + type;
            const size = 10 + Math.random() * 22;
            const dur = 15 + Math.random() * 20;
            shape.style.setProperty('--size', size + 'px');
            shape.style.setProperty('--dur', dur + 's');
            shape.style.left = (5 + Math.random() * 90) + '%';
            shape.style.top = (5 + Math.random() * 90) + '%';
            shape.style.animationDelay = -(Math.random() * dur) + 's';
            container.appendChild(shape);
        }
        section.prepend(container);
    }

    createGeoElements('.timeline', 11);
    createGeoElements('.projects', 9);
    createGeoElements('.footer', 5);

    // 生成背景文字图案
    document.querySelectorAll('.hero-bg-pattern').forEach(pattern => {
        const text = 'Q I N G J   ';
        for (let i = 0; i < 15; i++) {
            const row = document.createElement('div');
            row.className = 'pattern-row';
            row.textContent = text.repeat(8);
            pattern.appendChild(row);
        }
    });

    // 主题切换逻辑
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    const html = document.documentElement;

    const savedTheme = localStorage.getItem('theme');

    if (savedTheme === 'light') {
        html.setAttribute('data-theme', 'light');
        themeIcon.className = 'ri-sun-fill';
    } else {
        html.removeAttribute('data-theme');
        themeIcon.className = 'ri-moon-fill';
    }

    themeToggle.addEventListener('click', () => {
        const currentTheme = html.getAttribute('data-theme');
        if (currentTheme === 'light') {
            html.removeAttribute('data-theme');
            localStorage.setItem('theme', 'dark');
            themeIcon.className = 'ri-moon-fill';
        } else {
            html.setAttribute('data-theme', 'light');
            localStorage.setItem('theme', 'light');
            themeIcon.className = 'ri-sun-fill';
        }
    });

    // iOS 风格滚动格言效果
    const quoteObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            } else {
                entry.target.classList.remove('visible');
            }
        });
    }, { root: null, rootMargin: '0px', threshold: 0.3 });

    document.querySelectorAll('.quote-animate').forEach(quote => {
        quoteObserver.observe(quote);
    });

    // 导航菜单切换
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.navbar');

    burger.addEventListener('click', function () {
        nav.classList.toggle('active');
        burger.classList.toggle('active');
    });

    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function () {
            nav.classList.remove('active');
            burger.classList.remove('active');
        });
    });

    // 滚动时导航栏效果
    window.addEventListener('scroll', function () {
        const header = document.querySelector('.header');
        header.classList.toggle('scrolled', window.scrollY > 50);
    });

    // 程序员语录轮播
    const quotes = [
        '"It works on my machine"',
        '"It was working yesterday"',
        '"Must be a compiler bug"',
        '"Code is poetry in motion"',
        '"Every bug tells a story"',
        '"Simplicity is the ultimate sophistication"',
        '"There is no place like 127.0.0.1"',
        '"99 bugs in the code, take one down..."',
        '"Sleep is for the weak, coffee is for the strong"',
        '"I don\'t always test my code, but when I do..."'
    ];

    const quoteElement = document.getElementById('quote');
    let currentQuoteIndex = 0;

    function rotateQuote() {
        quoteElement.style.opacity = '0';
        quoteElement.style.transform = 'translateY(10px) scale(0.98)';
        quoteElement.style.filter = 'blur(2px)';

        setTimeout(() => {
            currentQuoteIndex = (currentQuoteIndex + 1) % quotes.length;
            quoteElement.textContent = quotes[currentQuoteIndex];

            quoteElement.style.opacity = '1';
            quoteElement.style.transform = 'translateY(0) scale(1)';
            quoteElement.style.filter = 'blur(0)';
        }, 350);
    }

    if (quoteElement) {
        quoteElement.style.transition = 'opacity 0.4s cubic-bezier(0.22, 1, 0.36, 1), transform 0.4s cubic-bezier(0.22, 1, 0.36, 1), filter 0.4s ease';
        setInterval(rotateQuote, 4000);
    }

    // Apple 风格滚动显示 — 更细腻的阈值
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    // 通用 scroll-reveal 元素
    document.querySelectorAll('.scroll-reveal').forEach((el, i) => {
        el.style.setProperty('--delay', `${i * 0.08}s`);
        revealObserver.observe(el);
    });

    // Bento 卡片交错入场 + 3D 悬停
    document.querySelectorAll('.bento-card').forEach((el, i) => {
        el.classList.add('scroll-reveal');
        el.style.setProperty('--delay', `${i * 0.1}s`);
        revealObserver.observe(el);

        el.addEventListener('transitionend', function handler(e) {
            if (e.propertyName === 'opacity') {
                el.classList.remove('scroll-reveal', 'visible');
                el.removeEventListener('transitionend', handler);
            }
        });

        // 3D tilt on hover
        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            el.style.transform = `translateY(-6px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg)`;
        });

        el.addEventListener('mouseleave', () => {
            el.style.transform = '';
            el.style.transition = 'transform 0.5s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.4s ease, border-color 0.4s ease';
        });

        el.addEventListener('mouseenter', () => {
            el.style.transition = 'transform 0.15s ease, box-shadow 0.4s ease, border-color 0.4s ease';
        });
    });

    // Section 标题入场 — 独立延迟
    document.querySelectorAll('.section-title').forEach(el => {
        el.classList.add('scroll-reveal');
        el.style.setProperty('--delay', '0s');
        revealObserver.observe(el);
    });

    document.querySelectorAll('.section-subtitle').forEach(el => {
        el.classList.add('scroll-reveal');
        el.style.setProperty('--delay', '0.15s');
        revealObserver.observe(el);
    });

    // Timeline 项逐个入场，间隔更大
    document.querySelectorAll('.timeline-item').forEach((el, i) => {
        el.classList.add('scroll-reveal');
        el.style.setProperty('--delay', `${i * 0.15}s`);
        revealObserver.observe(el);
    });

    // Project 项逐个入场
    document.querySelectorAll('.project-item').forEach((el, i) => {
        el.classList.add('scroll-reveal');
        el.style.setProperty('--delay', `${i * 0.08}s`);
        revealObserver.observe(el);
    });

    // Footer 入场
    const footer = document.querySelector('.footer');
    if (footer) {
        const footerObs = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, { threshold: 0.2 });
        footerObs.observe(footer);
    }

    // Apple 风格视差滚动
    let ticking = false;

    function onParallaxScroll() {
        const scrollY = window.scrollY;
        const vh = window.innerHeight;

        // Hero 内容轻微上移 + 渐隐
        const heroContent = document.querySelector('.hero-content');
        const revealContent = document.querySelector('.hero-reveal-content');
        if (heroContent && scrollY < vh) {
            const progress = scrollY / vh;
            heroContent.style.transform = `translateY(${scrollY * 0.3}px)`;
            heroContent.style.opacity = 1 - progress * 1.2;
            if (revealContent) {
                revealContent.style.transform = `translateY(${scrollY * 0.3}px)`;
            }
        }

        // Hero 名言视差
        const heroQuote = document.querySelector('.hero > .hero-quote');
        const revealQuote = document.querySelector('.hero-reveal .hero-quote');
        if (heroQuote && scrollY < vh) {
            heroQuote.style.transform = `translateY(${scrollY * 0.15}px)`;
            if (revealQuote) {
                revealQuote.style.transform = `translateY(${scrollY * 0.15}px)`;
            }
        }

        // 背景文字视差
        document.querySelectorAll('.hero > .hero-bg-pattern').forEach(p => {
            if (scrollY < vh) {
                p.style.transform = `translateY(${scrollY * 0.1}px)`;
            }
        });

        ticking = false;
    }

    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(onParallaxScroll);
            ticking = true;
        }
    }, { passive: true });

    // Hero 鼠标跟随圆形揭示
    const heroSection = document.querySelector('.hero');
    const revealLayer = document.querySelector('.hero-reveal');

    if (heroSection && revealLayer) {
        heroSection.addEventListener('mousemove', (e) => {
            const rect = heroSection.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            revealLayer.style.transition = 'clip-path 0.08s ease-out';
            revealLayer.style.clipPath = `circle(180px at ${x}px ${y}px)`;
        });

        heroSection.addEventListener('mouseleave', (e) => {
            const rect = heroSection.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            revealLayer.style.transition = 'clip-path 0.4s cubic-bezier(0.22, 1, 0.36, 1)';
            revealLayer.style.clipPath = `circle(0px at ${x}px ${y}px)`;
        });
    }

    // 平滑锚点滚动（覆盖默认行为，更丝滑）
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
});
