document.addEventListener("DOMContentLoaded", () => {

  let allProducts = [];

  // ----- Hero Swiper -----
  const heroSwiper = new Swiper('.heroSwiper', {
    loop: true,
    slidesPerView: 1,
    autoplay: { delay: 3000, disableOnInteraction: false },
    pagination: { el: '.heroSwiper .swiper-pagination', clickable: true },
    navigation: { nextEl: '.heroSwiper .swiper-button-next', prevEl: '.heroSwiper .swiper-button-prev' },
  });

  // ----- Cart -----
  let totalItems = 0;
  let totalValue = 0;
  let balance = 1000;
  let deliveryCharge = 0;

  const productContainer = document.getElementById("product-container");
  const balanceEl = document.getElementById("balance");
  const deliveryEl = document.getElementById("delivery");
  const cartCountEl = document.getElementById("cart-count");
  const cartTotalEl = document.getElementById("cart-total");
  const promoForm = document.getElementById("promo-form");
  const promoMessage = document.getElementById("promo-message");
  const applyBtn = document.getElementById("apply_btn");
  const addMoneyBtn = document.getElementById("add_money");

  function updateDelivery() {
    if (totalValue > 1000) deliveryCharge = 100;
    else if (totalValue > 400) deliveryCharge = 80;
    else if (totalValue > 200) deliveryCharge = 50;
    else deliveryCharge = 0;

    if (deliveryEl) deliveryEl.textContent = deliveryCharge;
  }

  function updateCartDisplay() {
    if (cartCountEl) cartCountEl.textContent = totalItems;
    if (cartTotalEl) cartTotalEl.textContent = totalValue.toFixed(2);
    if (balanceEl) balanceEl.textContent = balance.toFixed(2);
    updateDelivery();
  }

  // ----- Render Products -----
  function renderProducts(products) {
    productContainer.innerHTML = "";
    products.forEach(product => {
      const card = document.createElement("div");
      card.className = "bg-white p-4 rounded-lg shadow-md hover:shadow-xl hover:scale-105 transition flex flex-col items-center";
      card.innerHTML = `
        <img src="${product.image}" alt="${product.title}" class="w-full aspect-square object-cover max-w-[382px] rounded-md">
        <p class="text-xl font-semibold text-gray-900 mt-4 text-center">${product.title}</p>
        <p class="text-gray-600 mb-4 text-center">${product.description.slice(0, 80)}...</p>
        <div class="text-2xl font-bold mb-2">$${product.price}</div>
        <div class="text-yellow-500"><i class="fa-solid fa-star"></i> ${product.rating.rate}/5</div>
        <button class="w-full h-10 rounded bg-black text-white hover:bg-blue-800 transition add-to-cart">Add to Cart</button>
        <button class="w-full h-10 rounded bg-black text-white mt-2 hover:bg-blue-800 transition delete-cart">Remove from Cart</button>
      `;

      const addedItems = [];
      const addBtn = card.querySelector(".add-to-cart");
      const removeBtn = card.querySelector(".delete-cart");

      if (addBtn) {
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
      }

      if (removeBtn) {
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
      }

      productContainer.appendChild(card);
    });
  }

  // ----- Fetch Products -----
  async function fetchProducts() {
    try {
      const res = await fetch("https://fakestoreapi.com/products");
      const products = await res.json();
      allProducts = products;
      renderProducts(allProducts);
      loadComments(products); // Load comments after products
    } catch (err) {
      if (productContainer) productContainer.innerHTML = `<p class="text-red-500 text-center">Failed to load products</p>`;
    }
  }

  fetchProducts();

  // ----- Sorting -----
  const sortLowHighBtn = document.getElementById("sort-low-high");
  const sortHighLowBtn = document.getElementById("sort-high-low");

  if (sortLowHighBtn && sortHighLowBtn) {
    sortLowHighBtn.addEventListener("click", () => {
      const sorted = [...allProducts].sort((a, b) => a.price - b.price);
      renderProducts(sorted);
    });
    sortHighLowBtn.addEventListener("click", () => {
      const sorted = [...allProducts].sort((a, b) => b.price - a.price);
      renderProducts(sorted);
    });
  }

  // ----- Promo & Add Money -----
  if (promoForm) {
    promoForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const codeInput = document.getElementById("promo-code");
      const code = codeInput ? codeInput.value.trim().toUpperCase() : "";
      if (code === "TECH10") {
        totalValue *= 0.9;
        updateCartDisplay();
        if (applyBtn) { applyBtn.disabled = true; applyBtn.textContent = "Applied"; }
        if (promoMessage) {
          promoMessage.textContent = "Promo applied! 10% off";
          promoMessage.classList.remove("hidden");
          promoMessage.classList.replace("text-red-600", "text-green-600");
        }
      } else {
        if (promoMessage) {
          promoMessage.textContent = "Invalid promo code";
          promoMessage.classList.remove("hidden");
          promoMessage.classList.replace("text-green-600", "text-red-600");
        }
      }
    });
  }

  if (addMoneyBtn) {
    addMoneyBtn.addEventListener("click", (e) => {
      e.preventDefault();
      balance += 1000;
      updateCartDisplay();
    });
  }

  updateCartDisplay();

  // ----- Load Comments / Reviews from FakeStore API -----
  function loadComments(products) {
    const container = document.getElementById('comment-container');
    if (!container) return;

    container.innerHTML = "";

    // Take first 6 products as comments
    products.slice(0, 6).forEach(product => {
      const slide = document.createElement("div");
      slide.className = "swiper-slide bg-white p-6 rounded-2xl shadow flex flex-col justify-center items-center";
      slide.innerHTML = `
        <p class="text-gray-800 text-lg mb-4">"${product.description.slice(0, 120)}"</p>
        <p class="font-bold text-blue-600">${product.title}</p>
        <div class="text-yellow-500 mt-2"><i class="fa-solid fa-star"></i> ${product.rating.rate}/5</div>
      `;
      container.appendChild(slide);
    });

    new Swiper('.reviewsSwiper', {
      loop: true,
      slidesPerView: 1,
      spaceBetween: 30,
      autoplay: { delay: 3500, disableOnInteraction: false },
      pagination: { el: '.reviewsSwiper .swiper-pagination', clickable: true },
      navigation: { nextEl: '.reviewsSwiper .swiper-button-next', prevEl: '.reviewsSwiper .swiper-button-prev' },
      breakpoints: { 640: { slidesPerView: 1 }, 768: { slidesPerView: 2 }, 1024: { slidesPerView: 3 } },
    });
  }

  // ----- Scroll & Active Section -----
  const sections = document.querySelectorAll("section");
  const navLinks = document.querySelectorAll(".menu-item");
  const backToTopBtn = document.querySelector("#backToTop");

  window.addEventListener("scroll", () => {
    let current = "";
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.clientHeight;
      if (pageYOffset >= sectionTop && pageYOffset < sectionTop + sectionHeight) {
        current = section.getAttribute("id");
      }
    });

    navLinks.forEach(link => {
      link.classList.remove("text-blue-600", "underline");
      if (link.getAttribute("href") === "#" + current) {
        link.classList.add("text-blue-600", "underline");
      }
    });

    if (backToTopBtn) {
      if (pageYOffset > 200) backToTopBtn.classList.remove("hidden");
      else backToTopBtn.classList.add("hidden");
    }
  });

  if (backToTopBtn) {
    backToTopBtn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  }

  // ----- Contact Form -----
  const contactForm = document.getElementById('contactForm');
  const thankYouMsg = document.getElementById('thankYouMsg');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const message = document.getElementById('message').value.trim();

      if (!name || !email || !message) {
        alert('Please fill out all fields.');
        return;
      }
      if (name.length < 3) {
        alert('At least 3 characters in name');
        return;
      }
      if (!email.includes("@gmail.com")) {
        alert('Please enter a valid email address.');
        return;
      }

      contactForm.classList.add('hidden');
      thankYouMsg.classList.remove('hidden');
    });
  }

});
