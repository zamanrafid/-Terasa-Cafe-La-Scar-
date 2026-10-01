// ===== PRELOADER =====
window.addEventListener('load', () => setTimeout(() => document.getElementById('preloader').classList.add('hide'), 900));
setTimeout(() => document.getElementById('preloader').classList.add('hide'), 3500);

// ===== SCROLL PROGRESS + NAV SHADOW + TO TOP =====
const progress = document.getElementById('scrollProgress');
const toTop = document.getElementById('toTop');
window.addEventListener('scroll', () => {
  const h = document.documentElement;
  progress.style.width = (h.scrollTop / (h.scrollHeight - h.clientHeight) * 100) + '%';
  document.getElementById('navbar').style.boxShadow = h.scrollTop > 10 ? '0 8px 24px rgba(0,0,0,.1)' : 'none';
  toTop.classList.toggle('show', h.scrollTop > 600);
}, { passive: true });
toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// ===== HERO SLIDESHOW =====
const slides = document.querySelectorAll('.hero-slides .slide');
const dots = document.querySelectorAll('#heroDots button');
let cur = 0;
function goSlide(i) {
  slides[cur].classList.remove('active'); dots[cur].classList.remove('active');
  cur = (i + slides.length) % slides.length;
  slides[cur].classList.add('active'); dots[cur].classList.add('active');
}
setInterval(() => goSlide(cur + 1), 6000);
dots.forEach((d, i) => d.addEventListener('click', () => goSlide(i)));

// ===== REVEAL ON SCROLL =====
const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); } }), { threshold: .12 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// ===== ANIMATED COUNTERS =====
const cio = new IntersectionObserver(es => es.forEach(e => {
  if (!e.isIntersecting) return; cio.unobserve(e.target);
  const el = e.target, target = parseFloat(el.dataset.target), dec = parseInt(el.dataset.decimals || 0);
  const t0 = performance.now(), dur = 1600;
  (function tick(t) {
    const p = Math.min((t - t0) / dur, 1), ease = 1 - Math.pow(1 - p, 3);
    const val = target * ease;
    el.textContent = dec ? val.toFixed(dec) : Math.round(val).toLocaleString('ro-RO');
    if (p < 1) requestAnimationFrame(tick);
  })(t0);
}), { threshold: .5 });
document.querySelectorAll('.counter').forEach(el => cio.observe(el));

// ===== OPEN / CLOSED BADGE =====
(function () {
  const badge = document.getElementById('openBadge');
  const now = new Date(), day = now.getDay(), h = now.getHours() + now.getMinutes() / 60;
  const weekend = (day === 0 || day === 5 || day === 6);
  const open = weekend ? (h >= 9 && h < 24) : (h >= 8 && h < 23);
  badge.textContent = open ? '● Deschis acum · te așteptăm!' : '● Închis acum · ne vedem dimineață';
  badge.classList.add(open ? 'open' : 'closed');
  const tables = 3 + Math.floor(Math.random() * 6);
  document.getElementById('freeTables').textContent = `🔥 Azi: ${tables} mese libere pe terasă`;
  const days = ['Duminică','Luni','Marți','Miercuri','Joi','Vineri','Sâmbătă'];
  document.getElementById('todayHours').textContent = `Azi (${days[day]}): ${weekend ? '09:00–00:00' : '08:00–23:00'} · bucătăria -1h`;
})();

// ===== MENU DATA + TABS =====
const MENU = {
  brunch: [
    { name: "Mic Dejun La Scară", desc: "Ouă ochiuri/omletă, halloumi, avocado, focaccia, salată", price: "38 lei" },
    { name: "Pancakes cu ricotta", desc: "Miere, fructe de pădure, smântână, mentă", price: "34 lei", tag: "Popular" },
    { name: "Shakshuka", desc: "Ouă în sos de roșii, feta, pâine cu usturoi", price: "36 lei" },
    { name: "Bowl vegan 🌱", desc: "Quinoa, humus, legume coapte, tahini", price: "35 lei", tag: "Vegan" },
    { name: "Croissant + cafea", desc: "Croissant cu unt + flat white / cappuccino", price: "24 lei" },
    { name: "Omletă cu trufe", desc: "Cremă de trufe, parmezan, rucola", price: "42 lei", tag: "Chef" },
  ],
  pranz: [
    { name: "Supă cremă de roșii", desc: "Burrata, busuioc, focaccia caldă", price: "28 lei" },
    { name: "Salată Caesar cu pui", desc: "Romana, parmezan, crutoane, dressing casă", price: "39 lei" },
    { name: "Burger La Scară", desc: "Vită, cheddar, ceapă caramelizată, wedges", price: "52 lei", tag: "Chef" },
    { name: "Paste cu creveți", desc: "Usturoi, chili, unt, pătrunjel, lămâie", price: "54 lei" },
    { name: "Halloumi la grătar", desc: "Cuscus, legume, mentă, rodie", price: "44 lei", tag: "Veggie" },
    { name: "Pui cu piure de țelină", desc: "Sos de cimbru, morcovi glazurați", price: "48 lei" },
  ],
  cafe: [
    { name: "Espresso / Ristretto", desc: "Blend casă, note de ciocolată", price: "10 lei" },
    { name: "Flat White dublu", desc: "Dublu shot, lapte catifelat", price: "16 lei", tag: "Popular" },
    { name: "Cappuccino clasic", desc: "Rețetă italiană, cacao belgiană", price: "15 lei" },
    { name: "Matcha latte", desc: "Matcha ceremonial, lapte de ovăz", price: "19 lei", tag: "Nou" },
    { name: "Tiramisu La Scară", desc: "Espresso, mascarpone, cacao", price: "28 lei" },
    { name: "Cheesecake Basque", desc: "Centru cremos, fructe proaspete", price: "30 lei" },
    { name: "Limonadă cu mentă", desc: "Menta din grădina noastră + miere", price: "20 lei" },
    { name: "Ciocolată caldă belgiană", desc: "70% cacao, frișcă, fulgi de sare", price: "18 lei" },
  ],
  bauturi: [
    { name: "Aperol Spritz", desc: "Aperol, prosecco, sifon, portocală", price: "32 lei" },
    { name: "Hugo pe terasă", desc: "Prosecco, soc, mentă, lime", price: "32 lei", tag: "Terasa" },
    { name: "Vinul casei (pahar)", desc: "Fetească Albă / Merlot, Dealu Mare", price: "22 lei" },
    { name: "Limonadă castravete", desc: "Castravete, lime, mentă", price: "21 lei" },
    { name: "Bere artizanală", desc: "Seleție locală — întreabă barmanul", price: "20 lei" },
    { name: "Cocktail fără alcool", desc: "Fructe de sezon, gheață pilée", price: "24 lei" },
  ]
};
const grid = document.getElementById('menuGrid');
function renderMenu(key) {
  grid.innerHTML = MENU[key].map(m => `<div class="menu-item"><div><h4>${m.name}${m.tag ? `<span class="tag">${m.tag}</span>` : ''}</h4><p>${m.desc}</p></div><div class="price">${m.price}</div></div>`).join('');
}
renderMenu('brunch');
document.querySelectorAll('.tab').forEach(b => b.addEventListener('click', () => {
  document.querySelectorAll('.tab').forEach(x => x.classList.remove('active'));
  b.classList.add('active'); renderMenu(b.dataset.tab);
}));

// ===== BURGER + responsive nav =====
const burger = document.getElementById('burger'), navLinks = document.getElementById('navLinks');
burger.addEventListener('click', (e) => { e.stopPropagation(); navLinks.classList.toggle('open'); burger.textContent = navLinks.classList.contains('open') ? '✕' : '☰'; });
navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => { navLinks.classList.remove('open'); burger.textContent = '☰'; }));
document.addEventListener('click', (e) => { if (navLinks.classList.contains('open') && !navLinks.contains(e.target) && e.target !== burger) { navLinks.classList.remove('open'); burger.textContent = '☰'; } });
window.addEventListener('resize', () => { if (window.innerWidth > 1020 && navLinks.classList.contains('open')) { navLinks.classList.remove('open'); burger.textContent = '☰'; } });

// ===== GALLERY LIGHTBOX =====
const lb = document.getElementById('lightbox'), lbImg = document.getElementById('lightboxImg');
document.querySelectorAll('.gallery img').forEach(img => img.addEventListener('click', () => {
  lbImg.src = img.src.replace('w=800', 'w=1400'); lb.classList.add('open');
}));
lb.addEventListener('click', () => lb.classList.remove('open'));
document.addEventListener('keydown', e => { if (e.key === 'Escape') { lb.classList.remove('open'); modal.classList.remove('open'); } });

// ===== REVIEWS SLIDER =====
const track = document.getElementById('reviewTrack');
document.getElementById('prevR').addEventListener('click', () => track.scrollBy({ left: -320, behavior: 'smooth' }));
document.getElementById('nextR').addEventListener('click', () => track.scrollBy({ left: 320, behavior: 'smooth' }));

// ===== TOAST =====
function toast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg; t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3200);
}

// ===== RESERVATION =====
const dataInput = document.getElementById('dataInput');
const today = new Date().toISOString().split('T')[0];
dataInput.min = today; dataInput.value = today;
const maxD = new Date(); maxD.setMonth(maxD.getMonth() + 2);
dataInput.max = maxD.toISOString().split('T')[0];

const form = document.getElementById('resForm'), err = document.getElementById('formError');
const modal = document.getElementById('confirmModal'), confirmText = document.getElementById('confirmText');
const summary = document.getElementById('liveSummary');
function updateSummary() {
  const d = dataInput.value, o = document.getElementById('oraInput').value, p = document.getElementById('persInput').value;
  if (d && o && p) {
    const dRO = new Date(d + 'T00:00').toLocaleDateString('ro-RO', { weekday: 'long', day: 'numeric', month: 'long' });
    summary.innerHTML = `✨ <strong>Rezumat:</strong> ${dRO}, ora <strong>${o}</strong>, <strong>${p}</strong>`;
    summary.style.background = '#e8f5e9'; summary.style.borderStyle = 'solid';
  }
}
['change', 'input'].forEach(ev => form.addEventListener(ev, updateSummary));

form.addEventListener('submit', e => {
  e.preventDefault(); err.textContent = '';
  const fd = new FormData(form);
  const nume = (fd.get('nume') || '').toString().trim();
  const telefon = (fd.get('telefon') || '').toString().trim();
  const data = fd.get('data'), ora = fd.get('ora'), persoane = fd.get('persoane'), zona = fd.get('zona');
  if (nume.length < 3) return err.textContent = 'Te rog introdu numele complet.';
  if (!/^(\+?40|0)?\s?7\d{2}[\s.-]?\d{3}[\s.-]?\d{3}$/.test(telefon.replace(/\s/g, '')))
    return err.textContent = 'Telefon invalid — ex. 0721 234 567.';
  if (!data) return err.textContent = 'Alege data rezervării.';
  if (!ora) return err.textContent = 'Alege ora rezervării.';
  if (!persoane) return err.textContent = 'Alege numărul de persoane.';
  if (!document.getElementById('gdpr').checked) return err.textContent = 'Bifează acordul de prelucrare a datelor.';

  const all = JSON.parse(localStorage.getItem('lascara_rezervari') || '[]');
  const nr = String(all.length + 1).padStart(3, '0');
  all.push({ nume, telefon, data, ora, persoane, zona, created: new Date().toISOString() });
  localStorage.setItem('lascara_rezervari', JSON.stringify(all));

  const dataRO = new Date(data + 'T00:00').toLocaleDateString('ro-RO', { weekday: 'long', day: 'numeric', month: 'long' });
  confirmText.innerHTML = `<strong>${nume}</strong>, te așteptăm <strong>${dataRO} la ${ora}</strong> — ${persoane}, <strong>${zona}</strong>.<br>Nr. rezervare: <strong>#${nr}</strong>`;
  const dt = String(data).replaceAll('-', '') + 'T' + String(ora).replace(':', '') + '00';
  document.getElementById('addCalendar').href = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=Rezervare+La+Scara+%23${nr}&dates=${dt}/${dt}&details=Masa+${persoane}+zona+${zona}`;
  modal.classList.add('open'); modal.setAttribute('aria-hidden', 'false');
  toast('✅ Rezervare înregistrată cu succes!');
  form.reset(); dataInput.value = today;
  summary.textContent = 'Alege data, ora și persoanele → vezi rezumatul aici ✨';
  summary.style.background = ''; summary.style.borderStyle = '';
});
document.getElementById('closeModal').addEventListener('click', () => modal.classList.remove('open'));
modal.addEventListener('click', e => { if (e.target === modal) modal.classList.remove('open'); });

// ===== NEWSLETTER =====
document.getElementById('newsForm').addEventListener('submit', e => {
  e.preventDefault(); e.target.reset(); toast('📩 Mulțumim! Te-ai abonat la noutăți La Scară.');
});
