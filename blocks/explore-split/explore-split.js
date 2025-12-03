export default function decorate(block) {
  const row = block.querySelector(':scope > div');
  if (!row) return;

  const columns = [...row.children];
  if (columns.length < 2) return;

  // First column is Textures
  const texturesCol = columns[0];
  texturesCol.classList.add('explore-split-section');

  // Get heading and images from textures column
  const texturesHeading = texturesCol.querySelector('h3');
  const texturesImages = [...texturesCol.querySelectorAll('img')];

  if (texturesHeading && texturesImages.length > 0) {
    // Create header with title and "View all" button
    const header = document.createElement('div');
    header.className = 'explore-split-header';

    const title = document.createElement('h3');
    title.textContent = texturesHeading.textContent;

    const viewAllBtn = document.createElement('a');
    viewAllBtn.href = '#';
    viewAllBtn.className = 'explore-split-view-all';
    viewAllBtn.textContent = 'View all';
    viewAllBtn.innerHTML = 'View all <span>→</span>';

    header.appendChild(title);
    header.appendChild(viewAllBtn);

    // Create grid for images
    const grid = document.createElement('div');
    grid.className = 'explore-split-grid';

    texturesImages.forEach((img) => {
      const card = document.createElement('div');
      card.className = 'explore-split-card';
      card.appendChild(img.cloneNode(true));
      grid.appendChild(card);
    });

    // Clear and rebuild textures column
    texturesCol.innerHTML = '';
    texturesCol.appendChild(header);
    texturesCol.appendChild(grid);
  }

  // Second column is Wallpapers
  const wallpapersCol = columns[1];
  wallpapersCol.classList.add('explore-split-section');

  // Get heading and images from wallpapers column
  const wallpapersHeading = wallpapersCol.querySelector('h3');
  const wallpapersImages = [...wallpapersCol.querySelectorAll('img')];

  if (wallpapersHeading && wallpapersImages.length > 0) {
    // Create header with title and "View all" button
    const header = document.createElement('div');
    header.className = 'explore-split-header';

    const title = document.createElement('h3');
    title.textContent = wallpapersHeading.textContent;

    const viewAllBtn = document.createElement('a');
    viewAllBtn.href = '#';
    viewAllBtn.className = 'explore-split-view-all';
    viewAllBtn.textContent = 'View all';
    viewAllBtn.innerHTML = 'View all <span>→</span>';

    header.appendChild(title);
    header.appendChild(viewAllBtn);

    // Create grid for images
    const grid = document.createElement('div');
    grid.className = 'explore-split-grid';

    wallpapersImages.forEach((img) => {
      const card = document.createElement('div');
      card.className = 'explore-split-card';
      card.appendChild(img.cloneNode(true));
      grid.appendChild(card);
    });

    // Clear and rebuild wallpapers column
    wallpapersCol.innerHTML = '';
    wallpapersCol.appendChild(header);
    wallpapersCol.appendChild(grid);
  }

  // Move columns to be direct children of block (unwrap from row)
  block.append(texturesCol, wallpapersCol);
  row.remove();
}
