// ==========================================================================
// DAPOER TINY - Senior Frontend Architecture & Interactive Core
// ==========================================================================

// Global Application State
const state = {
  cart: [],
  wishlist: new Set(),
  spotlight: {
    basePrice: 28000,
    currentPrice: 28000,
    quantity: 1,
    portion: '1 Porsi Personal',
    name: 'Ayam Bakar Madu Spesial',
    image: 'images/ayam_bakar_madu.jpg'
  },
  quickView: {
    currentDish: null,
    quantity: 1
  },
  activeCategory: 'all',
  searchQuery: ''
};

// Currency Formatter (IDR)
function formatRupiah(number) {
  return 'Rp ' + Number(number).toLocaleString('id-ID');
}

// ==========================================================================
// TOAST NOTIFICATIONS
// ==========================================================================
let toastTimeout = null;

function showToast(message, iconClass = 'fa-solid fa-circle-check') {
  const toast = document.getElementById('cartToast');
  const toastMsg = document.getElementById('toastMsg');
  const toastIcon = document.getElementById('toastIcon');

  if (!toast || !toastMsg) return;

  if (toastTimeout) clearTimeout(toastTimeout);

  toastMsg.textContent = message;
  if (toastIcon) toastIcon.className = iconClass;

  toast.classList.add('show');

  toastTimeout = setTimeout(() => {
    toast.classList.remove('show');
  }, 3200);
}

// ==========================================================================
// CART DRAWER STATE & RENDERING
// ==========================================================================

// Load Cart from localStorage
function initCartFromStorage() {
  try {
    const saved = localStorage.getItem('dapoer_tiny_cart');
    if (saved) {
      state.cart = JSON.parse(saved);
      renderCart();
    }
  } catch (e) {
    state.cart = [];
  }
}

// Save Cart to localStorage
function saveCartToStorage() {
  try {
    localStorage.setItem('dapoer_tiny_cart', JSON.stringify(state.cart));
  } catch (e) {
    console.error('Gagal menyimpan keranjang:', e);
  }
}

// Add Item to Cart
function addToCartItem(item) {
  const existingIndex = state.cart.findIndex(
    cartItem => cartItem.id === item.id && (cartItem.portion || '') === (item.portion || '')
  );

  const qtyToAdd = item.quantity || 1;

  if (existingIndex > -1) {
    state.cart[existingIndex].quantity += qtyToAdd;
  } else {
    state.cart.push({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      portion: item.portion || '',
      quantity: qtyToAdd
    });
  }

  saveCartToStorage();
  renderCart();
  openCart();

  showToast(`${qtyToAdd}x "${item.name}" berhasil masuk keranjang!`);
}

// Update Cart Quantity
function updateCartItemQty(index, delta) {
  if (!state.cart[index]) return;

  state.cart[index].quantity += delta;

  if (state.cart[index].quantity <= 0) {
    const removedName = state.cart[index].name;
    state.cart.splice(index, 1);
    showToast(`"${removedName}" dihapus dari keranjang`, 'fa-solid fa-trash-can');
  }

  saveCartToStorage();
  renderCart();
}

// Remove Single Item from Cart
function removeCartItem(index) {
  if (!state.cart[index]) return;
  const removedName = state.cart[index].name;
  state.cart.splice(index, 1);
  saveCartToStorage();
  renderCart();
  showToast(`"${removedName}" dihapus dari keranjang`, 'fa-solid fa-trash-can');
}

// Clear Entire Cart
function clearCart() {
  if (state.cart.length === 0) return;
  if (confirm('Apakah Anda yakin ingin mengosongkan seluruh keranjang belanja?')) {
    state.cart = [];
    saveCartToStorage();
    renderCart();
    showToast('Keranjang telah dikosongkan', 'fa-solid fa-trash-can');
  }
}

// Render Cart UI
function renderCart() {
  const cartList = document.getElementById('cartItemsList');
  const cartCountBadges = document.querySelectorAll('#cartCount');
  const cartItemsTag = document.getElementById('cartItemsTag');
  const subtotalEl = document.getElementById('cartSubtotal');
  const shippingEl = document.getElementById('cartShipping');
  const grandTotalEl = document.getElementById('cartGrandTotal');
  const trackerFill = document.getElementById('trackerFill');
  const trackerText = document.getElementById('trackerText');

  const totalItems = state.cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  // Free shipping threshold: Rp 80.000
  const freeShippingThreshold = 80000;
  const standardShipping = 10000;
  const isFreeShipping = subtotal >= freeShippingThreshold || subtotal === 0;
  const shippingFee = (subtotal === 0 || isFreeShipping) ? 0 : standardShipping;
  const grandTotal = subtotal + shippingFee;

  // Update Badges
  cartCountBadges.forEach(badge => {
    badge.textContent = totalItems;
    badge.classList.add('pulse');
    setTimeout(() => badge.classList.remove('pulse'), 300);
  });

  if (cartItemsTag) cartItemsTag.textContent = `${totalItems} item`;

  // Free Shipping Tracker
  if (trackerFill && trackerText) {
    if (subtotal === 0) {
      trackerFill.style.width = '0%';
      trackerText.innerHTML = `<i class="fa-solid fa-truck-fast"></i> Belanja <strong>${formatRupiah(freeShippingThreshold)}</strong> untuk <strong>Gratis Ongkir!</strong>`;
    } else if (subtotal < freeShippingThreshold) {
      const remaining = freeShippingThreshold - subtotal;
      const percent = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));
      trackerFill.style.width = `${percent}%`;
      trackerText.innerHTML = `<i class="fa-solid fa-truck-fast"></i> Tambah <strong>${formatRupiah(remaining)}</strong> lagi untuk <strong>Gratis Ongkir!</strong>`;
    } else {
      trackerFill.style.width = '100%';
      trackerText.innerHTML = `<i class="fa-solid fa-circle-check"></i> Selamat! Anda mendapatkan <strong>Gratis Ongkir!</strong>`;
    }
  }

  // Render Items List
  if (cartList) {
    if (state.cart.length === 0) {
      cartList.innerHTML = `
        <div class="cart-empty-state">
          <i class="fa-solid fa-basket-shopping"></i>
          <h4>Keranjang Anda Kosong</h4>
          <p>Yuk, pilih menu lezat favorit Anda dari Dapoer Tiny dan nikmati santap hangat bersama keluarga.</p>
          <a href="#menu" class="btn btn-brown-sm" onclick="closeCart()">Jelajahi Menu Sekarang</a>
        </div>
      `;
    } else {
      cartList.innerHTML = state.cart.map((item, index) => `
        <div class="cart-item-row">
          <div class="cart-item-img">
            <img src="${item.image}" alt="${item.name}">
          </div>
          <div class="cart-item-info">
            <h5 class="cart-item-title">${item.name}</h5>
            ${item.portion ? `<span style="font-size: 0.72rem; color: #8E7D73; display: block; margin-bottom: 2px;">${item.portion}</span>` : ''}
            <div class="cart-item-price">${formatRupiah(item.price)}</div>
            <div class="cart-item-controls">
              <button class="cart-qty-btn" onclick="updateCartItemQty(${index}, -1)" title="Kurangi"><i class="fa-solid fa-minus"></i></button>
              <span class="cart-qty-display">${item.quantity}</span>
              <button class="cart-qty-btn" onclick="updateCartItemQty(${index}, 1)" title="Tambah"><i class="fa-solid fa-plus"></i></button>
            </div>
          </div>
          <button class="cart-remove-item" onclick="removeCartItem(${index})" title="Hapus"><i class="fa-regular fa-trash-can"></i></button>
        </div>
      `).join('');
    }
  }

  // Update Summary
  if (subtotalEl) subtotalEl.textContent = formatRupiah(subtotal);
  if (shippingEl) shippingEl.textContent = isFreeShipping ? (subtotal > 0 ? 'Gratis' : 'Rp 0') : formatRupiah(standardShipping);
  if (grandTotalEl) grandTotalEl.textContent = formatRupiah(grandTotal);
}

// Open / Close Cart Drawer
function openCart() {
  const drawer = document.getElementById('cartDrawer');
  const backdrop = document.getElementById('cartBackdrop');
  if (drawer && backdrop) {
    drawer.classList.add('open');
    backdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function closeCart() {
  const drawer = document.getElementById('cartDrawer');
  const backdrop = document.getElementById('cartBackdrop');
  if (drawer && backdrop) {
    drawer.classList.remove('open');
    backdrop.classList.remove('active');
    document.body.style.overflow = '';
  }
}

// Process Checkout to WhatsApp
function processCheckout() {
  if (state.cart.length === 0) {
    showToast('Keranjang Anda masih kosong!', 'fa-solid fa-circle-exclamation');
    return;
  }

  const subtotal = state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const freeShipping = subtotal >= 80000;
  const shippingFee = freeShipping ? 0 : 10000;
  const grandTotal = subtotal + shippingFee;

  let message = `*HALO DAPOER TINY, SAYA INGIN MEMESAN:*\n\n`;
  message += `━━━━━━━━━━━━━━━━━━━━━\n`;
  
  state.cart.forEach((item, i) => {
    message += `${i + 1}. *${item.name}* ${item.portion ? `(${item.portion})` : ''}\n`;
    message += `   Jumlah: ${item.quantity} x ${formatRupiah(item.price)} = ${formatRupiah(item.price * item.quantity)}\n\n`;
  });

  message += `━━━━━━━━━━━━━━━━━━━━━\n`;
  message += `Subtotal: ${formatRupiah(subtotal)}\n`;
  message += `Ongkos Kirim: ${freeShipping ? 'GRATIS' : formatRupiah(shippingFee)}\n`;
  message += `*TOTAL PEMBAYARAN: ${formatRupiah(grandTotal)}*\n\n`;
  message += `Mohon konfirmasi ketersediaan dan metode pengirimannya. Terima kasih!`;

  const waUrl = `https://wa.me/628123456789?text=${encodeURIComponent(message)}`;
  window.open(waUrl, '_blank');
}

// ==========================================================================
// QUICK VIEW MODAL
// ==========================================================================
function openQuickView(dish) {
  state.quickView.currentDish = dish;
  state.quickView.quantity = 1;

  const modal = document.getElementById('quickViewModal');
  const backdrop = document.getElementById('quickViewBackdrop');

  document.getElementById('qvImage').src = dish.image;
  document.getElementById('qvCategory').textContent = dish.category.toUpperCase();
  document.getElementById('qvTitle').textContent = dish.name;
  document.getElementById('qvPrice').textContent = formatRupiah(dish.price);
  document.getElementById('qvDesc').textContent = dish.desc;
  document.getElementById('qvQtyVal').textContent = '1';

  if (modal && backdrop) {
    modal.classList.add('open');
    backdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function closeQuickView() {
  const modal = document.getElementById('quickViewModal');
  const backdrop = document.getElementById('quickViewBackdrop');
  if (modal && backdrop) {
    modal.classList.remove('open');
    backdrop.classList.remove('active');
    document.body.style.overflow = '';
  }
}

function changeQvQty(delta) {
  state.quickView.quantity = Math.max(1, Math.min(20, state.quickView.quantity + delta));
  const el = document.getElementById('qvQtyVal');
  if (el) el.textContent = state.quickView.quantity;
}

function addQvToCart() {
  if (!state.quickView.currentDish) return;

  addToCartItem({
    id: state.quickView.currentDish.id,
    name: state.quickView.currentDish.name,
    price: state.quickView.currentDish.price,
    image: state.quickView.currentDish.image,
    quantity: state.quickView.quantity
  });

  closeQuickView();
}

// ==========================================================================
// SPOTLIGHT SINGLE DISH SHOWCASE
// ==========================================================================
function switchImage(button, imgUrl) {
  const mainImg = document.getElementById('mainProductImg');
  if (mainImg) {
    mainImg.style.opacity = '0.3';
    setTimeout(() => {
      mainImg.src = imgUrl;
      state.spotlight.image = imgUrl;
      mainImg.style.opacity = '1';
    }, 150);
  }

  document.querySelectorAll('.thumb-btn').forEach(btn => btn.classList.remove('active'));
  button.classList.add('active');
}

function selectSize(button, price, portionLabel) {
  state.spotlight.currentPrice = price;
  state.spotlight.portion = portionLabel;

  document.querySelectorAll('.size-btn').forEach(btn => btn.classList.remove('active'));
  button.classList.add('active');

  const priceElement = document.getElementById('spotlightPrice');
  if (priceElement) {
    priceElement.textContent = formatRupiah(price * state.spotlight.quantity);
  }
}

function changeQty(delta) {
  state.spotlight.quantity = Math.max(1, Math.min(20, state.spotlight.quantity + delta));

  const qtyEl = document.getElementById('qtyVal');
  if (qtyEl) qtyEl.textContent = state.spotlight.quantity;

  const priceElement = document.getElementById('spotlightPrice');
  if (priceElement) {
    priceElement.textContent = formatRupiah(state.spotlight.currentPrice * state.spotlight.quantity);
  }
}

function addSpotlightToCart() {
  addToCartItem({
    id: 'spotlight-ayam-bakar',
    name: `${state.spotlight.name}`,
    portion: state.spotlight.portion,
    price: state.spotlight.currentPrice,
    image: state.spotlight.image,
    quantity: state.spotlight.quantity
  });
}

// ==========================================================================
// LIVE SEARCH & CATEGORY FILTERING
// ==========================================================================
function filterMenu() {
  const searchInput = document.getElementById('menuSearchInput');
  const clearBtn = document.getElementById('clearSearchBtn');
  const query = (searchInput ? searchInput.value.trim().toLowerCase() : '');
  const category = state.activeCategory;
  const cards = document.querySelectorAll('.product-card');
  const resultsInfo = document.getElementById('searchResultsInfo');

  if (clearBtn) {
    if (query.length > 0) clearBtn.classList.add('active');
    else clearBtn.classList.remove('active');
  }

  let visibleCount = 0;

  cards.forEach(card => {
    const cardCategory = card.getAttribute('data-category');
    const cardName = card.getAttribute('data-name') || '';

    const matchesCategory = (category === 'all' || cardCategory === category);
    const matchesSearch = (query === '' || cardName.toLowerCase().includes(query));

    if (matchesCategory && matchesSearch) {
      card.style.display = 'flex';
      card.style.animation = 'fadeIn 0.35s ease';
      visibleCount++;
    } else {
      card.style.display = 'none';
    }
  });

  if (resultsInfo) {
    if (query.length > 0) {
      resultsInfo.innerHTML = `Menemukan <strong>${visibleCount}</strong> menu untuk kata kunci <em>"${query}"</em>`;
    } else {
      resultsInfo.innerHTML = '';
    }
  }
}

function filterByCategory(category) {
  state.activeCategory = category;
  document.querySelectorAll('.filter-btn').forEach(btn => {
    if (btn.getAttribute('data-filter') === category) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
  filterMenu();
}

// ==========================================================================
// WISHLIST SYSTEM
// ==========================================================================
function toggleWishlist(button, dishName) {
  const icon = button.querySelector('i');
  const wishlistBadge = document.getElementById('wishlistCount');

  if (state.wishlist.has(dishName)) {
    state.wishlist.delete(dishName);
    button.classList.remove('active');
    if (icon) {
      icon.classList.remove('fa-solid');
      icon.classList.add('fa-regular');
    }
    showToast(`"${dishName}" dihapus dari favorit`, 'fa-regular fa-heart');
  } else {
    state.wishlist.add(dishName);
    button.classList.add('active');
    if (icon) {
      icon.classList.remove('fa-regular');
      icon.classList.add('fa-solid');
    }
    showToast(`"${dishName}" ditambahkan ke favorit! ❤️`, 'fa-solid fa-heart');
  }

  if (wishlistBadge) {
    wishlistBadge.textContent = state.wishlist.size;
    if (state.wishlist.size > 0) {
      wishlistBadge.classList.add('has-items');
    } else {
      wishlistBadge.classList.remove('has-items');
    }
  }
}

// ==========================================================================
// SCROLL REVEAL ANIMATIONS (IntersectionObserver)
// ==========================================================================
function initScrollAnimations() {
  const revealElements = document.querySelectorAll('.reveal-on-scroll');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          obs.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => observer.observe(el));
  } else {
    // Fallback if IntersectionObserver is not supported
    revealElements.forEach(el => el.classList.add('is-revealed'));
  }
}

// ==========================================================================
// EVENT LISTENERS & INITIALIZATION
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
  // Initialize Storage & State
  initCartFromStorage();
  initScrollAnimations();

  // Cart Button Triggers
  const openCartBtn = document.getElementById('openCartBtn');
  if (openCartBtn) {
    openCartBtn.addEventListener('click', openCart);
  }

  // Sticky Navbar Scroll Listener
  const navbar = document.getElementById('mainNavbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // Mobile Menu Toggle
  const mobileBtn = document.getElementById('mobileMenuBtn');
  const mobileDrawer = document.getElementById('mobileDrawer');
  if (mobileBtn && mobileDrawer) {
    mobileBtn.addEventListener('click', () => {
      mobileDrawer.classList.toggle('open');
      const icon = mobileBtn.querySelector('i');
      if (mobileDrawer.classList.contains('open')) {
        icon.className = 'fa-solid fa-xmark';
      } else {
        icon.className = 'fa-solid fa-bars';
      }
    });

    // Close mobile drawer on link click
    document.querySelectorAll('.mobile-link').forEach(link => {
      link.addEventListener('click', () => {
        mobileDrawer.classList.remove('open');
        mobileBtn.querySelector('i').className = 'fa-solid fa-bars';
      });
    });
  }

  // Search Input Event
  const searchInput = document.getElementById('menuSearchInput');
  const clearBtn = document.getElementById('clearSearchBtn');
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      filterMenu();
    });
  }
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      searchInput.value = '';
      filterMenu();
      searchInput.focus();
    });
  }

  // Filter Buttons Event
  const filterButtons = document.querySelectorAll('.filter-btn');
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.getAttribute('data-filter');
      filterByCategory(filter);
    });
  });

  // Catering Form Submit
  const cateringForm = document.getElementById('cateringForm');
  if (cateringForm) {
    cateringForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const contactVal = document.getElementById('cateringContactInput').value.trim();
      const waMsg = `Halo Dapoer Tiny, saya ingin konsultasi paket katering/acara. Kontak saya: ${contactVal}`;
      window.open(`https://wa.me/628123456789?text=${encodeURIComponent(waMsg)}`, '_blank');
      showToast('Permintaan konsultasi Anda telah dikirim via WhatsApp!');
      cateringForm.reset();
    });
  }

  // Keyboard Accessibility: Escape to close modals
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeCart();
      closeQuickView();
    }
  });
});
