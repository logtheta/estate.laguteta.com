// Application state
let currentLang = localStorage.getItem('lang') || 'it';
let currentProperty = null;
let currentMediaIndex = 0;

// DOM elements
const propertyTabs = document.getElementById('propertyTabs');
const propertyPrice = document.getElementById('propertyPrice');
const propertyLocation = document.getElementById('propertyLocation');
const propertyStats = document.getElementById('propertyStats');
const propertyFeatures = document.getElementById('propertyFeatures');
const propertyDescription = document.getElementById('propertyDescription');
const propertyPricingDetails = document.getElementById('propertyPricingDetails');
const mainImage = document.getElementById('mainImage');
const mainVideo = document.getElementById('mainVideo');
const gallerySideImages = document.getElementById('gallerySideImages');
const seeAllPhotos = document.getElementById('seeAllPhotos');
const photoCount = document.getElementById('photoCount');
const formSubject = document.getElementById('formSubject');
const formProperty = document.getElementById('formProperty');

// Lightbox elements
const lightbox = document.getElementById('lightbox');
const lightboxImage = document.getElementById('lightboxImage');
const lightboxVideo = document.getElementById('lightboxVideo');
const lightboxCounter = document.getElementById('lightboxCounter');
const lightboxThumbs = document.getElementById('lightboxThumbs');
const lightboxClose = document.getElementById('lightboxClose');
const lightboxPrev = document.getElementById('lightboxPrev');
const lightboxNext = document.getElementById('lightboxNext');

// Initialize
function init() {
    setupLanguageSwitcher();
    renderPropertyTabs();
    if (PROPERTIES.length > 0) {
        selectProperty(PROPERTIES[0].id);
    }
    updateLanguage(currentLang);
    setupLightbox();
}

// Language
function setupLanguageSwitcher() {
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            updateLanguage(btn.dataset.lang);
        });
    });
}

function updateLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('lang', lang);
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.lang === lang);
    });
    document.documentElement.lang = lang;
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.dataset.i18n;
        if (TRANSLATIONS[lang] && TRANSLATIONS[lang][key]) {
            el.textContent = TRANSLATIONS[lang][key];
        }
    });
    if (currentProperty) {
        renderProperty(currentProperty);
    }
}

// Tabs
function renderPropertyTabs() {
    propertyTabs.innerHTML = PROPERTIES.map(prop => `
        <button class="property-tab" data-property="${prop.id}">${getText(prop.name)}</button>
    `).join('');
    propertyTabs.querySelectorAll('.property-tab').forEach(tab => {
        tab.addEventListener('click', () => selectProperty(tab.dataset.property));
    });
}

function selectProperty(propertyId) {
    currentProperty = PROPERTIES.find(p => p.id === propertyId);
    if (!currentProperty) return;
    document.querySelectorAll('.property-tab').forEach(tab => {
        tab.classList.toggle('active', tab.dataset.property === propertyId);
        const prop = PROPERTIES.find(p => p.id === tab.dataset.property);
        if (prop) tab.textContent = getText(prop.name);
    });
    currentMediaIndex = 0;
    renderProperty(currentProperty);
}

// Render property
function renderProperty(property) {
    // Price
    const mainPrice = property.pricing[0];
    propertyPrice.textContent = getText(mainPrice.price);

    // Location
    propertyLocation.textContent = getText(property.location);
    propertyLocation.href = property.mapsUrl || '#';

    // Stats
    propertyStats.innerHTML = `
        <div class="stat-item">
            <div class="stat-value">1</div>
            <div class="stat-label">${currentLang === 'it' ? 'ettaro' : 'hectare'}</div>
        </div>
        <div class="stat-item">
            <div class="stat-value">4</div>
            <div class="stat-label">${currentLang === 'it' ? 'min dal mare' : 'min to sea'}</div>
        </div>
    `;

    // Features with meaningful icons
    const featureIcons = {
        'tree': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22v-7"/><path d="M9 9V3l3 3 3-3v6"/><path d="M5 14l7-7 7 7"/><path d="M3 18l9-9 9 9"/></svg>',
        'water': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v6"/><path d="M12 22a8 8 0 0 0 8-8c0-4-8-10-8-10S4 10 4 14a8 8 0 0 0 8 8z"/></svg>',
        'tractor': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="5" y="11" width="14" height="6" rx="1"/><path d="M12 11V7H8l-2 4"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/><path d="M14 17h-4"/></svg>',
        'bolt': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>',
        'default': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>'
    };
    propertyFeatures.innerHTML = property.features ? property.features.map(f => `
        <div class="feature-item">
            ${featureIcons[f.icon] || featureIcons['default']}
            <span>${getText(f.label)}</span>
        </div>
    `).join('') : '';

    // Description
    const descText = getText(property.description);
    propertyDescription.innerHTML = `<p>${descText.replace(/\n\n/g, ' ')}</p>`;

    // Pricing
    const pricingTitle = TRANSLATIONS[currentLang]['pricing.title'] || 'Pricing Options';
    propertyPricingDetails.innerHTML = `
        <h3>${pricingTitle}</h3>
        ${property.pricing.map(item => `
            <div class="pricing-row">
                <span class="pricing-label">${getText(item.label)}</span>
                <span class="pricing-value">${getText(item.price)}</span>
            </div>
        `).join('')}
    `;

    // Gallery
    renderGallery(property);

    // Update form subject and property
    const propertyName = getText(property.name);
    const subjectText = currentLang === 'it'
        ? `Richiesta per ${propertyName}`
        : `Inquiry for ${propertyName}`;
    formSubject.value = subjectText;
    formProperty.value = propertyName;
}

// Gallery
function renderGallery(property) {
    const media = property.media;

    // Main image
    if (media[0]) {
        if (media[0].type === 'video') {
            mainImage.style.display = 'none';
            mainVideo.style.display = 'block';
            mainVideo.src = media[0].src;
        } else {
            mainVideo.style.display = 'none';
            mainImage.style.display = 'block';
            mainImage.src = media[0].src;
        }
    }

    // Side images (show 4 in a 2x2 grid)
    gallerySideImages.innerHTML = media.slice(1, 5).map((item, i) => `
        <div class="gallery-side-image" data-index="${i + 1}">
            <img src="${item.type === 'video' ? (item.poster || '') : item.src}" alt="Property image ${i + 2}">
        </div>
    `).join('');

    // Photo count
    const countText = currentLang === 'it'
        ? `Vedi tutte le ${media.length} foto`
        : `See all ${media.length} photos`;
    photoCount.textContent = countText;

    // Click handlers
    document.getElementById('galleryMainImage').onclick = () => openLightbox(0);
    gallerySideImages.querySelectorAll('.gallery-side-image').forEach(el => {
        el.onclick = () => openLightbox(parseInt(el.dataset.index));
    });
    seeAllPhotos.onclick = () => openLightbox(0);
}

// Lightbox
function setupLightbox() {
    lightboxClose.onclick = closeLightbox;
    lightbox.onclick = (e) => {
        if (e.target === lightbox) closeLightbox();
    };
    lightboxPrev.onclick = () => navigateLightbox(-1);
    lightboxNext.onclick = () => navigateLightbox(1);
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') navigateLightbox(-1);
        if (e.key === 'ArrowRight') navigateLightbox(1);
    });
    // Touch swipe support
    let touchStartX = 0;
    let touchEndX = 0;
    lightbox.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    lightbox.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        const diff = touchStartX - touchEndX;
        if (Math.abs(diff) > 50) {
            if (diff > 0) navigateLightbox(1);
            else navigateLightbox(-1);
        }
    }, { passive: true });
}

function openLightbox(index) {
    if (!currentProperty) return;
    currentMediaIndex = index;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
    renderLightboxThumbs();
    showLightboxMedia(index);
}

function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
    lightboxVideo.pause();
}

function navigateLightbox(dir) {
    if (!currentProperty) return;
    const total = currentProperty.media.length;
    currentMediaIndex = (currentMediaIndex + dir + total) % total;
    showLightboxMedia(currentMediaIndex);
}

function showLightboxMedia(index) {
    const media = currentProperty.media[index];
    const total = currentProperty.media.length;

    lightboxCounter.textContent = `${index + 1} / ${total}`;

    if (media.type === 'video') {
        lightboxImage.style.display = 'none';
        lightboxVideo.style.display = 'block';
        lightboxVideo.src = media.src;
    } else {
        lightboxVideo.style.display = 'none';
        lightboxVideo.pause();
        lightboxImage.style.display = 'block';
        lightboxImage.src = media.src;
    }

    lightboxThumbs.querySelectorAll('.lightbox-thumb').forEach((thumb, i) => {
        thumb.classList.toggle('active', i === index);
    });
}

function renderLightboxThumbs() {
    lightboxThumbs.innerHTML = currentProperty.media.map((item, i) => {
        const src = item.type === 'video' ? (item.poster || item.src) : item.src;
        return `<div class="lightbox-thumb ${i === 0 ? 'active' : ''}" data-index="${i}">
            <img src="${src}" alt="">
        </div>`;
    }).join('');

    lightboxThumbs.querySelectorAll('.lightbox-thumb').forEach(thumb => {
        thumb.onclick = () => {
            currentMediaIndex = parseInt(thumb.dataset.index);
            showLightboxMedia(currentMediaIndex);
        };
    });
}

// Utility
function getText(obj) {
    if (typeof obj === 'string') return obj;
    if (obj && typeof obj === 'object') {
        return obj[currentLang] || obj.en || obj.it || '';
    }
    return '';
}

document.addEventListener('DOMContentLoaded', init);
