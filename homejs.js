/* NAVBAR */
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  navMenu.classList.toggle('show');
});

window.addEventListener("scroll", function () {
  const nav = document.querySelector(".main-nav");
  if (window.scrollY > 50) {
    nav.classList.add("scrolled");
  } else {
    nav.classList.remove("scrolled");
  }
});


/* PRODUCT */
document.addEventListener("DOMContentLoaded", function () {
  const viewButtons = document.querySelectorAll(".view-btn");
  const modal = new bootstrap.Modal(document.getElementById("productModal"));
  const directorFilter = document.getElementById("directorFilter");
  const products = document.querySelectorAll(".product-card");

  // 🎞 View Button Modal
  viewButtons.forEach((btn) => {
    btn.addEventListener("click", function () {
      const card = this.closest(".product-card");
      document.getElementById("modalProductTitle").textContent = card.dataset.title;
      document.getElementById("modalProductPrice").textContent = card.dataset.price;
      document.getElementById("modalProductOldPrice").textContent = card.dataset.oldprice;
      document.getElementById("modalProductDescription").textContent = card.dataset.description;
      document.getElementById("modalProductGenre").textContent = card.dataset.genre;
      document.getElementById("modalProductDirector").textContent = card.dataset.director;
      document.getElementById("modalProductImage").src = card.dataset.image;
      modal.show();
    });
  });

  // 🎬 Director Filter
  directorFilter.addEventListener("change", function () {
    const selectedDirector = this.value.toLowerCase();

    products.forEach((card) => {
      const cardDirector = card.dataset.director.toLowerCase();
      card.parentElement.style.display =
        selectedDirector === "all" || cardDirector === selectedDirector
          ? "block"
          : "none";
    });
  });

  // 🎥 Auto-filter by director from URL
  const urlParams = new URLSearchParams(window.location.search);
  const directorFromURL = urlParams.get("director");

  if (directorFromURL) {
    for (let option of directorFilter.options) {
      if (option.value.toLowerCase() === directorFromURL.toLowerCase()) {
        directorFilter.value = option.value;
        break;
      }
    }

    const event = new Event("change");
    directorFilter.dispatchEvent(event);

    const section = document.querySelector("section.py-5");
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  }
});



/* CONTACT */
const contactForm = document.querySelector('.contact-form form');
if (contactForm) {
  contactForm.addEventListener('submit', function(event) {
    event.preventDefault();
    Swal.fire({
      icon: 'success',
      title: 'Submit Successfully!',
      text: 'Thank you for contacting us.',
      confirmButtonColor: '#05043f'
    });
    contactForm.reset();
  });
}



/* CART */
document.addEventListener("DOMContentLoaded", () => {
  const toCurrency = (n) => `$${Number(n).toFixed(0)}`;
  const el = (sel) => document.querySelector(sel);
  const els = (sel) => Array.from(document.querySelectorAll(sel));

  // Load cart from localStorage and render items
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  // Ensure each item has a 'selected' property, default to true
  cart.forEach(item => {
    if (item.selected === undefined) item.selected = true;
  });
  localStorage.setItem("cart", JSON.stringify(cart));
  const cartContainer = el(".col-lg-8"); // Assuming the left section is col-lg-8

  if (cart.length === 0) {
    // If cart is empty, show a message
    cartContainer.innerHTML = '<p class="text-light">Your cart is empty.</p>';
  } else {
    // Clear existing static items
    const existingItems = els(".cart-item");
    existingItems.forEach(item => item.remove());

    // Generate cart items from localStorage
    cart.forEach((item, index) => {
      const cartItemHTML = `
        <div class="cart-item border border-warning rounded-3 p-3 mb-3 d-flex align-items-center" data-price="${item.price}" data-index="${index}">
          <input type="checkbox" class="form-check-input me-3 item-select" ${item.selected ? 'checked' : ''} />
          <img src="${item.image}" class="rounded me-3" width="100" alt="${item.title}" />
          <div class="flex-grow-1">
            <h5 class="text-light mb-1">${item.title}</h5>
            <p class="text-secondary mb-1">${toCurrency(item.price)}</p>
            <p class="text-secondary small">Collector’s edition VHS tape.</p>
            <div class="d-flex align-items-center">
              <button class="btn btn-warning btn-sm minus">-</button>
              <input type="text" class="form-control text-center mx-1 qty-input" value="${item.quantity}" style="height: 30px; width: 50px" />
              <button class="btn btn-warning btn-sm plus">+</button>
            </div>
          </div>
          <button class="btn btn-outline-warning btn-sm delete-item" data-index="${index}">
            <i class="bi bi-trash"></i>
          </button>
        </div>
      `;
      cartContainer.insertAdjacentHTML('beforeend', cartItemHTML);
    });
  }

  // Add event listeners for delete buttons
  document.addEventListener("click", (e) => {
    if (e.target.closest(".delete-item")) {
      const index = e.target.closest(".delete-item").dataset.index;
      cart.splice(index, 1);
      localStorage.setItem("cart", JSON.stringify(cart));
      location.reload(); // Reload to update the cart display
    }
  });

  // Add event listeners for checkboxes
  document.addEventListener("change", (e) => {
    if (e.target.classList.contains("item-select")) {
      const index = e.target.closest(".cart-item").dataset.index;
      cart[index].selected = e.target.checked;
      localStorage.setItem("cart", JSON.stringify(cart));
      updateSummary();
    }
  });

  function updateSummary() {
    let totalItems = 0;
    let subtotal = 0;
    els(".cart-item").forEach((item) => {
      const checkbox = item.querySelector(".item-select");
      if (checkbox && checkbox.checked) {
        const qty = parseInt(item.querySelector(".qty-input").value) || 0;
        const price = parseFloat(item.dataset.price) || 0;
        totalItems += qty;
        subtotal += qty * price;
      }
    });
    const total = subtotal;
    if (el("#item-count")) el("#item-count").textContent = totalItems;
    if (el("#subtotal")) el("#subtotal").textContent = toCurrency(subtotal);
    if (el("#total")) el("#total").textContent = toCurrency(total);
  }

  els(".cart-item").forEach((item) => {
    const minus = item.querySelector(".minus");
    const plus = item.querySelector(".plus");
    const qtyInput = item.querySelector(".qty-input");
    if (!qtyInput) return;
    if (!qtyInput.value || isNaN(parseInt(qtyInput.value))) qtyInput.value = 1;

    minus &&
      minus.addEventListener("click", () => {
        let v = parseInt(qtyInput.value) || 0;
        if (v > 1) qtyInput.value = v - 1;
        const index = item.dataset.index;
        cart[index].quantity = v - 1;
        localStorage.setItem("cart", JSON.stringify(cart));
        updateSummary();
      });

    plus &&
      plus.addEventListener("click", () => {
        let v = parseInt(qtyInput.value) || 0;
        qtyInput.value = v + 1;
        const index = item.dataset.index;
        cart[index].quantity = v + 1;
        localStorage.setItem("cart", JSON.stringify(cart));
        updateSummary();
      });
  });

  updateSummary();

  const paymentModalEl = el("#paymentModal");
  const paymentModal = paymentModalEl
    ? bootstrap.Modal.getOrCreateInstance(paymentModalEl)
    : null;
  const closeButton = paymentModalEl
    ? paymentModalEl.querySelector(".btn-close")
    : null;

  const cartStep = el("#cart");
  const paymentStep = el("#payment");
  const successStep = el("#success");

const checkoutButton = el("#checkoutBtn");
if (checkoutButton) {
  checkoutButton.addEventListener("click", () => {
    const selectedItems = els(".cart-item").filter(item => item.querySelector(".item-select").checked);
    if (selectedItems.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "No Items Selected",
        text: "Please select at least one item before proceeding to checkout.",
        confirmButtonColor: "#05043f"
      });
      return;
    }

    // Proceed to payment modal only if items are selected
    if (cartStep) cartStep.style.color = "#666666";
    if (paymentStep) paymentStep.style.color = "#f7d02a";
    if (paymentModal) paymentModal.show();
  });
}

  if (closeButton) {
    closeButton.addEventListener("click", () => {
      if (paymentStep) paymentStep.style.color = "#666666";
      if (cartStep) cartStep.style.color = "#f7d02a";
    });
  }

  const paymentSelect = el("#paymentMethod");
  const paymentSections = els(".payment-section");
  if (paymentSelect) {
    paymentSelect.addEventListener("change", function () {
      paymentSections.forEach((s) => s.classList.add("d-none"));
      const id = this.value;
      if (!id) return;
      const target = el(`#${id}Fields`);
      if (target) target.classList.remove("d-none");
    });
  }

  function getCustomerFields() {
    const result = { name: "", contact: "", address: "" };
    const visibleSection = document.querySelector(
      ".payment-section:not(.d-none)"
    );
    const trySelectors = (candidates) => {
      for (const s of candidates) {
        let node = visibleSection
          ? visibleSection.querySelector(`#${s}`)
          : null;
        if (!node) node = el(`#${s}`);
        if (node && node.value && node.value.trim()) return node.value.trim();
      }
      return "";
    };
    result.name = trySelectors(["codName", "fullname", "cardName"]);
    result.contact = trySelectors(["codContact", "contact"]);
    result.address = trySelectors(["codAddress", "address"]);
    return result;
  }

  const paymentForm = el("#paymentForm");
  const cartSection = el(".cart-section") || el(".container");
  const successModalEl = el("#successModal");

  if (paymentForm) {
    paymentForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const method = (paymentSelect && paymentSelect.value) || "";
      let valid = false;
      const fields = getCustomerFields();

      if (method === "card") {
        const cardName = el("#cardName")?.value.trim() || "";
        const cardNumber = el("#cardNumber")?.value.replace(/\s+/g, "") || "";
        valid = cardName.length > 1 && cardNumber.length === 16;
      } else if (method === "paypal") {
        const email = el("#paypalEmail")?.value.trim() || "";
        valid = email.includes("@");
      } else if (method === "gcash") {
        const num = el("#contact")?.value.trim() || "";
        valid = num.length === 11;
      } else if (method === "cod") {
        valid =
          fields.name.length > 1 &&
          fields.contact.length >= 11 &&
          fields.address.length > 5;
      }

      if (!valid) {
        alert("Please complete required payment fields");
        return;
      }

      const inst = bootstrap.Modal.getInstance(paymentModalEl);
      inst && inst.hide();

      if (cartStep) cartStep.style.color = "#666666";
      if (paymentStep) paymentStep.style.color = "#666666";
      if (successStep) successStep.style.color = "#f7d02a";

      const totalText = el("#total") ? el("#total").textContent : "-";
      const set = (id, v) => {
        const n = el(`#${id}`);
        if (n) n.textContent = v;
      };
      set("orderName", fields.name || "-");
      set("orderContact", fields.contact || "-");
      set("orderAddress", fields.address || "-");
      set("orderPayment", method || "-");
      set("orderTotal", totalText);

      const successModal = new bootstrap.Modal(successModalEl);
      successModal.show();

      // ✅ Remove only checked-out items after successful payment
      const selectedItems = Array.from(document.querySelectorAll(".cart-item"))
        .filter(item => item.querySelector(".item-select").checked);

      let cartData = JSON.parse(localStorage.getItem("cart")) || [];

      selectedItems.forEach(item => {
        const title = item.querySelector("h5").textContent.trim();

        // Fade out before removing
        item.classList.add("fade-out");
        setTimeout(() => item.remove(), 300);

        // Remove from localStorage
        cartData = cartData.filter(cartItem => cartItem.title !== title);
      });

      localStorage.setItem("cart", JSON.stringify(cartData));
      updateSummary();
    });
  }

  const returnHome = el("#returnHome");
  if (returnHome) {
    returnHome.addEventListener("click", () => (location.href = "cartpage.html"));
  }
});

// 🛒 ADD TO CART FUNCTIONALITY
const addToCartButtons = document.querySelectorAll(".btn.btn-primary.w-50"); // your cart buttons

addToCartButtons.forEach((button) => {
  button.addEventListener("click", function () {
    const card = this.closest(".product-card");
    const product = {
      title: card.dataset.title,
      price: parseFloat(card.dataset.price.replace("$", "")),
      image: card.dataset.image,
      quantity: 1,
      selected: true,
    };

    // Get existing cart or create a new one
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    // Check if product already exists
    const existing = cart.find(item => item.title === product.title);
    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push(product);
    }

    // Save updated cart
    localStorage.setItem("cart", JSON.stringify(cart));

    // Show success modal
    Swal.fire({
      icon: 'success',
      title: 'Added to Cart!',
      text: 'Product has been added to your cart.',
      confirmButtonColor: '#05043f',
      confirmButtonText: 'OK',
    });
  });
});

// Add to Cart functionality for the modal's button
const modalAddToCartButton = document.querySelector("#productModal .btn.btn-primary");
if (modalAddToCartButton) {
  modalAddToCartButton.addEventListener("click", function () {
    const title = document.getElementById("modalProductTitle").textContent;
    const price = parseFloat(document.getElementById("modalProductPrice").textContent.replace("$", ""));
    const image = document.getElementById("modalProductImage").src;

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    const existing = cart.find(item => item.title === title);
    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({ title, price, image, quantity: 1, selected: true });
    }

    localStorage.setItem("cart", JSON.stringify(cart));

    Swal.fire({
      icon: 'success',
      title: 'Added to Cart!',
      text: 'Product has been added to your cart.',
      confirmButtonColor: '#05043f',
      confirmButtonText: 'OK',
    });
  });
}
