const menu = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.nav');
const header = document.querySelector('.header');
const links = [...navigation.querySelectorAll('a')];
const sections = links.map(link => document.querySelector(link.hash));
const compact = window.matchMedia('(max-width: 800px)');

function setMenu(open) {
  menu.setAttribute('aria-expanded', String(open));
  menu.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
  navigation.classList.toggle('is-open', open);
}

document.documentElement.classList.add('enhanced');
menu.addEventListener('click', () => setMenu(menu.getAttribute('aria-expanded') === 'false'));
document.addEventListener('click', event => {
  if (!header.contains(event.target) || event.target.closest('a')) setMenu(false);
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && menu.getAttribute('aria-expanded') === 'true') {
    setMenu(false);
    menu.focus();
  }
});
header.addEventListener('focusout', event => {
  if (!header.contains(event.relatedTarget)) setMenu(false);
});
compact.addEventListener('change', () => setMenu(false));

function updateLocation() {
  const boundary = header.offsetHeight + 30;
  let active = sections[0];
  for (const section of sections) {
    if (section.getBoundingClientRect().top <= boundary) active = section;
  }
  if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2) active = sections.at(-1);
  for (const link of links) {
    if (link.hash === '#' + active.id) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  }
}

let scheduled = false;
function scheduleUpdate() {
  if (scheduled) return;
  scheduled = true;
  requestAnimationFrame(() => {
    updateLocation();
    scheduled = false;
  });
}
window.addEventListener('scroll', scheduleUpdate, {passive: true});
window.addEventListener('resize', scheduleUpdate);
window.addEventListener('load', updateLocation);
updateLocation();
