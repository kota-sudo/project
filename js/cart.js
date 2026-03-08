const cartList = document.getElementById("cart-list");
const cartEmpty = document.getElementById("cart-empty");
const cartItemCount = document.getElementById("cart-item-count");

const summaryQty = document.getElementById("summary-qty");
const summaryTotal = document.getElementById("summary-total");
const shippingFee = document.getElementById("shipping-fee");
const grandTotal = document.getElementById("grand-total");
const deliveryMethod = document.getElementById("delivery-method");

/* デモ用の仮データ
   あとで order/product-detail から localStorage に保存する形に変えられる
*/
let cartData = [
    {
        id: 1,
        name: "高たんぱくキーマカレー",
        desc: "食べ応えがありつつ脂質は控えめ。人気のバランス型メニュー。",
        price: 880,
        quantity: 1,
        image: "img/meal-2.jpg"
    },
    {
        id: 2,
        name: "男磨きホエイプロテイン 1kg リッチショコラ味",
        desc: "トレーニング後に取り入れやすい定番プロテイン。",
        price: 4480,
        quantity: 1,
        image: "img/protein-1.jpg"
    }
];

function formatPrice(price) {
    return `¥${price.toLocaleString()}`;
}

function getShipping() {
    if (!deliveryMethod) return 0;
    return deliveryMethod.value === "delivery" ? 500 : 0;
}

function updateSummary() {
    const totalQty = cartData.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = cartData.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shipping = getShipping();
    const total = subtotal + shipping;

    if (cartItemCount) cartItemCount.textContent = `${totalQty}点`;
    if (summaryQty) summaryQty.textContent = `${totalQty}点`;
    if (summaryTotal) summaryTotal.textContent = formatPrice(subtotal);
    if (shippingFee) shippingFee.textContent = formatPrice(shipping);
    if (grandTotal) grandTotal.textContent = formatPrice(total);
}

function renderCart() {
    if (!cartList || !cartEmpty) return;

    cartList.innerHTML = "";

    if (cartData.length === 0) {
        cartEmpty.style.display = "block";
        updateSummary();
        return;
    }

    cartEmpty.style.display = "none";

    cartData.forEach((item) => {
        const itemEl = document.createElement("article");
        itemEl.className = "cart-item";

        itemEl.innerHTML = `
            <div class="cart-item-image">
                <img src="${item.image}" alt="${item.name}">
            </div>

            <div class="cart-item-info">
                <h3 class="cart-item-name">${item.name}</h3>
                <p class="cart-item-desc">${item.desc}</p>
                <p class="cart-item-price">単価 ${formatPrice(item.price)}</p>
            </div>

            <div class="cart-item-actions">
                <div class="qty-control">
                    <button class="qty-btn" data-action="minus" data-id="${item.id}">−</button>
                    <span class="qty-value">${item.quantity}</span>
                    <button class="qty-btn" data-action="plus" data-id="${item.id}">＋</button>
                </div>

                <p class="item-total">${formatPrice(item.price * item.quantity)}</p>

                <button class="remove-btn" data-action="remove" data-id="${item.id}">削除する</button>
            </div>
        `;

        cartList.appendChild(itemEl);
    });

    updateSummary();
    bindCartActions();
}

function bindCartActions() {
    const actionButtons = document.querySelectorAll("[data-action]");

    actionButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const id = Number(button.dataset.id);
            const action = button.dataset.action;
            const target = cartData.find((item) => item.id === id);

            if (!target) return;

            if (action === "plus") {
                target.quantity += 1;
            }

            if (action === "minus") {
                target.quantity -= 1;
                if (target.quantity <= 0) {
                    cartData = cartData.filter((item) => item.id !== id);
                }
            }

            if (action === "remove") {
                cartData = cartData.filter((item) => item.id !== id);
            }

            renderCart();
        });
    });
}

if (deliveryMethod) {
    deliveryMethod.addEventListener("change", updateSummary);
}

renderCart();