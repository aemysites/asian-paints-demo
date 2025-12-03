/*
 * Accordion Block
 * Recreate an accordion
 * https://www.hlx.live/developer/block-collection/accordion
 */

import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const rows = [...block.children];
  const initialVisibleCount = 5;

  rows.forEach((row, index) => {
    // decorate accordion item label
    const label = row.children[0];
    const summary = document.createElement('summary');
    summary.className = 'accordion-faq-item-label';
    summary.append(...label.childNodes);
    // decorate accordion item body
    const body = row.children[1];
    body.className = 'accordion-faq-item-body';
    // decorate accordion item
    const details = document.createElement('details');
    moveInstrumentation(row, details);
    details.className = 'accordion-faq-item';
    details.append(summary, body);

    // Hide items beyond the initial visible count
    if (index >= initialVisibleCount) {
      details.style.display = 'none';
      details.classList.add('accordion-faq-hidden');
    }

    row.replaceWith(details);
  });

  // Add "View all" button if there are more than 5 items
  if (rows.length > initialVisibleCount) {
    const viewAllBtn = document.createElement('button');
    viewAllBtn.className = 'accordion-faq-view-all';
    viewAllBtn.textContent = 'View all';
    viewAllBtn.addEventListener('click', () => {
      const hiddenItems = block.querySelectorAll('.accordion-faq-hidden');
      hiddenItems.forEach(item => {
        item.style.display = 'block';
        item.classList.remove('accordion-faq-hidden');
      });
      viewAllBtn.style.display = 'none';
    });
    block.appendChild(viewAllBtn);
  }
}
