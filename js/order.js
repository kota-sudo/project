const searchForm = document.getElementById("shop-search-form");
const searchInput = document.getElementById("shop-search-input");
const categorySelect = document.getElementById("shop-category-select");

const categoryChecks = document.querySelectorAll(".filter-category");
const purposeChecks = document.querySelectorAll(".filter-purpose");
const methodChecks = document.querySelectorAll(".filter-method");

const quickFilters = document.querySelectorAll(".quick-filter");
const productRows = document.querySelectorAll(".product-row");

const cartButtons = document.querySelectorAll(".product-cart-btn");
const cartCountDisplay = document.getElementById("cart-count-display");
const cartToast = document.getElementById("cart-toast");

const priceRange = document.querySelector(".price-range");
const priceRangeValue = document.querySelector(".price-range-value");
const priceLinks = document.querySelectorAll(".price-links a");

let cartCount = 0;

/* =========================
   utility
========================= */

function getCheckedValues(nodeList) {
    return Array.from(nodeList)
        .filter((input) => input.checked)
        .map((input) => input.value);
}

function normalizeText(text) {
    return text.toLowerCase().replace(/\s+/g, "");
}

function formatYen(value) {
    return `¥${Number(value).toLocaleString()}`;
}

/* =========================
   filtering
========================= */

function filterProducts() {
    const keyword = normalizeText(searchInput ? searchInput.value : "");
    const selectedCategory = categorySelect ? categorySelect.value : "all";

    const checkedCategories = getCheckedValues(categoryChecks);
    const checkedPurposes = getCheckedValues(purposeChecks);
    const checkedMethods = getCheckedValues(methodChecks);

    const maxPrice = priceRange ? Number(priceRange.value) : Infinity;

    let visibleCount = 0;

    productRows.forEach((row) => {
        const rowCategory = row.dataset.category || "";
        const rowPurpose = row.dataset.purpose || "";
        const rowMethods = (row.dataset.method || "").split(" ");
        const rowName = normalizeText(row.dataset.name || "");
        const rowDesc = normalizeText(row.dataset.desc || "");
        const rowPrice = Number(row.dataset.price || 0);

        const matchKeyword =
            keyword === "" ||
            rowName.includes(keyword) ||
            rowDesc.includes(keyword);

        const matchSelectCategory =
            selectedCategory === "all" || rowCategory === selectedCategory;

        const matchCheckedCategory =
            checkedCategories.length === 0 || checkedCategories.includes(rowCategory);

        const matchPurpose =
            checkedPurposes.length === 0 || checkedPurposes.includes(rowPurpose);

        const matchMethod =
            checkedMethods.length === 0 ||
            checkedMethods.every((method) => rowMethods.includes(method));

        const matchPrice = rowPrice <= maxPrice;

        const isVisible =
            matchKeyword &&
            matchSelectCategory &&
            matchCheckedCategory &&
            matchPurpose &&
            matchMethod &&
            matchPrice;

        if (isVisible) {
            row.classList.remove("is-hidden");
            visibleCount++;
        } else {
            row.classList.add("is-hidden");
        }
    });

    const resultText = document.querySelector(".results-head p");
    if (resultText) {
        resultText.textContent = `検索結果 ${visibleCount}件`;
    }

    if (priceRange && priceRangeValue) {
        priceRangeValue.textContent = `¥320 〜 ${formatYen(priceRange.value)}`;
    }
}

/* =========================
   search
========================= */

if (searchForm) {
    searchForm.addEventListener("submit", function (e) {
        e.preventDefault();
        filterProducts();
    });
}

if (searchInput) {
    searchInput.addEventListener("input", filterProducts);
}

if (categorySelect) {
    categorySelect.addEventListener("change", filterProducts);
}

[...categoryChecks, ...purposeChecks, ...methodChecks].forEach((input) => {
    input.addEventListener("change", filterProducts);
});

if (priceRange) {
    priceRange.addEventListener("input", filterProducts);
}

/* =========================
   price links
========================= */

priceLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
        e.preventDefault();

        const max = Number(this.dataset.priceMax);

        if (priceRange) {
            priceRange.value = max;
        }

        filterProducts();
    });
});

/* =========================
   quick filters
========================= */

quickFilters.forEach((link) => {
    link.addEventListener("click", function (e) {
        e.preventDefault();

        quickFilters.forEach((item) => item.classList.remove("active"));
        this.classList.add("active");

        const type = this.dataset.quick;

        if (categorySelect) {
            categorySelect.value = "all";
        }

        categoryChecks.forEach((input) => (input.checked = false));
        purposeChecks.forEach((input) => (input.checked = false));
        methodChecks.forEach((input) => (input.checked = false));

        if (type === "protein" || type === "meal" || type === "snack") {
            if (categorySelect) {
                categorySelect.value = type;
            }
        }

        if (type === "member") {
            methodChecks.forEach((input) => {
                if (input.value === "member") input.checked = true;
            });
        }

        if (type === "store") {
            methodChecks.forEach((input) => {
                if (input.value === "store") input.checked = true;
            });
        }

        if (type === "delivery") {
            methodChecks.forEach((input) => {
                if (input.value === "delivery") input.checked = true;
            });
        }

        filterProducts();
    });
});

/* =========================
   cart action
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

cartButtons.forEach((button) => {
    button.addEventListener("click", function () {
        cartCount += 1;
        updateCartCount();

        const productName = this.dataset.productName || "商品";
        const row = this.closest(".product-row");

        if (row) {
            row.classList.add("is-highlight");
            setTimeout(() => {
                row.classList.remove("is-highlight");
            }, 700);
        }

        const originalText = this.textContent;
        this.textContent = "追加しました";
        this.disabled = true;

        setTimeout(() => {
            this.textContent = originalText;
            this.disabled = false;
        }, 900);

        showToast(`${productName} をカートに追加しました`);
    });
});

/* =========================
   init
========================= */

filterProducts();
updateCartCount();