export default function decorate(block) {
  const row = block.querySelector(':scope > div');
  if (!row) return;

  const columns = [...row.children];
  if (columns.length < 2) return;

  // First column is heading
  const headingCol = columns[0];
  headingCol.classList.add('tools-carousel-heading');

  // Second column contains carousel items
  const carouselCol = columns[1];
  if (carouselCol) {
    carouselCol.classList.add('tools-carousel-items');

    // Get all images and headings
    const images = [...carouselCol.querySelectorAll('img')];
    const headings = [...carouselCol.querySelectorAll('h3')];

    if (images.length > 0) {
      // Create carousel structure
      const carouselContainer = document.createElement('div');
      carouselContainer.className = 'tools-carousel-container';

      const carouselTrack = document.createElement('div');
      carouselTrack.className = 'tools-carousel-track';

      // Create slides from images and headings
      images.forEach((img, index) => {
        const slide = document.createElement('div');
        slide.className = 'tools-carousel-slide';
        if (index === 0) slide.classList.add('active');

        const heading = headings[index];

        if (heading) {
          const title = document.createElement('div');
          title.className = 'tools-carousel-title';
          title.textContent = heading.textContent;

          slide.appendChild(img.cloneNode(true));
          slide.appendChild(title);
          carouselTrack.appendChild(slide);
        }
      });

      carouselContainer.appendChild(carouselTrack);

      // Add navigation buttons
      const prevButton = document.createElement('button');
      prevButton.className = 'tools-carousel-nav tools-carousel-prev';
      prevButton.setAttribute('aria-label', 'Previous');
      prevButton.innerHTML = '‹';

      const nextButton = document.createElement('button');
      nextButton.className = 'tools-carousel-nav tools-carousel-next';
      nextButton.setAttribute('aria-label', 'Next');
      nextButton.innerHTML = '›';

      carouselContainer.appendChild(prevButton);
      carouselContainer.appendChild(nextButton);

      // Clear carousel column and add container
      carouselCol.innerHTML = '';
      carouselCol.appendChild(carouselContainer);

      // Carousel logic
      let currentSlide = 0;
      const slides = carouselTrack.querySelectorAll('.tools-carousel-slide');
      const totalSlides = slides.length;
      const slidesPerView = 3;

      function showSlide(index) {
        slides.forEach(slide => slide.classList.remove('active'));
        const offset = Math.min(index, totalSlides - slidesPerView);
        carouselTrack.style.transform = `translateX(-${offset * (100 / slidesPerView)}%)`;

        for (let i = 0; i < slidesPerView && (offset + i) < totalSlides; i++) {
          slides[offset + i].classList.add('active');
        }
      }

      prevButton.addEventListener('click', () => {
        currentSlide = Math.max(0, currentSlide - 1);
        showSlide(currentSlide);
      });

      nextButton.addEventListener('click', () => {
        currentSlide = Math.min(totalSlides - slidesPerView, currentSlide + 1);
        showSlide(currentSlide);
      });
    }
  }

  // Move columns to be direct children of block
  block.append(headingCol, carouselCol);
  row.remove();
}
