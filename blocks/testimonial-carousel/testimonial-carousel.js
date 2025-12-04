export default function decorate(block) {
  // Get all child divs (sections) from the block
  const sections = [...block.querySelectorAll(':scope > div')];

  if (sections.length === 0) return;

  // First section might contain the heading
  const firstSection = sections[0];
  const headingText = firstSection.textContent.trim() || 'What our clients say about us!';

  // Create the main container structure
  const container = document.createElement('div');
  container.className = 'testimonial-carousel-container';

  // Add heading section
  const headingWrapper = document.createElement('div');
  headingWrapper.className = 'testimonial-heading';
  const h2 = document.createElement('h2');
  // Split heading for multi-line display
  const words = headingText.split(' ');
  const midPoint = Math.ceil(words.length / 2);
  h2.innerHTML = `${words.slice(0, midPoint).join(' ')}<br>${words.slice(midPoint).join(' ')}`;
  headingWrapper.appendChild(h2);
  container.appendChild(headingWrapper);

  // Create carousel wrapper
  const carouselWrapper = document.createElement('div');
  carouselWrapper.className = 'testimonial-carousel-wrapper';

  // Create slides container
  const slidesContainer = document.createElement('div');
  slidesContainer.className = 'testimonial-slides';

  // Process testimonial sections (skip first if it's just the heading)
  const testimonialSections = sections.slice(1);

  testimonialSections.forEach((section, index) => {
    const slide = document.createElement('div');
    slide.className = 'testimonial-slide';
    slide.dataset.index = index;

    // Extract content from section - markdown table generates 4 divs per row
    // Column 0: link with picture, Column 1: quote, Column 2: name, Column 3: location
    const columns = [...section.querySelectorAll(':scope > div')];

    // Get image and video URL from first column
    let imageUrl = '';
    let videoUrl = '';
    let altText = '';
    let pictureElement = null;

    if (columns[0]) {
      const link = columns[0].querySelector('a');
      if (link) {
        videoUrl = link.href;
        const img = link.querySelector('img');
        pictureElement = link.querySelector('picture');
        if (img) {
          imageUrl = img.src;
          altText = img.alt || '';
        }
      }
    }

    // Get quote (column 1), name (column 2), location (column 3)
    const quote = columns[1] ? columns[1].textContent.trim() : '';
    const name = columns[2] ? columns[2].textContent.trim() : '';
    const location = columns[3] ? columns[3].textContent.trim() : '';

    // Build image wrapper
    const imageWrapper = document.createElement('div');
    imageWrapper.className = 'testimonial-image';

    if (pictureElement) {
      // Clone and append the picture element from the markdown
      const clonedPicture = pictureElement.cloneNode(true);
      imageWrapper.appendChild(clonedPicture);

      if (videoUrl) {
        // Create play button overlay
        const playButton = document.createElement('button');
        playButton.className = 'testimonial-play-button';
        playButton.setAttribute('aria-label', 'Play video testimonial');
        playButton.dataset.videoUrl = videoUrl;

        const playIcon = document.createElement('span');
        playIcon.className = 'play-icon';
        playIcon.innerHTML = `
          <svg width="62" height="62" viewBox="0 0 62 62" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="31" cy="31" r="31" fill="white" fill-opacity="0.9"/>
            <path d="M24 20L42 31L24 42V20Z" fill="#D32F2F"/>
          </svg>
        `;
        playButton.appendChild(playIcon);
        imageWrapper.appendChild(playButton);
      }
    } else if (imageUrl) {
      // Fallback to creating img if no picture element found
      const img = document.createElement('img');
      img.src = imageUrl;
      img.alt = altText;
      img.loading = 'lazy';
      imageWrapper.appendChild(img);

      if (videoUrl) {
        const playButton = document.createElement('button');
        playButton.className = 'testimonial-play-button';
        playButton.setAttribute('aria-label', 'Play video testimonial');
        playButton.dataset.videoUrl = videoUrl;

        const playIcon = document.createElement('span');
        playIcon.className = 'play-icon';
        playIcon.innerHTML = `
          <svg width="62" height="62" viewBox="0 0 62 62" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="31" cy="31" r="31" fill="white" fill-opacity="0.9"/>
            <path d="M24 20L42 31L24 42V20Z" fill="#D32F2F"/>
          </svg>
        `;
        playButton.appendChild(playIcon);
        imageWrapper.appendChild(playButton);
      }
    }

    // Build testimonial content
    const contentWrapper = document.createElement('div');
    contentWrapper.className = 'testimonial-content';

    // Add logo background
    const logoSvg = document.createElement('div');
    logoSvg.className = 'testimonial-logo-bg';
    logoSvg.innerHTML = `
      <svg width="81" height="70" viewBox="0 0 81 70" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 10L30 5L40 10L30 15L20 10Z" fill="#E0E0E0"/>
        <path d="M50 20L60 15L70 20L60 25L50 20Z" fill="#E0E0E0"/>
        <rect x="10" y="25" width="30" height="30" rx="5" fill="#E0E0E0"/>
        <rect x="45" y="35" width="30" height="25" rx="5" fill="#E0E0E0"/>
      </svg>
    `;
    contentWrapper.appendChild(logoSvg);

    // Add quote
    if (quote) {
      const quoteDiv = document.createElement('div');
      quoteDiv.className = 'testimonial-quote';
      quoteDiv.textContent = quote;
      contentWrapper.appendChild(quoteDiv);
    }

    // Add attribution
    if (name || location) {
      const attribution = document.createElement('div');
      attribution.className = 'testimonial-attribution';

      const text = [];
      if (name) text.push(`<span class="testimonial-name">${name}${location ? ',' : ''}</span>`);
      if (location) text.push(`<span class="testimonial-location"> ${location}</span>`);

      attribution.innerHTML = text.join('');
      contentWrapper.appendChild(attribution);
    }

    slide.appendChild(imageWrapper);
    slide.appendChild(contentWrapper);
    slidesContainer.appendChild(slide);
  });

  // Wrap slides in overflow container
  const slidesWrapper = document.createElement('div');
  slidesWrapper.className = 'testimonial-carousel-slides-wrapper';
  slidesWrapper.appendChild(slidesContainer);
  carouselWrapper.appendChild(slidesWrapper);

  // Create navigation buttons (positioned below slides)
  const navButtons = document.createElement('div');
  navButtons.className = 'testimonial-nav-buttons';
  navButtons.innerHTML = `
    <button class="testimonial-prev" aria-label="Previous testimonial">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M15 18L9 12L15 6" stroke="#333" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </button>
    <button class="testimonial-next" aria-label="Next testimonial">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M9 18L15 12L9 6" stroke="#333" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </button>
  `;
  carouselWrapper.appendChild(navButtons);

  container.appendChild(carouselWrapper);

  // Create video modal
  const modal = document.createElement('div');
  modal.className = 'testimonial-video-modal';
  modal.innerHTML = `
    <div class="testimonial-video-modal-content">
      <button class="testimonial-video-close" aria-label="Close video">
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M24 8L8 24M8 8L24 24" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
      <div class="testimonial-video-wrapper">
        <iframe
          src=""
          allow="autoplay; fullscreen"
          allowfullscreen
          loading="lazy"
          title="Testimonial Video">
        </iframe>
      </div>
    </div>
  `;
  container.appendChild(modal);

  // Clear the block and add new content
  block.textContent = '';
  block.appendChild(container);

  // Initialize carousel functionality
  initializeCarousel(block);
}

function initializeCarousel(block) {
  const slidesContainer = block.querySelector('.testimonial-slides');
  const slides = block.querySelectorAll('.testimonial-slide');
  const prevButton = block.querySelector('.testimonial-prev');
  const nextButton = block.querySelector('.testimonial-next');
  const playButtons = block.querySelectorAll('.testimonial-play-button');
  const modal = block.querySelector('.testimonial-video-modal');
  const closeButton = block.querySelector('.testimonial-video-close');
  const iframe = modal.querySelector('iframe');

  if (slides.length === 0) return;

  let currentIndex = 0;
  let slidesPerView = getSlidesPerView();

  function getSlidesPerView() {
    if (window.innerWidth >= 1200) return 4;
    if (window.innerWidth >= 900) return 3;
    if (window.innerWidth >= 600) return 2;
    return 1;
  }

  function updateCarousel() {
    const slideWidth = slides[0].offsetWidth;
    const gap = 20; // Match CSS gap
    const offset = currentIndex * (slideWidth + gap);
    slidesContainer.style.transform = `translateX(-${offset}px)`;

    // Update button states
    prevButton.disabled = currentIndex === 0;
    nextButton.disabled = currentIndex >= slides.length - slidesPerView;
  }

  function nextSlide() {
    if (currentIndex < slides.length - slidesPerView) {
      currentIndex++;
      updateCarousel();
    }
  }

  function prevSlide() {
    if (currentIndex > 0) {
      currentIndex--;
      updateCarousel();
    }
  }

  // Navigation button events
  if (prevButton && nextButton) {
    nextButton.addEventListener('click', nextSlide);
    prevButton.addEventListener('click', prevSlide);
  }

  // Video modal events
  playButtons.forEach(button => {
    button.addEventListener('click', () => {
      const videoUrl = button.dataset.videoUrl;
      if (videoUrl) {
        // Convert regular YouTube URL to embed URL if needed
        let embedUrl = videoUrl;
        if (videoUrl.includes('youtube.com/watch')) {
          const urlObj = new URL(videoUrl);
          const videoId = urlObj.searchParams.get('v');
          embedUrl = `https://www.youtube.com/embed/${videoId}`;
        } else if (videoUrl.includes('youtu.be/')) {
          const videoId = videoUrl.split('youtu.be/')[1].split('?')[0];
          embedUrl = `https://www.youtube.com/embed/${videoId}`;
        } else if (videoUrl.includes('youtube.com/embed/')) {
          embedUrl = videoUrl;
        }

        iframe.src = embedUrl + '?autoplay=1';
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  if (closeButton) {
    closeButton.addEventListener('click', () => {
      modal.classList.remove('active');
      iframe.src = '';
      document.body.style.overflow = '';
    });
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeButton.click();
    }
  });

  // Keyboard navigation
  const handleKeyDown = (e) => {
    if (modal.classList.contains('active') && e.key === 'Escape') {
      closeButton.click();
    }
  };
  document.addEventListener('keydown', handleKeyDown);

  // Handle window resize
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      const newSlidesPerView = getSlidesPerView();
      if (newSlidesPerView !== slidesPerView) {
        slidesPerView = newSlidesPerView;
        currentIndex = Math.min(currentIndex, Math.max(0, slides.length - slidesPerView));
        updateCarousel();
      }
    }, 250);
  });

  // Initial update
  updateCarousel();
}
