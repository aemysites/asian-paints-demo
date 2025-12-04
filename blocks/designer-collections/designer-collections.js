export default function decorate(block) {
  const heading = block.querySelector('h2');
  if (heading) {
    heading.classList.add('designer-collections-title');
  }

  // Get all rows
  const rows = [...block.querySelectorAll(':scope > div')];
  if (rows.length === 0) return;

  // Create carousel structure
  const carouselContainer = document.createElement('div');
  carouselContainer.className = 'designer-collections-carousel';

  const carouselTrack = document.createElement('div');
  carouselTrack.className = 'designer-collections-track';

  // Get the first (and only) row which contains all the cells
  const dataRow = rows[0];
  if (!dataRow) return;

  // Get all cells (columns) from the data row - each is a collection
  const cells = [...dataRow.children];

  cells.forEach((cell, cellIndex) => {
    const card = document.createElement('div');
    card.className = 'designer-collections-card';
    if (cellIndex === 0) card.classList.add('active');

    // Extract logo, video link, title, and description from cell content
    const logo = cell.querySelector('img');
    const videoLink = cell.querySelector('a[href$=".webm"]');
    const title = cell.querySelector('strong');
    const description = cell.querySelector('em');

    // Add logo
    if (logo) {
      const logoDiv = document.createElement('div');
      logoDiv.className = 'designer-collections-logo';
      logoDiv.appendChild(logo.cloneNode(true));
      card.appendChild(logoDiv);
    }

    // Add video/image
    const mediaDiv = document.createElement('div');
    mediaDiv.className = 'designer-collections-image';

    if (videoLink) {
      const video = document.createElement('video');
      video.setAttribute('playsinline', '');
      video.setAttribute('muted', '');
      video.setAttribute('loop', '');
      video.setAttribute('autoplay', '');
      video.src = videoLink.href;
      video.className = 'designer-collections-video';
      mediaDiv.appendChild(video);
    }
    card.appendChild(mediaDiv);

    // Add content
    const content = document.createElement('div');
    content.className = 'designer-collections-content';

    if (title) {
      const titleEl = document.createElement('h3');
      titleEl.textContent = title.textContent;
      content.appendChild(titleEl);
    }

    if (description) {
      const descEl = document.createElement('p');
      descEl.textContent = description.textContent;
      content.appendChild(descEl);
    }

    card.appendChild(content);
    carouselTrack.appendChild(card);
  });

  carouselContainer.appendChild(carouselTrack);

  // Add navigation buttons
  const prevButton = document.createElement('button');
  prevButton.className = 'designer-collections-nav designer-collections-prev';
  prevButton.setAttribute('aria-label', 'Previous');
  prevButton.innerHTML = '←';

  const nextButton = document.createElement('button');
  nextButton.className = 'designer-collections-nav designer-collections-next';
  nextButton.setAttribute('aria-label', 'Next');
  nextButton.innerHTML = '→';

  carouselContainer.appendChild(prevButton);
  carouselContainer.appendChild(nextButton);

  // Clear block content and add carousel
  block.innerHTML = '';
  if (heading) {
    block.appendChild(heading);
  }
  block.appendChild(carouselContainer);

  // Carousel logic
  let currentSlide = 0;
  const cards = carouselTrack.querySelectorAll('.designer-collections-card');
  const totalSlides = cards.length;

  function getCardsPerView() {
    return window.innerWidth < 900 ? 1 : 3;
  }

  function showSlide(index) {
    const cardsPerView = getCardsPerView();
    cards.forEach(card => card.classList.remove('active'));

    const offset = Math.min(index, Math.max(0, totalSlides - cardsPerView));
    const cardWidth = cards[0].offsetWidth;
    const gap = 20;
    carouselTrack.style.transform = `translateX(-${offset * (cardWidth + gap)}px)`;

    for (let i = 0; i < cardsPerView && (offset + i) < totalSlides; i++) {
      cards[offset + i].classList.add('active');
    }
  }

  prevButton.addEventListener('click', () => {
    const cardsPerView = getCardsPerView();
    currentSlide = Math.max(0, currentSlide - 1);
    showSlide(currentSlide);
  });

  nextButton.addEventListener('click', () => {
    const cardsPerView = getCardsPerView();
    currentSlide = Math.min(totalSlides - cardsPerView, currentSlide + 1);
    showSlide(currentSlide);
  });

  // Handle window resize
  window.addEventListener('resize', () => {
    showSlide(currentSlide);
  });

  // Initial show
  showSlide(0);
}
