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




// === HOME ===
/* 
gsap.from("#home-h1",{
  y:-600,
  duration:1.5,
  ease: Bounce.easeOut,
});

gsap.from("#reflection",{
  y:600,
  duration:1.5,
  ease: Bounce.easeOut,
});

gsap.to("#home-h1",{
  delay:2,
  scale:1.1,
  duration:0.4,
  ease: "elastic.out(1, 0.1)",  
  yoyo:true,
  repeat:3,  
});

gsap.to("#reflection",{
  delay:2,
  scale:1.1,
  duration:0.4,
  ease: "elastic.out(1, 0.1)",
  yoyo:true,
  repeat:3,
}); */

// === HOME (timeline) ===
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
  .from(".menu-item",{
    y:-300,
    ease:"power3.out",
    duration:1,
    stagger:0.25,
  });
