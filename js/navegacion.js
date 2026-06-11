// ─── Secciones disponibles ───────────────────────────────────────────────────
const SECCIONES = ["inicio", "about", "projects", "certificados", "contacto"];

// Todas las secciones del DOM (excepto footer)
const seccionesDOM = [
  { id: "inicio", selector: ".hero" },
  { id: "about", selector: ".about, .info-extra, .skills-section" },
  { id: "projects", selector: ".proyectos" },
  { id: "certificados", selector: ".certificados" },
  { id: "contacto", selector: ".contacto-section" },
];

// ─── Mostrar sección activa ───────────────────────────────────────────────────
function mostrarSeccion(idActivo) {
  seccionesDOM.forEach(({ id, selector }) => {
    const elementos = document.querySelectorAll(selector);
    elementos.forEach((el) => {
      if (id === idActivo) {
        el.style.display = "";
        el.classList.remove("seccion-oculta");
      } else {
        el.style.display = "none";
        el.classList.add("seccion-oculta");
      }
    });
  });

  // Actualizar links activos en navbar
  document.querySelectorAll(".nav-links a").forEach((link) => {
    link.classList.remove("active");
    const href = link.getAttribute("href"); // e.g. "#inicio"
    if (href === `#${idActivo}`) link.classList.add("active");
  });

  // Guardar estado
  localStorage.setItem("seccionActiva", idActivo);

  // Scroll al top
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// ─── Interceptar clics en nav-links ──────────────────────────────────────────
function inicializarNavegacion() {
  document.querySelectorAll(".nav-links a, .nav-logo-link").forEach((link) => {
    link.addEventListener("click", (e) => {
      const href = link.getAttribute("href");
      if (!href || !href.startsWith("#")) return;
      e.preventDefault();

      const id = href.replace("#", "");
      if (SECCIONES.includes(id)) {
        mostrarSeccion(id);
        cerrarMenu();
      }
    });
  });
}

// ─── Hamburger menu ───────────────────────────────────────────────────────────
function cerrarMenu() {
  const burger = document.querySelector(".nav-hamburger");
  const links = document.querySelector(".nav-links");
  if (burger) burger.classList.remove("open");
  if (links) links.classList.remove("open");
}

function inicializarHamburger() {
  const burger = document.querySelector(".nav-hamburger");
  const links = document.querySelector(".nav-links");
  if (!burger || !links) return;

  burger.addEventListener("click", () => {
    burger.classList.toggle("open");
    links.classList.toggle("open");
  });

  // Cerrar al hacer clic fuera
  document.addEventListener("click", (e) => {
    if (!burger.contains(e.target) && !links.contains(e.target)) {
      cerrarMenu();
    }
  });
}

// ─── Navegación desde proyectos (volver) ──────────────────────────────────────
document.querySelectorAll(".proyecto-card").forEach((card) => {
  card.addEventListener("click", () => {
    localStorage.setItem("volverA", "projects");
  });
});

// ─── Inicializar al cargar ────────────────────────────────────────────────────
window.addEventListener("DOMContentLoaded", () => {
  inicializarNavegacion();
  inicializarHamburger();

  // Revisar si hay que volver a proyectos
  const volver = localStorage.getItem("volverA");
  if (volver === "projects") {
    localStorage.removeItem("volverA");
    mostrarSeccion("projects");
    return;
  }

  // Restaurar última sección visitada (o inicio por defecto)
  const ultima = localStorage.getItem("seccionActiva") || "inicio";
  mostrarSeccion(ultima);
});
