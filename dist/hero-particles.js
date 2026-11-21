(() => {
  const layer = document.querySelector('.hero-lights');
  if (!layer) return;

  const bokehCanvas = layer.querySelector('.hero-bokeh');
  const canvas = layer.querySelector('#particles');
  const backdrop = bokehCanvas.getContext('2d');
  const context = canvas.getContext('2d');
  const atlas = document.createElement('canvas');
  const brush = atlas.getContext('2d');
  if (!backdrop || !context || !brush) return;

  const particleCount = 180;
  const colors = ['0,255,102', '201,255,64'];
  const radii = [0.4, 1.1, 1.9, 3];
  const tile = 44;
  const texture = tile * 2;
  const between = (min, max) => min + Math.random() * (max - min);
  const scatter = () => Math.random() + Math.random() + Math.random() - 1.5;

  // Most lights collect along a shallow arc and in the lower-right foreground.
  function arcPosition(t, spread) {
    return {
      x: .25 + t * .77,
      y: .58 - .32 * Math.sin(Math.PI * t) + .1 * t + scatter() * spread
    };
  }
  const focalPoint = () => ({ x: .75 + scatter() * .12, y: .37 + scatter() * .14 });
  const foreground = () => ({ x: .89 + scatter() * .2, y: .81 + scatter() * .32 });
  function lightPosition() {
    const group = Math.random();
    if (group < .18) return { x: Math.random(), y: Math.random() };
    if (group < .60) {
      const t = Math.random();
      return arcPosition(t, .08 + .13 * t);
    }
    return group < .78 ? focalPoint() : foreground();
  }

  // Paint each glow once at 2x, then stamp the small textures in the animation.
  atlas.width = texture * radii.length;
  atlas.height = texture * colors.length;
  brush.scale(2, 2);
  colors.forEach((rgb, row) => {
    radii.forEach((radius, column) => {
      const x = (column + .5) * tile;
      const y = (row + .5) * tile;
      const glowRadius = 8 + (radius - .4) * 12 / 2.6;
      const glow = brush.createRadialGradient(x, y, 0, x, y, glowRadius);
      glow.addColorStop(0, 'rgba(' + rgb + ',.78)');
      glow.addColorStop(radius / glowRadius, 'rgba(' + rgb + ',.48)');
      glow.addColorStop(.47, 'rgba(' + rgb + ',.07)');
      glow.addColorStop(1, 'rgba(' + rgb + ',0)');
      brush.fillStyle = glow;
      brush.fillRect(x - glowRadius, y - glowRadius, glowRadius * 2, glowRadius * 2);
      brush.fillStyle = 'rgb(' + rgb + ')';
      brush.beginPath();
      brush.arc(x, y, radius, 0, Math.PI * 2);
      brush.fill();
    });
  });

  const particles = Array.from({ length: particleCount }, () => {
    const point = lightPosition();
    const column = Math.floor(Math.pow(Math.random(), 1.3) * radii.length);
    const lime = Math.random() < (point.x > .55 ? .68 : .12);
    return {
      ...point, spriteX: column * texture, spriteY: lime ? texture : 0,
      age: Math.random(), lifetime: between(7, 15), rise: between(65, 150),
      drift: between(-24, 24), phase: between(0, Math.PI * 2), twinkle: between(.45, 1.35),
      opacity: between(.45, 1) * (point.x < .5 ? .62 : 1)
    };
  });

  const hazeColors = ['74,201,55', '118,230,42', '183,246,55', '208,255,126'];
  function bokehLights(count, minRadius, maxRadius, maxAlpha, position = lightPosition) {
    return Array.from({ length: count }, () => ({
      ...position(), radius: between(minRadius, maxRadius), alpha: between(maxAlpha * .23, maxAlpha),
      edge: between(.18, .72), rgb: hazeColors[Math.floor(Math.random() * hazeColors.length)]
    }));
  }
  const bokeh = [
    ...bokehLights(20, 15, 36, .24),
    ...bokehLights(72, 5, 18, .52, foreground),
    ...bokehLights(92, 3, 13, .45),
    ...bokehLights(150, .7, 3.6, .65),
    ...bokehLights(140, .7, 3.2, .85, focalPoint),
    ...bokehLights(160, .45, 2.1, .79, () => arcPosition(Math.random(), .075))
  ];

  let width = 0;
  let height = 0;
  let pixelRatio = 0;
  let elapsed = 0;
  function paintBokeh() {
    const scale = Math.max(.6, Math.min(height / 490, 1.45));
    backdrop.clearRect(0, 0, width, height);
    backdrop.globalCompositeOperation = 'lighter';
    for (const light of bokeh) {
      const x = light.x * width;
      const y = light.y * height;
      const r = light.radius * scale;
      const blur = backdrop.createRadialGradient(x, y, 0, x, y, r);
      blur.addColorStop(0, 'rgba(' + light.rgb + ',' + light.alpha + ')');
      blur.addColorStop(light.edge, 'rgba(' + light.rgb + ',' + light.alpha * .78 + ')');
      blur.addColorStop(1, 'rgba(' + light.rgb + ',0)');
      backdrop.fillStyle = blur;
      backdrop.fillRect(x - r, y - r, r * 2, r * 2);
    }
  }

  function paintParticles() {
    context.clearRect(0, 0, width, height);
    for (const particle of particles) {
      const age = (particle.age + elapsed / particle.lifetime) % 1;
      const x = particle.x * width + (age - .5) * particle.drift;
      const y = particle.y * height + (.5 - age) * particle.rise;
      const fade = Math.min(1, age * 9, (1 - age) * 9);
      const shimmer = .78 + .22 * Math.sin(particle.phase + elapsed * particle.twinkle);
      context.globalAlpha = particle.opacity * fade * shimmer;
      context.drawImage(atlas, particle.spriteX, particle.spriteY, texture, texture,
        x - tile / 2, y - tile / 2, tile, tile);
    }
    context.globalAlpha = 1;
  }

  function resize() {
    const w = layer.clientWidth;
    const h = layer.clientHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    if (!w || !h || (w === width && h === height && dpr === pixelRatio)) return;
    width = w;
    height = h;
    pixelRatio = dpr;
    bokehCanvas.width = width;
    bokehCanvas.height = height;
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    context.setTransform(canvas.width / width, 0, 0, canvas.height / height, 0, 0);
    paintBokeh();
    paintParticles();
  }
  resize();
  if ('ResizeObserver' in window) new ResizeObserver(resize).observe(layer);
  window.addEventListener('resize', resize, { passive: true });

  if (!('IntersectionObserver' in window)) return;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let inView = false;
  let frame = 0;
  let lastPaint = null;
  function animate(now) {
    if (lastPaint === null) lastPaint = now;
    const delta = now - lastPaint;
    if (delta >= 1000 / 30 - .5) {
      elapsed += Math.min(delta / 1000, .1);
      lastPaint = now;
      paintParticles();
    }
    frame = requestAnimationFrame(animate);
  }
  function updatePlayback() {
    if (inView && !document.hidden && !reducedMotion.matches) {
      if (!frame) frame = requestAnimationFrame(animate);
    } else {
      cancelAnimationFrame(frame);
      frame = 0;
      lastPaint = null;
    }
  }
  const visibility = new IntersectionObserver(entries => {
    inView = entries.at(-1).isIntersecting;
    updatePlayback();
  });
  visibility.observe(layer);
  document.addEventListener('visibilitychange', updatePlayback);
  reducedMotion.addEventListener('change', updatePlayback);
})();
