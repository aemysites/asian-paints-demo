/**
 * Asian Paints Header - Complete Navigation System
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  // Fetch nav content from content folder
  const resp = await fetch('/content/nav.plain.html');
  if (resp.ok) {
    const html = await resp.text();
    // Parse the HTML and get the content
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    // Get all direct children (sections) from the nav content
    const sections = doc.body.children;

    // Clone and append each section, preserving classes
    Array.from(sections).forEach((section) => {
      const clonedSection = section.cloneNode(true);
      block.appendChild(clonedSection);
    });
  } else {
    console.error('Failed to load nav.plain.html:', resp.status);
  }

  // Mobile hamburger menu functionality
  const setupMobileMenu = () => {
    const hamburger = block.querySelector('.nav-hamburger button');
    const header = block.querySelector('.header');

    if (hamburger && header) {
      hamburger.addEventListener('click', () => {
        const isExpanded = header.getAttribute('aria-expanded') === 'true';
        header.setAttribute('aria-expanded', !isExpanded);
        hamburger.setAttribute('aria-expanded', !isExpanded);
        document.body.style.overflow = isExpanded ? '' : 'hidden';
      });
    }
  };

  // Desktop navigation hover with dropdown
  const setupDesktopNav = () => {
    const navItems = block.querySelectorAll('.header > div > ul > li');

    navItems.forEach((item) => {
      const submenu = item.querySelector('ul');

      if (submenu) {
        item.addEventListener('mouseenter', () => {
          if (window.innerWidth >= 992) {
            item.classList.add('active');
          }
        });

        item.addEventListener('mouseleave', () => {
          if (window.innerWidth >= 992) {
            item.classList.remove('active');
          }
        });

        // Mobile toggle
        const link = item.querySelector(':scope > a');
        if (link) {
          link.addEventListener('click', (e) => {
            if (window.innerWidth < 992 && submenu) {
              e.preventDefault();
              item.classList.toggle('active');
            }
          });
        }
      }
    });
  };

  // Sticky header on scroll
  const setupStickyHeader = () => {
    let lastScroll = 0;
    const headerElement = block.closest('header');

    window.addEventListener('scroll', () => {
      const currentScroll = window.pageYOffset;

      if (currentScroll > 60) {
        headerElement?.classList.add('scrolled');
      } else {
        headerElement?.classList.remove('scrolled');
      }

      // Hide/show header on scroll (desktop only)
      if (window.innerWidth >= 992) {
        if (currentScroll > lastScroll && currentScroll > 200) {
          headerElement?.classList.add('header-hidden');
        } else {
          headerElement?.classList.remove('header-hidden');
        }
      }

      lastScroll = currentScroll;
    });
  };

  // Handle window resize
  const setupResizeHandler = () => {
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        if (window.innerWidth >= 992) {
          // Reset mobile menu state on desktop
          const header = block.querySelector('.header');
          if (header) {
            header.setAttribute('aria-expanded', 'false');
          }
          document.body.style.overflow = '';

          // Close all mobile submenus
          block.querySelectorAll('.header > div > ul > li.active').forEach((item) => {
            item.classList.remove('active');
          });
        }
      }, 250);
    });
  };

  // Initialize all functionality
  setupMobileMenu();
  setupDesktopNav();
  setupStickyHeader();
  setupResizeHandler();

  // Add hamburger menu button if not present
  const header = block.querySelector('.header');
  if (header) {
    const headerDiv = header.querySelector('div');
    if (headerDiv && !headerDiv.querySelector('.nav-hamburger')) {
      const hamburger = document.createElement('p');
      hamburger.className = 'nav-hamburger';
      hamburger.innerHTML = `
        <button type="button" aria-controls="nav" aria-label="Open navigation" aria-expanded="false">
          <span class="nav-hamburger-icon"></span>
        </button>
      `;
      headerDiv.appendChild(hamburger);

      // Re-setup mobile menu after adding hamburger
      setupMobileMenu();
    }
  }
}
