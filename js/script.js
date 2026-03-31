/* ============================================
   HOTEL COZZY INN - Main JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', function() {
  // Initialize all features
  initPageLoader();
  initStickyHeader();
  initMobileMenu();
  initScrollReveal();
  initTestimonialsSlider();
  initLightbox();
  initBackToTop();
  initSmoothScroll();
  initGalleryFilter();
});

/* ============================================
   Page Loader
   ============================================ */
function initPageLoader() {
  const loader = document.querySelector('.page-loader');
  if (!loader) return;
  
  window.addEventListener('load', function() {
    setTimeout(function() {
      loader.classList.add('hidden');
    }, 500);
  });
}

/* ============================================
   Sticky Header
   ============================================ */
function initStickyHeader() {
  const header = document.querySelector('.header');
  if (!header) return;
  
  let lastScrollY = window.scrollY;
  
  function handleScroll() {
    const currentScrollY = window.scrollY;
    
    if (currentScrollY > 100) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    
    lastScrollY = currentScrollY;
  }
  
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // Check on load
}

/* ============================================
   Mobile Menu
   ============================================ */
function initMobileMenu() {
  const menuToggle = document.querySelector('.menu-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-menu a');
  
  if (!menuToggle || !navMenu) return;
  
  menuToggle.addEventListener('click', function() {
    this.classList.toggle('active');
    navMenu.classList.toggle('active');
    document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
  });
  
  // Close menu when clicking a link
  navLinks.forEach(function(link) {
    link.addEventListener('click', function() {
      menuToggle.classList.remove('active');
      navMenu.classList.remove('active');
      document.body.style.overflow = '';
    });
  });
  
  // Close menu when clicking outside
  document.addEventListener('click', function(e) {
    if (!navMenu.contains(e.target) && !menuToggle.contains(e.target)) {
      menuToggle.classList.remove('active');
      navMenu.classList.remove('active');
      document.body.style.overflow = '';
    }
  });
}

/* ============================================
   Scroll Reveal Animations
   ============================================ */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  
  if (revealElements.length === 0) return;
  
  const revealOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const revealObserver = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
      }
    });
  }, revealOptions);
  
  revealElements.forEach(function(el) {
    revealObserver.observe(el);
  });
}

/* ============================================
   Testimonials Slider
   ============================================ */
function initTestimonialsSlider() {
  const slider = document.querySelector('.testimonials-slider');
  if (!slider) return;
  
  const slides = slider.querySelectorAll('.testimonial-slide');
  const dots = slider.querySelectorAll('.slider-dot');
  const prevBtn = slider.querySelector('.slider-prev');
  const nextBtn = slider.querySelector('.slider-next');
  
  if (slides.length === 0) return;
  
  let currentSlide = 0;
  let autoSlideInterval;
  
  function showSlide(index) {
    // Handle wrap around
    if (index >= slides.length) index = 0;
    if (index < 0) index = slides.length - 1;
    
    slides.forEach(function(slide) {
      slide.classList.remove('active');
    });
    
    dots.forEach(function(dot) {
      dot.classList.remove('active');
    });
    
    slides[index].classList.add('active');
    if (dots[index]) dots[index].classList.add('active');
    
    currentSlide = index;
  }
  
  function nextSlide() {
    showSlide(currentSlide + 1);
  }
  
  function prevSlide() {
    showSlide(currentSlide - 1);
  }
  
  function startAutoSlide() {
    autoSlideInterval = setInterval(nextSlide, 5000);
  }
  
  function stopAutoSlide() {
    clearInterval(autoSlideInterval);
  }
  
  // Event listeners
  if (prevBtn) {
    prevBtn.addEventListener('click', function() {
      stopAutoSlide();
      prevSlide();
      startAutoSlide();
    });
  }
  
  if (nextBtn) {
    nextBtn.addEventListener('click', function() {
      stopAutoSlide();
      nextSlide();
      startAutoSlide();
    });
  }
  
  dots.forEach(function(dot, index) {
    dot.addEventListener('click', function() {
      stopAutoSlide();
      showSlide(index);
      startAutoSlide();
    });
  });
  
  // Touch/swipe support
  let touchStartX = 0;
  let touchEndX = 0;
  
  slider.addEventListener('touchstart', function(e) {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });
  
  slider.addEventListener('touchend', function(e) {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  }, { passive: true });
  
  function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;
    
    if (Math.abs(diff) > swipeThreshold) {
      stopAutoSlide();
      if (diff > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
      startAutoSlide();
    }
  }
  
  // Initialize
  showSlide(0);
  startAutoSlide();
}

/* ============================================
   Lightbox
   ============================================ */
function initLightbox() {
  const galleryItems = document.querySelectorAll('.gallery-item[data-lightbox]');
  
  if (galleryItems.length === 0) return;
  
  // Create lightbox HTML
  const lightboxHTML = `
    <div class="lightbox" id="lightbox">
      <div class="lightbox-content">
        <button class="lightbox-close" aria-label="Close">
          <svg viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
        </button>
        <button class="lightbox-nav lightbox-prev" aria-label="Previous">
          <svg viewBox="0 0 24 24"><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/></svg>
        </button>
        <button class="lightbox-nav lightbox-next" aria-label="Next">
          <svg viewBox="0 0 24 24"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/></svg>
        </button>
        <img src="" alt="">
        <div class="lightbox-caption"></div>
      </div>
    </div>
  `;
  
  document.body.insertAdjacentHTML('beforeend', lightboxHTML);
  
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = lightbox.querySelector('img');
  const lightboxCaption = lightbox.querySelector('.lightbox-caption');
  const closeBtn = lightbox.querySelector('.lightbox-close');
  const prevBtn = lightbox.querySelector('.lightbox-prev');
  const nextBtn = lightbox.querySelector('.lightbox-next');
  
  let currentIndex = 0;
  const images = Array.from(galleryItems).map(function(item) {
    return {
      src: item.querySelector('img').src,
      caption: item.dataset.caption || ''
    };
  });
  
  function openLightbox(index) {
    currentIndex = index;
    updateLightboxImage();
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
  
  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }
  
  function updateLightboxImage() {
    lightboxImg.src = images[currentIndex].src;
    lightboxCaption.textContent = images[currentIndex].caption;
  }
  
  function nextImage() {
    currentIndex = (currentIndex + 1) % images.length;
    updateLightboxImage();
  }
  
  function prevImage() {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    updateLightboxImage();
  }
  
  // Event listeners
  galleryItems.forEach(function(item, index) {
    item.addEventListener('click', function() {
      openLightbox(index);
    });
  });
  
  closeBtn.addEventListener('click', closeLightbox);
  nextBtn.addEventListener('click', nextImage);
  prevBtn.addEventListener('click', prevImage);
  
  lightbox.addEventListener('click', function(e) {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });
  
  // Keyboard navigation
  document.addEventListener('keydown', function(e) {
    if (!lightbox.classList.contains('active')) return;
    
    switch(e.key) {
      case 'Escape':
        closeLightbox();
        break;
      case 'ArrowLeft':
        prevImage();
        break;
      case 'ArrowRight':
        nextImage();
        break;
    }
  });
}

/* ============================================
   Back to Top Button
   ============================================ */
function initBackToTop() {
  const backToTop = document.querySelector('.back-to-top');
  if (!backToTop) return;
  
  function toggleBackToTop() {
    if (window.scrollY > 500) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }
  }
  
  window.addEventListener('scroll', toggleBackToTop, { passive: true });
  
  backToTop.addEventListener('click', function() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
  
  toggleBackToTop(); // Check on load
}

/* ============================================
   Smooth Scroll for Anchor Links
   ============================================ */
function initSmoothScroll() {
  const anchorLinks = document.querySelectorAll('a[href^="#"]');
  
  anchorLinks.forEach(function(link) {
    link.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      
      if (href === '#') return;
      
      const target = document.querySelector(href);
      if (!target) return;
      
      e.preventDefault();
      
      const headerHeight = document.querySelector('.header').offsetHeight;
      const targetPosition = target.getBoundingClientRect().top + window.scrollY - headerHeight;
      
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    });
  });
}

/* ============================================
   Gallery Filter
   ============================================ */
function initGalleryFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-page-grid .gallery-item');
  
  if (filterBtns.length === 0 || galleryItems.length === 0) return;
  
  filterBtns.forEach(function(btn) {
    btn.addEventListener('click', function() {
      // Update active button
      filterBtns.forEach(function(b) {
        b.classList.remove('active');
      });
      this.classList.add('active');
      
      const filter = this.dataset.filter;
      
      galleryItems.forEach(function(item) {
        if (filter === 'all' || item.dataset.category === filter) {
          item.style.display = 'block';
          setTimeout(function() {
            item.style.opacity = '1';
            item.style.transform = 'scale(1)';
          }, 10);
        } else {
          item.style.opacity = '0';
          item.style.transform = 'scale(0.8)';
          setTimeout(function() {
            item.style.display = 'none';
          }, 300);
        }
      });
    });
  });
}

/* ============================================
   Form Validation (Basic)
   ============================================ */
function initFormValidation() {
  const form = document.querySelector('.contact-form form');
  if (!form) return;
  
  form.addEventListener('submit', function(e) {
    let isValid = true;
    const requiredFields = form.querySelectorAll('[required]');
    
    requiredFields.forEach(function(field) {
      if (!field.value.trim()) {
        isValid = false;
        field.classList.add('error');
      } else {
        field.classList.remove('error');
      }
    });
    
    // Email validation
    const emailField = form.querySelector('input[type="email"]');
    if (emailField && emailField.value) {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(emailField.value)) {
        isValid = false;
        emailField.classList.add('error');
      }
    }
    
    if (!isValid) {
      e.preventDefault();
    }
  });
}

/* ============================================
   Parallax Effect (Optional Enhancement)
   ============================================ */
function initParallax() {
  const parallaxElements = document.querySelectorAll('.hero-bg');
  
  if (parallaxElements.length === 0) return;
  
  function updateParallax() {
    const scrollY = window.scrollY;
    
    parallaxElements.forEach(function(el) {
      const speed = 0.5;
      el.style.transform = 'translateY(' + (scrollY * speed) + 'px)';
    });
  }
  
  window.addEventListener('scroll', updateParallax, { passive: true });
}

/* ============================================
   Image Lazy Loading
   ============================================ */
function initLazyLoading() {
  const lazyImages = document.querySelectorAll('img[data-src]');
  
  if (lazyImages.length === 0) return;
  
  const imageObserver = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
        imageObserver.unobserve(img);
      }
    });
  }, {
    rootMargin: '100px'
  });
  
  lazyImages.forEach(function(img) {
    imageObserver.observe(img);
  });
}
