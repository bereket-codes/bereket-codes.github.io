// ========== STATE MANAGEMENT ==========
const products = [
  { id: 1, name: "Ethiopian Coffee", price: 340, emoji: "☕" },
  { id: 2, name: "Leather Backpack", price: 1250, emoji: "🎒" },
  { id: 3, name: "Cotton Shirt", price: 680, emoji: "👕" },
  { id: 4, name: "Power Bank", price: 950, emoji: "🔋" },
  { id: 5, name: "Spiced Butter", price: 220, emoji: "🧈" },
  { id: 6, name: "Headphones", price: 1100, emoji: "🎧" }
];

let cart = [];

// ========== DOM ELEMENTS ==========
const productGridEl = document.getElementById('productGrid');
const cartBadgeEl = document.getElementById('cartBadge');
const cartDrawerEl = document.getElementById('cartDrawer');
const cartItemsListEl = document.getElementById('cartItemsList');
const subtotalEl = document.getElementById('subtotal');
const deliveryFeeEl = document.getElementById('deliveryFee');
const totalAmountEl = document.getElementById('totalAmount');
const cartToggle = document.getElementById('cartToggle');
const closeDrawerBtn = document.getElementById('closeDrawerBtn');
const checkoutBtn = document.getElementById('checkoutBtn');
const paymentModal = document.getElementById('paymentModal');
const modalContent = document.getElementById('modalContent');

// ========== HELPER FUNCTIONS ==========
function getCartItemById(id) {
  return cart.find(item => item.id === id);
}

function getTotalItems() {
  return cart.reduce((sum, item) => sum + item.quantity, 0);
}

function calculateSubtotal() {
  return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

function calculateDelivery() {
  const subtotal = calculateSubtotal();
  return subtotal > 0 ? (subtotal >= 800 ? 0 : 75) : 0;
}

function updateCartBadge() {
  cartBadgeEl.textContent = getTotalItems();
}

// ========== CART STATE MODIFICATIONS ==========
function addToCart(product) {
  const existing = cart.find(item => item.id === product.id);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ id: product.id, name: product.name, price: product.price, quantity: 1 });
  }
}

function increaseQuantity(productId) {
  const item = cart.find(i => i.id === productId);
  if (item) item.quantity += 1;
}

function decreaseQuantity(productId) {
  const item = cart.find(i => i.id === productId);
  if (item && item.quantity > 1) {
    item.quantity -= 1;
  } else {
    removeFromCart(productId);
  }
}

function removeFromCart(productId) {
  cart = cart.filter(item => item.id !== productId);
}

function handleProductAction(action, productId) {
  const product = products.find(p => p.id === productId);
  if (!product) return;

  switch (action) {
    case 'add':
      addToCart(product);
      break;
    case 'increase':
      increaseQuantity(productId);
      break;
    case 'decrease':
      decreaseQuantity(productId);
      break;
    case 'remove':
      removeFromCart(productId);
      break;
  }
  renderAll();
}

// ========== RENDERING FUNCTIONS ==========
function renderProductGrid() {
  if (!productGridEl) return;
  
  productGridEl.innerHTML = products.map(product => {
    const cartItem = getCartItemById(product.id);
    const quantity = cartItem ? cartItem.quantity : 0;
    
    return `
      <div class="product-card">
        <div class="product-emoji">${product.emoji}</div>
        <div class="product-name">${product.name}</div>
        <div class="product-price">${product.price} ETB</div>
        <div class="product-actions">
          ${quantity === 0 ? `
            <button class="btn add-btn" data-action="add" data-id="${product.id}">
              <i class="fas fa-cart-plus"></i> Add
            </button>` : `
            <div class="quantity-control">
              <button class="qty-btn" data-action="decrease" data-id="${product.id}">−</button>
              <span class="qty-num">${quantity}</span>
              <button class="qty-btn" data-action="increase" data-id="${product.id}">+</button>
              <button class="btn remove-btn" data-action="remove" data-id="${product.id}" style="margin-left:4px;">
                <i class="fas fa-trash-alt"></i>
              </button>
            </div>
          `}
        </div>
      </div>
    `;
  }).join('');

  // Attach event listeners
  document.querySelectorAll('[data-action]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const action = btn.getAttribute('data-action');
      const id = parseInt(btn.getAttribute('data-id'), 10);
      handleProductAction(action, id);
    });
  });
}

function renderCartDrawer() {
  if (!cartItemsListEl) return;
  
  if (cart.length === 0) {
    cartItemsListEl.innerHTML = `<li style="text-align:center; padding:20px; color:#9b8c7c;">🛒 Your cart is empty</li>`;
  } else {
    cartItemsListEl.innerHTML = cart.map(item => `
      <li class="cart-item">
        <div class="cart-item-info">
          <span class="cart-item-title">${item.name}</span>
          <span class="cart-item-price">${item.price} ETB × ${item.quantity}</span>
        </div>
        <div class="cart-item-actions">
          <button class="qty-btn" data-drawer-action="decrease" data-id="${item.id}">−</button>
          <span style="font-weight:600;">${item.quantity}</span>
          <button class="qty-btn" data-drawer-action="increase" data-id="${item.id}">+</button>
          <i class="fas fa-trash-alt" style="color:#b44d2a; margin-left:8px; cursor:pointer;" data-drawer-action="remove" data-id="${item.id}"></i>
        </div>
      </li>
    `).join('');

    // Attach drawer listeners
    document.querySelectorAll('[data-drawer-action]').forEach(el => {
      el.addEventListener('click', (e) => {
        e.stopPropagation();
        const action = el.getAttribute('data-drawer-action');
        const id = parseInt(el.getAttribute('data-id'), 10);
        if (action === 'increase') increaseQuantity(id);
        else if (action === 'decrease') decreaseQuantity(id);
        else if (action === 'remove') removeFromCart(id);
        renderAll();
      });
    });
  }

  // Update summary values
  const subtotal = calculateSubtotal();
  const delivery = calculateDelivery();
  const total = subtotal + delivery;
  subtotalEl.textContent = `${subtotal.toFixed(2)} ETB`;
  deliveryFeeEl.textContent = delivery === 0 ? 'FREE' : `${delivery.toFixed(2)} ETB`;
  totalAmountEl.textContent = `${total.toFixed(2)} ETB`;
}

function renderAll() {
  renderProductGrid();
  renderCartDrawer();
  updateCartBadge();
}

// ========== DRAWER TOGGLE ==========
function openDrawer() {
  cartDrawerEl.classList.add('open');
}

function closeDrawer() {
  cartDrawerEl.classList.remove('open');
}

cartToggle.addEventListener('click', (e) => {
  e.stopPropagation();
  cartDrawerEl.classList.contains('open') ? closeDrawer() : openDrawer();
});

closeDrawerBtn.addEventListener('click', closeDrawer);

document.addEventListener('click', (e) => {
  if (!cartDrawerEl.contains(e.target) && !cartToggle.contains(e.target)) {
    closeDrawer();
  }
});

// ========== PAYMENT MODAL ==========
function showPaymentModal() {
  if (cart.length === 0) {
    alert("Your cart is empty. Add some items first!");
    return;
  }
  
  modalContent.innerHTML = `
    <h3 style="margin-bottom:12px;"><i class="fas fa-credit-card"></i> Telebirr Payment</h3>
    <div id="modalStep1">
      <input type="text" id="customerName" placeholder="Full Name" value="Bereket Tadesse">
      <input type="tel" id="customerPhone" placeholder="Phone (09...)" value="0911223344">
      <button class="checkout-btn" id="proceedToPayBtn" style="margin-top:12px;">
        <i class="fas fa-arrow-right"></i> Continue to Pay
      </button>
    </div>
    <div id="modalStep2" class="hidden">
      <div class="spinner" id="processingSpinner"><i class="fas fa-spinner"></i></div>
      <p id="processingText" class="hidden">Processing payment...</p>
      <div id="qrDisplay" class="hidden">
        <div class="qr-mock"><i class="fas fa-qrcode"></i></div>
        <p>Scan with Telebirr app</p>
        <p style="font-size:0.9rem; color:#666;">or confirm on your phone</p>
      </div>
      <div id="successScreen" class="hidden">
        <div class="success-icon"><i class="fas fa-check-circle"></i></div>
        <h3>Order Successful! 🎉</h3>
        <p>Thank you for your purchase.</p>
        <button class="btn add-btn" id="closeSuccessBtn" style="margin-top:16px;">Continue Shopping</button>
      </div>
    </div>
  `;
  
  paymentModal.classList.add('active');
  document.getElementById('proceedToPayBtn')?.addEventListener('click', simulatePaymentProcess);
}

function simulatePaymentProcess() {
  const name = document.getElementById('customerName')?.value.trim();
  const phone = document.getElementById('customerPhone')?.value.trim();
  
  if (!name || !phone) {
    alert('Please enter your name and phone number.');
    return;
  }

  const step1 = document.getElementById('modalStep1');
  const step2 = document.getElementById('modalStep2');
  if (step1) step1.classList.add('hidden');
  if (step2) step2.classList.remove('hidden');

  const spinner = document.getElementById('processingSpinner');
  const processingText = document.getElementById('processingText');
  const qrDisplay = document.getElementById('qrDisplay');
  const successScreen = document.getElementById('successScreen');

  setTimeout(() => {
    if (spinner) spinner.classList.add('hidden');
    if (processingText) {
      processingText.classList.remove('hidden');
      processingText.innerText = 'Connecting to Telebirr...';
    }
  }, 1200);

  setTimeout(() => {
    if (processingText) processingText.innerText = 'Generating QR code...';
    if (qrDisplay) qrDisplay.classList.remove('hidden');
    if (processingText) processingText.classList.add('hidden');
  }, 2200);

  setTimeout(() => {
    if (qrDisplay) qrDisplay.classList.add('hidden');
    if (successScreen) successScreen.classList.remove('hidden');
  }, 3800);
}

function closePaymentModal() {
  paymentModal.classList.remove('active');
}

// ========== EVENT LISTENERS ==========
checkoutBtn.addEventListener('click', () => {
  if (cart.length === 0) {
    alert("Add items to cart before checkout.");
    return;
  }
  closeDrawer();
  showPaymentModal();
});

paymentModal.addEventListener('click', (e) => {
  if (e.target === paymentModal) {
    closePaymentModal();
  }
});

document.addEventListener('click', (e) => {
  if (e.target && e.target.id === 'closeSuccessBtn') {
    cart = [];
    renderAll();
    closePaymentModal();
    closeDrawer();
  }
});

// ========== INITIALIZE APP ==========
renderAll();
closeDrawer();