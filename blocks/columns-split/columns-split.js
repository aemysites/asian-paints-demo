export default function decorate(block) {
  const cols = [...block.firstElementChild.children];
  block.classList.add(`columns-split-${cols.length}-cols`);

  // Check if this is a clickable banner (has both image and button link)
  const hasImageCol = cols.some(col => col.querySelector('picture'));
  const buttonLink = block.querySelector('a.button');

  if (hasImageCol && buttonLink) {
    // Make the entire block clickable
    const blockLink = document.createElement('a');
    blockLink.href = buttonLink.href;
    blockLink.target = buttonLink.target || '_self';
    blockLink.className = 'columns-split-link';
    blockLink.setAttribute('aria-label', buttonLink.textContent.trim());

    // Replace the button link with a span to keep visual appearance
    const buttonSpan = document.createElement('span');
    buttonSpan.className = buttonLink.className;
    buttonSpan.textContent = buttonLink.textContent;
    buttonLink.replaceWith(buttonSpan);

    // Move all block content into the link
    const row = block.firstElementChild;
    while (row.firstChild) {
      blockLink.appendChild(row.firstChild);
    }
    row.appendChild(blockLink);
  }

  // setup image columns
  [...block.children].forEach((row) => {
    [...row.children].forEach((col) => {
      const pic = col.querySelector('picture');
      if (pic) {
        const picWrapper = pic.closest('div');
        if (picWrapper && picWrapper.children.length === 1) {
          // picture is only content in column
          picWrapper.classList.add('columns-split-img-col');
        }
      }
    });
  });
}
