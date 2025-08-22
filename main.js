// CURSOR: solo desktop 

document.addEventListener("DOMContentLoaded", () => {
  const cursor = document.getElementById("cursor");
  if (!cursor) return;

  const isCoarse = window.matchMedia("(pointer: coarse)").matches;
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Salir en táctiles o si el usuario prefiere menos movimiento
  if (isCoarse || prefersReduced) {
    cursor.style.display = "none";
    return;
  }

  // Estado inicial
  gsap.set(cursor, { x: 0, y: 0, autoAlpha: 0 });

  // Movimiento suave
  const setX = gsap.quickTo(cursor, "x", { duration: 0.15, ease: "power3" });
  const setY = gsap.quickTo(cursor, "y", { duration: 0.15, ease: "power3" });

  const show = () => {
    if (gsap.getProperty(cursor, "autoAlpha") === 0) {
      gsap.to(cursor, { autoAlpha: 1, duration: 0.2 });
    }
  };
  const hide = () => gsap.to(cursor, { autoAlpha: 0, duration: 0.2 });

  // Pointer Events (desktop)
  window.addEventListener("pointermove", (e) => {
    setX(e.clientX);
    setY(e.clientY);
    show();
  });

  window.addEventListener("pointerdown", () => cursor.classList.add("cursor--down"));
  window.addEventListener("pointerup", () => cursor.classList.remove("cursor--down"));

  document.addEventListener("mouseleave", hide);
  document.addEventListener("mouseenter", show);

  // Hover sobre elementos interactivos (desktop)
  const hoverables = ["a","button","[role='button']","input","textarea","select",".interactive"];
  document.addEventListener("mouseover", (e) => {
    if (e.target.closest(hoverables.join(","))) cursor.classList.add("cursor--hover");
  });
  document.addEventListener("mouseout", (e) => {
    if (e.target.closest(hoverables.join(","))) cursor.classList.remove("cursor--hover");
  });
});

/* =========================
   Sección Menu
   Requiere: GSAP 3.12+
   ========================= */


const toggle = document.getElementById('menuToggle');
const menu = document.getElementById('menu');
const items = menu.querySelectorAll('li');

const tl = gsap.timeline({ paused: true, reversed: true });


tl.to(menu, {
  y: 0,
  duration: 0.5,
  ease: "power4.out"
}).from(items, {    
  opacity: 0,
  y: 40,
  duration: 0.5,
  ease: "power2.out",
  stagger: 0.1
}, "-=0.3");

toggle.addEventListener('click', () => {
tl.reversed() ? tl.play() : tl.reverse();
});


// Navegar al seleccionar una opción del menú (desktop y móvil)
menu.addEventListener('click', (e) => {
  const link = e.target.closest('a');
  if (!link) return;

  const href = link.getAttribute('href');
  if (!href || !href.startsWith('#')) return;

  e.preventDefault();

  const go = () => {
    const section = document.querySelector(href);
    if (section) {
      gsap.to(window, {        
        duration: 2.5,      // controla la velocidad
        ease: "power2.inOut",
        scrollTo: { y: section, offsetY: 0, autoKill:false, }
      });

      /* section.scrollIntoView({ behavior: 'smooth', block: 'start' }); */
    }
    // Limpia el callback para no acumularlo
    tl.eventCallback('onReverseComplete', null);
  };

  // Si el menú está abierto, ciérralo y luego navega; si ya está cerrado, navega directo
  if (!tl.reversed()) {
    tl.eventCallback('onReverseComplete', go);
    tl.reverse();
  } else {
    go();
  }
});

   

/* =========================
   Sección Home
   Requiere: GSAP 3.12+
   ========================= */

const tlHome = gsap.timeline({ defaults: { ease: "bounce.out" } });

tlHome
  .from("#home-h1", { y: -600, duration: 1.5 })
  .from("#reflection", { y: 600, duration: 1.5 }, "<")
  .to("#home-h1", {
    scale: 1.1,
    duration: 0.4,
    ease: "elastic.out(1, 0.1)",
    yoyo: true,
    repeat: 1,
  }, 2)
  .to("#reflection", {
    scale: 1.1,
    duration: 0.4,
    ease: "elastic.out(1, 0.1)",
    yoyo: true,
    repeat: 1
  }, "<")
  .from("#menuToggle",{
    y:-300,        
    ease: "bounce.in",
  });






/* =========================
   Sección 2: Sticky
   Requiere: GSAP 3.12+ y ScrollTrigger
   ========================= */


(function(){
  if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") return;
  gsap.registerPlugin(ScrollTrigger);

  // Lenis opcional si el proyecto ya lo usa:
  try{
    if (typeof Lenis !== "undefined" && !window.__lenis_init__){
      const lenis = new Lenis();
      window.__lenis_init__ = true;
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add((time) => lenis.raf(time * 1000));
      gsap.ticker.lagSmoothing(0);
    }
  }catch(e){ /* silenciar si no está disponible */ }

  const stickySection = document.querySelector(".sticky");
  const stickyHeader  = document.querySelector(".sticky-header");
  const cards         = document.querySelectorAll(".sticky .card");
  if(!stickySection || !stickyHeader || !cards.length) return;

  const stickyHeight = window.innerHeight * 5;

  // Trayectorias Y y rotaciones por tarjeta
  const transforms = [
    [[10, 50, -10, 10], [20, -10, -45, 20]],
    [[0, 47.5, -10, 15], [-25, 15, -45, 30]],
    [[0, 52.5, -10, 5], [15, -5, -40, 60]],
    [[0, 50, 30, -80], [20, -10, 60, 5]],
    [[0, 55, -15, 30], [25, -15, 60, 95]],
  ];

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const st = ScrollTrigger.create({
    trigger: stickySection,
    start: "top top",
    end: `+=${stickyHeight}px`,
    pin: true,
    pinSpacing: true,
    onUpdate: (self) => {
      if (prefersReduced) return;

      const progress = self.progress;

      // Mover el H1 horizontalmente (ancho extra en CSS)
      const maxTranslate = stickyHeader.scrollWidth - window.innerWidth;
      const translateX = -progress * maxTranslate;
      gsap.set(stickyHeader, { x: translateX });

      // Animar tarjetas
      cards.forEach((card, index) => {
        const delay = index * 0.1125;
        const cardProgress = gsap.utils.clamp(0, 1, (progress - delay) * 2);

        if (cardProgress > 0){
          const cardStartX = 25;   // xPercent inicial (entra desde la derecha)
          const cardEndX   = -650; // xPercent final (sale a la izquierda)
          const yPos       = transforms[index][0] || [0,0,0,0];
          const rotations  = transforms[index][1] || [0,0,0,0];

          const cardX = gsap.utils.interpolate(cardStartX, cardEndX, cardProgress);

          const yProgress = cardProgress * 3;
          const yIndex = Math.min(
            Math.floor(yProgress),
            yPos.length - 2,
            rotations.length - 2
          );
          const yInterpolation = yProgress - yIndex;

          const cardY = gsap.utils.interpolate(
            yPos[yIndex],
            yPos[yIndex + 1],
            yInterpolation
          );

          const cardRotation = gsap.utils.interpolate(
            rotations[yIndex],
            rotations[yIndex + 1],
            yInterpolation
          );

          gsap.set(card, {
            xPercent: cardX,
            yPercent: cardY,
            rotation: cardRotation,
            opacity: 1
          });
        }else{
          gsap.set(card, { opacity: 0 });
        }
      });
    }
  });

  if (prefersReduced){
    st.disable(false);
    // Estado estático accesible
    gsap.set(stickyHeader, { clearProps: "all" });
    cards.forEach((card, i) => {
      gsap.set(card, { opacity: 1, xPercent: 0, yPercent: 0, rotation: 0 });
    });
  }

  // Recalcular al cambiar tamaño de ventana
  window.addEventListener("resize", () => ScrollTrigger.refresh());
})();





