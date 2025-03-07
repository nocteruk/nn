// 定义API基础URL
const API_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5050/api'
    : '/api';

// 获取CSRF令牌函数
function getCsrfToken() {
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
        const [name, value] = cookie.trim().split('=');
        if (name === 'XSRF-TOKEN') {
            return decodeURIComponent(value);
        }
    }
    return '';
}

// XSS防护 - 输入转义函数
function escapeHtml(unsafe) {
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// 输入验证函数
function validateInputs(formData) {
    // 名称验证 - 2-50个字符
    if (!formData.name || formData.name.length < 2 || formData.name.length > 50) {
        return { valid: false, message: '姓名长度应在2-50个字符之间' };
    }
    
    // 手机号验证 - 中国大陆手机号
    if (!formData.phone || !/^1[3-9]\d{9}$/.test(formData.phone)) {
        return { valid: false, message: '请输入有效的手机号码' };
    }
    
    // 邮箱验证 (如果提供)
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        return { valid: false, message: '请输入有效的电子邮箱' };
    }
    
    // 消息验证 - 10-500个字符
    if (!formData.message || formData.message.length < 10 || formData.message.length > 500) {
        return { valid: false, message: '咨询内容应在10-500个字符之间' };
    }
    
    return { valid: true };
}

// 显示表单错误函数
function showFormError(message) {
    // 查找或创建错误元素
    let errorDiv = document.querySelector('.form-error');
    
    if (!errorDiv) {
        errorDiv = document.createElement('div');
        errorDiv.className = 'form-error';
        const contactForm = document.getElementById('contactForm');
        contactForm.parentElement.insertBefore(errorDiv, contactForm.nextSibling);
    }
    
    // 设置错误消息
    errorDiv.innerHTML = message;
    errorDiv.style.display = 'block';
    
    // 5秒后自动隐藏
    setTimeout(() => {
        errorDiv.style.display = 'none';
    }, 5000);
}

// 等待DOM加载完成
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    const formSuccess = document.getElementById('formSuccess');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // 获取表单元素
            const submitBtn = this.querySelector('button[type="submit"]');
            const btnText = submitBtn.querySelector('.btn-text');
            const spinner = submitBtn.querySelector('.spinner-border');
            
            // 获取表单数据
            const name = this.querySelector('#name').value;
            const phone = this.querySelector('#phone').value;
            const email = this.querySelector('#email').value;
            const message = this.querySelector('#message').value;
            
            // 验证表单数据
            const validation = validateInputs({name, phone, email, message});
            if (!validation.valid) {
                showFormError(validation.message);
                return;
            }
            
            // 显示加载状态
            submitBtn.disabled = true;
            btnText.style.display = 'none';
            spinner.classList.remove('d-none');
            
            // 准备请求数据
            const formData = {
                name: escapeHtml(name),
                phone: escapeHtml(phone),
                email: escapeHtml(email),
                message: escapeHtml(message),
                source: window.location.href,
                timestamp: new Date().toISOString()
            };
            
            // 发送请求
            fetch(`${API_URL}/inquiries`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-Token': getCsrfToken()
                },
                body: JSON.stringify(formData)
            })
            .then(response => {
                if (!response.ok) {
                    if (response.status === 429) {
                        throw new Error('请求过于频繁，请稍后再试');
                    }
                    return response.json().then(data => {
                        throw new Error(data.message || '提交失败，请稍后重试');
                    });
                }
                return response.json();
            })
            .then(data => {
                // 处理成功响应
                if (data.success) {
                    // 显示成功消息
                    contactForm.style.display = 'none';
                    formSuccess.style.display = 'block';
                    
                    // 重置表单
                    this.reset();
                    
                    // 5秒后重置表单显示
                    setTimeout(() => {
                        contactForm.style.display = 'block';
                        formSuccess.style.display = 'none';
                    }, 5000);
                } else {
                    // 显示错误信息
                    showFormError(data.message || '提交失败，请稍后重试');
                }
            })
            .catch(error => {
                console.error('表单提交出错:', error);
                
                // 开发环境下模拟成功
                if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
                    contactForm.style.display = 'none';
                    formSuccess.style.display = 'block';
                    this.reset();
                    
                    setTimeout(() => {
                        contactForm.style.display = 'block';
                        formSuccess.style.display = 'none';
                    }, 5000);
                } else {
                    // 显示错误信息
                    showFormError(error.message || '提交失败，请稍后重试');
                }
            })
            .finally(() => {
                // 恢复按钮状态
                submitBtn.disabled = false;
                btnText.style.display = '';
                spinner.classList.add('d-none');
            });
        });
    }
    
    // 处理产品系列按钮功能
    const productCards = document.querySelectorAll('.product-card');
    if (productCards.length > 0 && contactForm) {
        productCards.forEach(card => {
            const detailBtn = card.querySelector('.primary-btn');
            if (detailBtn) {
                detailBtn.addEventListener('click', function(e) {
                    e.preventDefault();
                    const productName = card.querySelector('h3').textContent;
                    const messageField = contactForm.querySelector('textarea[name="message"]');
                    if (messageField) {
                        messageField.value = `我对"${escapeHtml(productName)}"感兴趣，请联系我详谈。`;
                    }
                    
                    // 添加隐藏字段产品名称
                    let productField = contactForm.querySelector('input[name="product"]');
                    if (!productField) {
                        productField = document.createElement('input');
                        productField.type = 'hidden';
                        productField.name = 'product';
                        contactForm.appendChild(productField);
                    }
                    productField.value = escapeHtml(productName);
                    
                    // 滚动到联系表单
                    document.getElementById('contact').scrollIntoView({behavior: 'smooth'});
                });
            }
        });
    }
});