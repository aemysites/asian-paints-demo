export default function decorate(block) {
  // Remove dark-blue class from parent section to prevent inherited background
  const section = block.closest('.section');
  if (section) {
    section.classList.remove('dark-blue');
  }

  const rows = [...block.children];
  if (!rows || rows.length === 0) return;

  // Get header row for content reference
  const headerRow = rows[0];
  if (!headerRow) return;

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

    // Create containers for layout
    let descriptionCell = null;
    const inputCells = [];
    let buttonCell = null;

    cells.forEach((cell, cellIdx) => {
      const content = cell.textContent.trim();
      const headerCell = headerCells[cellIdx];

      // First cell is the description text
      if (cellIdx === 0) {
        cell.classList.add('form-description-cell');
        descriptionCell = cell;

        if (!content && headerCell) {
          const descContent = headerCell.innerHTML;

          if (descContent && descContent.includes('Painting Service')) {
            const strongMatch = descContent.match(/<strong>(.*?)<\/strong>/);
            if (strongMatch) {
              const titleText = strongMatch[1];
              if (titleText.includes('Painting Service')) {
                const parts = titleText.split('Painting Service');
                const beforeText = parts[0].trim();
                const afterText = headerCell.textContent.replace(titleText, '').trim();

                cell.innerHTML = `
                  <div class="form-title-small">${beforeText}</div>
                  <div class="form-title-large">Painting<br>Service</div>
                  <div class="form-subtitle">${afterText}</div>
                `;
              } else {
                cell.innerHTML = descContent;
              }
            } else {
              cell.innerHTML = descContent;
            }
          } else if (descContent) {
            cell.innerHTML = descContent;
          }
        }
        return;
      }

      // Check if header cell has a button link
      const headerLink = headerCell ? headerCell.querySelector('a') : null;
      if (headerLink && !content) {
        const button = document.createElement('button');
        button.textContent = headerLink.textContent.trim();
        button.className = 'form-submit';
        button.type = 'button';
        cell.textContent = '';
        cell.appendChild(button);
        cell.classList.add('form-button-cell');
        buttonCell = cell;
      } else if (content && content.length > 0) {
        cell.classList.add('form-input-cell');
        const input = document.createElement('input');

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
        inputCells.push(cell);
      } else {
        cell.classList.add('form-empty-cell');
      }
    });

    // Restructure: wrap inputs in a grid container
    if (inputCells.length > 0) {
      const fieldsArea = document.createElement('div');
      fieldsArea.className = 'form-fields-area';

      const inputsGrid = document.createElement('div');
      inputsGrid.className = 'form-inputs-grid';

      inputCells.forEach((inputCell) => {
        inputsGrid.appendChild(inputCell);
      });

      fieldsArea.appendChild(inputsGrid);

      if (buttonCell) {
        fieldsArea.appendChild(buttonCell);
      }

      // Append to row after description
      if (descriptionCell) {
        row.appendChild(fieldsArea);
      }
    }
  });
}
