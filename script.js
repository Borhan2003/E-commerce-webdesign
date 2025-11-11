
// Swiper - Hero Section
const heroSwiper = new Swiper('.heroSwiper', {
    loop: true,
    slidesPerView: 1,
    autoplay: { delay: 3000, disableOnInteraction: false },
    pagination: { el: '.swiper-pagination', clickable: true },
    navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' },
});

// Cart Logic
let totalItems = 0;
let totalValue = 0;
const cartCount = document.getElementById("cart-count");
const cartTotal = document.getElementById("cart-total");

// Fetch Products
const productContainer = document.getElementById("product-container");
async function fetchProducts() {
    try {
        const res = await fetch("https://fakestoreapi.com/products");
        const products = await res.json();
        productContainer.innerHTML = "";
        products.forEach(product => {
            const card = document.createElement("div");
            card.className = "bg-white p-4 rounded-lg shadow-md hover:shadow-xl hover:scale-105 transition flex flex-col items-center";
            card.innerHTML = `
        <img src="${product.image}" alt="${product.title}" class="w-full aspect-square object-cover max-w-[382px] rounded-md">
        <p class="text-xl font-semibold text-gray-900 mt-4 text-center">${product.title}</p>
        <p class="text-gray-600 mb-4 text-center">${product.description.slice(0, 80)}...</p>
        <div class="text-2xl font-bold mb-2">$${product.price}</div>
        <button class="w-full h-10 rounded bg-black text-white hover:bg-blue-800 transition add-to-cart">Add to Cart</button>
        <button class="w-full h-10 rounded bg-black text-white mt-2 hover:bg-blue-800 transition delete-cart">Remove from Cart</button>
    `;

            const addedItems = [];
            const addBtn = card.querySelector(".add-to-cart");
            const removeBtn = card.querySelector(".delete-cart");

            // balance check
            addBtn.addEventListener("click", () => {
                if (totalValue + product.price > balance) {
                    alert("Insufficient balance! Cannot add this item.");
                    return;
                }
                totalItems++;
                totalValue += product.price;
                addedItems.push(product.title);
                updateCartDisplay();
            });

            removeBtn.addEventListener("click", () => {
                if (addedItems.includes(product.title)) {
                    totalItems--;
                    totalValue -= product.price;
                    addedItems.splice(addedItems.indexOf(product.title), 1);
                    updateCartDisplay();
                } else {
                    alert("Item not in cart");
                }
            });

            productContainer.appendChild(card);
        });

    } catch (err) {
        productContainer.innerHTML = `<p class="text-red-500 text-center">Failed to load products </p>`;
    }
}
fetchProducts();

// cart functionality

const balanceEl = document.getElementById("balance");
const deliveryEl = document.getElementById("delivery");
const cartCountEl = document.getElementById("cart-count");
const cartTotalEl = document.getElementById("cart-total");
const promoForm = document.getElementById("promo-form");
const promoMessage = document.getElementById("promo-message");
const applyBtn = document.getElementById("apply_btn");
const addMoneyBtn = document.getElementById("add_money");

let balance = 1000;
let deliveryCharge = 0;


function updateDelivery() {
    if (totalValue > 1000) deliveryCharge = 100;
    else if (totalValue > 400) deliveryCharge = 80;
    else if (totalValue > 200) deliveryCharge = 50;
    else deliveryCharge = 0;

    deliveryEl.textContent = deliveryCharge;
}

// Update cart and balance display
function updateCartDisplay() {
    cartCountEl.textContent = totalItems;
    cartTotalEl.textContent = totalValue.toFixed(2);
    balanceEl.textContent = balance.toFixed(2);
    updateDelivery();
}
// Promo code functionality
promoForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const code = document.getElementById("promo-code").value.trim().toUpperCase();
    if (code === "TECH10") {
        totalValue *= 0.9; // 10% discount
        updateCartDisplay();
        applyBtn.disabled = true;
        applyBtn.textContent = "Applied";
        promoMessage.textContent = "Promo applied!10% off";
        promoMessage.classList.remove("hidden");
        promoMessage.classList.replace("text-red-600", "text-green-600");
    } else {
        promoMessage.textContent = "Invalid promo code";
        promoMessage.classList.remove("hidden");
        promoMessage.classList.replace("text-green-600", "text-red-600");
    }
});
// Add Money button
addMoneyBtn.addEventListener("click", (e) => {
    e.preventDefault();
    balance += 1000;
    updateCartDisplay();
});
let h1 = document.querySelector('#Buy_now');
h1.addEventListener('click', (e) => {
    e.preventDefault();
});



updateCartDisplay();

// Load Reviews
async function loadComments() {
    try {
        const res = await fetch('https://fakestoreapi.com/products');
        const data = await res.json();
        const comments = data.slice(0, 6);
        const container = document.getElementById('comment-container');
        container.innerHTML = '';

        comments.forEach(product => {
            const slide = document.createElement('div');
            slide.className = 'swiper-slide bg-white p-6 rounded-2xl shadow';
            slide.innerHTML = `
        <div class="flex items-center justify-between mb-3">
          <h3 class="font-semibold text-lg">${product.title}</h3>
          <div class="text-yellow-500"> ${product.rating.rate}/5</div>
        </div>
        <p class="text-gray-700 italic">"${product.description}"</p>
      `;
            container.appendChild(slide);
        });

        new Swiper('.reviewsSwiper', {
            loop: true,
            slidesPerView: 1,
            spaceBetween: 30,
            autoplay: { delay: 3500, disableOnInteraction: false },
            pagination: { el: '.swiper-pagination', clickable: true },
            navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' },
            breakpoints: {
                640: { slidesPerView: 1 },
                768: { slidesPerView: 2 },
                1024: { slidesPerView: 3 },
            },
        });
    } catch (err) {
        console.error(err);
    }
}
loadComments();


// Scroll-based Navbar Highlight
const sections = document.querySelectorAll("section");
const navLinks = document.querySelectorAll(".menu-item");

window.addEventListener("scroll", () => {
    let current = "";
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset < 10) current = "home";
        else if (pageYOffset >= sectionTop - sectionHeight / 3)
            current = section.getAttribute("id");
    });

    navLinks.forEach(link => {
        link.classList.remove("text-blue-600", "underline");
        if (link.getAttribute("href") === "#" + current)
            link.classList.add("text-blue-600", "underline");
    });
});

// Back to Top Button
const backToTopBtn = document.querySelector("#backToTop");

window.addEventListener("scroll", () => {

    if (pageYOffset > 200) {
        backToTopBtn.classList.remove("hidden");
    } else {
        backToTopBtn.classList.add("hidden");
    }
});

backToTopBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
});

