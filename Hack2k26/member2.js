const foodItems = [
  { id: 1, name: "Margherita Pizza", price: 199 },
  { id: 2, name: "Cheese Burger", price: 149 },
  { id: 3, name: "Paneer Biryani", price: 220 },
  { id: 4, name: "Veg Noodles", price: 130 },
  { id: 5, name: "Farmhouse Pizza", price: 249 },
  { id: 6, name: "Cold Coffee", price: 99 }
];

function getCart() {
  return JSON.parse(localStorage.getItem("foodiehubCart") || "[]");
}

function saveCart(cart) {
  localStorage.setItem("foodiehubCart", JSON.stringify(cart));
}

function money(value) {
  return "₹" + value;
}

// MENU PAGE
const foodGrid = document.getElementById("foodGrid");

if (foodGrid) {
  document.querySelectorAll(".add-btn").forEach(button => {
    button.addEventListener("click", () => {
      const id = Number(button.dataset.id);
      const food = foodItems.find(item => item.id === id);
      const cart = getCart();
      const existing = cart.find(item => item.id === id);

      if (existing) {
        existing.quantity += 1;
      } else {
        cart.push({ ...food, quantity: 1 });
      }

      saveCart(cart);
      button.textContent = "Added ✓";
      setTimeout(() => button.textContent = "Add +", 900);
    });
  });

  const search = document.getElementById("foodSearch");
  const cards = [...document.querySelectorAll(".food-card")];
  let selectedCategory = "All";

  function filterFood() {
    const term = search.value.toLowerCase();
    let visible = 0;

    cards.forEach(card => {
      const matchesCategory =
        selectedCategory === "All" ||
        card.dataset.category === selectedCategory;

      const matchesSearch =
        card.dataset.name.toLowerCase().includes(term);

      card.hidden = !(matchesCategory && matchesSearch);
      if (!card.hidden) visible++;
    });

    document.getElementById("noFood").hidden = visible > 0;
  }

  search.addEventListener("input", filterFood);

  document.querySelectorAll(".category-btn").forEach(button => {
    button.addEventListener("click", () => {
      document.querySelector(".category-btn.active")
        ?.classList.remove("active");

      button.classList.add("active");
      selectedCategory = button.dataset.category;
      filterFood();
    });
  });
}

// CART PAGE
function renderCart() {
  const container = document.getElementById("cartItems");
  if (!container) return;

  const cart = getCart();
  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity, 0
  );

  if (cart.length === 0) {
    container.innerHTML =
      '<p class="empty-message">Your cart is empty. <a href="menu.html">Explore menu</a></p>';
  } else {
    container.innerHTML = cart.map(item => `
      <div class="cart-item">
        <div>
          <h3>${item.name}</h3>
          <p>${money(item.price)} each</p>
          <div class="quantity-controls">
            <button data-action="minus" data-id="${item.id}">−</button>
            <span>${item.quantity}</span>
            <button data-action="plus" data-id="${item.id}">+</button>
            <button data-action="remove" data-id="${item.id}">Remove</button>
          </div>
        </div>
        <strong>${money(item.price * item.quantity)}</strong>
      </div>
    `).join("");
  }

  document.getElementById("cartSubtotal").textContent = money(subtotal);
  document.getElementById("cartTotal").textContent =
    money(subtotal + (cart.length ? 30 : 0));

  document.getElementById("checkoutLink").style.pointerEvents =
    cart.length ? "auto" : "none";

  document.getElementById("checkoutLink").style.opacity =
    cart.length ? "1" : "0.5";
}

const cartContainer = document.getElementById("cartItems");

if (cartContainer) {
  cartContainer.addEventListener("click", event => {
    const button = event.target.closest("button[data-action]");
    if (!button) return;

    const id = Number(button.dataset.id);
    let cart = getCart();
    const item = cart.find(food => food.id === id);

    if (!item) return;

    if (button.dataset.action === "plus") item.quantity++;
    if (button.dataset.action === "minus") item.quantity--;
    if (button.dataset.action === "remove") item.quantity = 0;

    cart = cart.filter(food => food.quantity > 0);
    saveCart(cart);
    renderCart();
  });

  renderCart();
}

// CHECKOUT PAGE
function renderCheckout() {
  const container = document.getElementById("checkoutItems");
  if (!container) return;

  const cart = getCart();
  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity, 0
  );

  container.innerHTML = cart.length
    ? cart.map(item =>
        `<p>${item.name} × ${item.quantity} — ${money(item.price * item.quantity)}</p>`
      ).join("")
    : "<p>Your cart is empty.</p>";

  document.getElementById("checkoutSubtotal").textContent = money(subtotal);
  document.getElementById("checkoutTotal").textContent =
    money(subtotal + (cart.length ? 30 : 0));
}

if (document.getElementById("checkoutForm")) {
  renderCheckout();

  document.getElementById("checkoutForm").addEventListener("submit", async event => {
    event.preventDefault();

    const cart = getCart();
    const message = document.getElementById("checkoutMessage");

    if (!cart.length) {
      message.textContent = "Your cart is empty. Please add food first.";
      return;
    }

    const order = {
      customer: {
        name: document.getElementById("customerName").value.trim(),
        phone: document.getElementById("customerPhone").value.trim(),
        email: document.getElementById("customerEmail").value.trim(),
        address: document.getElementById("customerAddress").value.trim(),
        city: document.getElementById("customerCity").value.trim()
      },
      paymentMethod: document.getElementById("paymentMethod").value,
      items: cart,
      subtotal: cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
      deliveryFee: 30
    };

    order.total = order.subtotal + order.deliveryFee;
    message.textContent = "Submitting your order...";

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(order)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Order failed");
      }

      localStorage.removeItem("foodiehubCart");
      message.textContent =
        "Order placed successfully! Order ID: " + result.orderId;
      event.target.reset();
      renderCheckout();

    } catch (error) {
      message.textContent =
        "Order could not be submitted. Backend connection will be set up later.";
    }
  });
}