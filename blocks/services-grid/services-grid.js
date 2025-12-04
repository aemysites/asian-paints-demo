export default function decorate(block) {
  const row = block.querySelector(':scope > div');
  if (!row) return;

  const columns = [...row.children];
  if (columns.length < 2) return;

  // First column is text content
  const textCol = columns[0];
  textCol.classList.add('services-grid-text');

  // Second column contains service images in a grid
  const servicesCol = columns[1];
  if (servicesCol) {
    servicesCol.classList.add('services-grid-images');

    // Get all images
    const images = [...servicesCol.querySelectorAll('img')];

    if (images.length > 0) {
      // Create grid container
      const gridContainer = document.createElement('div');
      gridContainer.className = 'services-grid-container';

      // Wrap each image in a card
      images.forEach((img) => {
        const card = document.createElement('div');
        card.className = 'services-grid-card';
        card.appendChild(img.cloneNode(true));
        gridContainer.appendChild(card);
      });

      // Clear services column and add grid
      servicesCol.innerHTML = '';
      servicesCol.appendChild(gridContainer);
    }
  }

  // Move columns to be direct children of block (unwrap from row)
  block.append(textCol, servicesCol);
  row.remove();
}
