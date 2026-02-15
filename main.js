// Minha Empresa - JavaScript Principal
// Gerado por WebAI Studio Pro
'use strict';

document.addEventListener('DOMContentLoaded', function() {
  // Header scroll effect
  var header = document.querySelector('.header');
  var lastScroll = 0;
  window.addEventListener('scroll', function() {
    var currentScroll = window.scrollY;
    if (currentScroll > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    lastScroll = currentScroll;
  });

  // Smooth scroll
  document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      var target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // Contact form
  var contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      alert('Mensagem enviada com sucesso! Entraremos em contato em breve.');
      contactForm.reset();
    });
  }

  // Premium Intersection Observer animations
  var observerOptions = { threshold: 0.1, rootMargin: '0px 0px -60px 0px' };
  var animationIndex = 0;

  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        var delay = (animationIndex % 6) * 100;
        animationIndex++;
        setTimeout(function() {
          entry.target.classList.add('animate-fade-up');
          entry.target.style.animationDelay = (delay / 1000) + 's';
        }, delay);
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.service-card, .section-title, .section-subtitle, .about-content, .portfolio-item, .contact-form').forEach(function(el) {
    el.style.opacity = '0';
    observer.observe(el);
  });

  // Parallax effect on hero
  var hero = document.querySelector('.hero');
  if (hero) {
    window.addEventListener('scroll', function() {
      var scrolled = window.scrollY;
      if (scrolled < window.innerHeight) {
        hero.style.backgroundPositionY = (scrolled * 0.4) + 'px';
      }
    });
  }

  // Mobile menu
  var menuToggle = document.getElementById('menuToggle');
  var navMenu = document.getElementById('navMenu');
  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', function() {
      navMenu.classList.toggle('active');
    });
  }

  // Cursor trail effect (subtle)
  document.addEventListener('mousemove', function(e) {
    var cards = document.querySelectorAll('.service-card');
    cards.forEach(function(card) {
      var rect = card.getBoundingClientRect();
      var x = e.clientX - rect.left;
      var y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', x + 'px');
      card.style.setProperty('--mouse-y', y + 'px');
    });
  });
});
