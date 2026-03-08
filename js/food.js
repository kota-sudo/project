const scrollBar = document.querySelector(".scroll-bar");

function updateScrollBar() {
    if (!scrollBar) return;

    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

    scrollBar.style.width = progress + "%";
}

window.addEventListener("scroll", updateScrollBar);
window.addEventListener("load", updateScrollBar);