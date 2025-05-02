
// Dynamically load images from JSON
let imagesData;

// Fetch the images data as soon as possible
fetch('images.json')
  .then(response => response.json())
  .then(data => {
    imagesData = data;
    initializeImages();
  })
  .catch(error => console.error('Error loading images:', error));

// Generate dynamic casino name
function generateCasinoName() {
  const adjectives = ["Royal", "Imperial", "Majestic", "Opulent", "Luxe", "Golden", "Diamond", "Elite"];
  const nouns = ["Fortune", "Paradise", "Oasis", "Empire", "Mirage", "Crown", "Jackpot"];
  
  const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
  
  return `${randomAdjective} ${randomNoun}`;
}

// DOM Elements
let mobileMenuButton;
let mobileMenu;
let casinoCardsContainer;
let modalContainer;
let faqItems;
let backToTopButton;
let loadMoreButton;
let vipForm;
let newsletterForm;
let countdownElements;

// Set up event listeners once DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  // Set dynamic site name
  const siteName = generateCasinoName();
  document.title = `${siteName} | Luxury Casino Resorts Worldwide`;
  
  // Update all elements with site name
  document.querySelectorAll('.site-name').forEach(el => el.textContent = siteName);
  
  // Initialize AOS
  AOS.init({
    duration: 800,
    easing: 'ease-in-out',
    once: true
  });

  // Mobile menu toggle
  mobileMenuButton = document.getElementById('mobile-menu-button');
  mobileMenu = document.getElementById('mobile-menu');
  
  if (mobileMenuButton && mobileMenu) {
    mobileMenuButton.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });
  }
  
  // Smooth scroll for navigation links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
        
        // Close mobile menu if open
        if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
          mobileMenu.classList.add('hidden');
        }
      }
    });
  });
  
  // Initialize Swiper for galleries and carousels
  initializeSwipers();
  
  // Initialize FAQ accordion
  faqItems = document.querySelectorAll('.faq-item');
  if (faqItems.length) {
    faqItems.forEach(item => {
      const header = item.querySelector('.faq-question');
      const content = item.querySelector('.faq-answer');
      const icon = item.querySelector('.faq-icon');
      
      header.addEventListener('click', () => {
        // Close all other items
        faqItems.forEach(otherItem => {
          if (otherItem !== item) {
            otherItem.querySelector('.faq-answer').classList.add('hidden');
            otherItem.querySelector('.faq-icon').classList.replace('fa-minus', 'fa-plus');
          }
        });
        
        // Toggle current item
        content.classList.toggle('hidden');
        if (content.classList.contains('hidden')) {
          icon.classList.replace('fa-minus', 'fa-plus');
        } else {
          icon.classList.replace('fa-plus', 'fa-minus');
        }
      });
    });
  }

  // Initialize countdown timers
  initializeCountdowns();
  
  // Back to top button
  backToTopButton = document.getElementById('back-to-top');
  if (backToTopButton) {
    window.addEventListener('scroll', () => {
      if (window.pageYOffset > 300) {
        backToTopButton.classList.remove('hidden');
      } else {
        backToTopButton.classList.add('hidden');
      }
    });
    
    backToTopButton.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
  
  // Load more button for casinos
  loadMoreButton = document.getElementById('load-more-casinos');
  casinoCardsContainer = document.getElementById('casino-cards');
  if (loadMoreButton && casinoCardsContainer) {
    loadMoreButton.addEventListener('click', loadMoreCasinos);
  }
  
  // Form validations
  vipForm = document.getElementById('vip-form');
  if (vipForm) {
    vipForm.addEventListener('submit', handleVIPFormSubmit);
  }
  
  newsletterForm = document.getElementById('newsletter-form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', handleNewsletterSubmit);
  }
  
  // Modal handling
  modalContainer = document.getElementById('modal-container');
  if (modalContainer) {
    document.querySelectorAll('.close-modal').forEach(button => {
      button.addEventListener('click', closeModal);
    });
    
    window.addEventListener('click', (e) => {
      if (e.target === modalContainer) {
        closeModal();
      }
    });
  }
  
  // Set copyright year
  document.getElementById('current-year').textContent = new Date().getFullYear();
});

// Initialize images after JSON is loaded
function initializeImages() {
  if (!imagesData) return;
  
  // Set hero background
  const heroSection = document.getElementById('hero');
  if (heroSection && imagesData.header.hero) {
    heroSection.style.backgroundImage = `linear-gradient(to bottom, rgba(0,0,0,0.4), rgba(0,0,0,0.7)), url(${imagesData.header.hero})`;
  }
  
  // Set logo
  const logoElements = document.querySelectorAll('.site-logo');
  logoElements.forEach(logo => {
    if (imagesData.header.logo) {
      const img = document.createElement('img');
      img.src = imagesData.header.logo;
      img.alt = "Casino Logo";
      img.className = "h-10";
      logo.appendChild(img);
    }
  });
  
  // Load top casino cards
  loadCasinos();
  
  // Load gallery images
  const galleryContainer = document.querySelector('.swiper-wrapper');
  if (galleryContainer && imagesData.gallery) {
    imagesData.gallery.forEach(image => {
      const slide = document.createElement('div');
      slide.className = 'swiper-slide';
      
      const img = document.createElement('img');
      img.src = image;
      img.className = 'w-full h-64 object-cover rounded-lg';
      img.loading = 'lazy';
      img.alt = 'Casino Gallery Image';
      
      slide.appendChild(img);
      galleryContainer.appendChild(slide);
    });
  }
  
  // Load event images
  const eventCards = document.querySelectorAll('.event-card');
  if (eventCards.length && imagesData.events) {
    eventCards.forEach((card, index) => {
      if (index < imagesData.events.length) {
        const event = imagesData.events[index];
        const img = card.querySelector('.event-image');
        if (img) {
          img.src = event.image;
          img.alt = event.title;
        }
      }
    });
  }
  
  // Load testimonial images
  const testimonials = document.querySelectorAll('.testimonial');
  if (testimonials.length && imagesData.testimonials) {
    testimonials.forEach((testimonial, index) => {
      if (index < imagesData.testimonials.length) {
        const testData = imagesData.testimonials[index];
        const img = testimonial.querySelector('.testimonial-image');
        if (img) {
          img.src = testData.image;
          img.alt = testData.name;
        }
      }
    });
  }
  
  // Load spotlight images
  const spotlightBlocks = document.querySelectorAll('.spotlight-block');
  if (spotlightBlocks.length && imagesData.spotlight) {
    const spotlightKeys = Object.keys(imagesData.spotlight);
    spotlightBlocks.forEach((block, index) => {
      if (index < spotlightKeys.length) {
        const key = spotlightKeys[index];
        const spotData = imagesData.spotlight[key];
        const img = block.querySelector('.spotlight-image');
        if (img) {
          img.src = spotData.image;
          img.alt = spotData.title || 'Spotlight Feature';
        }
      }
    });
  }
  
  // Load VIP form image
  const vipImage = document.querySelector('.vip-image');
  if (vipImage && imagesData.vip && imagesData.vip.image) {
    vipImage.src = imagesData.vip.image;
  }
  
  // Add footer logo
  const footerLogo = document.querySelector('.footer-logo');
  if (footerLogo && imagesData.footer && imagesData.footer.logo) {
    const img = document.createElement('img');
    img.src = imagesData.footer.logo;
    img.alt = "Casino Logo";
    img.className = "h-8 mb-4";
    footerLogo.appendChild(img);
  }
}

// Load top casinos from JSON data
function loadCasinos(start = 0, limit = 3) {
  if (!casinoCardsContainer || !imagesData || !imagesData.casinos) return;
  
  const casinosToShow = imagesData.casinos.slice(start, start + limit);
  
  casinosToShow.forEach(casino => {
    // Create casino card
    const casinoCard = document.createElement('div');
    casinoCard.className = 'casino-card bg-white rounded-lg shadow-xl overflow-hidden transition-transform duration-300 transform hover:scale-105';
    casinoCard.setAttribute('data-aos', 'fade-up');
    
    // Generate HTML for card
    casinoCard.innerHTML = `
      <img src="${casino.image}" alt="${casino.name}" class="w-full h-48 object-cover">
      <div class="p-4">
        <div class="flex justify-between items-center mb-2">
          <h3 class="text-xl font-bold">${casino.name}</h3>
          <div class="text-sm">${casino.country}</div>
        </div>
        <div class="star-rating mb-2">
          ${generateStarRating(casino.rating)}
        </div>
        <p class="text-gray-600 mb-4">${casino.description}</p>
        <button class="learn-more-btn w-full bg-gradient-to-r from-yellow-600 to-yellow-400 text-white py-2 rounded-lg hover:from-yellow-500 hover:to-yellow-300 transition-all" data-casino="${casino.name}">Learn More</button>
      </div>
    `;
    
    casinoCardsContainer.appendChild(casinoCard);
    
    // Add event listener to the button
    const learnMoreBtn = casinoCard.querySelector('.learn-more-btn');
    learnMoreBtn.addEventListener('click', () => {
      openCasinoModal(casino);
    });
  });
  
  // Hide "Load More" if all casinos are shown
  if (start + limit >= imagesData.casinos.length) {
    loadMoreButton.classList.add('hidden');
  }
}

function loadMoreCasinos() {
  // Show loading spinner
  loadMoreButton.innerHTML = '<span class="loader"></span>';
  
  // Simulate loading delay
  setTimeout(() => {
    // Get current number of casino cards
    const currentCount = casinoCardsContainer.querySelectorAll('.casino-card').length;
    
    // Load more casinos
    loadCasinos(currentCount, 3);
    
    // Restore button text
    loadMoreButton.innerHTML = 'Load More';
  }, 1500);
}

function openCasinoModal(casino) {
  const modalContent = document.getElementById('modal-content');
  if (!modalContent || !modalContainer) return;
  
  modalContent.innerHTML = `
    <div class="relative">
      <img src="${casino.image}" alt="${casino.name}" class="w-full h-64 object-cover rounded-t-lg">
      <button class="absolute top-4 right-4 bg-black bg-opacity-50 text-white rounded-full p-2 close-modal">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
    <div class="p-6">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-2xl font-bold">${casino.name}</h3>
        <div class="text-sm bg-gray-100 px-3 py-1 rounded-full">${casino.country}</div>
      </div>
      <div class="star-rating mb-4">
        ${generateStarRating(casino.rating)}
      </div>
      <p class="text-gray-600 mb-6">${casino.details}</p>
      <div class="grid grid-cols-2 gap-4 mb-6">
        <div class="bg-gray-100 p-4 rounded">
          <h4 class="font-bold mb-2">Amenities</h4>
          <ul class="list-disc list-inside">
            <li>Luxury Suites</li>
            <li>Fine Dining</li>
            <li>VIP Gaming</li>
          </ul>
        </div>
        <div class="bg-gray-100 p-4 rounded">
          <h4 class="font-bold mb-2">Entertainment</h4>
          <ul class="list-disc list-inside">
            <li>Live Shows</li>
            <li>Nightclubs</li>
            <li>Special Events</li>
          </ul>
        </div>
      </div>
      <button class="w-full bg-gradient-to-r from-red-800 to-red-600 text-white py-3 rounded-lg hover:from-red-700 hover:to-red-500 transition-all">Book Your Experience</button>
    </div>
  `;
  
  // Show modal
  modalContainer.classList.remove('hidden');
  
  // Add event listener to close button
  modalContent.querySelector('.close-modal').addEventListener('click', closeModal);
}

function closeModal() {
  if (modalContainer) {
    modalContainer.classList.add('hidden');
  }
}

function generateStarRating(rating) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
  
  let starsHTML = '';
  
  // Add full stars
  for (let i = 0; i < fullStars; i++) {
    starsHTML += '<i class="fas fa-star"></i>';
  }
  
  // Add half star if needed
  if (hasHalfStar) {
    starsHTML += '<i class="fas fa-star-half-alt"></i>';
  }
  
  // Add empty stars
  for (let i = 0; i < emptyStars; i++) {
    starsHTML += '<i class="far fa-star"></i>';
  }
  
  return starsHTML;
}

function initializeSwipers() {
  // Gallery Swiper
  if (document.querySelector('.gallery-swiper')) {
    new Swiper('.gallery-swiper', {
      slidesPerView: 1,
      spaceBetween: 20,
      loop: true,
      lazy: true,
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
      breakpoints: {
        640: {
          slidesPerView: 2,
        },
        1024: {
          slidesPerView: 3,
        },
      }
    });
  }
  
  // Events Swiper
  if (document.querySelector('.events-swiper')) {
    new Swiper('.events-swiper', {
      slidesPerView: 1,
      spaceBetween: 20,
      loop: false,
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
      breakpoints: {
        640: {
          slidesPerView: 2,
        },
        1024: {
          slidesPerView: 4,
        },
      }
    });
  }
  
  // Testimonials Swiper
  if (document.querySelector('.testimonials-swiper')) {
    new Swiper('.testimonials-swiper', {
      slidesPerView: 1,
      spaceBetween: 30,
      loop: true,
      autoplay: {
        delay: 5000,
        disableOnInteraction: false,
      },
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
      breakpoints: {
        768: {
          slidesPerView: 2,
        },
        1024: {
          slidesPerView: 3,
        }
      }
    });
  }
}

function initializeCountdowns() {
  const events = document.querySelectorAll('.event-countdown');
  events.forEach(event => {
    const dateStr = event.dataset.date;
    if (!dateStr) return;
    
    const targetDate = new Date(dateStr);
    
    // Update countdown every second
    const interval = setInterval(() => {
      const now = new Date();
      const diff = targetDate - now;
      
      if (diff <= 0) {
        event.innerHTML = "Event has started!";
        clearInterval(interval);
        return;
      }
      
      // Calculate days, hours, minutes, seconds
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      
      event.innerHTML = `${days}d ${hours}h ${minutes}m ${seconds}s`;
    }, 1000);
  });
  
  // Main countdown in hero section
  const mainCountdown = document.getElementById('main-countdown');
  if (mainCountdown) {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 30); // 30 days from now
    
    const interval = setInterval(() => {
      const now = new Date();
      const diff = targetDate - now;
      
      if (diff <= 0) {
        mainCountdown.innerHTML = "Event has started!";
        clearInterval(interval);
        return;
      }
      
      // Calculate days, hours, minutes, seconds
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      
      mainCountdown.innerHTML = `
        <div class="flex flex-col items-center p-2">
          <span class="text-2xl md:text-4xl">${days}</span>
          <span class="text-xs md:text-sm">Days</span>
        </div>
        <div class="flex flex-col items-center p-2">
          <span class="text-2xl md:text-4xl">${hours}</span>
          <span class="text-xs md:text-sm">Hours</span>
        </div>
        <div class="flex flex-col items-center p-2">
          <span class="text-2xl md:text-4xl">${minutes}</span>
          <span class="text-xs md:text-sm">Minutes</span>
        </div>
        <div class="flex flex-col items-center p-2">
          <span class="text-2xl md:text-4xl">${seconds}</span>
          <span class="text-xs md:text-sm">Seconds</span>
        </div>
      `;
    }, 1000);
  }
}

function handleVIPFormSubmit(e) {
  e.preventDefault();
  
  // Get form data
  const name = document.getElementById('vip-name').value;
  const email = document.getElementById('vip-email').value;
  const country = document.getElementById('vip-country').value;
  
  // Simple validation
  if (!name || !email || !country) {
    showToast('Please fill out all fields', 'error');
    return;
  }
  
  if (!isValidEmail(email)) {
    showToast('Please enter a valid email address', 'error');
    return;
  }
  
  // Show loading state
  const submitButton = document.getElementById('vip-submit');
  const originalText = submitButton.innerHTML;
  submitButton.innerHTML = '<span class="loader"></span>';
  submitButton.disabled = true;
  
  // Simulate form submission
  setTimeout(() => {
    // Reset form
    vipForm.reset();
    
    // Show success message
    showToast('Thank you for joining our VIP program!', 'success');
    
    // Restore button
    submitButton.innerHTML = originalText;
    submitButton.disabled = false;
    
    // Show confetti effect
    createConfetti();
  }, 1500);
}

function handleNewsletterSubmit(e) {
  e.preventDefault();
  
  // Get email
  const email = document.getElementById('newsletter-email').value;
  
  // Validate email
  if (!email || !isValidEmail(email)) {
    showToast('Please enter a valid email address', 'error');
    return;
  }
  
  // Show loading state
  const submitButton = document.getElementById('newsletter-submit');
  const originalText = submitButton.innerHTML;
  submitButton.innerHTML = '<span class="loader"></span>';
  submitButton.disabled = true;
  
  // Simulate form submission
  setTimeout(() => {
    // Reset form
    newsletterForm.reset();
    
    // Show success message
    showToast('Thank you for subscribing!', 'success');
    
    // Restore button
    submitButton.innerHTML = originalText;
    submitButton.disabled = false;
  }, 1000);
}

function isValidEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
}

function showToast(message, type = 'info') {
  // Create toast element
  const toast = document.createElement('div');
  toast.className = `fixed bottom-4 right-4 px-6 py-3 rounded-lg shadow-lg z-50 transform translate-y-0 opacity-0 transition-all duration-300`;
  
  // Set background color based on type
  if (type === 'success') {
    toast.classList.add('bg-green-600', 'text-white');
  } else if (type === 'error') {
    toast.classList.add('bg-red-600', 'text-white');
  } else {
    toast.classList.add('bg-blue-600', 'text-white');
  }
  
  // Set message
  toast.textContent = message;
  
  // Append to body
  document.body.appendChild(toast);
  
  // Animate in
  setTimeout(() => {
    toast.classList.replace('opacity-0', 'opacity-100');
    toast.classList.replace('translate-y-0', '-translate-y-4');
  }, 10);
  
  // Animate out and remove
  setTimeout(() => {
    toast.classList.replace('opacity-100', 'opacity-0');
    toast.classList.replace('-translate-y-4', 'translate-y-4');
    
    // Remove element after animation
    setTimeout(() => {
      document.body.removeChild(toast);
    }, 300);
  }, 3000);
}

function createConfetti() {
  const confettiContainer = document.getElementById('confetti-container');
  if (!confettiContainer) return;
  
  // Clear existing confetti
  confettiContainer.innerHTML = '';
  
  // Create confetti pieces
  const colors = ['#D4AF37', '#8B0000', '#FFFFFF', '#121212', '#C0C0C0'];
  const shapes = ['circle', 'square', 'triangle'];
  
  for (let i = 0; i < 100; i++) {
    const confetti = document.createElement('div');
    confetti.className = 'confetti';
    
    // Random color
    const color = colors[Math.floor(Math.random() * colors.length)];
    confetti.style.backgroundColor = color;
    
    // Random shape
    const shape = shapes[Math.floor(Math.random() * shapes.length)];
    if (shape === 'circle') {
      confetti.style.borderRadius = '50%';
    } else if (shape === 'triangle') {
      confetti.style.width = '0';
      confetti.style.height = '0';
      confetti.style.backgroundColor = 'transparent';
      confetti.style.borderLeft = '5px solid transparent';
      confetti.style.borderRight = '5px solid transparent';
      confetti.style.borderBottom = `10px solid ${color}`;
    }
    
    // Random position
    confetti.style.left = `${Math.random() * 100}%`;
    
    // Random size
    const size = Math.floor(Math.random() * 10) + 5;
    confetti.style.width = `${size}px`;
    confetti.style.height = `${size}px`;
    
    // Random animation duration
    const duration = Math.random() * 2 + 2;
    confetti.style.animationDuration = `${duration}s`;
    
    // Add to container
    confettiContainer.appendChild(confetti);
    
    // Start animation after a small delay
    setTimeout(() => {
      confetti.classList.add('confetti-animation');
    }, Math.random() * 500);
    
    // Remove confetti after animation
    setTimeout(() => {
      confettiContainer.removeChild(confetti);
    }, duration * 1000);
  }
}
