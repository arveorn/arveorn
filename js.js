(function () {
    'use strict';

    var nav = document.getElementById('templatemo-nav');
    var navToggle = document.getElementById('navToggle');
    var navLinks = document.getElementById('navLinks');
    var navItems = document.querySelectorAll('.nav-links a');
    var sections = document.querySelectorAll('.parallax-section');
    var parallaxBgs = document.querySelectorAll('.parallax-bg');
    var revealElements = document.querySelectorAll('.section-content');
    var galleryItems = document.querySelectorAll('.gallery-item');
    var btnMore = document.getElementById('btnMore');
    var ITEMS_PER_STEP = 8;
    var lightbox = document.getElementById('lightbox');
    var lightboxImg = document.getElementById('lightboxImg');
    var lightboxTitle = document.getElementById('lightboxTitle');
    var lightboxDesc = document.getElementById('lightboxDesc');
    var lightboxLink = document.getElementById('lightboxLink');
    var lightboxLinkText = document.getElementById('lightboxLinkText');
    var lightboxClose = document.getElementById('lightboxClose');
    
    var isMobile = /Android|iPhone|iPad|iPod|webOS|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth <= 768;
    var ticking = false;

    function updateParallax() {
        if (isMobile) return;
        var windowHeight = window.innerHeight;
        parallaxBgs.forEach(function (bg) {
            var section = bg.parentElement;
            var rect = section.getBoundingClientRect();
            if (rect.bottom < -300 || rect.top > windowHeight + 300) return;
            var speed = parseFloat(bg.getAttribute('data-speed')) || 0.5;
            var sectionCenterY = rect.top + rect.height / 2;
            var viewportCenterY = windowHeight / 2;
            var offset = sectionCenterY - viewportCenterY;
            var totalTravel = windowHeight + rect.height;
            var normalized = offset / (totalTravel / 2);
            normalized = Math.max(-1, Math.min(1, normalized));
            var maxShift = windowHeight * speed;
            var translateY = normalized * maxShift;
            bg.style.transform = 'translate3d(0,' + translateY.toFixed(1) + 'px,0)';
        });
        ticking = false;
    }

    function onScroll() {
        if (!ticking) {
            window.requestAnimationFrame(updateParallax);
            ticking = true;
        }
    }

    if (!isMobile) {
        window.addEventListener('scroll', onScroll, { passive: true });
        updateParallax();
    }

    window.addEventListener('resize', function () {
        isMobile = window.innerWidth <= 768;
        if (!isMobile) {
            updateParallax();
        } else {
            parallaxBgs.forEach(function (bg) { bg.style.transform = 'translate3d(0,0,0)'; });
        }
    });

    function handleNavScroll() {
        if (window.scrollY > 80) nav.classList.add('scrolled');
        else nav.classList.remove('scrolled');
    }
    window.addEventListener('scroll', handleNavScroll, { passive: true });
    handleNavScroll();

    navToggle.addEventListener('click', function () {
        navToggle.classList.toggle('active');
        navLinks.classList.toggle('open');
    });

    navItems.forEach(function (link) {
        link.addEventListener('click', function () {
            navToggle.classList.remove('active');
            navLinks.classList.remove('open');
        });
    });

    function updateActiveLink() {
        var scrollPos = window.scrollY + window.innerHeight / 3;
        sections.forEach(function (section) {
            var top = section.offsetTop;
            var height = section.offsetHeight;
            var id = section.getAttribute('id');
            if (scrollPos >= top && scrollPos < top + height) {
                navItems.forEach(function (link) {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + id) link.classList.add('active');
                });
            }
        });
    }
    window.addEventListener('scroll', updateActiveLink, { passive: true });
    updateActiveLink();

    revealElements.forEach(function (el) { el.classList.add('reveal'); });
    function checkReveal() {
        var windowHeight = window.innerHeight;
        revealElements.forEach(function (el) {
            if (el.getBoundingClientRect().top < windowHeight - 120) el.classList.add('visible');
        });
    }
    window.addEventListener('scroll', checkReveal, { passive: true });
    checkReveal();

    galleryItems.forEach(function (item) {
        var img = item.querySelector('img');
        if (!img) return;
        if (img.complete && img.naturalWidth > 0) {
            item.classList.remove('is-empty');
        } else if (img.complete && img.naturalWidth === 0) {
            item.classList.add('is-empty');
        } else {
            img.addEventListener('load', function () { item.classList.remove('is-empty'); });
            img.addEventListener('error', function () { item.classList.add('is-empty'); });
        }
    });

    function updateMoreButtonVisibility() {
        if (!btnMore) return;
        var stillHidden = document.querySelectorAll('.gallery-item.gallery-hidden');
        if (stillHidden.length === 0) btnMore.classList.add('is-done');
        else btnMore.classList.remove('is-done');
    }

    function showMoreItems() {
        var hidden = document.querySelectorAll('.gallery-item.gallery-hidden');
        var toShow = Array.prototype.slice.call(hidden, 0, ITEMS_PER_STEP);
        toShow.forEach(function (item) { item.classList.remove('gallery-hidden'); });
        updateMoreButtonVisibility();
    }

    if (btnMore) {
        updateMoreButtonVisibility();
        btnMore.addEventListener('click', showMoreItems);
    }

    function isItemLoaded(item) {
        var img = item.querySelector('img');
        return !!(img && img.complete && img.naturalWidth > 0);
    }

    function openLightbox(item) {
        var full = item.getAttribute('data-full') || (item.querySelector('img') ? item.querySelector('img').src : '');
        var title = item.getAttribute('data-title') || '';
        var desc = item.getAttribute('data-desc') || '';
        var link = item.getAttribute('data-link') || '';
        var linktext = item.getAttribute('data-linktext') || 'View on Telegram';

        lightboxImg.src = full;
        lightboxImg.alt = title;
        lightboxTitle.textContent = title;

        if (desc) {
            lightboxDesc.textContent = desc;
            lightboxDesc.style.display = '';
        } else {
            lightboxDesc.textContent = '';
            lightboxDesc.style.display = 'none';
        }

        if (link) {
            lightboxLink.href = link;
            lightboxLinkText.textContent = linktext;
            lightboxLink.classList.remove('is-hidden');
        } else {
            lightboxLink.href = '#';
            lightboxLink.classList.add('is-hidden');
        }

        lightbox.classList.add('open');
        lightbox.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        lightbox.classList.remove('open');
        lightbox.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        setTimeout(function () {
            lightboxImg.src = '';
            lightboxTitle.textContent = '';
            lightboxDesc.textContent = '';
            lightboxLink.href = '#';
        }, 350);
    }

    galleryItems.forEach(function (item) {
        item.addEventListener('click', function () {
            if (!isItemLoaded(item)) return;
            openLightbox(item);
        });
    });

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && lightbox.classList.contains('open')) closeLightbox();
    });

    lightbox.addEventListener('click', function (e) {
        if (e.target === lightbox) closeLightbox();
    });

    if (lightboxClose) {
        lightboxClose.addEventListener('click', function (e) {
            e.stopPropagation();
            closeLightbox();
        });
    }

    var homeSection = document.getElementById('home');
    var scrollHint;
    if (homeSection) {
        scrollHint = document.createElement('div');
        scrollHint.className = 'scroll-hint';
        homeSection.appendChild(scrollHint);

        setTimeout(function () { scrollHint.classList.add('visible'); }, 5000);

        var hintObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    if (scrollHint.classList.contains('visible')) scrollHint.style.opacity = '';
                } else {
                    scrollHint.style.opacity = '0';
                }
            });
        }, { threshold: 0.5 });
        hintObserver.observe(homeSection);
    }
})();