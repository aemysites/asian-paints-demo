/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  // Fetch footer content
  const resp = await fetch('/footer.plain.html');
  if (resp.ok) {
    const html = await resp.text();
    // Parse the HTML and get the content from body > div sections
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const sections = doc.querySelectorAll('body > div');

    // Add the sections to the block
    sections.forEach(section => {
      block.appendChild(section.cloneNode(true));
    });
  } else {
    console.error('Failed to load footer.plain.html:', resp.status);
  }

  // Footer dropdown functionality for mobile
  const dropdownButtons = block.querySelectorAll('.footer-menu-dropdown');
  dropdownButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const parent = button.closest('.footer-menu-list');
      const menu = parent.querySelector('.footer-menu-wraper');
      const isOpen = parent.classList.contains('open');

      // Close all other menus on mobile
      if (window.innerWidth < 768) {
        block.querySelectorAll('.footer-menu-list').forEach((item) => {
          if (item !== parent) {
            item.classList.remove('open');
          }
        });
      }

      // Toggle current menu
      parent.classList.toggle('open');
    });
  });

  // Country selector functionality
  const countrySelector = block.querySelector('.selected-country');
  const countryDropdown = block.querySelector('.country-selector-sec');

  if (countrySelector && countryDropdown) {
    countrySelector.addEventListener('click', (e) => {
      e.stopPropagation();
      countryDropdown.classList.toggle('show');
    });

    // Close country dropdown when clicking outside
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.country-section')) {
        countryDropdown.classList.remove('show');
      }
    });

    // Close button for mobile
    const closeBtn = countryDropdown.querySelector('.close-icon');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        countryDropdown.classList.remove('show');
      });
    }
  }

  // Find store functionality
  const findStoreForm = block.querySelector('.find-store-pin');
  if (findStoreForm) {
    findStoreForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const pincodeInput = findStoreForm.querySelector('#store-id');
      const pincode = pincodeInput.value.trim();

      if (pincode && /^\d{6}$/.test(pincode)) {
        window.location.href = `https://www.asianpaints.com/store-locator.html?pincode=${pincode}`;
      } else {
        pincodeInput.classList.add('error');
        setTimeout(() => {
          pincodeInput.classList.remove('error');
        }, 2000);
      }
    });
  }

  // Email subscription functionality
  const emailForm = block.querySelector('.latest-trending-sub');
  if (emailForm) {
    const emailInput = emailForm.querySelector('#trackemailid');
    const errorLabel = emailForm.querySelector('.error-label');
    const successMsg = emailForm.querySelector('.signup-success-message');

    emailForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = emailInput.value.trim();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailRegex.test(email)) {
        if (errorLabel) errorLabel.style.display = 'block';
        if (successMsg) successMsg.style.display = 'none';
        emailInput.classList.add('error');
      } else {
        if (errorLabel) errorLabel.style.display = 'none';
        if (successMsg) {
          successMsg.style.display = 'block';
          setTimeout(() => {
            successMsg.style.display = 'none';
          }, 3000);
        }
        emailInput.classList.remove('error');
        emailInput.value = '';
      }
    });
  }

  // Add smooth scroll behavior for back to top
  const backToTopBtn = block.querySelector('.back-to-top');
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
}
