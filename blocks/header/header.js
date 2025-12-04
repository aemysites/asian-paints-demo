/**
 * Asian Paints Header Block
 * Fetches nav content and transforms into styled 3-tier layout
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  // Fetch nav content
  const resp = await fetch('/nav.plain.html');
  if (!resp.ok) {
    // eslint-disable-next-line no-console
    console.error('Failed to load nav:', resp.status);
    return;
  }

    const html = await resp.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

  // nav.plain.html wraps content in a div, get the wrapper's children
  const wrapper = doc.body.querySelector('div') || doc.body;
  const allChildren = [...wrapper.children];
  if (allChildren.length === 0) return;

  // Separate elements by type
  const paragraphs = allChildren.filter((el) => el.tagName === 'P');
  const lists = allChildren.filter((el) => el.tagName === 'UL');

  // Based on nav structure:
  // - First 3 paragraphs with images = brand logos
  // - 4th paragraph with image = main logo
  // - First UL = main navigation
  // - Next paragraphs with images = icon buttons (Search, Store, Profile, Cart)
  // - Paragraph with only text link = CTA button
  // - Second UL = secondary navigation

  const brandLogos = [];
  let mainLogo = null;
  const iconButtons = [];
  let ctaButton = null;

  let imageParaCount = 0;
  paragraphs.forEach((p) => {
    const img = p.querySelector('img');
    const link = p.querySelector('a');
    const hasOnlyTextLink = link && !img && link.textContent.trim().length > 0;

    if (hasOnlyTextLink) {
      ctaButton = p;
    } else if (img) {
      imageParaCount += 1;
      if (imageParaCount <= 3) {
        // First 3 images are brand logos
        brandLogos.push(p);
      } else if (imageParaCount === 4) {
        // 4th image is main logo
        mainLogo = p;
  } else {
        // Rest are icon buttons
        iconButtons.push(p);
      }
    }
  });

  // Get navigation lists
  const mainNav = lists.length > 0 ? lists[0] : null;
  const secondaryNav = lists.length > 1 ? lists[1] : null;

  // Build new structure
  block.textContent = '';

  // 1. Brand Bar
  if (brandLogos.length > 0) {
    const brandBar = document.createElement('div');
    brandBar.className = 'header-brands';

    const brandBarInner = document.createElement('div');
    brandLogos.forEach((logo, idx) => {
      const p = document.createElement('p');
      const existingLink = logo.querySelector('a');

      if (existingLink) {
        p.appendChild(existingLink.cloneNode(true));
      } else {
        const link = document.createElement('a');
        link.href = idx === 0 ? '/' : idx === 1 ? 'https://www.beautifulhomes.asianpaints.com' : 'https://whiteteak.asianpaints.com';
        const img = logo.querySelector('img');
        if (img) link.appendChild(img.cloneNode(true));
        p.appendChild(link);
      }
      brandBarInner.appendChild(p);
    });

    brandBar.appendChild(brandBarInner);
    block.appendChild(brandBar);
  }

  // 2. Main Header
  const mainHeader = document.createElement('div');
  mainHeader.className = 'header-main';

  const mainHeaderInner = document.createElement('div');

  // Logo
  if (mainLogo) {
    const logoP = document.createElement('p');
    logoP.className = 'header-logo';
    const existingLink = mainLogo.querySelector('a');
    if (existingLink) {
      logoP.appendChild(existingLink.cloneNode(true));
    } else {
      const link = document.createElement('a');
      link.href = '/';
      const img = mainLogo.querySelector('img');
      if (img) link.appendChild(img.cloneNode(true));
      logoP.appendChild(link);
    }
    mainHeaderInner.appendChild(logoP);
  }

  // Navigation
  if (mainNav) {
    const nav = mainNav.cloneNode(true);
    nav.className = 'header-nav';
    mainHeaderInner.appendChild(nav);
  }

  // Icon Buttons
  if (iconButtons.length > 0) {
    const actions = document.createElement('div');
    actions.className = 'header-actions';

    iconButtons.forEach((btn) => {
      const img = btn.querySelector('img');
      const alt = img?.getAttribute('alt')?.toLowerCase() || '';
      const link = document.createElement('a');

      if (alt.includes('search')) link.href = '#search';
      else if (alt.includes('store')) link.href = '/store-locator';
      else if (alt.includes('profile')) link.href = '/profile';
      else if (alt.includes('cart')) link.href = '/cart';
      else link.href = '#';

      link.setAttribute('aria-label', img?.getAttribute('alt') || 'Action');
      if (img) link.appendChild(img.cloneNode(true));
      actions.appendChild(link);
    });

    mainHeaderInner.appendChild(actions);
  }

  // CTA Button
  if (ctaButton) {
    const cta = document.createElement('p');
    cta.className = 'header-cta';
    cta.innerHTML = ctaButton.innerHTML;
    mainHeaderInner.appendChild(cta);
  }

  // Hamburger
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

  // 3. Secondary Navigation
  if (secondaryNav) {
    const secNav = document.createElement('div');
    secNav.className = 'header-secondary-nav';
    const secNavInner = document.createElement('div');
    secNavInner.appendChild(secondaryNav.cloneNode(true));
    secNav.appendChild(secNavInner);
    block.appendChild(secNav);
  }

  // Setup interactions
  // Mobile menu toggle
  const hamburgerBtn = block.querySelector('.nav-hamburger button');
  const headerMain = block.querySelector('.header-main');

  if (hamburgerBtn && headerMain) {
    hamburgerBtn.addEventListener('click', () => {
      const expanded = headerMain.getAttribute('aria-expanded') === 'true';
      headerMain.setAttribute('aria-expanded', String(!expanded));
      hamburgerBtn.setAttribute('aria-expanded', String(!expanded));
      document.body.style.overflow = expanded ? '' : 'hidden';
    });
  }

  // Desktop dropdowns
  block.querySelectorAll('.header-nav > li').forEach((item) => {
    const submenu = item.querySelector('ul');
    if (submenu) {
      item.addEventListener('mouseenter', () => {
        if (window.innerWidth >= 992) item.classList.add('active');
      });
      item.addEventListener('mouseleave', () => {
        if (window.innerWidth >= 992) item.classList.remove('active');
      });

      // Mobile toggle
      const link = item.querySelector(':scope > p > a');
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

  // Sticky header
  const header = block.closest('header');
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const scroll = window.pageYOffset;
    if (scroll > 60) header?.classList.add('scrolled');
    else header?.classList.remove('scrolled');

    if (window.innerWidth >= 992) {
      if (scroll > lastScroll && scroll > 200) header?.classList.add('header-hidden');
      else header?.classList.remove('header-hidden');
    }
    lastScroll = scroll;
  });

  // Resize handler
  window.addEventListener('resize', () => {
      if (window.innerWidth >= 992) {
      headerMain?.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      block.querySelectorAll('.header-nav > li.active').forEach((li) => li.classList.remove('active'));
    }
  });
}
