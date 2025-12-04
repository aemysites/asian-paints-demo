export default function decorate(block) {
  // Get heading and description
  const heading = block.querySelector('h2, h3, h4');
  const description = block.querySelector('p');

  // Get all rows after header
  const rows = [...block.querySelectorAll(':scope > div')];

  // Create container for text content
  const textDiv = document.createElement('div');
  textDiv.className = 'interiors-shop-text';

  if (heading) {
    heading.classList.add('interiors-shop-heading');
    textDiv.appendChild(heading.cloneNode(true));
  }

  if (description) {
    description.classList.add('interiors-shop-description');
    textDiv.appendChild(description.cloneNode(true));
  }

  // Create container for cards
  const cardsDiv = document.createElement('div');
  cardsDiv.className = 'interiors-shop-cards';

  // Get all service cards (skip first row which has heading/description)
  rows.slice(1).forEach(row => {
    const cells = [...row.children];

    cells.forEach(cell => {
      const img = cell.querySelector('img');
      const title = cell.querySelector('strong');
      const desc = cell.querySelector('em');
      const link = cell.querySelector('a');

      if (img || title) {
        const card = document.createElement('div');
        card.className = 'interiors-shop-card';

        if (img) {
          const imgDiv = document.createElement('div');
          imgDiv.className = 'interiors-shop-card-image';
          imgDiv.appendChild(img.cloneNode(true));
          card.appendChild(imgDiv);
        }

        if (title) {
          const titleEl = document.createElement('h5');
          titleEl.textContent = title.textContent;
          card.appendChild(titleEl);
        }

        if (desc) {
          const descEl = document.createElement('p');
          descEl.textContent = desc.textContent;
          card.appendChild(descEl);
        }

        if (link) {
          const btn = document.createElement('a');
          btn.href = link.href;
          btn.className = 'interiors-shop-button';
          btn.textContent = link.textContent || 'Explore now';
          btn.innerHTML = `${btn.textContent} <span class="arrow">→</span>`;
          card.appendChild(btn);
        }

        cardsDiv.appendChild(card);
      }
    });
  });

  // Clear and rebuild block
  block.innerHTML = '';
  block.appendChild(textDiv);
  block.appendChild(cardsDiv);
}
