document.addEventListener("DOMContentLoaded", () => {
    const animatedItems = document.querySelectorAll(".fade-up, .fade-left, .fade-right");

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("is-visible");
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15
    });

    animatedItems.forEach((item, index) => {
        item.style.transitionDelay = `${Math.min(index * 0.06, 0.35)}s`;
        observer.observe(item);
    });

    const hoverCards = document.querySelectorAll(
        ".event-impact-card, .event-flow-card, .event-merit-card, .event-note-card, .event-about-point, .event-sub-card"
    );

    hoverCards.forEach((card) => {
        card.addEventListener("mousemove", (e) => {
            if (window.innerWidth <= 768) return;

            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -2;
            const rotateY = ((x - centerX) / centerX) * 2;

            card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
        });

        card.addEventListener("mouseleave", () => {
            card.style.transform = "";
        });
    });
});