/**
 * Asian Paints Header - Complete Navigation System
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  // Fetch nav content
  const resp = await fetch('/nav.plain.html');
  if (resp.ok) {
    const html = await resp.text();
    // Parse the HTML and get the content from main > div sections
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const sections = doc.querySelectorAll('main > div');

    // Add the sections to the block
    sections.forEach(section => {
      block.appendChild(section.cloneNode(true));
    });
  } else {
    console.error('Failed to load nav.plain.html:', resp.status);
  }

  // Mobile hamburger menu functionality
  const burgerMenu = block.querySelector('.burger');
  const mobileMenu = block.querySelector('.menu');
  const menuOverlay = block.querySelector('.overlay');

  if (burgerMenu && mobileMenu) {
    burgerMenu.addEventListener('click', () => {
      mobileMenu.classList.toggle('open');
      burgerMenu.classList.toggle('open');
      document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
    });

    if (menuOverlay) {
      menuOverlay.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        burgerMenu.classList.remove('open');
        document.body.style.overflow = '';
      });
    }
  }

  // Mobile menu dropdown navigation
  const mobileDropdowns = block.querySelectorAll('.menu__item.menu__dropdown > .menu__link');
  mobileDropdowns.forEach((dropdown) => {
    dropdown.addEventListener('click', (e) => {
      if (window.innerWidth < 992) {
        e.preventDefault();
        const parent = dropdown.closest('.menu__item');
        const submenu = parent.querySelector('.submenu');

        // Close other open submenus
        block.querySelectorAll('.menu__item.open').forEach((item) => {
          if (item !== parent) {
            item.classList.remove('open');
          }
        });

        parent.classList.toggle('open');
      }
    });
  });

  // Back arrow in mobile submenu
  const menuArrows = block.querySelectorAll('.menu__arrow');
  menuArrows.forEach((arrow) => {
    arrow.addEventListener('click', () => {
      const parent = arrow.closest('.menu__item');
      parent.classList.remove('open');
    });
  });

  // Desktop navigation hover
  const desktopNavItems = block.querySelectorAll('.main-desktop-nav > li.l1');
  desktopNavItems.forEach((navItem) => {
    const submenu = navItem.querySelector('.secondary-nav');

    if (submenu) {
      navItem.addEventListener('mouseenter', () => {
        if (window.innerWidth >= 992) {
          // Close other open menus
          desktopNavItems.forEach((item) => {
            if (item !== navItem) {
              item.classList.remove('open');
            }
          });
          navItem.classList.add('open');
        }
      });

      navItem.addEventListener('mouseleave', () => {
        if (window.innerWidth >= 992) {
          navItem.classList.remove('open');
        }
      });
    }
  });

  // Search functionality
  const searchIcon = block.querySelector('.search-icon, .ap-search-box');
  const searchModal = document.getElementById('unified-search-popup');

  if (searchIcon && searchModal) {
    searchIcon.addEventListener('click', () => {
      searchModal.style.display = 'block';
      searchModal.classList.add('show');
    });

    const closeBtn = searchModal.querySelector('.btn-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        searchModal.style.display = 'none';
        searchModal.classList.remove('show');
      });
    }

    // Close on outside click
    searchModal.addEventListener('click', (e) => {
      if (e.target === searchModal) {
        searchModal.style.display = 'none';
        searchModal.classList.remove('show');
      }
    });
  }

  // Profile dropdown
  const profileIcon = block.querySelector('.profile-icon, .login-status-check');
  const profilePopup = block.querySelector('.profile-popup-container');

  if (profileIcon && profilePopup) {
    profileIcon.addEventListener('click', (e) => {
      e.stopPropagation();
      profilePopup.classList.toggle('d-none');
    });

    document.addEventListener('click', (e) => {
      if (!e.target.closest('.user-profile-section')) {
        profilePopup.classList.add('d-none');
      }
    });
  }

  // Cart functionality placeholder
  const cartIcon = block.querySelector('#CartLogo, .cart-js-handle');
  if (cartIcon) {
    cartIcon.addEventListener('click', () => {
      // Cart functionality would go here
      console.log('Cart clicked');
    });
  }

  // Brand tabs (Asian Paints, Beautiful Homes, White Teak)
  const brandLogos = block.querySelectorAll('.logo-section .logo');
  brandLogos.forEach((logo, index) => {
    logo.addEventListener('click', () => {
      brandLogos.forEach((l) => l.classList.remove('active'));
      logo.classList.add('active');

      // Update background color based on brand
      const headerMain = block.querySelector('.header-main-logo-tabs-section');
      if (headerMain) {
        const bgColor = logo.getAttribute('data-attr-tab-bg') || '#fff';
        logo.style.background = bgColor;
      }
    });
  });

  // Sticky header on scroll
  let lastScroll = 0;
  const header = block.closest('header');

  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 50) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }

    // Hide header on scroll down, show on scroll up (desktop only)
    if (window.innerWidth >= 992) {
      if (currentScroll > lastScroll && currentScroll > 200) {
        header?.classList.add('header-hidden');
      } else {
        header?.classList.remove('header-hidden');
      }
    }

    lastScroll = currentScroll;
  });

  // Visual search button functionality
  const visualSearchBtns = block.querySelectorAll('.search-with-image-button');
  visualSearchBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const modal = document.getElementById('visual-search-browse-image-modal');
      if (modal) {
        modal.style.display = 'block';
        modal.classList.add('show');
      }
    });
  });

  // Initialize tooltips for icons
  const iconElements = block.querySelectorAll('[data-toggle="tooltip"]');
  iconElements.forEach((el) => {
    el.addEventListener('mouseenter', () => {
      const tooltip = el.querySelector('.icon-tooltip-text');
      if (tooltip) {
        tooltip.style.opacity = '1';
        tooltip.style.visibility = 'visible';
      }
    });

    el.addEventListener('mouseleave', () => {
      const tooltip = el.querySelector('.icon-tooltip-text');
      if (tooltip) {
        tooltip.style.opacity = '0';
        tooltip.style.visibility = 'hidden';
      }
    });
  });

  // Close mobile menu when clicking on a link
  const mobileLinks = block.querySelectorAll('.menu a');
  mobileLinks.forEach((link) => {
    link.addEventListener('click', () => {
      if (window.innerWidth < 992) {
        mobileMenu?.classList.remove('open');
        burgerMenu?.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  });

  // Handle window resize
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if (window.innerWidth >= 992) {
        // Reset mobile menu state on desktop
        mobileMenu?.classList.remove('open');
        burgerMenu?.classList.remove('open');
        document.body.style.overflow = '';

        // Close all mobile submenus
        block.querySelectorAll('.menu__item.open').forEach((item) => {
          item.classList.remove('open');
        });
      }
    }, 250);
  });
}
