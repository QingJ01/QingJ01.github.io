document.addEventListener('DOMContentLoaded', function () {
    // 设置当前年份
    document.getElementById('currentYear').textContent = new Date().getFullYear();

    // 导航菜单切换
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.nav-links');

    burger.addEventListener('click', function () {
        nav.classList.toggle('active');
        burger.classList.toggle('active');
    });

    // 点击导航链接后关闭菜单
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        link.addEventListener('click', function () {
            nav.classList.remove('active');
            burger.classList.remove('active');
        });
    });

    // 滚动时导航栏效果
    window.addEventListener('scroll', function () {
        const header = document.querySelector('header');
        header.classList.toggle('scrolled', window.scrollY > 50);
    });

    // 表单提交处理
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            // 获取表单数据
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;

            // 这里可以添加表单验证逻辑

            // 模拟表单提交
            alert(`谢谢您的留言，${name}！我会尽快回复您。`);

            // 清空表单
            contactForm.reset();
        });
    }

    // 添加滚动动画
    const scrollElements = document.querySelectorAll('.skill-category, .project-card, .media-card');

    const elementInView = (el, percentageScroll = 100) => {
        const elementTop = el.getBoundingClientRect().top;
        const elementHeight = el.getBoundingClientRect().height;

        return (
            elementTop <=
            ((window.innerHeight || document.documentElement.clientHeight) * (percentageScroll / 100))
        );
    };

    const displayScrollElement = (element) => {
        element.classList.add('scrolled');
    };

    const hideScrollElement = (element) => {
        element.classList.remove('scrolled');
    };

    const handleScrollAnimation = () => {
        scrollElements.forEach((el) => {
            if (elementInView(el, 90)) {
                displayScrollElement(el);
            } else {
                hideScrollElement(el);
            }
        });
    };

    // 初始检查元素是否在视图中
    window.addEventListener('load', () => {
        handleScrollAnimation();
    });

    // 滚动时检查
    window.addEventListener('scroll', () => {
        handleScrollAnimation();
    });

    // 公众号二维码交互
    const wechatCard = document.querySelector('.media-card:first-child');
    const qrCode = document.querySelector('.qr-code');
    const qrOverlay = document.querySelector('.qr-overlay');

    if (wechatCard && qrCode) {
        // 添加类以标识微信卡片
        wechatCard.classList.add('wechat');

        // 点击卡片显示大图
        wechatCard.addEventListener('click', function () {
            showQRCodeModal(qrCode.src);
        });

        // 确保点击覆盖层也能触发模态框
        if (qrOverlay) {
            qrOverlay.addEventListener('click', function (e) {
                e.stopPropagation(); // 阻止事件冒泡
                showQRCodeModal(qrCode.src);
            });
        }
    }

    // 创建二维码模态框函数
    function showQRCodeModal(imgSrc) {
        // 创建模态框元素
        const modal = document.createElement('div');
        modal.classList.add('qr-modal');

        // 创建模态框内容
        modal.innerHTML = `
            <div class="qr-modal-content">
                <span class="qr-close">&times;</span>
                <img src="${imgSrc}" alt="极客氢云公众号二维码">
                <p>扫码关注公众号</p>
            </div>
        `;

        // 添加到body
        document.body.appendChild(modal);

        // 显示模态框
        setTimeout(() => {
            modal.classList.add('show');
        }, 10);

        // 关闭按钮事件
        const closeBtn = modal.querySelector('.qr-close');
        closeBtn.addEventListener('click', function () {
            modal.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(modal);
            }, 300);
        });

        // 点击模态框背景关闭
        modal.addEventListener('click', function (e) {
            if (e.target === modal) {
                modal.classList.remove('show');
                setTimeout(() => {
                    document.body.removeChild(modal);
                }, 300);
            }
        });
    }

    // 更新项目图片错误处理
    const projectImages = document.querySelectorAll('.project-image img');
    projectImages.forEach(img => {
        img.addEventListener('error', function () {
            // 图片加载失败时，使用内联SVG作为备用
            const projectTitle = this.closest('.project-card').querySelector('h3').textContent;
            const projectImage = this.closest('.project-image');

            // 添加no-image类
            projectImage.classList.add('no-image');

            // 根据项目类型添加不同的图标
            let iconType = 'braces';
            if (projectTitle.includes('云盘')) {
                iconType = 'cloud';
            } else if (projectTitle.includes('脚本')) {
                iconType = 'code';
            } else if (projectTitle.includes('测试')) {
                iconType = 'speedometer';
            }

            projectImage.setAttribute('data-icon', iconType);

            // 设置背景色替代图片
            this.style.opacity = '0.1';
        });
    });

    // 修改打字特效
    const typingText = document.querySelector('.typing-text');
    const cursor = document.querySelector('.cursor');
    const textToType = "我是<span class='highlight'>一只情酱</span>";
    let i = 0;
    let isDeleting = false;
    let currentText = '';

    function typeWriter() {
        // 完成打字后停止
        if (i >= textToType.length && !isDeleting) {
            return;
        }

        if (!isDeleting) {
            // 添加字符
            currentText = textToType.substring(0, i + 1);
            i++;
        }

        typingText.innerHTML = currentText;

        // 控制打字速度
        let typeSpeed = 100;

        // 如果是HTML标签部分，加快速度
        if (textToType[i - 1] === '<' || (i > 0 && textToType[i - 2] === '<' && textToType[i - 1] !== '>')) {
            typeSpeed = 10;
        }

        if (i < textToType.length) {
            setTimeout(typeWriter, typeSpeed);
        }
    }

    // 开始打字效果
    setTimeout(typeWriter, 1000);
});

// 添加模态框样式到页面
const style = document.createElement('style');
style.textContent = `
    .qr-modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.7);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 2000;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
    }
    
    .qr-modal.show {
        opacity: 1;
        visibility: visible;
    }
    
    .qr-modal-content {
        background-color: white;
        padding: 30px;
        border-radius: 10px;
        text-align: center;
        position: relative;
        max-width: 90%;
        transform: scale(0.9);
        transition: transform 0.3s ease;
    }
    
    .qr-modal.show .qr-modal-content {
        transform: scale(1);
    }
    
    .qr-modal-content img {
        max-width: 300px;
        border-radius: 5px;
        margin-bottom: 15px;
        margin-top: 15px;
    }
    
    .qr-modal-content p {
        font-size: 1.2rem;
        color: #333;
    }
    
    .qr-close {
        position: absolute;
        top: 10px;
        right: 15px;
        font-size: 28px;
        font-weight: bold;
        color: #aaa;
        cursor: pointer;
        z-index: 10;
        background-color: white;
        width: 30px;
        height: 30px;
        line-height: 30px;
        text-align: center;
        border-radius: 50%;
    }
    
    .qr-close:hover {
        color: #333;
        background-color: #f0f0f0;
    }
`;
document.head.appendChild(style); 