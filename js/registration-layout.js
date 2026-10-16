// Garder chaque étape entière dans la fenêtre, sans zone de défilement.
export function initRegistrationLayout() {
  const root = document.documentElement;
  const container = document.querySelector(
    ".registration-form-wrapper > .container",
  );
  const card = container.querySelector(".card");
  let frame = 0;

  const fit = () => {
    frame = 0;
    if (!root.classList.contains("registration-page") || !card.offsetHeight)
      return;
    const style = getComputedStyle(container);
    const available =
      container.clientHeight -
      parseFloat(style.paddingTop) -
      parseFloat(style.paddingBottom);
    const setScale = (scale) =>
      card.style.setProperty("--registration-scale", String(scale));
    setScale(1);
    if (card.offsetHeight <= available) return;

    // Conserver toute la largeur et ajuster seulement si l'étape dépasse.
    let lower = 0.05;
    let upper = 1;
    for (let attempt = 0; attempt < 12; attempt++) {
      const scale = (lower + upper) / 2;
      setScale(scale);
      if (card.offsetHeight * scale <= available - 1) lower = scale;
      else upper = scale;
    }
    setScale(lower);
  };
  const schedule = () => {
    if (!frame) frame = requestAnimationFrame(fit);
  };

  const observer = new ResizeObserver(schedule);
  observer.observe(container);
  observer.observe(card);
  observer.observe(document.querySelector(".navbar"));
  window.addEventListener("resize", schedule);
  document.fonts.ready.then(schedule);
}
