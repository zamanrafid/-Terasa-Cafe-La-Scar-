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
if (!matchMedia('(prefers-reduced-motion:reduce)').matches) setInterval(() => { if (!document.hidden) goSlide(cur + 1); }, 6000);
dots.forEach((d, i) => { d.setAttribute('aria-label', 'Imaginea ' + (i + 1)); d.addEventListener('click', () => goSlide(i)); });
// swipe on hero (touch)
(function () {
  const hero = document.getElementById('acasa'); let x0 = null, y0 = null;
  hero.addEventListener('touchstart', e => { x0 = e.touches[0].clientX; y0 = e.touches[0].clientY; }, { passive: true });
  hero.addEventListener('touchend', e => {
    if (x0 === null) return;
    const dx = e.changedTouches[0].clientX - x0, dy = e.changedTouches[0].clientY - y0;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) goSlide(cur + (dx < 0 ? 1 : -1));
    x0 = null;
  }, { passive: true });
})();

// ===== REVEAL ON SCROLL =====
const io = !('IntersectionObserver' in window) ? { observe: e => e.classList.add('visible'), unobserve() {} } : new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); } }), { threshold: .12 });
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

// ===== OPEN / CLOSED BADGE (always Europe/Bucharest time) =====
function buchNow() {
  const p = new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Bucharest', weekday: 'short', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false }).formatToParts(new Date());
  const g = t => p.find(x => x.type === t).value;
  return { day: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(g('weekday')), h: (parseInt(g('hour')) % 24) + parseInt(g('minute')) / 60, iso: `${g('year')}-${g('month')}-${g('day')}` };
}
const hoursFor = d => (d === 0 || d === 5 || d === 6) ? [9, 24] : [8, 23];
function updateBadge() {
  const badge = document.getElementById('openBadge'), { day, h, iso } = buchNow(), [o, c] = hoursFor(day);
  const open = h >= o && h < c;
  badge.textContent = open ? '● Deschis acum · te așteptăm!' : '● Închis acum · ne vedem dimineață';
  badge.classList.toggle('open', open); badge.classList.toggle('closed', !open);
  const seed = [...iso].reduce((a, ch) => a + ch.charCodeAt(0), 0);
  document.getElementById('freeTables').textContent = `🔥 Azi: ${3 + seed % 6} mese libere pe terasă`;
  const days = ['Duminică', 'Luni', 'Marți', 'Miercuri', 'Joi', 'Vineri', 'Sâmbătă'];
  document.getElementById('todayHours').textContent = `Azi (${days[day]}): ${String(o).padStart(2, '0')}:00–${c === 24 ? '00' : c}:00 · bucătăria -1h`;
}
updateBadge(); setInterval(updateBadge, 60000);

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
    { name: "Limonadă cu mentă", desc: "Mentă din grădina noastră + miere", price: "20 lei" },
    { name: "Ciocolată caldă belgiană", desc: "70% cacao, frișcă, fulgi de sare", price: "18 lei" },
  ],
  bauturi: [
    { name: "Aperol Spritz", desc: "Aperol, prosecco, sifon, portocală", price: "32 lei" },
    { name: "Hugo pe terasă", desc: "Prosecco, soc, mentă, lime", price: "32 lei", tag: "Terasa" },
    { name: "Vinul casei (pahar)", desc: "Fetească Albă / Merlot, Dealu Mare", price: "22 lei" },
    { name: "Limonadă castravete", desc: "Castravete, lime, mentă", price: "21 lei" },
    { name: "Bere artizanală", desc: "Selecție locală — întreabă barmanul", price: "20 lei" },
    { name: "Cocktail fără alcool", desc: "Fructe de sezon, gheață pilée", price: "24 lei" },
  ]
};
function esc(s) { return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); }
const grid = document.getElementById('menuGrid'), search = document.getElementById('menuSearch'), tabs = [...document.querySelectorAll('.tab')];
let activeTab = 'brunch';
const card = m => `<div class="menu-item"><div><h4>${m.name}${m.tag ? `<span class="tag">${m.tag}</span>` : ''}</h4><p>${m.desc}</p></div><div class="price">${m.price}</div></div>`;
function renderMenu() {
  const q = search.value.trim().toLowerCase();
  const list = q ? Object.values(MENU).flat().filter(m => (m.name + ' ' + m.desc + ' ' + (m.tag || '')).toLowerCase().includes(q)) : MENU[activeTab];
  grid.innerHTML = list.length ? list.map(card).join('') : `<p class="menu-empty">Nimic găsit pentru „${esc(q)}”. Încearcă „cafea”, „vegan” sau „paste”.</p>`;
  tabs.forEach(t => { const on = !q && t.dataset.tab === activeTab; t.classList.toggle('active', on); t.setAttribute('aria-selected', on); t.tabIndex = on || (q && t === tabs[0]) ? 0 : -1; });
}
document.getElementById('menuTabs').setAttribute('role', 'tablist');
tabs.forEach((b, i) => {
  b.setAttribute('role', 'tab');
  b.addEventListener('click', () => { activeTab = b.dataset.tab; search.value = ''; renderMenu(); });
  b.addEventListener('keydown', e => { const n = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0; if (n) { const t = tabs[(i + n + tabs.length) % tabs.length]; t.focus(); t.click(); } });
});
search.addEventListener('input', renderMenu);
renderMenu();

// ===== BURGER + responsive nav =====
const burger = document.getElementById('burger'), navLinks = document.getElementById('navLinks'), backdrop = document.getElementById('navBackdrop');
function setNav(open) {
  navLinks.classList.toggle('open', open);
  backdrop.classList.toggle('show', open);
  syncScroll();
  burger.textContent = open ? '✕' : '☰';
  burger.setAttribute('aria-expanded', open);
}
burger.addEventListener('click', e => { e.stopPropagation(); setNav(!navLinks.classList.contains('open')); });
navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setNav(false)));
backdrop.addEventListener('click', () => setNav(false));
window.addEventListener('resize', () => { if (window.innerWidth > 1020) setNav(false); });

// ===== SCROLL LOCK =====
function syncScroll() { document.body.classList.toggle('no-scroll', !!document.querySelector('.lightbox.open,.modal.open,.links.open')); }

// ===== GALLERY LIGHTBOX (prev/next, swipe, keyboard) =====
const lb = document.getElementById('lightbox'), lbImg = document.getElementById('lightboxImg'), lbCap = document.getElementById('lbCap');
const gImgs = [...document.querySelectorAll('.gallery img')]; let li = 0;
function showLb(i) {
  li = (i + gImgs.length) % gImgs.length;
  lbImg.src = gImgs[li].src.replace('w=800', 'w=1400'); lbImg.alt = gImgs[li].alt;
  lbCap.textContent = `${li + 1} / ${gImgs.length} · ${gImgs[li].alt}`;
  lb.classList.add('open'); syncScroll();
}
function closeLb() { lb.classList.remove('open'); syncScroll(); }
gImgs.forEach((img, i) => {
  img.tabIndex = 0; img.setAttribute('role', 'button');
  img.addEventListener('click', () => showLb(i));
  img.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); showLb(i); } });
});
lb.addEventListener('click', e => { const b = e.target.closest('[data-lb]'); if (b) return showLb(li + (b.dataset.lb === 'next' ? 1 : -1)); closeLb(); });
let lx = null;
lb.addEventListener('touchstart', e => { lx = e.touches[0].clientX; }, { passive: true });
lb.addEventListener('touchend', e => { if (lx === null) return; const dx = e.changedTouches[0].clientX - lx; if (Math.abs(dx) > 50) showLb(li + (dx < 0 ? 1 : -1)); lx = null; }, { passive: true });

// ===== REVIEWS SLIDER =====
const track = document.getElementById('reviewTrack');
document.getElementById('prevR').addEventListener('click', () => track.scrollBy({ left: -track.clientWidth * .9, behavior: 'smooth' }));
document.getElementById('nextR').addEventListener('click', () => track.scrollBy({ left: track.clientWidth * .9, behavior: 'smooth' }));

// ===== TOAST =====
let toastT;
function toast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg; t.classList.add('show');
  clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove('show'), 3200);
}

// ===== RESERVATION =====
const pad = n => String(n).padStart(2, '0');
const dataInput = document.getElementById('dataInput'), oraInput = document.getElementById('oraInput'), persInput = document.getElementById('persInput');
const today = buchNow().iso;
dataInput.min = today; dataInput.value = today;
const [ty, tm, td] = today.split('-').map(Number), maxD = new Date(ty, tm - 1 + 2, td);
dataInput.max = `${maxD.getFullYear()}-${pad(maxD.getMonth() + 1)}-${pad(maxD.getDate())}`;

// disable hours that are in the past, before opening, or inside the last kitchen hour
function refreshTimes() {
  if (!dataInput.value) return;
  const d = new Date(dataInput.value + 'T12:00').getDay(), [o, c] = hoursFor(d), isToday = dataInput.value === today, now = buchNow().h;
  [...oraInput.options].forEach(opt => {
    if (!opt.value) return;
    const [hh, mm] = opt.value.split(':').map(Number), t = hh + mm / 60;
    opt.disabled = t < o || t > c - 1 || (isToday && t < now + .5);
  });
  if (oraInput.selectedOptions[0] && oraInput.selectedOptions[0].disabled) oraInput.value = '';
}
dataInput.addEventListener('change', refreshTimes); refreshTimes();

const form = document.getElementById('resForm'), err = document.getElementById('formError');
const modal = document.getElementById('confirmModal'), confirmText = document.getElementById('confirmText');
const summary = document.getElementById('liveSummary'), submitBtn = form.querySelector('button[type=submit]');
function updateSummary() {
  const d = dataInput.value, o = oraInput.value, p = persInput.value;
  if (d && o && p) {
    const dRO = new Date(d + 'T12:00').toLocaleDateString('ro-RO', { weekday: 'long', day: 'numeric', month: 'long' });
    summary.innerHTML = `✨ <strong>Rezumat:</strong> ${esc(dRO)}, ora <strong>${esc(o)}</strong>, <strong>${esc(p)}</strong>`;
    summary.style.background = '#e8f5e9'; summary.style.borderStyle = 'solid';
  }
}
['change', 'input'].forEach(ev => form.addEventListener(ev, updateSummary));
function closeModal() { modal.classList.remove('open'); modal.setAttribute('aria-hidden', 'true'); syncScroll(); }

form.addEventListener('submit', e => {
  e.preventDefault(); err.textContent = '';
  form.querySelectorAll('[aria-invalid]').forEach(x => x.removeAttribute('aria-invalid'));
  const fail = (msg, el) => { err.textContent = msg; if (el) { el.setAttribute('aria-invalid', 'true'); el.focus(); } };
  const f = form.elements, nume = f.nume.value.trim(), telefon = f.telefon.value.trim(), email = f.email.value.trim();
  const data = f.data.value, ora = f.ora.value, persoane = f.persoane.value, zona = f.zona.value, mesaj = f.mesaj.value.trim();
  if (nume.length < 3) return fail('Te rog introdu numele complet.', f.nume);
  if (!/^(\+?40|0)?7\d{2}[.-]?\d{3}[.-]?\d{3}$/.test(telefon.replace(/\s/g, ''))) return fail('Telefon invalid — ex. 0721 234 567.', f.telefon);
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return fail('Adresa de email nu pare corectă.', f.email);
  if (!data) return fail('Alege data rezervării.', f.data);
  if (data < dataInput.min || data > dataInput.max) return fail('Alege o dată între azi și următoarele 2 luni.', f.data);
  if (!ora) return fail('Alege o oră disponibilă (orele trecute sau în afara programului sunt dezactivate).', f.ora);
  if (!persoane) return fail('Alege numărul de persoane.', f.persoane);
  const gdpr = document.getElementById('gdpr');
  if (!gdpr.checked) return fail('Bifează acordul de prelucrare a datelor.', gdpr);

  submitBtn.disabled = true; setTimeout(() => submitBtn.disabled = false, 1500);
  let all = [];
  try { all = JSON.parse(localStorage.getItem('lascara_rezervari') || '[]'); } catch (_) { all = []; }
  const nr = String(all.length + 1).padStart(3, '0');
  try { all.push({ nume, telefon, email, data, ora, persoane, zona, mesaj, created: new Date().toISOString() }); localStorage.setItem('lascara_rezervari', JSON.stringify(all)); } catch (_) { /* storage blocked (private mode) */ }

  const dataRO = new Date(data + 'T12:00').toLocaleDateString('ro-RO', { weekday: 'long', day: 'numeric', month: 'long' });
  confirmText.innerHTML = `<strong>${esc(nume)}</strong>, te așteptăm <strong>${esc(dataRO)} la ${esc(ora)}</strong> — ${esc(persoane)}, <strong>${esc(zona)}</strong>.<br>Nr. rezervare: <strong>#${nr}</strong>`;
  const [hh, mm] = ora.split(':').map(Number), end = hh * 60 + mm + 90, d0 = data.replaceAll('-', '');
  const st = `${d0}T${pad(hh)}${pad(mm)}00`, en = `${d0}T${pad(Math.floor(end / 60) % 24)}${pad(end % 60)}00`;
  document.getElementById('addCalendar').href = 'https://calendar.google.com/calendar/render?action=TEMPLATE'
    + `&text=${encodeURIComponent('Rezervare La Scară #' + nr)}&dates=${st}/${en}&ctz=Europe/Bucharest`
    + `&details=${encodeURIComponent(`Masă ${persoane}, zona ${zona}${mesaj ? '. ' + mesaj : ''}`)}&location=${encodeURIComponent('Str. Scărilor 12, București')}`;
  modal.classList.add('open'); modal.setAttribute('aria-hidden', 'false'); syncScroll();
  document.getElementById('closeModal').focus();
  toast('✅ Rezervare înregistrată cu succes!');
  form.reset(); dataInput.value = today; refreshTimes();
  summary.textContent = 'Alege data, ora și persoanele → vezi rezumatul aici ✨';
  summary.style.background = ''; summary.style.borderStyle = '';
});
document.getElementById('closeModal').addEventListener('click', closeModal);
modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });

// ===== NEWSLETTER =====
document.getElementById('newsForm').addEventListener('submit', e => {
  e.preventDefault();
  const em = e.target.querySelector('input').value.trim();
  try { const l = JSON.parse(localStorage.getItem('lascara_newsletter') || '[]'); if (!l.includes(em)) l.push(em); localStorage.setItem('lascara_newsletter', JSON.stringify(l)); } catch (_) {}
  e.target.reset(); toast('📩 Mulțumim! Te-ai abonat la noutăți La Scară.');
});

// ===== KEYBOARD =====
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') { closeLb(); closeModal(); setNav(false); }
  if (lb.classList.contains('open')) { if (e.key === 'ArrowLeft') showLb(li - 1); if (e.key === 'ArrowRight') showLb(li + 1); }
});

// ===== EXTRAS: scroll-spy, FAQ accordion, lazy images, year =====
const secLinks = [...navLinks.querySelectorAll('a[href^="#"]:not(.btn)')];
if ('IntersectionObserver' in window) {
  const spy = new IntersectionObserver(es => es.forEach(en => { if (en.isIntersecting) secLinks.forEach(a => a.classList.toggle('current', a.getAttribute('href') === '#' + en.target.id)); }), { rootMargin: '-45% 0px -50% 0px' });
  secLinks.forEach(a => { const s = document.querySelector(a.getAttribute('href')); if (s) spy.observe(s); });
}
document.querySelectorAll('.faq details').forEach(d => d.addEventListener('toggle', () => { if (d.open) document.querySelectorAll('.faq details[open]').forEach(o => { if (o !== d) o.open = false; }); }));
document.querySelectorAll('img:not([loading])').forEach(i => { i.loading = 'lazy'; i.decoding = 'async'; });
document.getElementById('year').textContent = new Date().getFullYear();
