/* Shared ShopEase functionality. Data is stored in this browser using localStorage. */
const SHOP_KEYS = { cart: 'shopease_cart', users: 'shopease_users', products: 'shopease_seller_products', reviews: 'shopease_reviews' };
function readStore(key, fallback = []) { try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; } }
function writeStore(key, value) { localStorage.setItem(key, JSON.stringify(value)); }
function money(value) { return '₹' + Number(value || 0).toLocaleString('en-IN'); }
function getCart() { return readStore(SHOP_KEYS.cart, []); }
function updateCartCount() { const count = getCart().reduce((sum, item) => sum + Number(item.qty || 1), 0); document.querySelectorAll('#cart-count').forEach(el => el.textContent = count); }
function addToCart(name, price, image = '') {
  const cart = getCart(); const found = cart.find(item => item.name === name);
  if (found) found.qty += 1; else cart.push({ name, price: Number(price), image, qty: 1 });
  writeStore(SHOP_KEYS.cart, cart); updateCartCount();
  const button = [...document.querySelectorAll('button')].find(b => b.getAttribute('onclick')?.includes(name));
  if (button) { const old = button.textContent; button.textContent = 'Added ✓'; setTimeout(() => button.textContent = old, 900); }
}
function removeCartItem(name) { writeStore(SHOP_KEYS.cart, getCart().filter(item => item.name !== name)); renderCart(); }
function changeCartQty(name, delta) { const cart = getCart(); const item = cart.find(x => x.name === name); if (item) item.qty = Math.max(1, item.qty + delta); writeStore(SHOP_KEYS.cart, cart); renderCart(); }
function renderCart() {
  const holder = document.getElementById('cart-items'); if (!holder) return;
  const cart = getCart(); const empty = document.getElementById('empty-cart');
  holder.innerHTML = '';
  if (empty) empty.style.display = cart.length ? 'none' : 'block';
  cart.forEach(item => {
    const article = document.createElement('article'); article.className = 'cart-item';
    article.innerHTML = `${item.image ? `<img src="${item.image}" alt="">` : '<div class="cart-placeholder">🛍️</div>'}<div class="cart-item-details"><h3>${escapeHTML(item.name)}</h3><p>${money(item.price)}</p><div class="quantity-box"><button type="button" aria-label="Decrease">−</button><span>${item.qty}</span><button type="button" aria-label="Increase">+</button></div></div><button class="remove-item" type="button">Remove</button>`;
    const buttons = article.querySelectorAll('.quantity-box button'); buttons[0].addEventListener('click', () => changeCartQty(item.name, -1)); buttons[1].addEventListener('click', () => changeCartQty(item.name, 1)); article.querySelector('.remove-item').addEventListener('click', () => removeCartItem(item.name)); holder.appendChild(article);
  });
  const subtotal = cart.reduce((s, x) => s + x.price * x.qty, 0); const delivery = subtotal === 0 || subtotal >= 999 ? 0 : 49;
  const discount = sessionStorage.getItem('shopease_coupon') === 'EASE10' ? Math.round(subtotal * .1) : 0;
  const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = money(val); };
  set('subtotal', subtotal); set('delivery', delivery); set('discount', discount); set('total', Math.max(0, subtotal + delivery - discount));
  const count = document.getElementById('item-count'); if (count) count.textContent = `${cart.reduce((s,x)=>s+x.qty,0)} Items`;
  updateCartCount();
}
function escapeHTML(value) { return String(value).replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch])); }
document.addEventListener('DOMContentLoaded', () => {
  updateCartCount(); renderCart();
  const menu = document.getElementById('menuBtn'), nav = document.getElementById('navLinks');
  if (menu && nav) menu.addEventListener('click', () => nav.classList.toggle('show'));
  const couponBtn = document.getElementById('applyCoupon'); if (couponBtn) couponBtn.addEventListener('click', () => { const code = document.getElementById('coupon').value.trim().toUpperCase(); const msg = document.getElementById('coupon-message'); if (code === 'EASE10') { sessionStorage.setItem('shopease_coupon', code); msg.textContent = 'Coupon applied: 10% off!'; msg.style.color = '#4ed9a0'; } else { sessionStorage.removeItem('shopease_coupon'); msg.textContent = 'Invalid coupon code. Try EASE10.'; msg.style.color = '#ff8495'; } renderCart(); });
  const checkout = document.getElementById('checkoutBtn'); if (checkout) checkout.addEventListener('click', () => { if (!getCart().length) { alert('Your cart is empty. Add products before checkout.'); return; } alert('Demo checkout: your order summary is ready. No payment has been processed.'); });
  const newsletter = document.getElementById('newsletter-form'); if (newsletter) newsletter.addEventListener('submit', e => { e.preventDefault(); document.getElementById('newsletter-message').textContent = 'Thank you for subscribing!'; newsletter.reset(); });
});
