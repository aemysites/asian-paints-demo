/**
 * Asian Paints Header - Transforms flat EDS structure into styled layout
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  // Get the content div (second child of block)
  const rows = [...block.children];
  const contentRow = rows[1]; // The row with all the content

  if (!contentRow) return;

  const children = [...contentRow.children];

  // Find all elements by type
  const paragraphs = children.filter((el) => el.tagName === 'P');
  const lists = children.filter((el) => el.tagName === 'UL');

  // Identify elements by their content/position
  // First 3 paragraphs with pictures are brand logos
  // 4th paragraph with picture is main logo
  // Paragraphs with icons (small images) are action buttons
  // Paragraph with text link is CTA
  // First UL is main nav, second UL is secondary nav

  const brandLogos = [];
  const mainLogo = { element: null };
  const iconButtons = [];
  const ctaButton = { element: null };

  paragraphs.forEach((p, index) => {
    const img = p.querySelector('img');
    const link = p.querySelector('a');

    if (img) {
      const width = parseInt(img.getAttribute('width'), 10) || 0;
      const height = parseInt(img.getAttribute('height'), 10) || 0;

      // Brand logos are wider (129x22), main logo is square-ish (50x32)
      if (width > 100 && height < 30) {
        brandLogos.push(p);
      } else if (width <= 60 && height <= 48 && width > 24) {
        mainLogo.element = p;
      } else if (width <= 24 && height <= 24) {
        iconButtons.push(p);
      }
    } else if (link && !img) {
      // Text link without image is CTA
      ctaButton.element = p;
    }
  });

  const mainNav = lists[0];
  const secondaryNav = lists[1];

  // Clear the block
  block.innerHTML = '';

  // Create Brand Bar
  const brandBar = document.createElement('div');
  brandBar.className = 'header-brands';
  const brandBarInner = document.createElement('div');
  brandLogos.forEach((logo, index) => {
    const wrapper = document.createElement('p');
    wrapper.innerHTML = logo.innerHTML;
    // Wrap in link if not already
    if (!wrapper.querySelector('a')) {
      const link = document.createElement('a');
      if (index === 0) {
        link.href = '/';
      } else if (index === 1) {
        link.href = 'https://www.beautifulhomes.asianpaints.com';
      } else {
        link.href = 'https://whiteteak.asianpaints.com';
      }
      link.innerHTML = wrapper.innerHTML;
      wrapper.innerHTML = '';
      wrapper.appendChild(link);
    }
    brandBarInner.appendChild(wrapper);
  });
  brandBar.appendChild(brandBarInner);
  block.appendChild(brandBar);

  // Create Main Header
  const mainHeader = document.createElement('div');
  mainHeader.className = 'header-main';
  const mainHeaderInner = document.createElement('div');

  // Add main logo
  if (mainLogo.element) {
    const logoWrapper = document.createElement('p');
    logoWrapper.className = 'header-logo';
    // Wrap in link
    const logoLink = document.createElement('a');
    logoLink.href = '/';
    logoLink.innerHTML = mainLogo.element.innerHTML;
    logoWrapper.appendChild(logoLink);
    mainHeaderInner.appendChild(logoWrapper);
  }

  // Add main navigation
  if (mainNav) {
    mainNav.className = 'header-nav';
    mainHeaderInner.appendChild(mainNav);
  }

  // Add icon buttons
  const actionsWrapper = document.createElement('div');
  actionsWrapper.className = 'header-actions';
  iconButtons.forEach((btn) => {
    const img = btn.querySelector('img');
    const alt = img?.getAttribute('alt') || '';
    const wrapper = document.createElement('a');
    wrapper.href = '#';
    wrapper.setAttribute('aria-label', alt);

    if (alt.toLowerCase().includes('search')) {
      wrapper.href = '#search';
    } else if (alt.toLowerCase().includes('store')) {
      wrapper.href = '/store-locator';
    } else if (alt.toLowerCase().includes('profile')) {
      wrapper.href = '/profile';
    } else if (alt.toLowerCase().includes('cart')) {
      wrapper.href = '/cart';
    }

    wrapper.innerHTML = btn.innerHTML;
    actionsWrapper.appendChild(wrapper);
  });
  mainHeaderInner.appendChild(actionsWrapper);

  // Add CTA button
  if (ctaButton.element) {
    const ctaWrapper = document.createElement('p');
    ctaWrapper.className = 'header-cta';
    ctaWrapper.innerHTML = ctaButton.element.innerHTML;
    mainHeaderInner.appendChild(ctaWrapper);
  }

  // Add hamburger menu
  const hamburger = document.createElement('p');
  hamburger.className = 'nav-hamburger';
  hamburger.innerHTML = `
    <button type="button" aria-controls="nav" aria-label="Open navigation" aria-expanded="false">
      <span class="nav-hamburger-icon"></span>
    </button>
  `;
  mainHeaderInner.appendChild(hamburger);

  mainHeader.appendChild(mainHeaderInner);
  block.appendChild(mainHeader);

  // Create Secondary Navigation
  if (secondaryNav) {
    const secondaryNavWrapper = document.createElement('div');
    secondaryNavWrapper.className = 'header-secondary-nav';
    const secondaryNavInner = document.createElement('div');
    secondaryNavInner.appendChild(secondaryNav);
    secondaryNavWrapper.appendChild(secondaryNavInner);
    block.appendChild(secondaryNavWrapper);
  }

  // Setup mobile menu toggle
  const hamburgerBtn = block.querySelector('.nav-hamburger button');
  const headerMain = block.querySelector('.header-main');

  if (hamburgerBtn && headerMain) {
    hamburgerBtn.addEventListener('click', () => {
      const isExpanded = headerMain.getAttribute('aria-expanded') === 'true';
      headerMain.setAttribute('aria-expanded', !isExpanded);
      hamburgerBtn.setAttribute('aria-expanded', !isExpanded);
      document.body.style.overflow = isExpanded ? '' : 'hidden';
    });
  }

  // Setup desktop navigation dropdowns
  const navItems = block.querySelectorAll('.header-nav > li');
  navItems.forEach((item) => {
    const submenu = item.querySelector('ul');

    if (submenu) {
      // Desktop hover
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

      // Mobile click
      const link = item.querySelector(':scope > p > a, :scope > a');
      if (link) {
        link.addEventListener('click', (e) => {
          if (window.innerWidth < 992) {
            e.preventDefault();
            item.classList.toggle('active');
          }
        });
      }
    }
  });

  // Sticky header behavior
  let lastScroll = 0;
  const headerElement = block.closest('header');

  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 60) {
      headerElement?.classList.add('scrolled');
    } else {
      headerElement?.classList.remove('scrolled');
    }

    if (window.innerWidth >= 992) {
      if (currentScroll > lastScroll && currentScroll > 200) {
        headerElement?.classList.add('header-hidden');
      } else {
        headerElement?.classList.remove('header-hidden');
      }
    }

    lastScroll = currentScroll;
  });

  // Handle resize
  window.addEventListener('resize', () => {
    if (window.innerWidth >= 992) {
      headerMain?.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
      block.querySelectorAll('.header-nav > li.active').forEach((item) => {
        item.classList.remove('active');
      });
    }
  });
}
