const faqQuestions = document.querySelectorAll(".faq-question");
const categoryLinks = document.querySelectorAll(".faq-category-link");
const scrollBar = document.querySelector(".scroll-bar");
const faqSections = document.querySelectorAll(".faq-section");
const header = document.querySelector(".faq-header");

/* =========================
   faq accordion
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
   category nav smooth scroll
========================= */

function getHeaderHeight() {
    return header ? header.offsetHeight : 80;
}

categoryLinks.forEach(function (link) {
    link.addEventListener("click", function (e) {
        e.preventDefault();

        const targetId = this.getAttribute("href");
        const target = document.querySelector(targetId);
        if (!target) return;

        categoryLinks.forEach(function (item) {
            item.classList.remove("active");
        });

        this.classList.add("active");

        const targetTop =
            target.getBoundingClientRect().top + window.pageYOffset - getHeaderHeight() - 20;

        window.scrollTo({
            top: targetTop,
            behavior: "smooth"
        });
    });
});

/* =========================
   active category on scroll
========================= */

function updateActiveCategory() {
    let currentId = "";

    faqSections.forEach(function (section) {
        const sectionTop = section.offsetTop - getHeaderHeight() - 80;
        if (window.scrollY >= sectionTop) {
            currentId = section.getAttribute("id");
        }
    });

    if (currentId) {
        categoryLinks.forEach(function (link) {
            link.classList.remove("active");

            if (link.getAttribute("href") === "#" + currentId) {
                link.classList.add("active");
            }
        });
    }
}

window.addEventListener("scroll", updateActiveCategory);
window.addEventListener("load", updateActiveCategory);

/* =========================
   scroll bar
========================= */

function updateScrollBar() {
    if (!scrollBar) return;

    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

    scrollBar.style.width = progress + "%";
}

window.addEventListener("scroll", updateScrollBar);
window.addEventListener("load", updateScrollBar);