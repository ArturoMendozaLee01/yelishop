// CURSOR: desktop + táctil

document.addEventListener("DOMContentLoaded", () => {
  const cursor = document.getElementById("cursor");
  if (!cursor) return;

  // Estado inicial: invisible hasta mover/tocar
  gsap.set(cursor, { x: 0, y: 0, autoAlpha: 0 });

  const setX = gsap.quickTo(cursor, "x", { duration: 0.15, ease: "power3" });
  const setY = gsap.quickTo(cursor, "y", { duration: 0.15, ease: "power3" });

  const show = () => {
    if (gsap.getProperty(cursor, "autoAlpha") === 0) {
      gsap.to(cursor, { autoAlpha: 1, duration: 0.2 });
    }
  };
  const hide = () => gsap.to(cursor, { autoAlpha: 0, duration: 0.2 });

  const supportsPointer = "onpointermove" in window;

  if (supportsPointer) {
    // Escritorio y móviles modernos (Pointer Events)
    window.addEventListener("pointermove", (e) => {
      setX(e.clientX);
      setY(e.clientY);
      show();
    });

    window.addEventListener("pointerdown", () => cursor.classList.add("cursor--down"));
    window.addEventListener("pointerup", () => cursor.classList.remove("cursor--down"));

    document.addEventListener("mouseleave", hide);
    document.addEventListener("mouseenter", show);

    // Hover en elementos interactivos (solo tendrá efecto en desktop)
    const hoverables = ["a","button","[role='button']","input","textarea","select",".interactive"];
    document.addEventListener("mouseover", (e) => {
      if (e.target.closest(hoverables.join(","))) cursor.classList.add("cursor--hover");
    });
    document.addEventListener("mouseout", (e) => {
      if (e.target.closest(hoverables.join(","))) cursor.classList.remove("cursor--hover");
    });
  } else {
    // Fallback para navegadores sin Pointer Events (touch clásico)
    const onTouch = (e) => {
      const t = e.touches && e.touches[0];
      if (!t) return;
      setX(t.clientX);
      setY(t.clientY);
      cursor.classList.add("cursor--down"); // aspecto de "presionado"
      show();
    };
    const onTouchEnd = () => {
      cursor.classList.remove("cursor--down");
      hide();
    };

    document.addEventListener("touchstart", onTouch, { passive: true });
    document.addEventListener("touchmove", onTouch, { passive: true });
    document.addEventListener("touchend", onTouchEnd, { passive: true });
    document.addEventListener("touchcancel", onTouchEnd, { passive: true });
  }
});
