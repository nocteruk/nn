// 页面初始化
document.addEventListener('DOMContentLoaded', function() {
    // 导航栏滚动效果
    const header = document.querySelector('.fixed-header');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 50) {
            header.style.background = 'rgba(28, 28, 28, 0.98)';
            header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.background = 'rgba(28, 28, 28, 0.95)';
            header.style.boxShadow = 'none';
        }

        lastScroll = currentScroll;
    });

    // 移动端菜单
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const body = document.body;

    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
        });

        // 点击导航链接时关闭菜单
        const navLinks = navMenu.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                body.style.overflow = '';
            });
        });

        // 点击外部关闭菜单
        document.addEventListener('click', (e) => {
            if (!navMenu.contains(e.target) && !menuToggle.contains(e.target)) {
                navMenu.classList.remove('active');
                body.style.overflow = '';
            }
        });
    }

    // 平滑滚动
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerOffset = 80;
                const elementPosition = target.offsetTop;
                const offsetPosition = elementPosition - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // 表单处理
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            // 获取表单数据
            const formData = new FormData(this);
            const submitBtn = this.querySelector('button[type="submit"]');
            const btnText = submitBtn.querySelector('.btn-text');
            const spinner = submitBtn.querySelector('.spinner-border');
            const formSuccess = document.getElementById('formSuccess');

            // 显示加载状态
            submitBtn.disabled = true;
            btnText.style.display = 'none';
            spinner.classList.remove('d-none');

            try {
                // 模拟API请求
                await new Promise(resolve => setTimeout(resolve, 1500));

                // 隐藏表单，显示成功信息
                contactForm.style.display = 'none';
                formSuccess.style.display = 'block';

                // 重置表单
                this.reset();
            } catch (error) {
                console.error('提交失败:', error);
                alert('提交失败，请稍后重试');
            } finally {
                // 恢复按钮状态
                submitBtn.disabled = false;
                btnText.style.display = 'inline';
                spinner.classList.add('d-none');
            }
        });
    }

    // 微信二维码弹窗功能
    const wechatIcon = document.getElementById('wechatIcon');
    
    if (wechatIcon) {
        // 创建弹窗元素
        const qrPopup = document.createElement('div');
        qrPopup.className = 'qr-popup';
        qrPopup.innerHTML = `
            <div class="qr-content">
                <span class="close-qr">&times;</span>
                <h3>扫码关注我们</h3>
                <img src="images/qr-code.png" alt="微信二维码">
            </div>
        `;
        document.body.appendChild(qrPopup);
        
        // 微信图标点击事件
        wechatIcon.addEventListener('click', (e) => {
            e.preventDefault();
            qrPopup.classList.add('active');
        });
        
        // 关闭二维码弹窗
        const closeQrBtn = qrPopup.querySelector('.close-qr');
        closeQrBtn.addEventListener('click', () => {
            qrPopup.classList.remove('active');
        });
        
        // 点击弹窗外部区域关闭
        qrPopup.addEventListener('click', (e) => {
            if (e.target === qrPopup) {
                qrPopup.classList.remove('active');
            }
        });
    }

    // 动画效果
    const animateElements = document.querySelectorAll('.animate-fadeInUp');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });

    animateElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        observer.observe(element);
    });

    // 搜索功能
    const searchContainer = document.querySelector('.search-container');
    const searchInput = document.querySelector('.search-input');
    const searchBtn = document.querySelector('.search-btn');
    
    // 添加搜索按钮到导航栏
    const searchToggle = document.createElement('a');
    searchToggle.href = '#';
    searchToggle.innerHTML = '<i class="fas fa-search"></i>';
    searchToggle.classList.add('search-toggle');
    navMenu.appendChild(searchToggle);

    // 切换搜索框显示
    searchToggle.addEventListener('click', function(e) {
        e.preventDefault();
        searchContainer.classList.toggle('active');
        searchInput.focus();
    });

    // 搜索功能实现
    searchBtn.addEventListener('click', function() {
        const searchTerm = searchInput.value.trim();
        if (searchTerm) {
            // 这里可以实现搜索逻辑
            console.log('搜索关键词:', searchTerm);
            // TODO: 实现搜索结果展示
        }
    });

    // 按Enter键触发搜索
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            searchBtn.click();
        }
    });

    // 点击其他区域关闭搜索框
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.search-container') && 
            !e.target.closest('.search-toggle')) {
            searchContainer.classList.remove('active');
        }
    });

    // 消息提示函数
    function showMessage(message, type = 'info') {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message-toast ${type}`;
        messageDiv.textContent = message;
        
        document.body.appendChild(messageDiv);
        
        // 显示动画
        setTimeout(() => messageDiv.classList.add('show'), 100);
        
        // 3秒后移除
        setTimeout(() => {
            messageDiv.classList.remove('show');
            setTimeout(() => messageDiv.remove(), 300);
        }, 3000);
    }

    // 需求选择弹窗
    const needsModal = document.getElementById('needsModal');
    const closeModalBtn = document.querySelector('.close-modal');
    const needItems = document.querySelectorAll('.need-item');
    const categoryBtns = document.querySelectorAll('.category-btn');
    const productCards = document.querySelectorAll('.product-card');

    // 显示需求选择弹窗（5秒后自动显示）
    setTimeout(() => {
        if (!localStorage.getItem('needsModalShown')) {
            needsModal.classList.add('active');
            localStorage.setItem('needsModalShown', 'true');
        }
    }, 5000);

    // 关闭弹窗
    closeModalBtn.addEventListener('click', () => {
        needsModal.classList.remove('active');
    });

    // 点击外部关闭
    needsModal.addEventListener('click', (e) => {
        if (e.target === needsModal) {
            needsModal.classList.remove('active');
        }
    });

    // 需求选择处理
    needItems.forEach(item => {
        item.addEventListener('click', () => {
            const filter = item.getAttribute('data-filter');
            needsModal.classList.remove('active');
            
            // 滚动到产品部分
            const productsSection = document.getElementById('products');
            if (productsSection) {
                window.scrollTo({
                    top: productsSection.offsetTop - 80,
                    behavior: 'smooth'
                });
                
                // 模拟点击对应的分类按钮
                const targetCategoryBtn = Array.from(categoryBtns).find(btn => 
                    btn.getAttribute('data-filter') === filter
                );
                
                if (targetCategoryBtn) {
                    // 移除所有按钮的active类
                    categoryBtns.forEach(b => b.classList.remove('active'));
                    
                    // 添加当前按钮的active类
                    targetCategoryBtn.classList.add('active');
                    
                    // 筛选产品
                    productCards.forEach(card => {
                        if (filter === 'all') {
                            card.style.display = 'block';
                        } else {
                            if (card.dataset.material === filter || card.dataset.category === filter) {
                                card.style.display = 'block';
                            } else {
                                card.style.display = 'none';
                            }
                        }
                    });
                }
            }
        });
    });

    // 产品详情页功能
    initProductDetails();
    
    // 快速询价浮动按钮
    initQuickInquiry();
    
    // 导航菜单交互优化
    initNavigation();
    
    // 返回顶部按钮
    initBackToTop();

    // 产品分类导航
    initCategoryFilter();

    // 初始化所有功能
    initHeaderScroll();
    initAnimations();
    initModalHandlers();
    initSmoothScroll();
    initFloatingContact();

    // 搜索功能初始化
    handleSearch();
});

// 搜索处理函数
function handleSearch() {
    const searchInput = document.querySelector('.search-input');
    const searchTerm = searchInput.value.trim();
    
    if (!searchTerm) {
        return;
    }

    // 这里添加搜索逻辑
    console.log('Searching for:', searchTerm);
    // TODO: 实现搜索功能
}

// 产品详情页功能
function initProductDetails() {
    const productCards = document.querySelectorAll('.product-card');
    
    productCards.forEach(card => {
        const detailBtn = card.querySelector('.primary-btn');
        const productName = card.querySelector('h3').textContent;
        const productDesc = card.querySelector('p').textContent;
        const productImage = card.querySelector('img').src;
        
        detailBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // 创建产品详情模态框
            const detailModal = document.createElement('div');
            detailModal.className = 'modal product-detail-modal active';
            
            // 获取产品数据属性
            const material = card.dataset.material || '铜';
            const style = card.dataset.style || '经典';
            const features = card.dataset.features ? card.dataset.features.split(',') : ['高品质', '耐用'];
            
            // 构建特性HTML
            const featuresHtml = features.map(feature => 
                `<span class="feature-tag"><i class="fas fa-check"></i> ${feature}</span>`
            ).join('');
            
            // 填充模态框内容
            detailModal.innerHTML = `
                <div class="modal-content product-detail-content">
                    <button class="close-modal"><i class="fas fa-times"></i></button>
                    <div class="product-detail-grid">
                        <div class="product-detail-images">
                            <div class="main-image">
                                <img src="${productImage}" alt="${productName}">
                            </div>
                            <div class="thumbnail-images">
                                <img src="${productImage}" alt="缩略图1" class="active">
                                <img src="images/detail-2.jpg" alt="缩略图2">
                                <img src="images/detail-3.jpg" alt="缩略图3">
                            </div>
                        </div>
                        <div class="product-detail-info">
                            <h2>${productName}</h2>
                            <div class="product-meta">
                                <span><i class="fas fa-medal"></i> 材质：${material}</span>
                                <span><i class="fas fa-paint-brush"></i> 风格：${style}</span>
                            </div>
                            <div class="product-description">
                                <h3>产品描述</h3>
                                <p>${productDesc}</p>
                                <p>采用优质材料精心打造，经久耐用，品质保证。适合各种高端场所使用，彰显尊贵品位。</p>
                            </div>
                            <div class="product-features">
                                <h3>产品特点</h3>
                                <div class="features-container">
                                    ${featuresHtml}
                                </div>
                            </div>
                            <div class="product-params">
                                <h3>规格参数</h3>
                                <table class="params-table">
                                    <tr>
                                        <td>适用场景</td>
                                        <td>别墅、高端公寓、会所</td>
                                    </tr>
                                    <tr>
                                        <td>尺寸范围</td>
                                        <td>可定制 (标准: 2.2m×1.1m)</td>
                                    </tr>
                                    <tr>
                                        <td>工艺工期</td>
                                        <td>15-20天</td>
                                    </tr>
                                    <tr>
                                        <td>保修期限</td>
                                        <td>5年质保</td>
                                    </tr>
                                </table>
                            </div>
                            <div class="product-actions">
                                <button class="btn primary-btn inquiry-btn">
                                    <i class="fas fa-comment-dots"></i> 立即咨询
                                </button>
                                <button class="btn secondary-btn customize-btn">
                                    <i class="fas fa-tools"></i> 定制方案
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            
            // 添加到页面
            document.body.appendChild(detailModal);
            
            // 防止滚动
            document.body.style.overflow = 'hidden';
            
            // 关闭按钮事件
            const closeBtn = detailModal.querySelector('.close-modal');
            closeBtn.addEventListener('click', function() {
                detailModal.remove();
                document.body.style.overflow = '';
            });
            
            // 缩略图切换
            const thumbnails = detailModal.querySelectorAll('.thumbnail-images img');
            const mainImage = detailModal.querySelector('.main-image img');
            
            thumbnails.forEach(thumb => {
                thumb.addEventListener('click', function() {
                    // 移除所有active类
                    thumbnails.forEach(t => t.classList.remove('active'));
                    // 添加active类到当前缩略图
                    this.classList.add('active');
                    // 更新主图
                    mainImage.src = this.src;
                });
            });
            
            // 咨询按钮事件
            const inquiryBtn = detailModal.querySelector('.inquiry-btn');
            inquiryBtn.addEventListener('click', function() {
                // 关闭详情模态框
                detailModal.remove();
                document.body.style.overflow = '';
                
                // 滚动到联系表单并填充产品信息
                const contactForm = document.getElementById('contactForm');
                const messageField = document.getElementById('message');
                
                if (contactForm && messageField) {
                    // 填充咨询内容
                    messageField.value = `我对【${productName}】很感兴趣，请提供更多信息。`;
                    
                    // 滚动到表单
                    contactForm.scrollIntoView({ behavior: 'smooth' });
                    
                    // 聚焦到第一个输入框
                    const firstInput = contactForm.querySelector('input');
                    if (firstInput) {
                        setTimeout(() => {
                            firstInput.focus();
                        }, 800);
                    }
                }
            });
            
            // 定制方案按钮事件
            const customizeBtn = detailModal.querySelector('.customize-btn');
            customizeBtn.addEventListener('click', function() {
                // 关闭详情模态框
                detailModal.remove();
                document.body.style.overflow = '';
                
                // 滚动到咨询表单
                const contactForm = document.getElementById('contactForm');
                if (contactForm) {
                    contactForm.scrollIntoView({ behavior: 'smooth' });
                    
                    // 聚焦到第一个输入框
                    const firstInput = contactForm.querySelector('input');
                    if (firstInput) {
                        setTimeout(() => {
                            firstInput.focus();
                        }, 800);
                    }
                }
            });
        });
    });
}

// 快速询价浮动按钮
function initQuickInquiry() {
    // 创建浮动按钮
    const quickInquiryBtn = document.createElement('div');
    quickInquiryBtn.className = 'quick-inquiry-btn';
    quickInquiryBtn.innerHTML = `
        <div class="inquiry-btn-group">
            <a href="tel:13852955775" class="inquiry-phone">
                <i class="fas fa-phone-alt"></i>
            </a>
            <button class="inquiry-chat">
                <i class="fas fa-comments"></i>
            </button>
            <button class="inquiry-form">
                <i class="fas fa-envelope"></i>
            </button>
        </div>
        <button class="inquiry-toggle">
            <i class="fas fa-headset"></i>
        </button>
    `;
    
    // 添加到页面
    document.body.appendChild(quickInquiryBtn);
    
    // 切换展开/收起
    const toggleBtn = quickInquiryBtn.querySelector('.inquiry-toggle');
    toggleBtn.addEventListener('click', function() {
        quickInquiryBtn.classList.toggle('active');
    });
    
    // 聊天按钮点击
    const chatBtn = quickInquiryBtn.querySelector('.inquiry-chat');
    chatBtn.addEventListener('click', function() {
        // 创建聊天窗口
        const chatWindow = document.createElement('div');
        chatWindow.className = 'chat-window';
        chatWindow.innerHTML = `
            <div class="chat-header">
                <h3>在线客服</h3>
                <button class="close-chat"><i class="fas fa-times"></i></button>
            </div>
            <div class="chat-messages">
                <div class="message system">
                    <p>欢迎咨询铜艺门匠，请问有什么可以帮您？</p>
                    <span class="time">${new Date().toLocaleTimeString()}</span>
                </div>
            </div>
            <div class="chat-input">
                <textarea placeholder="请输入您的问题..."></textarea>
                <button class="send-btn"><i class="fas fa-paper-plane"></i></button>
            </div>
        `;
        
        // 添加到页面
        document.body.appendChild(chatWindow);
        
        // 关闭聊天窗口
        const closeChat = chatWindow.querySelector('.close-chat');
        closeChat.addEventListener('click', function() {
            chatWindow.remove();
        });
        
        // 发送消息
        const sendBtn = chatWindow.querySelector('.send-btn');
        const textarea = chatWindow.querySelector('textarea');
        const messagesContainer = chatWindow.querySelector('.chat-messages');
        
        function sendMessage() {
            const message = textarea.value.trim();
            if (message) {
                // 添加用户消息
                messagesContainer.innerHTML += `
                    <div class="message user">
                        <p>${message}</p>
                        <span class="time">${new Date().toLocaleTimeString()}</span>
                    </div>
                `;
                
                // 清空输入框
                textarea.value = '';
                
                // 滚动到底部
                messagesContainer.scrollTop = messagesContainer.scrollHeight;
                
                // 模拟客服回复
                setTimeout(() => {
                    messagesContainer.innerHTML += `
                        <div class="message system">
                            <p>感谢您的咨询，我们的客服人员将尽快回复您。您也可以直接拨打电话 138-5295-5775 与我们联系。</p>
                            <span class="time">${new Date().toLocaleTimeString()}</span>
                        </div>
                    `;
                    
                    // 滚动到底部
                    messagesContainer.scrollTop = messagesContainer.scrollHeight;
                }, 1000);
            }
        }
        
        // 点击发送
        sendBtn.addEventListener('click', sendMessage);
        
        // 按Enter发送
        textarea.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
            }
        });
    });
    
    // 表单按钮点击
    const formBtn = quickInquiryBtn.querySelector('.inquiry-form');
    formBtn.addEventListener('click', function() {
        // 滚动到联系表单
        const contactForm = document.getElementById('contactForm');
        if (contactForm) {
            contactForm.scrollIntoView({ behavior: 'smooth' });
            
            // 聚焦到第一个输入框
            const firstInput = contactForm.querySelector('input');
            if (firstInput) {
                setTimeout(() => {
                    firstInput.focus();
                }, 800);
            }
        }
    });

    // 替换跳转到appointmentForm的代码为跳转到contactForm
    const quickContactBtn = document.querySelector('.inquiry-toggle[data-action="contact"]');
    if (quickContactBtn) {
        quickContactBtn.addEventListener('click', function() {
            const contactForm = document.getElementById('contactForm');
            if (contactForm) {
                contactForm.scrollIntoView({ behavior: 'smooth' });
                // 焦点放在第一个输入框
                const firstInput = contactForm.querySelector('input');
                if (firstInput) {
                    setTimeout(() => {
                        firstInput.focus();
                    }, 500);
                }
            }
        });
    }
}

// 导航菜单交互优化
function initNavigation() {
    // 移动端菜单切换
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            this.classList.toggle('active');
        });
    }
    
    // 平滑滚动到锚点
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // 如果是下拉菜单的切换按钮，不执行滚动
            if (this.classList.contains('dropdown-toggle')) {
                return;
            }
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                e.preventDefault();
                
                // 关闭移动端菜单
                if (navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                    menuToggle.classList.remove('active');
                }
                
                // 平滑滚动
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // 滚动时高亮当前导航项
    const sections = document.querySelectorAll('section[id]');
    
    function highlightNavOnScroll() {
        const scrollPosition = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                // 移除所有active类
                navLinks.forEach(link => {
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    } else {
                        link.classList.remove('active');
                    }
                });
            }
        });
    }
    
    // 监听滚动事件
    window.addEventListener('scroll', highlightNavOnScroll);
}

// 返回顶部按钮
function initBackToTop() {
    // 创建返回顶部按钮
    const backToTopBtn = document.createElement('button');
    backToTopBtn.className = 'back-to-top';
    backToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    
    // 添加到页面
    document.body.appendChild(backToTopBtn);
    
    // 显示/隐藏按钮
    function toggleBackToTopBtn() {
        if (window.scrollY > 300) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    }
    
    // 监听滚动事件
    window.addEventListener('scroll', toggleBackToTopBtn);
    
    // 点击返回顶部
    backToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// 产品分类导航功能
function initCategoryFilter() {
    const categoryBtns = document.querySelectorAll('.category-btn');
    const productCards = document.querySelectorAll('.product-card');
    
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // 移除所有按钮的active类
            categoryBtns.forEach(b => b.classList.remove('active'));
            
            // 添加当前按钮的active类
            btn.classList.add('active');
            
            const filter = btn.dataset.filter;
            
            // 筛选产品
            productCards.forEach(card => {
                if (filter === 'all') {
                    card.style.display = 'block';
                } else {
                    if (card.dataset.material === filter || card.dataset.category === filter) {
                        card.style.display = 'block';
                    } else {
                        card.style.display = 'none';
                    }
                }
            });
        });
    });
}

// 页面滚动时改变头部样式
function initHeaderScroll() {
    const header = document.querySelector('.fixed-header');
    const scrollThreshold = 100;
    
    function updateHeaderStyle() {
        if (window.scrollY > scrollThreshold) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }
    
    // 初始检查
    updateHeaderStyle();
    
    // 滚动事件监听
    window.addEventListener('scroll', updateHeaderStyle);
}

// 滚动动画效果
function initAnimations() {
    const animatedElements = document.querySelectorAll('.animate-fadeInUp');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                // 一旦显示动画，停止观察
                observer.unobserve(entry.target);
            }
        });
    }, {
        root: null,
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });
    
    animatedElements.forEach(element => {
        // 先隐藏所有动画元素
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        observer.observe(element);
    });
}

// 初始化模态框处理
function initModalHandlers() {
    // 需求选择弹窗
    const needsModal = document.getElementById('needsModal');
    const closeModalBtn = document.querySelector('.close-modal');
    const needItems = document.querySelectorAll('.need-item');
    const categoryBtns = document.querySelectorAll('.category-btn');
    const productCards = document.querySelectorAll('.product-card');
    
    // 5秒后显示弹窗（仅在首页）
    if (window.location.hash === '' || window.location.hash === '#home') {
        setTimeout(() => {
            needsModal.classList.add('active');
        }, 5000);
    }
    
    // 关闭弹窗
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', () => {
            needsModal.classList.remove('active');
        });
    }
    
    // 点击外部关闭
    needsModal.addEventListener('click', (e) => {
        if (e.target === needsModal) {
            needsModal.classList.remove('active');
        }
    });
    
    // 需求选择
    needItems.forEach(item => {
        item.addEventListener('click', () => {
            const filter = item.getAttribute('data-filter');
            needsModal.classList.remove('active');
            
            // 滚动到产品部分
            const productsSection = document.getElementById('products');
            if (productsSection) {
                window.scrollTo({
                    top: productsSection.offsetTop - 80,
                    behavior: 'smooth'
                });
                
                // 模拟点击对应的分类按钮
                const targetCategoryBtn = Array.from(categoryBtns).find(btn => 
                    btn.getAttribute('data-filter') === filter
                );
                
                if (targetCategoryBtn) {
                    // 移除所有按钮的active类
                    categoryBtns.forEach(b => b.classList.remove('active'));
                    
                    // 添加当前按钮的active类
                    targetCategoryBtn.classList.add('active');
                    
                    // 筛选产品
                    productCards.forEach(card => {
                        if (filter === 'all') {
                            card.style.display = 'block';
                        } else {
                            if (card.dataset.material === filter || card.dataset.category === filter) {
                                card.style.display = 'block';
                            } else {
                                card.style.display = 'none';
                            }
                        }
                    });
                }
            }
        });
    });
}

// 平滑滚动锚链接
function initSmoothScroll() {
    const anchors = document.querySelectorAll('a[href^="#"]');
    
    anchors.forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// 初始化浮动咨询按钮
function initFloatingContact() {
    const floatingBtn = document.getElementById('floatingContactBtn');
    const floatingOptions = document.querySelector('.floating-options');
    
    if (!floatingBtn) return;
    
    let isOpen = false;
    
    floatingBtn.addEventListener('click', () => {
        if (isOpen) {
            floatingOptions.style.opacity = '0';
            floatingOptions.style.transform = 'translateY(20px)';
            floatingOptions.style.pointerEvents = 'none';
        } else {
            floatingOptions.style.opacity = '1';
            floatingOptions.style.transform = 'translateY(0)';
            floatingOptions.style.pointerEvents = 'all';
        }
        
        isOpen = !isOpen;
    });
    
    // 滚动链接处理
    const scrollLinks = document.querySelectorAll('.js-scroll');
    scrollLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            const targetId = link.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
                
                // 如果是表单，聚焦到第一个输入字段
                const formField = targetElement.querySelector('input');
                if (formField) {
                    setTimeout(() => {
                        formField.focus();
                    }, 1000);
                }
                
                // 关闭浮动选项
                isOpen = false;
                floatingOptions.style.opacity = '0';
                floatingOptions.style.transform = 'translateY(20px)';
                floatingOptions.style.pointerEvents = 'none';
            }
        });
    });
} 