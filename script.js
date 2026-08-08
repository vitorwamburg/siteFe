// header solid on scroll
const header = document.getElementById('site-header');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 40);
});

// mobile nav toggle
const menuBtn = document.getElementById('menu-btn');
const nav = document.getElementById('primary-nav');
menuBtn.addEventListener('click', () => {
  nav.classList.toggle('open');
  menuBtn.classList.toggle('open');
  document.body.classList.toggle('nav-open');
});
nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  nav.classList.remove('open');
  menuBtn.classList.remove('open');
  document.body.classList.remove('nav-open');
}));

// scroll reveal
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
}, { threshold: 0.15 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));
