document.addEventListener('DOMContentLoaded', function () {
    // 设置当前年份
    document.getElementById('currentYear').textContent = new Date().getFullYear();

    // 主题切换逻辑
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    const html = document.documentElement;

    // 检查本地存储或系统偏好
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    // 默认暗色，如果是明确设置了 light 或者是系统浅色且未设置，则设为 light
    // 但鉴于 5ime 风格默认为暗色，我们优先使用 savedTheme，其次默认 dark
    // 如果想要跟随系统： 
    // if (savedTheme === 'light' || (!savedTheme && !systemPrefersDark)) { ... }

    // 这里简单处理：有保存则用保存的，没有则默认暗色（因为我们的 CSS :root 是暗色）
    if (savedTheme === 'light') {
        html.setAttribute('data-theme', 'light');
        themeIcon.className = 'bi bi-sun-fill';
    } else {
        html.removeAttribute('data-theme'); // default is dark
        themeIcon.className = 'bi bi-moon-stars-fill';
    }

    themeToggle.addEventListener('click', () => {
        const currentTheme = html.getAttribute('data-theme');
        if (currentTheme === 'light') {
            html.removeAttribute('data-theme');
            localStorage.setItem('theme', 'dark');
            themeIcon.className = 'bi bi-moon-stars-fill';
        } else {
            html.setAttribute('data-theme', 'light');
            localStorage.setItem('theme', 'light');
            themeIcon.className = 'bi bi-sun-fill';
        }
    });

    // 浏览量卡片交互（可选：简单的悬停效果已经在 CSS 中处理）
    const viewCard = document.getElementById('view-card');

    // iOS 风格滚动格言效果
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.3 // 当 30% 可见时触发
    };

    const quoteObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            } else {
                // 可选：离开视口时移除，以支持反复滚动动画
                entry.target.classList.remove('visible');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.quote-content').forEach(quote => {
        quoteObserver.observe(quote);
    });

    // 导航菜单切换
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.navbar');

    burger.addEventListener('click', function () {
        nav.classList.toggle('active');
        burger.classList.toggle('active');
    });

    // 点击导航链接后关闭菜单
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
        // 淡出
        quoteElement.style.opacity = '0';
        quoteElement.style.transform = 'translateY(10px)';

        setTimeout(() => {
            currentQuoteIndex = (currentQuoteIndex + 1) % quotes.length;
            quoteElement.textContent = quotes[currentQuoteIndex];

            // 淡入
            quoteElement.style.opacity = '1';
            quoteElement.style.transform = 'translateY(0)';
        }, 300);
    }

    // 添加过渡样式
    if (quoteElement) {
        quoteElement.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        setInterval(rotateQuote, 4000);
    }

    // 项目卡片动画延迟
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach((card, index) => {
        card.style.setProperty('--index', index);
    });
});