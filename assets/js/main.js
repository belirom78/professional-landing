const isMobile = window.innerWidth <= 768;
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const WEBHOOK_URL = "https://YOUR-WEBHOOK-URL";

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
var serviceModal = document.getElementById('serviceModal');
var serviceModalTitle = document.getElementById('serviceModalTitle');
var serviceModalContent = document.getElementById('serviceModalContent');
var modalCloseButtons = serviceModal ? serviceModal.querySelectorAll('[data-close-modal]') : [];
var registryPriceModal = document.getElementById('registryPriceModal');
var registryPriceCloseButtons = registryPriceModal ? registryPriceModal.querySelectorAll('[data-close-price-modal]') : [];

var serviceDetails = {
    taxDisputes: {
        title: 'Споры с ИФНС по налоговым проверкам',
        content: `
            <p>Сопровождаем клиентов в спорах с налоговыми органами по камеральным и выездным проверкам. Анализируем материалы проверки, выявляем риски, готовим правовую позицию и выстраиваем стратегию защиты интересов бизнеса.</p>
            <p>Берём на себя подготовку пояснений, возражений, ответов на требования, жалоб и других процессуальных документов. При необходимости представляем интересы клиента в арбитражном суде.</p>
            <ul>
              <li>Правовой анализ претензий налогового органа</li>
              <li>Подготовка возражений и жалоб</li>
              <li>Сопровождение на стадии проверки и после неё</li>
              <li>Защита интересов клиента в суде</li>
            </ul>
        `
    },
    pretrialSettlement: {
        title: 'Досудебное урегулирование споров с ИФНС',
        content: `
            <p>Помогаем урегулировать спор с налоговым органом до суда — грамотно, последовательно и с минимизацией рисков для компании. Готовим юридически выверенные документы и сопровождаем переговорный процесс.</p>
            <p>Досудебный этап часто позволяет сократить финансовые потери, уточнить позицию инспекции и выстроить сильную доказательную базу для дальнейшей защиты интересов клиента.</p>
            <ul>
              <li>Подготовка писем, ответов, возражений и жалоб</li>
              <li>Переговоры с налоговыми органами</li>
              <li>Анализ позиции ИФНС и подготовка стратегии</li>
              <li>Снижение вероятности судебного спора</li>
            </ul>
        `
    },
    taxOptimization: {
        title: 'Снижение налоговой нагрузки',
        content: `
            <p>Разрабатываем законные и безопасные решения по снижению налоговой нагрузки для бизнеса с учётом специфики деятельности, структуры компании и текущих финансовых потоков.</p>
            <p>Наша задача — не просто уменьшить налоги, а выстроить устойчивую и понятную модель работы, которая соответствует законодательству и снижает вероятность претензий со стороны ИФНС.</p>
            <ul>
              <li>Анализ текущей налоговой модели бизнеса</li>
              <li>Поиск законных резервов для оптимизации</li>
              <li>Подготовка рекомендаций по снижению нагрузки</li>
              <li>Оценка налоговых рисков до внедрения решений</li>
            </ul>
        `
    },
    liquidation: {
        title: 'Ликвидация фирм',
        content: `
            <p>Оказываем полное сопровождение ликвидации юридических лиц — от первичной консультации и выбора оптимального варианта до завершения процедуры и подготовки необходимого пакета документов.</p>
            <p>Подбираем подходящий формат закрытия компании с учётом её состояния, обязательств, бухгалтерии и возможных рисков. Работаем аккуратно, официально и в рамках действующего законодательства.</p>
            <ul>
              <li>Добровольная ликвидация</li>
              <li>Упрощённая ликвидация</li>
              <li>Подготовка и подача документов</li>
              <li>Сопровождение процедуры "под ключ"</li>
            </ul>
        `
    },
    reorganization: {
        title: 'Реорганизация фирмы',
        content: `
            <p>Сопровождаем все основные формы реорганизации юридических лиц: слияние, присоединение, разделение, выделение и преобразование. Помогаем выбрать оптимальную модель под цели бизнеса.</p>
            <p>Готовим документы, контролируем соблюдение процедур и сроков, минимизируем юридические и регистрационные риски при изменении структуры компании.</p>
            <ul>
              <li>Слияние и присоединение</li>
              <li>Разделение и выделение</li>
              <li>Преобразование юридического лица</li>
              <li>Подготовка полного комплекта документов</li>
            </ul>
        `
    },
    companyRegistration: {
        title: 'Создание компании',
        content: `
            <p>Регистрируем юридические лица любой организационно-правовой формы и с любым количеством учредителей. Помогаем выбрать оптимальный формат регистрации под задачи бизнеса.</p>
            <p>Сопровождаем клиента на всех этапах: от подготовки документов и выбора кодов деятельности до подачи заявления и получения регистрационных данных.</p>
            <ul>
              <li>Регистрация ООО и других форм юридических лиц</li>
              <li>Подготовка учредительных документов</li>
              <li>Консультации по выбору структуры компании</li>
              <li>Сопровождение процедуры регистрации</li>
            </ul>
        `
    },
    legalServices: {
        title: 'Все виды юридических услуг',
        content: `
            <p>Предоставляем комплексное юридическое сопровождение бизнеса и частных клиентов. Помогаем по корпоративным, договорным, регистрационным и иным правовым вопросам.</p>
            <p>Выстраиваем работу так, чтобы клиент получал не просто разовую консультацию, а понятное практическое решение своей задачи с учётом сроков, рисков и результата.</p>
            <ul>
              <li>Юридические консультации</li>
              <li>Подготовка и проверка документов</li>
              <li>Сопровождение корпоративных вопросов</li>
              <li>Правовая поддержка бизнеса на постоянной основе</li>
            </ul>
        `
    },
    bankruptcySupport: {
        title: 'Банкротство юридических и физических лиц',
        content: `
            <p>Помогаем пройти процедуру банкротства законно и с минимальными рисками.</p>
            <p>Сопровождаем клиентов на всех этапах — от анализа финансовой ситуации до завершения процедуры в суде.</p>
            <p><strong>Что входит в услугу:</strong></p>
            <ul>
              <li>Анализ финансового состояния и долгов</li>
              <li>Подготовка заявления о банкротстве</li>
              <li>Сбор и оформление документов</li>
              <li>Представительство в арбитражном суде</li>
              <li>Взаимодействие с финансовым управляющим</li>
              <li>Защита интересов клиента в ходе процедуры</li>
            </ul>
        `
    },
    registryChanges: {
        title: 'Изменения в ЕГРЮЛ и ЕГРИП',
        content: `
            <p>Подготавливаем документы и сопровождаем внесение изменений в государственные реестры юридических лиц и индивидуальных предпринимателей. Работаем быстро, аккуратно и с учётом действующих требований.</p>
            <p>Помогаем внести изменения в сведения о компании, составе участников, адресе, руководителе, видах деятельности и других регистрационных данных.</p>
            <ul>
              <li>Подготовка пакета документов</li>
              <li>Сопровождение подачи изменений</li>
              <li>Изменение сведений о компании и ИП</li>
              <li><a href="#prices" class="modal-link">Перейти к ценам</a></li>
            </ul>
        `
    }
};

function openServiceModal(key) {
    if (!serviceModal || !serviceModalTitle || !serviceModalContent) return;
    var item = serviceDetails[key];
    if (!item) return;
    serviceModalTitle.innerHTML = item.title;
    serviceModalContent.innerHTML = item.content;
    serviceModal.classList.add('is-open');
    serviceModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
}

function closeServiceModal() {
    if (!serviceModal) return;
    serviceModal.classList.remove('is-open');
    serviceModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
}

function openRegistryPriceModal() {
    if (!registryPriceModal) return;
    registryPriceModal.classList.add('is-open');
    registryPriceModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
}

function closeRegistryPriceModal() {
    if (!registryPriceModal) return;
    registryPriceModal.classList.remove('is-open');
    registryPriceModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
}

document.querySelectorAll('.service-details-btn').forEach(function(btn) {
    btn.addEventListener('click', function() {
        openServiceModal(btn.dataset.service);
    });
});

modalCloseButtons.forEach(function(btn) {
    btn.addEventListener('click', closeServiceModal);
});

registryPriceCloseButtons.forEach(function(btn) {
    btn.addEventListener('click', closeRegistryPriceModal);
});

if (serviceModalContent) {
    serviceModalContent.addEventListener('click', function(event) {
        var modalLink = event.target.closest('.modal-link');
        if (!modalLink) return;
        closeServiceModal();
    });
}

window.addEventListener('click', function(event) {
    var consultModal = document.getElementById('consultationModal');
    var policyModal = document.getElementById('policyModal');
    if (event.target === consultModal) closeModal();
    if (event.target === policyModal) closePolicyModal();
});

document.addEventListener('keydown', function(event) {
    if (event.key !== 'Escape') return;
    if (registryPriceModal && registryPriceModal.classList.contains('is-open')) closeRegistryPriceModal();
    if (serviceModal && serviceModal.classList.contains('is-open')) closeServiceModal();
    closeModal();
    closePolicyModal();
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

function showLeadFormMessage(text, type) {
    const messageDiv = document.getElementById('leadFormMessage');
    if (!messageDiv) return;
    messageDiv.textContent = text;
    messageDiv.className = `form-message ${type}`;
    messageDiv.style.display = 'block';
}

function hideLeadFormMessage() {
    const messageDiv = document.getElementById('leadFormMessage');
    if (!messageDiv) return;
    messageDiv.style.display = 'none';
}

function sanitizePhone(phone) {
    return String(phone || '').replace(/\D/g, '');
}

(function initLeadForm() {
    const form = document.getElementById('leadForm');
    if (!form) return;

    const submitBtn = document.getElementById('leadFormSubmit');
    const submitBtnText = document.getElementById('leadFormSubmitText');

    form.addEventListener('submit', async function(event) {
        event.preventDefault();
        hideLeadFormMessage();

        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        const phone = form.phone ? form.phone.value : '';
        const normalizedPhone = sanitizePhone(phone);
        if (normalizedPhone.length < 10) {
            showLeadFormMessage('������ ��������. ���������� ����� ��� �������� � Telegram.', 'error');
            if (form.phone) form.phone.focus();
            return;
        }

        const payload = {
            name: (form.name ? form.name.value : '').trim(),
            phone: phone.trim(),
            service: (form.service ? form.service.value : '').trim(),
            comment: (form.comment ? form.comment.value : '').trim(),
            page: location.href,
            ts: new Date().toISOString()
        };

        submitBtn.disabled = true;
        submitBtnText.innerHTML = '<span class="spinner"></span> ����������...';

        try {
            const response = await fetch(WEBHOOK_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) throw new Error('Webhook request failed');

            form.reset();
            showLeadFormMessage('������ ����������, �� �������� � ����.', 'success');
        } catch (error) {
            showLeadFormMessage('������ ��������. ���������� ����� ��� �������� � Telegram.', 'error');
        } finally {
            submitBtn.disabled = false;
            submitBtnText.textContent = '��������� ������';
        }
    });
})();

// Cookie Banner
function initCookieBanner() {
    const banner = document.getElementById("cookie-banner");
    const button = document.getElementById("cookie-accept-btn");

    if (!banner || !button) return;

    if (localStorage.getItem("cookieAccepted") === "true") return;

    banner.classList.add("is-visible");

    button.addEventListener("click", function () {
        banner.classList.remove("is-visible");
        localStorage.setItem("cookieAccepted", "true");
    });
}

document.addEventListener("DOMContentLoaded", function () {
    initCookieBanner();
});

// Mobile Menu (legacy stub — логика перенесена в headerInit)
function toggleMobileMenu() { /* no-op */ }

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
        const href = this.getAttribute('href');
        if (!href || href === '#' || href.length < 2 || !href.startsWith('#')) return;
        e.preventDefault();
        let target = null;
        try { target = document.querySelector(href); } catch (_) { return; }
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
    document.querySelectorAll('.tilt-card, .glass-effect:not(#cookie-banner)').forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        if (elementTop < window.innerHeight - 150) {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }
    });
}

document.querySelectorAll('.tilt-card, .glass-effect:not(#cookie-banner)').forEach(element => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(20px)';
    element.style.transition = 'all 0.6s ease';
});

window.addEventListener('scroll', revealOnScroll);
window.addEventListener('load', revealOnScroll);

// Global Page Click Ripple (always enabled — premium animation)
(function() {
    function ensureRippleLayer() {
        var layer = document.getElementById('click-ripple-layer');
        if (!layer) {
            layer = document.createElement('div');
            layer.id = 'click-ripple-layer';
            layer.setAttribute('aria-hidden', 'true');
            document.body.appendChild(layer);
        }
        return layer;
    }

    function spawnRipple(x, y) {
        var layer = ensureRippleLayer();
        var r = document.createElement('span');
        r.className = 'page-ripple';
        r.style.left = x + 'px';
        r.style.top = y + 'px';
        layer.appendChild(r);
        r.addEventListener('animationend', function() { r.remove(); });
        setTimeout(function() { if (r.parentNode) r.remove(); }, 1200);
    }

    function shouldIgnore(e) {
        if (e.button === 2) return true;
        if (e.target && e.target.closest && (e.target.closest('.modal-content') || e.target.closest('.service-modal') || e.target.closest('.price-modal'))) return true;
        return false;
    }

    var pointerSupported = typeof PointerEvent !== 'undefined';

    if (pointerSupported) {
        document.addEventListener('pointerdown', function(e) {
            if (shouldIgnore(e)) return;
            spawnRipple(e.clientX, e.clientY);
        }, { capture: true, passive: true });
    } else {
        document.addEventListener('mousedown', function(e) {
            if (shouldIgnore(e)) return;
            spawnRipple(e.clientX, e.clientY);
        }, { capture: true, passive: true });

        document.addEventListener('touchstart', function(e) {
            if (e.target && e.target.closest && (e.target.closest('.modal-content') || e.target.closest('.service-modal') || e.target.closest('.price-modal'))) return;
            var touch = e.touches[0];
            if (touch) spawnRipple(touch.clientX, touch.clientY);
        }, { capture: true, passive: true });
    }

    // Fallback click handler (ensures ripple on devices that miss pointerdown)
    document.addEventListener('click', function(e) {
        if (shouldIgnore(e)) return;
        // Skip if pointerdown already fired (avoid double ripple on desktop)
        if (pointerSupported) return;
        spawnRipple(e.clientX, e.clientY);
    }, { capture: true, passive: true });
})();

// ============================================================
// SITE HEADER — Sticky, burger, active nav, mobile menu
// ============================================================
(function headerInit() {
    var header     = document.getElementById('site-header');
    var burger     = document.getElementById('headerBurger');
    var mobileMenu = document.getElementById('mobileMenu');

    if (!header || !burger || !mobileMenu) return;

    // 1. Sticky scroll state
    function onHeaderScroll() {
        header.classList.toggle('is-scrolled', window.pageYOffset > 10);
    }
    window.addEventListener('scroll', onHeaderScroll, { passive: true });
    onHeaderScroll();

    // 2. Open mobile menu
    function openMenu() {
        mobileMenu.removeAttribute('hidden');
        // Одна кадр до добавления .is-open, чтобы запустились CSS-переходы
        requestAnimationFrame(function() {
            mobileMenu.classList.add('is-open');
        });
        burger.classList.add('is-open');
        burger.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden';
    }

    // 3. Close mobile menu
    function closeMenu() {
        mobileMenu.classList.remove('is-open');
        burger.classList.remove('is-open');
        burger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
        // Скрываем после завершения анимации (0.38s + запас)
        setTimeout(function() {
            if (!mobileMenu.classList.contains('is-open')) {
                mobileMenu.setAttribute('hidden', '');
            }
        }, 420);
    }

    // 4. Burger toggle
    burger.addEventListener('click', function() {
        mobileMenu.classList.contains('is-open') ? closeMenu() : openMenu();
    });

    // 5. Закрытие по [data-close] (backdrop, кнопка ×, ссылки меню)
    mobileMenu.addEventListener('click', function(e) {
        if (e.target.closest('[data-close]')) closeMenu();
    });

    // 6. Закрытие по Esc
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && mobileMenu.classList.contains('is-open')) {
            closeMenu();
            burger.focus();
        }
    });

    // 7. Подсветка активной секции через IntersectionObserver
    var desktopLinks = document.querySelectorAll('.site-nav a[data-nav-section]');
    var mobileLinks  = document.querySelectorAll('.mobile-panel nav a[data-nav-section]');
    var allNavLinks  = Array.prototype.slice.call(desktopLinks).concat(
                       Array.prototype.slice.call(mobileLinks));

    function setActive(sectionId) {
        allNavLinks.forEach(function(link) {
            link.classList.toggle('is-active', link.dataset.navSection === sectionId);
        });
    }

    if ('IntersectionObserver' in window) {
        var sections = document.querySelectorAll('section[id], footer[id]');
        var observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    setActive(entry.target.id === 'hero-section' ? '' : entry.target.id);
                }
            });
        }, { rootMargin: '-72px 0px -55% 0px', threshold: 0 });
        sections.forEach(function(s) { observer.observe(s); });
    }
})();

// Ripple Effect
(function() {
    // Selectors for all interactive buttons/links
    var rippleSelector = [
        '.btn-primary',
        'nav a',
        'footer a',
        '.mobile-menu a',
        'button:not(.close-modal):not(.hamburger):not(.faq-question)'
    ].join(',');

    // Mark non-btn-primary elements with interactive-btn class for press/hover CSS
    document.querySelectorAll(rippleSelector).forEach(function(el) {
        if (!el.classList.contains('btn-primary')) {
            el.classList.add('interactive-btn');
        }
    });

    // Add ripple on click via event delegation
    document.addEventListener('click', function(e) {
        var target = e.target.closest(rippleSelector);
        if (!target || prefersReducedMotion) return;

        var rect = target.getBoundingClientRect();
        var size = Math.max(rect.width, rect.height);
        var x = e.clientX - rect.left - size / 2;
        var y = e.clientY - rect.top - size / 2;

        var ripple = document.createElement('span');
        ripple.className = 'ripple';
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';

        target.appendChild(ripple);

        ripple.addEventListener('animationend', function() {
            ripple.remove();
        });
    });
})();


