export default function decorate(block) {
  const rows = [...block.children];

  // Get header row for content reference
  const headerRow = rows[0];
  const headerCells = [...headerRow.children];

  // Process all rows
  rows.forEach((row, rowIdx) => {
    if (rowIdx === 0) {
      // Hide header row
      row.style.display = 'none';
      return;
    }

    row.classList.add('form-row');
    const cells = [...row.children];

    cells.forEach((cell, cellIdx) => {
      const content = cell.textContent.trim();
      const headerCell = headerCells[cellIdx];

      // First cell is the description text - copy from header if empty
      if (cellIdx === 0) {
        cell.classList.add('form-description-cell');
        if (!content && headerCell) {
          // Copy the description from header row
          cell.innerHTML = headerCell.innerHTML;
        }
        return;
      }

      // Check if header cell has a button link
      const headerLink = headerCell ? headerCell.querySelector('a') : null;
      if (headerLink && !content) {
        // This should be a button cell
        const button = document.createElement('button');
        button.textContent = headerLink.textContent.trim();
        button.className = 'form-submit';
        button.type = 'button';
        cell.textContent = '';
        cell.appendChild(button);
        cell.classList.add('form-button-cell');
      } else if (content && content.length > 0) {
        // This is an input placeholder
        cell.classList.add('form-input-cell');
        const input = document.createElement('input');

        // Determine input type based on header label
        let inputType = 'text';
        if (headerCell) {
          const headerLabel = headerCell.textContent.toLowerCase();
          if (headerLabel.includes('phone')) {
            inputType = 'tel';
          } else if (headerLabel.includes('email')) {
            inputType = 'email';
          }
        }

        input.type = inputType;
        input.placeholder = content;
        input.className = 'form-input';
        input.required = true;
        cell.textContent = '';
        cell.appendChild(input);
      } else {
        // Empty cell
        cell.classList.add('form-empty-cell');
      }
    });
  });
}
