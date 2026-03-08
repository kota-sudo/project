const menuIcon = document.querySelector(".menu-icon");
const menu = document.getElementById("menu");
const menuClose = document.getElementById("menu-close");
const menuLinks = document.querySelectorAll(".menu-list a");
const menuEntry = document.querySelector(".menu-entry");

const faqQuestions = document.querySelectorAll(".faq-question");

const fadeItems = document.querySelectorAll(".fade-up, .fade-left, .fade-right");
const header = document.querySelector(".header");

const resultNumbers = document.querySelectorAll(".results .result-number");
const resultsSection = document.querySelector(".results");
const scrollBar = document.querySelector(".scroll-bar");

const resultCards = document.querySelectorAll(".results-card");
const prevBtn = document.querySelector(".slider-prev");
const nextBtn = document.querySelector(".slider-next");
const resultsSlider = document.getElementById("results-slider");

const floatingCta = document.querySelector(".floating-cta");
const hero = document.querySelector(".hero");

const staggerGroups = [
    document.querySelectorAll(".review-card.stagger-item"),
    document.querySelectorAll(".feature-card.stagger-item"),
    document.querySelectorAll(".equipment-card.stagger-item")
];

const stepBadges = document.querySelectorAll(".step-badge");

let currentResultIndex = 0;
let touchStartX = 0;
let touchEndX = 0;

/* =========================
   common
========================= */

function openMenu() {
    if (!menu) return;
    menu.classList.add("active");
    document.body.style.overflow = "hidden";
}

function closeMenu() {
    if (!menu) return;
    menu.classList.remove("active");
    document.body.style.overflow = "auto";
}

function getHeaderHeight() {
    return header ? header.offsetHeight : 80;
}

function smoothScrollToTarget(targetSelector) {
    const target = document.querySelector(targetSelector);
    if (!target) return;

    const headerHeight = getHeaderHeight();
    const targetTop =
        target.getBoundingClientRect().top + window.pageYOffset - headerHeight;

    window.scrollTo({
        top: targetTop,
        behavior: "smooth"
    });
}

function handleMenuLink(link) {
    const href = link.getAttribute("href");

    if (!href) return;

    /* 別ページはそのまま遷移 */
    if (!href.startsWith("#")) {
        closeMenu();
        return;
    }

    /* ページ内リンクはメニュー閉じてからスクロール */
    link.addEventListener("click", function (e) {
        e.preventDefault();
        closeMenu();

        setTimeout(function () {
            smoothScrollToTarget(href);
        }, 250);
    });
}

/* =========================
   menu
========================= */

if (menuIcon) {
    menuIcon.addEventListener("click", function () {
        openMenu();
    });
}

if (menuClose) {
    menuClose.addEventListener("click", function () {
        closeMenu();
    });
}

if (menu) {
    menu.addEventListener("click", function (e) {
        if (e.target === menu) {
            closeMenu();
        }
    });
}

menuLinks.forEach(function (link) {
    handleMenuLink(link);
});

if (menuEntry) {
    handleMenuLink(menuEntry);
}

/* =========================
   faq
========================= */

faqQuestions.forEach(function (question) {
    question.addEventListener("click", function () {
        const currentItem = this.parentElement;
        const currentAnswer = currentItem.querySelector(".faq-answer");

        faqQuestions.forEach(function (otherQuestion) {
            const otherItem = otherQuestion.parentElement;
            const otherAnswer = otherItem.querySelector(".faq-answer");

            if (otherItem !== currentItem) {
                otherItem.classList.remove("active");
                otherAnswer.style.maxHeight = null;
            }
        });

        if (currentItem.classList.contains("active")) {
            currentItem.classList.remove("active");
            currentAnswer.style.maxHeight = null;
        } else {
            currentItem.classList.add("active");
            currentAnswer.style.maxHeight = currentAnswer.scrollHeight + "px";
        }
    });
});

/* =========================
   fade animation
========================= */

function checkFade() {
    fadeItems.forEach(function (item) {
        const itemTop = item.getBoundingClientRect().top;

        if (itemTop < window.innerHeight - 100) {
            item.classList.add("show");
        }
    });
}

window.addEventListener("scroll", checkFade);
window.addEventListener("load", checkFade);

/* =========================
   header scroll
========================= */

function checkHeader() {
    if (window.scrollY > 50) {
        header.classList.add("scrolled");
    } else {
        header.classList.remove("scrolled");
    }
}

window.addEventListener("scroll", checkHeader);
window.addEventListener("load", checkHeader);

/* =========================
   results number animation
========================= */

function animateValue(element, target, duration = 1600) {
    let startTimestamp = null;

    function step(timestamp) {
        if (!startTimestamp) startTimestamp = timestamp;

        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const current = Math.floor(progress * target);

        element.textContent = current.toLocaleString();

        if (progress < 1) {
            requestAnimationFrame(step);
        } else {
            element.textContent = target.toLocaleString();
        }
    }

    requestAnimationFrame(step);
}

if (resultsSection) {
    let hasAnimated = false;

    const observer = new IntersectionObserver(
        function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting && !hasAnimated) {
                    resultNumbers.forEach(function (number) {
                        const target = Number(number.dataset.target);
                        number.textContent = "0";
                        animateValue(number, target, 1600);
                    });

                    hasAnimated = true;
                }
            });
        },
        {
            threshold: 0.5
        }
    );

    observer.observe(resultsSection);
}

/* =========================
   scroll bar
========================= */

function updateScrollBar() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (scrollTop / docHeight) * 100;

    scrollBar.style.width = progress + "%";
}

window.addEventListener("scroll", updateScrollBar);
window.addEventListener("load", updateScrollBar);

/* =========================
   results slider
========================= */

function showSlide(index) {
    resultCards.forEach(function (card) {
        card.classList.remove("active");
    });

    resultCards[index].classList.add("active");
}

function startResultsSlider() {
    if (window.innerWidth > 768 || resultCards.length === 0) return;

    setInterval(function () {
        resultCards[currentResultIndex].classList.remove("active");
        currentResultIndex = (currentResultIndex + 1) % resultCards.length;
        resultCards[currentResultIndex].classList.add("active");
    }, 3000);
}

window.addEventListener("load", function () {
    if (window.innerWidth <= 768 && resultCards.length > 0) {
        resultCards[0].classList.add("active");
    }

    startResultsSlider();
});

if (nextBtn && prevBtn) {
    nextBtn.addEventListener("click", function () {
        currentResultIndex = (currentResultIndex + 1) % resultCards.length;
        showSlide(currentResultIndex);
    });

    prevBtn.addEventListener("click", function () {
        currentResultIndex =
            (currentResultIndex - 1 + resultCards.length) % resultCards.length;
        showSlide(currentResultIndex);
    });
}

/* =========================
   results swipe
========================= */

if (resultsSlider) {
    resultsSlider.addEventListener("touchstart", function (e) {
        touchStartX = e.changedTouches[0].screenX;
    });

    resultsSlider.addEventListener("touchend", function (e) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });
}

function handleSwipe() {
    const swipeDistance = touchEndX - touchStartX;

    if (swipeDistance < -50) {
        currentResultIndex = (currentResultIndex + 1) % resultCards.length;
        showSlide(currentResultIndex);
    }

    if (swipeDistance > 50) {
        currentResultIndex =
            (currentResultIndex - 1 + resultCards.length) % resultCards.length;
        showSlide(currentResultIndex);
    }
}

/* =========================
   floating cta
========================= */

if (floatingCta && hero) {
    function checkFloatingCta() {
        const heroBottom = hero.offsetHeight;

        if (window.scrollY > heroBottom) {
            floatingCta.classList.add("show");
        } else {
            floatingCta.classList.remove("show");
        }
    }

    window.addEventListener("scroll", checkFloatingCta);
    window.addEventListener("load", checkFloatingCta);
}

/* =========================
   stagger animation
========================= */

function checkStagger() {
    staggerGroups.forEach(function (group) {
        if (group.length === 0) return;

        const firstItemTop = group[0].getBoundingClientRect().top;

        if (firstItemTop < window.innerHeight - 80) {
            group.forEach(function (item, index) {
                if (!item.classList.contains("show")) {
                    setTimeout(function () {
                        item.classList.add("show");
                    }, index * 140);
                }
            });
        }
    });
}

window.addEventListener("scroll", checkStagger);
window.addEventListener("load", checkStagger);

/* =========================
   step badge animation
========================= */

function showSteps() {
    stepBadges.forEach((badge, index) => {
        const top = badge.getBoundingClientRect().top;

        if (top < window.innerHeight - 80) {
            setTimeout(() => {
                badge.classList.add("show");
            }, index * 300);
        }
    });
}

window.addEventListener("scroll", showSteps);
window.addEventListener("load", showSteps);

/* =========================
   event mobile auto slider
========================= */

document.addEventListener("DOMContentLoaded", function () {
    const eventList = document.querySelector(".event-list");
    if (!eventList) return;

    const eventCards = eventList.querySelectorAll(".event-sub-card");
    if (eventCards.length === 0) return;

    let currentIndex = 0;
    let autoSlideTimer = null;

    function isMobile() {
        return window.innerWidth <= 767;
    }

    function goToSlide(index) {
        const card = eventCards[index];
        if (!card) return;

        eventList.scrollTo({
            left: card.offsetLeft,
            behavior: "smooth"
        });
    }

    function stopEventAutoSlide() {
        if (autoSlideTimer) {
            clearInterval(autoSlideTimer);
            autoSlideTimer = null;
        }
    }

    function startEventAutoSlide() {
        stopEventAutoSlide();

        if (!isMobile()) return;

        autoSlideTimer = setInterval(function () {
            currentIndex++;

            if (currentIndex >= eventCards.length) {
                currentIndex = 0;
            }

            goToSlide(currentIndex);
        }, 3000);
    }

    function resetEventSlider() {
        currentIndex = 0;

        eventList.scrollTo({
            left: 0,
            behavior: "auto"
        });
    }

    startEventAutoSlide();

    window.addEventListener("resize", function () {
        stopEventAutoSlide();
        resetEventSlider();
        startEventAutoSlide();
    });

    eventList.addEventListener("touchstart", function () {
        stopEventAutoSlide();
    });

    eventList.addEventListener("touchend", function () {
        setTimeout(function () {
            startEventAutoSlide();
        }, 4000);
    });
});