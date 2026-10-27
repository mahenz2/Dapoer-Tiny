const DAPOER_MENU = [
  { id: 'menu-ayam-bakar', name: 'Ayam Bakar Madu Spesial', price: 28000, image: 'images/ayam_bakar_madu.jpg', category: 'makanan', categoryLabel: 'Ayam Bakar Spesial', desc: 'Ayam empuk dimarinasi dengan madu dan rempah, disajikan bersama sambal bajak dan lalapan segar.' },
  { id: 'menu-gurami-bakar', name: 'Gurami Bakar Bumbu Madu', price: 45000, image: 'images/gurami_bakar.jpg', category: 'makanan', categoryLabel: 'Ikan Bakar Fresh', desc: 'Ikan gurami segar dibakar dengan olesan kecap madu dan rempah Nusantara.' },
  { id: 'menu-pecel-lele', name: 'Pecel Lele Goreng Crispy', price: 18000, image: 'images/pecel_lele.jpg', category: 'makanan', categoryLabel: 'Ikan Goreng Renyah', desc: 'Lele renyah dengan sambal terasi dan lalapan segar.' },
  { id: 'menu-nasi-goreng', name: 'Nasi Goreng Spesial', price: 20000, image: 'images/nasi_goreng.jpg', category: 'makanan', categoryLabel: 'Favorit Warung', desc: 'Nasi goreng berbumbu dengan telur dan sayuran.' },
  { id: 'menu-hati-ayam', name: 'Hati Ayam Goreng Lalapan', price: 15000, image: 'images/hati_ayam_kremes.jpg', category: 'makanan', categoryLabel: 'Lauk Gurih', desc: 'Hati ayam goreng gurih dengan kremes dan lalapan.' },
  { id: 'menu-tempe-goreng', name: 'Tempe Goreng Gurih', price: 6000, image: 'images/tempe_goreng.jpg', category: 'pelengkap', categoryLabel: 'Lauk Pelengkap', desc: 'Tempe pilihan digoreng hingga gurih dan renyah.' },
  { id: 'menu-tahu-goreng', name: 'Tahu Goreng Crispy', price: 6000, image: 'images/tahu_goreng.jpg', category: 'pelengkap', categoryLabel: 'Lauk Pelengkap', desc: 'Tahu goreng renyah dengan bagian dalam yang lembut.' },
  { id: 'menu-nasi-putih', name: 'Nasi Putih Pulen', price: 6000, image: 'images/nasi_putih.jpg', category: 'pelengkap', categoryLabel: 'Nasi Hangat', desc: 'Nasi putih pulen yang disajikan hangat.' },
  { id: 'menu-sambal-matah', name: 'Extra Sambal Matah', price: 5000, image: 'images/sambal_matah.jpg', category: 'pelengkap', categoryLabel: 'Sambal Pilihan', desc: 'Sambal matah segar dengan cabai, bawang, dan serai.' },
  { id: 'menu-sambal-terasi', name: 'Extra Sambal Terasi', price: 5000, image: 'images/sambal_terasi.jpg', category: 'pelengkap', categoryLabel: 'Sambal Pilihan', desc: 'Sambal terasi dengan rasa pedas dan gurih.' },
  { id: 'menu-sambal-merah', name: 'Extra Sambal Merah', price: 5000, image: 'images/sambal_merah.jpg', category: 'pelengkap', categoryLabel: 'Sambal Pilihan', desc: 'Sambal merah pedas untuk melengkapi hidangan.' },
  { id: 'menu-es-jeruk', name: 'Es Jeruk Peras Asli', price: 8000, image: 'images/es_jeruk.jpg', category: 'minuman', categoryLabel: 'Minuman Segar', desc: 'Jeruk peras segar dengan rasa manis dan asam yang seimbang.' },
  { id: 'menu-es-teh', name: 'Es Teh Manis Segar', price: 5000, image: 'images/es_teh.jpg', category: 'minuman', categoryLabel: 'Minuman Segar', desc: 'Teh melati dingin dengan rasa manis yang pas.' },
  { id: 'menu-es-gula', name: 'Es Gula Asli Segar', price: 6000, image: 'images/es_gula.jpg', category: 'minuman', categoryLabel: 'Minuman Segar', desc: 'Minuman dingin dengan manis alami yang menyegarkan.' },
  { id: 'menu-air-mineral', name: 'Air Mineral Dingin', price: 4000, image: 'images/air_mineral.jpg', category: 'minuman', categoryLabel: 'Minuman Segar', desc: 'Air mineral dingin dalam kemasan.' }
];

function escapeMenuText(value) {
  return String(value).replace(/[&<>"']/g, character => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[character]);
}

function formatMenuPrice(price) {
  return `Rp ${Number(price).toLocaleString('id-ID')}`;
}

function createMenuCard(item, isFavoritePage = false) {
  const card = document.createElement('article');
  card.className = 'product-card';
  card.dataset.category = item.category;
  card.dataset.name = `${item.name} ${item.categoryLabel} ${item.desc}`.toLowerCase();
  card.innerHTML = `
    <div class="prod-img-wrap">
      <img src="${escapeMenuText(item.image)}" alt="${escapeMenuText(item.name)}" loading="lazy">
      <button type="button" class="wishlist-btn${state.wishlist.has(item.name) ? ' active' : ''}" aria-label="${isFavoritePage ? 'Hapus' : 'Tambah'} ${escapeMenuText(item.name)} ke favorit" title="${isFavoritePage ? 'Hapus dari favorit' : 'Simpan ke favorit'}">
        <i class="${state.wishlist.has(item.name) ? 'fa-solid' : 'fa-regular'} fa-heart"></i>
      </button>
    </div>
    <div class="product-body">
      <span class="prod-subtitle">${escapeMenuText(item.categoryLabel).toUpperCase()}</span>
      <h2 class="prod-name">${escapeMenuText(item.name)}</h2>
      <p class="prod-meta">${escapeMenuText(item.desc)}</p>
      <div class="product-footer">
        <span class="price-val">${formatMenuPrice(item.price)}</span>
        <button type="button" class="btn btn-brown-sm"><i class="fa-solid fa-cart-plus"></i> + Pesan</button>
      </div>
    </div>`;

  card.querySelector('.wishlist-btn').addEventListener('click', event => {
    toggleWishlist(event.currentTarget, item.name);
    if (isFavoritePage) renderFavoritePage();
  });
  card.querySelector('.product-footer button').addEventListener('click', () => addToCartItem(item));
  return card;
}

function renderSearchPage() {
  const grid = document.getElementById('searchMenuGrid');
  if (!grid) return;
  DAPOER_MENU.forEach(item => grid.appendChild(createMenuCard(item)));

  const params = new URLSearchParams(window.location.search);
  const query = params.get('q');
  const category = params.get('category');
  const searchInput = document.getElementById('menuSearchInput');
  if (query && searchInput) searchInput.value = query;
  if (['makanan', 'pelengkap', 'minuman'].includes(category)) {
    filterByCategory(category);
  } else {
    filterMenu();
  }
}

function renderFavoritePage() {
  const grid = document.getElementById('favoriteMenuGrid');
  const emptyState = document.getElementById('favoriteEmptyState');
  if (!grid || !emptyState) return;

  grid.replaceChildren();
  const favorites = DAPOER_MENU.filter(item => state.wishlist.has(item.name));
  favorites.forEach(item => grid.appendChild(createMenuCard(item, true)));
  emptyState.hidden = favorites.length > 0;
}

document.addEventListener('DOMContentLoaded', () => {
  renderSearchPage();
  renderFavoritePage();
});
