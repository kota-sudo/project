const scrollBar = document.querySelector(".scroll-bar");
const thumbButtons = document.querySelectorAll(".thumb-btn");
const mainImage = document.getElementById("main-product-image");

const addCartBtn = document.getElementById("add-cart-btn");
const cartCountDisplay = document.getElementById("cart-count-display");
const cartToast = document.getElementById("cart-toast");
const qtySelect = document.getElementById("qty");

const toggleReviewsBtn = document.getElementById("toggle-reviews-btn");
const reviewList = document.getElementById("review-list");

let cartCount = 0;

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

/* =========================
   image gallery
========================= */
thumbButtons.forEach((button) => {
    button.addEventListener("click", function () {
        const newImage = this.dataset.image;

        thumbButtons.forEach((btn) => btn.classList.remove("active"));
        this.classList.add("active");

        if (mainImage && newImage) {
            mainImage.src = newImage;
        }
    });
});

/* =========================
   review toggle
========================= */
if (toggleReviewsBtn && reviewList) {
    toggleReviewsBtn.addEventListener("click", function () {
        reviewList.classList.toggle("expanded");

        if (reviewList.classList.contains("expanded")) {
            this.textContent = "レビューを閉じる";
        } else {
            this.textContent = "レビューをもっと見る";
        }
    });
}

/* =========================
   cart toast
========================= */
function showToast(message) {
    if (!cartToast) return;

    cartToast.textContent = message;
    cartToast.classList.add("show");

    clearTimeout(showToast.timer);
    showToast.timer = setTimeout(() => {
        cartToast.classList.remove("show");
    }, 1800);
}

function updateCartCount() {
    if (cartCountDisplay) {
        cartCountDisplay.textContent = `カート ${cartCount}`;
    }
}

if (addCartBtn) {
    addCartBtn.addEventListener("click", function () {
        const quantity = qtySelect ? Number(qtySelect.value) : 1;
        const productName = this.dataset.productName || "商品";

        cartCount += quantity;
        updateCartCount();

        const originalText = this.textContent;
        this.textContent = "追加しました";
        this.disabled = true;

        setTimeout(() => {
            this.textContent = originalText;
            this.disabled = false;
        }, 900);

        showToast(`${productName} を ${quantity}点 カートに追加しました`);
    });
}

updateCartCount();