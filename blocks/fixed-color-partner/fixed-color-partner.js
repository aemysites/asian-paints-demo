/**
 * Fixed Color Partner - BCCI Campaign Overlay
 * @param {Element} block The fixed color partner block element
 */
export default function decorate(block) {
  // Get auto-close time from data attribute (default 8 seconds)
  const fixedImg = block.querySelector('.fixed-img');
  const autoCloseTime = fixedImg?.getAttribute('data-attr-autoclosetime') || 8;
  const autoCloseMs = parseInt(autoCloseTime, 10) * 1000;

  // Start in collapsed state
  block.classList.add('collapsed');

  // Add initial load animation
  setTimeout(() => {
    block.classList.add('initial-load');
  }, 100);

  // Create close button
  const closeBtn = document.createElement('button');
  closeBtn.className = 'close-btn';
  closeBtn.setAttribute('aria-label', 'Close');
  closeBtn.innerHTML = '×';
  block.appendChild(closeBtn);

  // Auto-expand after page load (show the promotional content)
  let expandTimer = setTimeout(() => {
    block.classList.remove('collapsed');

    // Auto-collapse after specified time
    if (autoCloseMs > 0) {
      setTimeout(() => {
        block.classList.add('collapsed');
      }, autoCloseMs);
    }
  }, 2000); // Show after 2 seconds

  // Click on collapsed badge to expand
  if (fixedImg) {
    fixedImg.addEventListener('click', (e) => {
      if (block.classList.contains('collapsed')) {
        e.preventDefault();
        block.classList.remove('collapsed');

        // Auto-collapse after specified time
        if (autoCloseMs > 0) {
          setTimeout(() => {
            block.classList.add('collapsed');
          }, autoCloseMs);
        }
      }
    });
  }

  // Click close button to collapse
  closeBtn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    block.classList.add('collapsed');
    clearTimeout(expandTimer);
  });

  // Click outside (on the expanded image area) to maintain expanded state
  const animateImage = block.querySelector('.animate-image');
  if (animateImage) {
    animateImage.addEventListener('click', (e) => {
      // Let the link work normally - don't prevent default
      // The user clicks to visit the campaign page
    });
  }

  // Keyboard accessibility
  block.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !block.classList.contains('collapsed')) {
      block.classList.add('collapsed');
    }
  });

  // Respect user's motion preferences
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    block.style.transition = 'none';
  }

  // Pause auto-collapse on hover
  let hoverTimer;
  block.addEventListener('mouseenter', () => {
    if (hoverTimer) {
      clearTimeout(hoverTimer);
    }
  });

  block.addEventListener('mouseleave', () => {
    if (!block.classList.contains('collapsed')) {
      hoverTimer = setTimeout(() => {
        block.classList.add('collapsed');
      }, 3000); // Collapse 3 seconds after mouse leaves
    }
  });

  // Store state in sessionStorage to avoid annoying users
  const storageKey = 'bcci-color-partner-dismissed';

  // Check if user previously dismissed
  if (sessionStorage.getItem(storageKey) === 'true') {
    block.classList.add('collapsed');
    clearTimeout(expandTimer);
  }

  // Mark as dismissed when manually closed
  closeBtn.addEventListener('click', () => {
    sessionStorage.setItem(storageKey, 'true');
  });
}
