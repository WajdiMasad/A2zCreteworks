// ========================================
// A2Z Creteworks - Elite UX Interactions
// ========================================

document.addEventListener('DOMContentLoaded', function () {

  // --- Magnetic Buttons ---
  const magneticBtns = document.querySelectorAll('.nav-cta, .btn-main'); // Expand to key buttons
  magneticBtns.forEach(btn => {
    btn.addEventListener('mousemove', function(e) {
      const rect = this.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      this.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
    });
    btn.addEventListener('mouseleave', function() {
      this.style.transform = `translate(0px, 0px)`;
    });
  });

  // --- Scroll Progress Bar ---
  const progressBar = document.getElementById('scroll-progress');
  
  window.addEventListener('scroll', function () {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    
    if (progressBar) {
      progressBar.style.width = scrolled + '%';
    }
  });

  // --- Glassmorphism Header Scroll Effect ---
  const header = document.getElementById('site-header');

  window.addEventListener('scroll', function () {
    if (window.pageYOffset > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // --- Mobile Navigation ---
  const navToggle = document.getElementById('nav-toggle');
  const navLinks = document.getElementById('nav-links');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', function () {
      navLinks.classList.toggle('open');
    });

    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navLinks.classList.remove('open');
      });
    });
  }

  // --- Magnetic & Silky Scroll Reveals ---
  const revealElements = document.querySelectorAll('.reveal-up');

  const revealObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.15, // Wait until 15% of element is visible
      rootMargin: '0px 0px -50px 0px' // Trigger slightly before it hits the bottom
    }
  );

  revealElements.forEach(function (el) {
    revealObserver.observe(el);
  });

  // --- Animated Number Counters (Cubic Easing) ---
  const statNumbers = document.querySelectorAll('.stat-number');
  let countersStarted = false;

  function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-target'), 10);
    const duration = 2500; // Slower, more deliberate luxury feel
    let start = 0;
    let startTime = null;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      
      // easeOutExpo for dramatic slowdown at the end
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const current = Math.floor(eased * target);
      
      el.textContent = current;
      
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = target;
      }
    }

    requestAnimationFrame(step);
  }

  const statsSection = document.querySelector('.stats-section');
  if (statsSection) {
    const statsObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting && !countersStarted) {
            countersStarted = true;
            statNumbers.forEach(function (num) {
              if (parseInt(num.getAttribute('data-target'), 10) > 0) {
                 animateCounter(num);
              }
            });
            statsObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );
    statsObserver.observe(statsSection);
  }

  // --- Smooth Anchor Scrolling ---
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const target = document.querySelector(targetId);
      if (target) {
        // Calculate offset (adjust for sticky header)
        const headerOffset = 70;
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // --- Contact Form — Web3Forms AJAX ---
  const contactForm = document.getElementById('contact-form');
  const formSuccess = document.getElementById('form-success');

  if (contactForm) {
    contactForm.addEventListener('submit', async function (e) {
      e.preventDefault();

      const btn = contactForm.querySelector('button[type="submit"]');
      const originalText = btn.textContent;

      btn.textContent = 'Sending...';
      btn.disabled = true;

      const formData = new FormData(contactForm);
      const data = Object.fromEntries(formData);

      try {
        const res = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify(data)
        });

        const json = await res.json();

        if (json.success) {
          contactForm.style.display = 'none';
          if (formSuccess) formSuccess.style.display = 'block';
        } else {
          btn.textContent = 'Something went wrong — try again';
          btn.style.background = '#c0392b';
          btn.style.color = '#fff';
          btn.disabled = false;
          setTimeout(function () {
            btn.textContent = originalText;
            btn.style.background = '';
            btn.style.color = '';
          }, 4000);
        }
      } catch (err) {
        btn.textContent = 'Network error — try again';
        btn.style.background = '#c0392b';
        btn.style.color = '#fff';
        btn.disabled = false;
        setTimeout(function () {
          btn.textContent = originalText;
          btn.style.background = '';
          btn.style.color = '';
        }, 4000);
      }
    });
  }

});
