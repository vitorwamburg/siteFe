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

// carrossel de depoimentos (página Serviços)
const track = document.getElementById('testimonial-track');
if (track) {
  const cards = Array.from(track.children);
  const dotsWrap = document.getElementById('testimonial-dots');
  const prevBtn = document.querySelector('.carousel-prev');
  const nextBtn = document.querySelector('.carousel-next');

  cards.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.setAttribute('aria-label', `Ir para depoimento ${i + 1}`);
    if (i === 0) dot.classList.add('active');
    dot.addEventListener('click', () => {
      track.scrollTo({ left: cards[i].offsetLeft - track.offsetLeft, behavior: 'smooth' });
    });
    dotsWrap.appendChild(dot);
  });
  const dots = Array.from(dotsWrap.children);

  function cardsPerView() {
    return Math.round(track.clientWidth / cards[0].getBoundingClientRect().width);
  }

  prevBtn.addEventListener('click', () => {
    track.scrollBy({ left: -cards[0].getBoundingClientRect().width * cardsPerView() - 22, behavior: 'smooth' });
  });
  nextBtn.addEventListener('click', () => {
    track.scrollBy({ left: cards[0].getBoundingClientRect().width * cardsPerView() + 22, behavior: 'smooth' });
  });

  let scrollTimeout;
  track.addEventListener('scroll', () => {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      let closest = 0, minDist = Infinity;
      cards.forEach((card, i) => {
        const dist = Math.abs(card.offsetLeft - track.offsetLeft - track.scrollLeft);
        if (dist < minDist) { minDist = dist; closest = i; }
      });
      dots.forEach((d, i) => d.classList.toggle('active', i === closest));
    }, 100);
  });
}

// formulário de contato (página Contato) — monta e abre um e-mail com os dados
const contactForm = document.getElementById('contact-form');
if (contactForm) {
  const note = document.getElementById('form-note');
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = new FormData(contactForm);
    const nome = (data.get('nome') || '').trim();
    const email = (data.get('email') || '').trim();
    const telefone = (data.get('telefone') || '').trim();
    const tipo = data.get('tipo') || '';
    const data_prevista = data.get('data') || '';
    const convidados = data.get('convidados') || '';
    const mensagem = (data.get('mensagem') || '').trim();

    if (!nome || !email || !mensagem) {
      note.textContent = 'Preencha nome, email e mensagem antes de enviar.';
      note.classList.remove('is-sent');
      return;
    }

    const subject = `Solicitação de experiência — ${nome}`;
    const bodyLines = [
      `Nome: ${nome}`,
      `Email: ${email}`,
      telefone ? `Telefone: ${telefone}` : null,
      tipo ? `Tipo de experiência: ${tipo}` : null,
      data_prevista ? `Data prevista: ${data_prevista}` : null,
      convidados ? `Número de convidados: ${convidados}` : null,
      '',
      'Mensagem:',
      mensagem
    ].filter(Boolean).join('\n');

    const mailto = `mailto:contato@chefernanda.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyLines)}`;
    window.location.href = mailto;

    note.textContent = 'Abrindo seu aplicativo de email com a mensagem pronta...';
    note.classList.add('is-sent');
  });
}

// accordion animado das perguntas frequentes (página Contato)
document.querySelectorAll('.faq-item').forEach(item => {
  const btn = item.querySelector('.faq-q');
  const answer = item.querySelector('.faq-answer');
  if (!btn || !answer) return;

  let isOpen = false;

  btn.addEventListener('click', () => {
    if (item.classList.contains('animating')) return;
    item.classList.add('animating');

    if (isOpen) {
      // fechar
      answer.style.height = answer.scrollHeight + 'px';
      requestAnimationFrame(() => {
        answer.style.transition = 'height .35s ease';
        answer.style.height = '0px';
      });
      answer.addEventListener('transitionend', function onEnd() {
        answer.removeEventListener('transitionend', onEnd);
        answer.style.transition = '';
        item.classList.remove('animating');
      }, { once: true });
      isOpen = false;
      btn.setAttribute('aria-expanded', 'false');
    } else {
      // abrir
      answer.style.height = '0px';
      requestAnimationFrame(() => {
        answer.style.transition = 'height .4s ease';
        answer.style.height = answer.scrollHeight + 'px';
      });
      answer.addEventListener('transitionend', function onEnd() {
        answer.removeEventListener('transitionend', onEnd);
        answer.style.transition = '';
        item.classList.remove('animating');
      }, { once: true });
      isOpen = true;
      btn.setAttribute('aria-expanded', 'true');
    }
  });
});

// carrossel automático de fotos (página Contato)
const autoTrack = document.getElementById('auto-carousel-track');
if (autoTrack) {
  const originalCards = Array.from(autoTrack.children);
  originalCards.forEach(card => autoTrack.appendChild(card.cloneNode(true)));
  const total = originalCards.length;
  let autoIndex = 0;

  function advanceAutoCarousel() {
    const gapPx = parseFloat(getComputedStyle(autoTrack).gap) || 16;
    const cardWidth = autoTrack.children[0].getBoundingClientRect().width + gapPx;
    autoIndex++;
    autoTrack.style.transition = 'transform .9s cubic-bezier(.16,.8,.26,1)';
    autoTrack.style.transform = `translateX(-${autoIndex * cardWidth}px)`;
    if (autoIndex === total) {
      autoTrack.addEventListener('transitionend', function resetAutoCarousel() {
        autoTrack.removeEventListener('transitionend', resetAutoCarousel);
        autoTrack.style.transition = 'none';
        autoIndex = 0;
        autoTrack.style.transform = 'translateX(0px)';
      }, { once: true });
    }
  }
  setInterval(advanceAutoCarousel, 5000);
}
