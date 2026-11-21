const techStrip = document.querySelector('.tech-strip');
const techLogos = techStrip.querySelector('.tech-logos');
const repeatedLogos = techLogos.cloneNode(true);
repeatedLogos.setAttribute('aria-hidden', 'true');
techLogos.after(repeatedLogos);
techStrip.classList.add('is-looping');
