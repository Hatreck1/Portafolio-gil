(() => {
  const form = document.getElementById("contactoForm");
  if (!form) return;

  const sanitize = (s) =>
    String(s || "")
      .replace(/[<>"'`]/g, "")
      .trim();

  const soloLetras = (s) => /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s'-]{2,60}$/.test(s);

  const emailOk = (s) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(s);

  const C = {
    nombre: {
      el: document.getElementById("nombre"),
      err: document.getElementById("err-nombre"),
    },
    apellido: {
      el: document.getElementById("apellido"),
      err: document.getElementById("err-apellido"),
    },
    email: {
      el: document.getElementById("email"),
      err: document.getElementById("err-email"),
    },
    asunto: {
      el: document.getElementById("asunto"),
      err: document.getElementById("err-asunto"),
    },
    mensaje: {
      el: document.getElementById("mensaje"),
      err: document.getElementById("err-mensaje"),
    },
  };

  const setError = (k, msg) => {
    if (!C[k]) return;
    C[k].el.classList.add("error");
    C[k].el.classList.remove("ok");
    if (C[k].err) {
      C[k].err.textContent = msg;
      C[k].err.classList.add("visible");
    }
  };

  const clearError = (k) => {
    if (!C[k]) return;
    C[k].el.classList.remove("error");
    if (C[k].err) C[k].err.classList.remove("visible");
  };

  const setOk = (k) => {
    if (!C[k]) return;
    C[k].el.classList.remove("error");
    C[k].el.classList.add("ok");
    if (C[k].err) C[k].err.classList.remove("visible");
  };

  function validateField(k) {
    const value = sanitize(C[k].el.value);

    switch (k) {
      case "nombre":
        if (!value) {
          setError("nombre", "El nombre es obligatorio.");
          return false;
        }
        if (!soloLetras(value)) {
          setError("nombre", "Solo letras y espacios (mínimo 2 caracteres).");
          return false;
        }
        setOk("nombre");
        return true;

      case "apellido":
        if (value && !soloLetras(value)) {
          setError("apellido", "Solo se permiten letras y espacios.");
          return false;
        }
        clearError("apellido");
        return true;

      case "email": {
        const raw = C.email.el.value.trim(); // sin sanitize, para no romper el @
        if (!raw) {
          setError("email", "El correo es obligatorio.");
          return false;
        }
        if (!emailOk(raw)) {
          setError("email", "Correo electrónico inválido.");
          return false;
        }
        setOk("email");
        return true;
      }

      case "asunto":
        if (!C.asunto.el.value) {
          setError("asunto", "Selecciona un asunto.");
          return false;
        }
        setOk("asunto");
        return true;

      case "mensaje":
        if (value.length < 10) {
          setError("mensaje", "El mensaje debe tener al menos 10 caracteres.");
          return false;
        }
        setOk("mensaje");
        return true;
    }

    return true;
  }

  Object.keys(C).forEach((k) => {
    if (!C[k].el) return;
    C[k].el.addEventListener("blur", () => validateField(k));
    C[k].el.addEventListener("input", () => validateField(k));
  });

  const mensajeEl = document.getElementById("mensaje");
  const contador = document.getElementById("charCount");
  if (mensajeEl && contador) {
    mensajeEl.addEventListener("input", () => {
      const total = mensajeEl.value.length;
      contador.textContent = total;
      contador.style.color = total >= 790 ? "#E24B4A" : "#00684a";
    });
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const trampa = form.querySelector(".campo-trampa");
    if (trampa && trampa.value) return;

    let valido = true;
    ["nombre", "apellido", "email", "asunto", "mensaje"].forEach((campo) => {
      if (!validateField(campo)) valido = false;
    });

    const politica = document.getElementById("politica");
    const errPolitica = document.getElementById("err-politica");
    if (!politica.checked) {
      errPolitica.classList.add("visible");
      valido = false;
    } else {
      errPolitica.classList.remove("visible");
    }

    if (!valido) return;

    const btn = document.getElementById("btnEnviar");
    const txt = document.getElementById("btnTxt");
    const errMsg = document.getElementById("formErrorMsg");
    const lang = document.documentElement.lang === "en";

    btn.disabled = true;
    txt.textContent = lang ? "Sending..." : "Enviando...";
    errMsg.classList.remove("visible");

    // ── Construir FormData ──────────────────────────────────────────
    const fd = new FormData();
    fd.append("nombre", sanitize(C.nombre.el.value));
    fd.append("apellido", sanitize(C.apellido.el.value));
    fd.append("email", sanitize(C.email.el.value));
    fd.append("asunto", sanitize(C.asunto.el.value));
    fd.append("mensaje", sanitize(C.mensaje.el.value));
    // Campos de control de FormSubmit
    fd.append(
      "_subject",
      `Contacto Portfolio – ${sanitize(C.asunto.el.value)}`,
    );
    fd.append("_captcha", "false");
    fd.append("_template", "table");
    // Evita redirección al enviar con fetch
    fd.append("_next", window.location.href);

    const resetBtn = () => {
      btn.disabled = false;
      txt.textContent = lang ? "Send message" : "Enviar mensaje";
    };

    try {
      const res = await fetch(
        "https://formsubmit.co/ajax/linkzama12@gmail.com",
        {
          method: "POST",
          headers: { Accept: "application/json" },
          body: fd,
        },
      );

      // FormSubmit devuelve JSON: { success: "true", message: "..." }
      const data = await res.json().catch(() => null);
      const ok = res.ok && data && data.success === "true";

      if (ok) {
        form.style.display = "none";
        document.getElementById("formSuccess").classList.add("visible");
      } else {
        console.error("FormSubmit response:", res.status, data);
        resetBtn();
        errMsg.classList.add("visible");
      }
    } catch (err) {
      console.error("Fetch error:", err);
      resetBtn();
      errMsg.classList.add("visible");
    }
  });
})();
