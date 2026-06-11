// ─── Traducciones ─────────────────────────────────────────────────────────────
let idiomaActual = "es";

function aplicarIdioma(lang) {
  idiomaActual = lang;

  // Traducciones
  document.querySelectorAll("[data-es]").forEach((el) => {
    const texto = el.getAttribute(`data-${lang}`);
    if (texto !== null) el.innerHTML = texto;
  });

  // Botón idioma
  const btn = document.getElementById("btnIdioma"); // ← mover aquí
  const langText = document.getElementById("langText");
  if (btn && langText) {
    // ← verificar ambos
    btn.classList.add("switching");
    setTimeout(() => {
      langText.textContent = lang === "es" ? "ES" : "EN";
      btn.classList.remove("switching");
    }, 120);
  }

  // CV según idioma
  const btnCV = document.getElementById("btnCV");
  if (btnCV) {
    if (lang === "es") {
      btnCV.href = "cv-desarrollador-soft/curriculum-cv-gilberto-ES.pdf";
      btnCV.download = "curriculum-cv-gilberto-ES.pdf";
    } else {
      btnCV.href = "cv-desarrollador-soft/curriculum-cv-gilberto-EN.pdf";
      btnCV.download = "curriculum-cv-gilberto-EN.pdf";
    }
  }

  localStorage.setItem("idioma", lang);
}

// ─── Toggle ───────────────────────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("btnIdioma");

  if (btn) {
    btn.addEventListener("click", () => {
      const nuevoIdioma = idiomaActual === "es" ? "en" : "es";
      aplicarIdioma(nuevoIdioma);
    });
  }

  const guardado = localStorage.getItem("idioma") || "es";
  aplicarIdioma(guardado);
});
