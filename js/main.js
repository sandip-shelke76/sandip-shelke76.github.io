// ============================================================
// DELUXE ENTERPRISES — Static Site JS
// ============================================================

// ======================== NAVBAR ========================
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
});

// ======================== HAMBURGER ========================
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
});
navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  hamburger.classList.remove('open');
  navLinks.classList.remove('open');
}));

// ======================== AOS SCROLL ANIMATIONS ========================
function initAOS() {
  const elements = document.querySelectorAll('[data-aos]');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('aos-animate'); });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
  elements.forEach(el => observer.observe(el));
}
initAOS();

// Add AOS to all section children
document.querySelectorAll('.product-card, .why-item, .process-step, .testimonial-card, .gallery-item, .contact-card, .about-card').forEach((el, i) => {
  el.setAttribute('data-aos', '');
  el.setAttribute('data-aos-delay', (i % 4) * 100);
});
initAOS();

// ======================== FORMSPREE FORM ========================
const form = document.getElementById('enquiryForm');
if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = form.querySelector('.btn-submit');
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    btn.disabled = true;

    // Check if FormSpree ID is configured
    const action = form.getAttribute('action');
    if (action.includes('YOUR_FORM_ID')) {
      // Show WhatsApp fallback
      const name = form.querySelector('[name="name"]').value;
      const phone = form.querySelector('[name="phone"]').value;
      const doorType = form.querySelector('[name="door_type"]').value;
      const message = form.querySelector('[name="message"]').value;
      const waText = `Hello Deluxe Enterprises!%0AName: ${name}%0APhone: ${phone}%0ADoor Type: ${doorType}%0AMessage: ${message}`;
      window.open(`https://wa.me/918329764135?text=${waText}`, '_blank');
      btn.innerHTML = '<i class="fas fa-check"></i> Sent via WhatsApp!';
      btn.style.background = '#25d366';
      setTimeout(() => {
        btn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Enquiry';
        btn.style.background = '';
        btn.disabled = false;
        form.reset();
      }, 3000);
      return;
    }

    try {
      const res = await fetch(action, {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' },
      });
      if (res.ok) {
        btn.innerHTML = '<i class="fas fa-check"></i> Enquiry Sent!';
        btn.style.background = '#4CAF50';
        form.reset();
        showToast('✅ Enquiry sent! We will contact you within 2 hours.', 'success');
        setTimeout(() => {
          btn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Enquiry';
          btn.style.background = '';
          btn.disabled = false;
        }, 4000);
      } else {
        throw new Error('Failed');
      }
    } catch (err) {
      btn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Enquiry';
      btn.disabled = false;
      showToast('❌ Something went wrong. Please WhatsApp us directly.', 'error');
    }
  });
}

// ======================== TOAST ========================
function showToast(message, type = 'success') {
  const ex = document.getElementById('toast');
  if (ex) ex.remove();
  const t = document.createElement('div');
  t.id = 'toast';
  t.style.cssText = `
    position:fixed;bottom:24px;left:50%;transform:translateX(-50%) translateY(80px);
    padding:14px 24px;border-radius:10px;font-size:0.88rem;font-weight:600;
    z-index:9999;color:#fff;box-shadow:0 8px 25px rgba(0,0,0,0.4);
    font-family:'Outfit',sans-serif;transition:all 0.4s cubic-bezier(0.175,0.885,0.32,1.275);
    background:${type === 'success' ? '#1a8a50' : '#dc3545'};
    max-width:360px;text-align:center;
  `;
  t.textContent = message;
  document.body.appendChild(t);
  setTimeout(() => t.style.transform = 'translateX(-50%) translateY(0)', 10);
  setTimeout(() => { t.style.transform = 'translateX(-50%) translateY(80px)'; setTimeout(() => t.remove(), 400); }, 4000);
}

// ======================== SMOOTH SCROLL ========================
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ======================== GALLERY LIGHTBOX ========================
document.querySelectorAll('.gallery-img').forEach(img => {
  img.style.cursor = 'pointer';
  img.addEventListener('click', () => {
    const overlay = document.createElement('div');
    overlay.style.cssText = `
      position:fixed;inset:0;background:rgba(0,0,0,0.95);z-index:9999;
      display:flex;align-items:center;justify-content:center;cursor:pointer;
    `;
    const label = img.querySelector('.gallery-overlay span')?.textContent || 'Gallery';
    overlay.innerHTML = `
      <div style="text-align:center;">
        <div style="font-size:6rem;margin-bottom:20px;">🚪</div>
        <p style="color:#c9a84c;font-family:'Playfair Display',serif;font-size:1.5rem;font-weight:700;">${label}</p>
        <p style="color:rgba(255,255,255,0.5);margin-top:8px;font-size:0.85rem;">Contact us to see real photos</p>
        <a href="https://wa.me/918329764135?text=Can%20you%20share%20photos%20of%20your%20${label.replace(/ /g,'%20')}?" 
           target="_blank"
           style="display:inline-flex;align-items:center;gap:8px;margin-top:20px;padding:12px 24px;background:#25d366;color:#fff;border-radius:50px;font-weight:700;text-decoration:none;">
          <i class="fab fa-whatsapp"></i> Request Photos on WhatsApp
        </a>
        <p style="color:rgba(255,255,255,0.3);margin-top:16px;font-size:0.75rem;">Click anywhere to close</p>
      </div>
    `;
    overlay.addEventListener('click', () => overlay.remove());
    document.body.appendChild(overlay);
  });
});

// ======================== COUNTER ANIMATION ========================
function animateCounter(el, target) {
  let count = 0;
  const step = Math.ceil(target / 60);
  const timer = setInterval(() => {
    count += step;
    if (count >= target) { count = target; clearInterval(timer); }
    el.textContent = count + (el.dataset.suffix || '');
  }, 30);
}

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const h3 = e.target.querySelector('h3');
      if (h3 && !h3.dataset.animated) {
        h3.dataset.animated = true;
        const text = h3.textContent;
        const num = parseInt(text);
        if (!isNaN(num)) {
          const suffix = text.replace(num.toString(), '');
          h3.dataset.suffix = suffix;
          animateCounter(h3, num);
        }
      }
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.hero-stat, .about-card').forEach(el => statsObserver.observe(el));

console.log('🚪 Deluxe Enterprises website loaded!');
