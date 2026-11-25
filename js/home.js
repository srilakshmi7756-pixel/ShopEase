// Home page uses the shared addToCart() function from script.js.
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.product-card').forEach(card => {
    const btn = card.querySelector('.add-btn'); const img = card.querySelector('img');
    if (btn && img) { const original = btn.getAttribute('onclick'); const match = original?.match(/addToCart\('([^']+)',\s*(\d+)/); if (match) btn.setAttribute('onclick', `addToCart('${match[1]}', ${match[2]}, '${img.src}')`); }
  });
});
