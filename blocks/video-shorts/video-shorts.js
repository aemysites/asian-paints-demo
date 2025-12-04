export default function decorate(block) {
  const title = block.querySelector('h2, h3');
  if (title) {
    title.classList.add('video-shorts-title');
  }

  // Create wrapper for carousel
  const wrapper = document.createElement('div');
  wrapper.classList.add('carousel-wrapper');

  // Create carousel track
  const track = document.createElement('div');
  track.classList.add('carousel-track');

  // Video data with color themes matching the paint shades
  const videos = [
    {
      color: '#8B6F47', // Brown for Wholegrain Mustard
      title: 'Wholegrain Mustard',
      cta: 'Explore shade',
      link: 'https://www.asianpaints.com/colour-catalogue/brown-wall-colours/wholegrain-mustard-n.html'
    },
    {
      color: '#FFB347', // Orange-yellow for Mango Mood
      title: 'Mango Mood',
      cta: 'Explore shade',
      link: 'https://www.asianpaints.com/colour-catalogue/yellow-wall-colours/mango-mood.html'
    },
    {
      color: '#DC143C', // Red for Scarlet
      title: 'Scarlet',
      cta: 'Explore shade',
      link: 'https://www.asianpaints.com/colour-catalogue/red-wall-colours/scarlet.html'
    },
    {
      color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', // Gradient for catalogue
      title: 'Color Catalogue',
      cta: 'Explore catalogue',
      link: 'https://www.asianpaints.com/colour-catalogue.html'
    },
    {
      color: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', // Gradient for inspiration
      title: 'Living Room Ideas',
      cta: 'Get Inspiration',
      link: 'https://www.asianpaints.com/inspiration/ideas/colour-inspiration/living-room.html'
    },
    {
      color: '#808080', // Grey for Stone Steps
      title: 'Stone Steps',
      cta: 'Explore shade',
      link: 'https://www.asianpaints.com/colour-catalogue/grey-wall-colours/stone-steps.html'
    },
    {
      color: '#90EE90', // Light green for Jugnu
      title: 'Jugnu',
      cta: 'Explore shade',
      link: 'https://www.asianpaints.com/colour-catalogue/green-wall-colours/jugnu-i.html'
    },
    {
      color: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', // Blue gradient for catalogue
      title: 'Color Catalogue',
      cta: 'Explore catalogue',
      link: 'https://www.asianpaints.com/colour-catalogue.html'
    },
    {
      color: '#87CEEB', // Sky blue for Empty Sky
      title: 'Empty Sky',
      cta: 'Explore shade',
      link: 'https://www.asianpaints.com/colour-catalogue/blue-wall-colours/empty-sky-n.html'
    },
    {
      color: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)', // Warm gradient for catalogue
      title: 'Color Catalogue',
      cta: 'Explore catalogue',
      link: 'https://www.asianpaints.com/colour-catalogue.html'
    }
  ];

  // Create video cards
  videos.forEach((video) => {
    const card = document.createElement('div');
    card.classList.add('video-card');

    // Create colored background div instead of video
    const colorBg = document.createElement('div');
    colorBg.classList.add('video-background');
    colorBg.style.width = '100%';
    colorBg.style.height = '100%';
    colorBg.style.background = video.color;
    colorBg.style.position = 'absolute';
    colorBg.style.top = '0';
    colorBg.style.left = '0';

    // Create controls overlay
    const controls = document.createElement('div');
    controls.classList.add('video-controls');

    // Top controls (share, mute)
    const controlsTop = document.createElement('div');
    controlsTop.classList.add('video-controls-top');

    const shareBtn = document.createElement('button');
    shareBtn.classList.add('control-btn', 'share-btn');
    shareBtn.innerHTML = `
      <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M21.707,11.293l-8-8A.99991.99991,0,0,0,12,4V7.54492A11.01525,11.01525,0,0,0,2,18.5V20a1,1,0,0,0,1.78418.62061,11.45625,11.45625,0,0,1,7.88672-4.04932c.0498-.00635.1748-.01611.3291-.02588V20a.99991.99991,0,0,0,1.707.707l8-8A.99962.99962,0,0,0,21.707,11.293ZM14,17.58594V15.5a.99974.99974,0,0,0-1-1c-.25488,0-1.2959.04932-1.56152.085A14.00507,14.00507,0,0,0,4.05176,17.5332,9.01266,9.01266,0,0,1,13,9.5a.99974.99974,0,0,0,1-1V6.41406L19.58594,12Z" fill="#fff"/>
      </svg>
    `;

    const muteBtn = document.createElement('button');
    muteBtn.classList.add('control-btn', 'mute-btn');
    muteBtn.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" stroke="#fff" fill="none" stroke-width="2" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" clip-rule="evenodd"/>
        <path stroke-linecap="round" stroke-linejoin="round" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"/>
      </svg>
    `;

    controlsTop.append(shareBtn, muteBtn);
    controls.append(controlsTop);

    // CTA button (always visible, positioned absolutely on card)
    const cta = document.createElement('a');
    cta.href = video.link;
    cta.classList.add('video-cta');
    cta.innerHTML = `
      <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 576 512">
        <path d="M528.12 301.319l47.273-208C578.806 78.301 567.391 64 551.99 64H159.208l-9.166-44.81C147.758 8.021 137.93 0 126.529 0H24C10.745 0 0 10.745 0 24v16c0 13.255 10.745 24 24 24h69.883l70.248 343.435C147.325 417.1 136 435.222 136 456c0 30.928 25.072 56 56 56s56-25.072 56-56c0-15.674-6.447-29.835-16.824-40h209.647C430.447 426.165 424 440.326 424 456c0 30.928 25.072 56 56 56s56-25.072 56-56c0-22.172-12.888-41.332-31.579-50.405l5.517-24.276c3.413-15.018-8.002-29.319-23.403-29.319H218.117l-6.545-32h293.145c11.206 0 20.92-7.754 23.403-18.681z"/>
      </svg>
      ${video.cta}
    `;

    card.append(colorBg, controls, cta);
    track.append(card);
  });

  // Create navigation buttons
  const prevBtn = document.createElement('button');
  prevBtn.classList.add('carousel-nav', 'prev');
  prevBtn.setAttribute('aria-label', 'Previous');
  prevBtn.innerHTML = `
    <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512">
      <path d="M512 256A256 256 0 1 0 0 256a256 256 0 1 0 512 0zM271 135c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-87 87 87 87c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0L167 273c-9.4-9.4-9.4-24.6 0-33.9L271 135z"/>
    </svg>
  `;

  const nextBtn = document.createElement('button');
  nextBtn.classList.add('carousel-nav', 'next');
  nextBtn.setAttribute('aria-label', 'Next');
  nextBtn.innerHTML = `
    <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512">
      <path d="M0 256a256 256 0 1 0 512 0A256 256 0 1 0 0 256zM241 377c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l87-87-87-87c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0L345 239c9.4 9.4 9.4 24.6 0 33.9L241 377z"/>
    </svg>
  `;

  // Navigation logic
  prevBtn.addEventListener('click', () => {
    track.scrollBy({ left: -300, behavior: 'smooth' });
  });

  nextBtn.addEventListener('click', () => {
    track.scrollBy({ left: 300, behavior: 'smooth' });
  });

  wrapper.append(prevBtn, track, nextBtn);
  block.append(wrapper);
  block.classList.add('video-shorts-container');
}
