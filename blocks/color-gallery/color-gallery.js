export default function decorate(block) {
  const row = block.querySelector(':scope > div');
  if (!row) return;

  const columns = [...row.children];
  if (columns.length < 2) return;

  // First column is text content
  const textCol = columns[0];
  textCol.classList.add('color-gallery-text');

  // Second column contains carousel images
  const carouselCol = columns[1];
  if (carouselCol) {
    carouselCol.classList.add('color-gallery-carousel');

    // Get all images from the carousel column
    const images = [...carouselCol.querySelectorAll('img')];

    if (images.length > 0) {
      // Create carousel structure
      const carouselContainer = document.createElement('div');
      carouselContainer.className = 'color-gallery-carousel-container';

      const carouselTrack = document.createElement('div');
      carouselTrack.className = 'color-gallery-carousel-track';

      // Wrap each image in a slide
      images.forEach((img, index) => {
        const slide = document.createElement('div');
        slide.className = 'color-gallery-slide';
        if (index === 0) slide.classList.add('active');
        slide.appendChild(img.cloneNode(true));
        carouselTrack.appendChild(slide);
      });

      carouselContainer.appendChild(carouselTrack);

      // Add navigation buttons
      const prevButton = document.createElement('button');
      prevButton.className = 'color-gallery-nav color-gallery-prev';
      prevButton.setAttribute('aria-label', 'Previous');
      prevButton.innerHTML = '‹';

      const nextButton = document.createElement('button');
      nextButton.className = 'color-gallery-nav color-gallery-next';
      nextButton.setAttribute('aria-label', 'Next');
      nextButton.innerHTML = '›';

      carouselContainer.appendChild(prevButton);
      carouselContainer.appendChild(nextButton);

      // Clear carousel column and add container
      carouselCol.innerHTML = '';
      carouselCol.appendChild(carouselContainer);

      // Carousel logic
      let currentSlide = 0;
      const slides = carouselTrack.querySelectorAll('.color-gallery-slide');
      const totalSlides = slides.length;

      function showSlide(index) {
        slides.forEach(slide => slide.classList.remove('active'));
        slides[index].classList.add('active');
        carouselTrack.style.transform = `translateX(-${index * 100}%)`;
      }

      prevButton.addEventListener('click', () => {
        currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
        showSlide(currentSlide);
      });

      nextButton.addEventListener('click', () => {
        currentSlide = (currentSlide + 1) % totalSlides;
        showSlide(currentSlide);
      });

      // Auto-play
      setInterval(() => {
        currentSlide = (currentSlide + 1) % totalSlides;
        showSlide(currentSlide);
      }, 5000);
    }
  }

  // Move columns to be direct children of block (unwrap from row)
  block.append(textCol, carouselCol);
  row.remove();
}
