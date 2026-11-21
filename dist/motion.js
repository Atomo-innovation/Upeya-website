if ('IntersectionObserver' in window) {
  const motion = window.matchMedia('(prefers-reduced-motion: no-preference)');
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      observer.unobserve(entry.target);
      if (motion.matches) entry.target.classList.add('is-entering');
    }
  }, { threshold: 0.08 });

  document.querySelectorAll('.hero-inner, .service, .process-steps > li')
    .forEach(element => observer.observe(element));

  // Changing the preference should only affect entrances the visitor has yet to see.
  motion.addEventListener('change', () => {
    document.querySelectorAll('.is-entering').forEach(element => element.classList.remove('is-entering'));
  });

  const diagram = document.querySelector('.device-steps');
  if (diagram) {
    const threshold = 0.5;
    let inView = false;

    function updatePlayback() {
      diagram.classList.toggle('is-playing', inView && !document.hidden);
    }

    const visibility = new IntersectionObserver(entries => {
      const entry = entries.at(-1);
      inView = entry.isIntersecting && entry.intersectionRatio >= threshold;
      updatePlayback();
    }, { threshold });
    document.addEventListener('visibilitychange', updatePlayback);
    diagram.classList.add('is-looping');
    visibility.observe(diagram);
  }
}
