const isMobile = window.innerWidth <= 768;
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// UTM Parameters Capture
(function() {
    const urlParams = new URLSearchParams(window.location.search);
    const utmParams = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];

    utmParams.forEach(param => {
        const value = urlParams.get(param);
        const input = document.getElementById(param);
        if (input && value) {
            input.value = value;
        }
    });
})();

// Scroll Progress
window.addEventListener('scroll', function() {
    const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (window.pageYOffset / windowHeight) * 100;
    document.getElementById('scrollProgress').style.width = scrolled + '%';
});

// Cursor Spotlight
if (!isMobile && !prefersReducedMotion) {
    const cursorSpotlight = document.getElementById('cursor-spotlight');
    const cursorSpotlightSecondary = document.getElementById('cursor-spotlight-secondary');
    let mouseX = 0, mouseY = 0, spotlightX = 0, spotlightY = 0;
    let spotlightSecondaryX = 0, spotlightSecondaryY = 0;

    document.addEventListener('mousemove', function(e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function animateSpotlight() {
        const lerp = 0.1;
        spotlightX += (mouseX - spotlightX) * lerp;
        spotlightY += (mouseY - spotlightY) * lerp;
        cursorSpotlight.style.left = spotlightX + 'px';
        cursorSpotlight.style.top = spotlightY + 'px';
        requestAnimationFrame(animateSpotlight);
    }

    function animateSpotlightSecondary() {
        const lerp = 0.05;
        spotlightSecondaryX += (mouseX - spotlightSecondaryX) * lerp;
        spotlightSecondaryY += (mouseY - spotlightSecondaryY) * lerp;
        cursorSpotlightSecondary.style.left = spotlightSecondaryX + 'px';
        cursorSpotlightSecondary.style.top = spotlightSecondaryY + 'px';
        requestAnimationFrame(animateSpotlightSecondary);
    }

    animateSpotlight();
    animateSpotlightSecondary();

    document.addEventListener('mouseleave', () => {
        cursorSpotlight.style.opacity = '0';
        cursorSpotlightSecondary.style.opacity = '0';
    });

    document.addEventListener('mouseenter', () => {
        cursorSpotlight.style.opacity = '0.8';
        cursorSpotlightSecondary.style.opacity = '0.7';
    });

    // Blob Parallax
    const blobs = [
        document.getElementById('blob1'),
        document.getElementById('blob2'),
        document.getElementById('blob3'),
        document.getElementById('blob4')
    ];

    let blobMouseX = 0, blobMouseY = 0, currentBlobX = 0, currentBlobY = 0;

    document.addEventListener('mousemove', function(e) {
        blobMouseX = (e.clientX / window.innerWidth - 0.5) * 2;
        blobMouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    });

    function animateBlobParallax() {
        const lerp = 0.08;
        currentBlobX += (blobMouseX - currentBlobX) * lerp;
        currentBlobY += (blobMouseY - currentBlobY) * lerp;

        const offsets = [50, 70, 60, 80];
        blobs.forEach((blob, i) => {
            if (blob) {
                blob.style.transform = `translate3d(${-currentBlobX * offsets[i]}px, ${-currentBlobY * offsets[i]}px, 0)`;
            }
        });

        requestAnimationFrame(animateBlobParallax);
    }

    animateBlobParallax();

    // Hero Parallax
    const heroParallaxContainer = document.getElementById('hero-parallax-container');
    let heroMouseX = 0, heroMouseY = 0, currentHeroX = 0, currentHeroY = 0;

    if (heroParallaxContainer) {
        document.addEventListener('mousemove', function(e) {
            heroMouseX = (e.clientX / window.innerWidth - 0.5) * 2;
            heroMouseY = (e.clientY / window.innerHeight - 0.5) * 2;
        });

        function animateHeroParallax() {
            const lerp = 0.1;
            currentHeroX += (heroMouseX - currentHeroX) * lerp;
            currentHeroY += (heroMouseY - currentHeroY) * lerp;
            heroParallaxContainer.style.transform = `translate3d(${-currentHeroX * 40}px, ${-currentHeroY * 40}px, 0)`;
            requestAnimationFrame(animateHeroParallax);
        }

        animateHeroParallax();
    }
}

// Scroll Parallax
if (!prefersReducedMotion) {
    const parallaxContent = document.querySelector('.parallax-content');
    const heroImage = document.querySelector('.hero-image-placeholder');
    const heroSection = document.getElementById('hero-section');
    const animatedBg = document.querySelector('.animated-bg');
    let ticking = false;

    function updateParallax() {
        if (!heroSection) return;
        const scrolled = window.pageYOffset;
        const heroRect = heroSection.getBoundingClientRect();

        if (heroRect.bottom > 0 && heroRect.top < window.innerHeight) {
            if (animatedBg) animatedBg.style.transform = `translate3d(0, ${scrolled * 0.3}px, 0)`;
            if (parallaxContent) parallaxContent.style.transform = `translate3d(0, ${scrolled * 0.08}px, 0)`;
            if (heroImage) heroImage.style.transform = `translate3d(0, ${scrolled * 0.15}px, 0)`;
        }
        ticking = false;
    }

    window.addEventListener('scroll', function() {
        if (!ticking) {
            window.requestAnimationFrame(updateParallax);
            ticking = true;
        }
    });
}

// 3D Tilt Cards
const tiltCards = document.querySelectorAll('.tilt-card');
if (!isMobile && !prefersReducedMotion) {
    tiltCards.forEach(card => {
        const cardInner = card.querySelector('.tilt-card-inner');

        card.addEventListener('mousemove', function(e) {
            const rect = card.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            const mouseX = e.clientX - centerX;
            const mouseY = e.clientY - centerY;
            const rotateX = (mouseY / rect.height) * -20;
            const rotateY = (mouseX / rect.width) * 20;

            if (cardInner) {
                cardInner.style.transform = `
                    perspective(1000px)
                    rotateX(${rotateX}deg)
                    rotateY(${rotateY}deg)
                    scale3d(1.05, 1.05, 1.05)
                `;
            }
        });

        card.addEventListener('mouseleave', function() {
            if (cardInner) {
                cardInner.style.transform = `
                    perspective(1000px)
                    rotateX(0deg)
                    rotateY(0deg)
                    scale3d(1, 1, 1)
                `;
            }
        });
    });
}

// FAQ Toggle
function toggleFaq(element) {
    const wasActive = element.classList.contains('active');
    document.querySelectorAll('.faq-item').forEach(item => item.classList.remove('active'));
    if (!wasActive) element.classList.add('active');
}

// Modals
function openModal() {
    document.getElementById('consultationModal').classList.add('is-open');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    document.getElementById('consultationModal').classList.remove('is-open');
    document.body.style.overflow = 'auto';
}

function openPolicyModal() {
    document.getElementById('policyModal').classList.add('is-open');
    document.body.style.overflow = 'hidden';
}

function closePolicyModal() {
    document.getElementById('policyModal').classList.remove('is-open');
    document.body.style.overflow = 'auto';
}

// Service Detail Modal
var serviceModalData = {
    liquidation: {
        title: 'Ликвидация фирмы под ключ',
        body: '<p>Закроем компанию официально и безопасно: анализ ситуации, подготовка документов, сопровождение этапов до результата.</p><p>Сроки обычно 2\u20134 месяца (зависит от ситуации).</p>'
    },
    reorganization: {
        title: 'Реорганизация фирмы',
        body: '<p>Подберём схему (слияние/присоединение/разделение/выделение), подготовим пакет документов и сопроводим регистрацию.</p><p>Сроки обычно 1\u20133 месяца.</p>'
    },
    registration: {
        title: 'Регистрация компании',
        body: '<p>Поможем открыть ООО/ИП: ОКВЭД, система налогообложения, документы, подача и получение регистрации.</p><p>Сроки обычно 3\u20137 рабочих дней.</p>'
    }
};

function openServiceModal(key) {
    var data = serviceModalData[key];
    if (!data) return;
    document.getElementById('serviceModalTitle').textContent = data.title;
    document.getElementById('serviceModalBody').innerHTML = data.body;
    document.getElementById('serviceModal').classList.add('is-open');
    document.body.style.overflow = 'hidden';
}

function closeServiceModal() {
    document.getElementById('serviceModal').classList.remove('is-open');
    document.body.style.overflow = 'auto';
}

window.onclick = function(event) {
    var consultModal = document.getElementById('consultationModal');
    var policyModal = document.getElementById('policyModal');
    var serviceModal = document.getElementById('serviceModal');
    if (event.target === consultModal) closeModal();
    if (event.target === policyModal) closePolicyModal();
    if (event.target === serviceModal) closeServiceModal();
}

document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeModal();
        closePolicyModal();
        closeServiceModal();
    }
});

// Form Submission with Formspree
async function handleSubmit(event) {
    event.preventDefault();

    const form = event.target;
    const submitBtn = document.getElementById('submitBtn');
    const submitBtnText = document.getElementById('submitBtnText');
    const messageDiv = document.getElementById('formMessage');
    const formAction = form.action;

    // Check if endpoint is configured
    if (formAction.includes('XXXXYYYY')) {
        showMessage('Необходимо настроить Formspree endpoint. Замените XXXXYYYY на ваш код формы.', 'info');
        return;
    }

    // Disable button
    submitBtn.disabled = true;
    submitBtnText.innerHTML = '<span class="spinner"></span> Отправляем...';
    hideMessage();

    try {
        const formData = new FormData(form);

        const response = await fetch(formAction, {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        });

        if (response.ok) {
            showMessage('Заявка отправлена! Мы свяжемся с вами в ближайшее время.', 'success');
            form.reset();

            setTimeout(() => {
                closeModal();
                hideMessage();
            }, 1500);
        } else {
            throw new Error('Server error');
        }
    } catch (error) {
        showMessage('Не удалось отправить заявку. Попробуйте позже или позвоните нам.', 'error');
    } finally {
        submitBtn.disabled = false;
        submitBtnText.textContent = 'Отправить заявку';
    }
}

function showMessage(text, type) {
    const messageDiv = document.getElementById('formMessage');
    messageDiv.textContent = text;
    messageDiv.className = `form-message ${type}`;
    messageDiv.style.display = 'block';
}

function hideMessage() {
    const messageDiv = document.getElementById('formMessage');
    messageDiv.style.display = 'none';
}

// Mobile Menu
function toggleMobileMenu() {
    const menu = document.getElementById('mobileMenu');
    menu.classList.toggle('active');
    document.body.style.overflow = menu.classList.contains('active') ? 'hidden' : 'auto';
}

// Phone Formatting
document.querySelectorAll('input[type="tel"]').forEach(input => {
    input.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 0) {
            if (value[0] === '7' || value[0] === '8') value = value.substring(1);
            e.target.value = '+7 ' +
                (value.substring(0, 3) ? '(' + value.substring(0, 3) : '') +
                (value.substring(3, 6) ? ') ' + value.substring(3, 6) : '') +
                (value.substring(6, 8) ? '-' + value.substring(6, 8) : '') +
                (value.substring(8, 10) ? '-' + value.substring(8, 10) : '');
        }
    });
});

// Smooth Scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: prefersReducedMotion ? 'auto' : 'smooth',
                block: 'start'
            });
        }
    });
});

// Reveal on Scroll
function revealOnScroll() {
    document.querySelectorAll('.tilt-card, .glass-effect').forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        if (elementTop < window.innerHeight - 150) {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }
    });
}

document.querySelectorAll('.tilt-card, .glass-effect').forEach(element => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(20px)';
    element.style.transition = 'all 0.6s ease';
});

window.addEventListener('scroll', revealOnScroll);
window.addEventListener('load', revealOnScroll);
