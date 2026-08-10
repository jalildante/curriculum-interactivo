import { PROFILE, SKILLS, EDUCATION, HABITS, COMPANIES, CLIENT_LOGOS } from "./data/resume.js";

const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

// -------------------------------------------------------------------------
// Fallback de logo: si la imagen no carga (o no hay URL), generar un
// avatar con las iniciales de la empresa para que nunca se vea roto.
// -------------------------------------------------------------------------
function initialsAvatar(name) {
  const words = name.split(/\s+/).filter(Boolean);
  const initials =
    words.length >= 2
      ? words.slice(0, 3).map((w) => w[0]).join("").toUpperCase()
      : words[0].slice(0, 3).toUpperCase();
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&length=3&background=0b2545&color=fff&size=128&bold=true`;
}

function logoImg(src, alt, className, initialsOverride) {
  const fallback = initialsAvatar(initialsOverride || alt);
  const url = src && src.trim() ? src : fallback;
  return `<img src="${url}" alt="${alt}" loading="lazy" class="${className || ""}" onerror="this.onerror=null;this.src='${fallback}';" />`;
}

// -------------------------------------------------------------------------
// Render: cabecera / skills / educación / hábitos
// -------------------------------------------------------------------------
function renderProfile() {
  $("#profile-name").textContent = PROFILE.name;
  $("#profile-contact").textContent = `${PROFILE.location} · ${PROFILE.phone} · ${PROFILE.email}`;
  $("#profile-summary").textContent = PROFILE.summary;
  $("#profile-goal").textContent = PROFILE.goal;
  $("#year").textContent = new Date().getFullYear();
}

function renderSkills() {
  $("#skills-list").innerHTML = SKILLS.map((s) => `<li>${s}</li>`).join("");
}

function renderEducation() {
  $("#education-list").innerHTML = EDUCATION.map(
    (e) => `
    <div class="education-item">
      <span class="edu-period">${e.period}</span>
      <h3>${e.title}</h3>
      <p class="edu-place">${e.place}</p>
      ${e.detail ? `<p class="edu-place">${e.detail}</p>` : ""}
    </div>`
  ).join("");
}

function renderHabits() {
  $("#habits-text").textContent = HABITS;
}

// -------------------------------------------------------------------------
// Línea de tiempo
// -------------------------------------------------------------------------
function renderTimeline() {
  const el = $("#timeline");
  el.innerHTML = COMPANIES.map((c, i) => {
    const side = i % 2 === 0 ? "right" : "left";
    return `
    <div class="tl-item ${side}" data-id="${c.id}">
      <div class="tl-node clickable" data-id="${c.id}" role="button" tabindex="0" aria-label="Ver detalle de ${c.name}">
        ${logoImg(c.logo, c.name, "", c.initials)}
      </div>
      <div class="tl-card">
        <span class="tl-period">${c.period}</span>
        <h3>${c.name}</h3>
        <p class="tl-role">${c.role}</p>
        <span class="tl-more">Ver detalle y comentarios →</span>
      </div>
    </div>`;
  }).join("");

  $$(".tl-node", el).forEach((node) => {
    node.addEventListener("click", () => openFocus(node.dataset.id));
    node.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openFocus(node.dataset.id);
      }
    });
  });
}

function setDimmed(activeId) {
  $$(".tl-item").forEach((item) => {
    item.classList.toggle("dimmed", item.dataset.id !== activeId);
  });
}

function clearDimmed() {
  $$(".tl-item").forEach((item) => item.classList.remove("dimmed"));
}

// -------------------------------------------------------------------------
// Overlay de foco (centra una experiencia y oculta el resto)
// -------------------------------------------------------------------------
async function openFocus(id) {
  const company = COMPANIES.find((c) => c.id === id);
  if (!company) return;

  setDimmed(id);

  const overlay = $("#focus-overlay");
  const card = $("#focus-card");

  const clientLogosHtml = (company.clients || [])
    .map((key) => CLIENT_LOGOS[key])
    .filter(Boolean)
    .map((cl) => `<span class="client-logo" title="Cliente: ${cl.name}">${logoImg(cl.logo, cl.name)}</span>`)
    .join("");

  const secondaryLogoHtml = company.secondaryLogo
    ? `<div class="focus-logo focus-logo-secondary" title="${company.secondaryLogo.name}">${logoImg(
        company.secondaryLogo.logo,
        company.secondaryLogo.name
      )}</div>`
    : "";

  card.innerHTML = `
    <button class="focus-close" aria-label="Cerrar">✕</button>
    <div class="focus-header">
      <div class="focus-logo-group">
        <div class="focus-logo">${logoImg(company.logo, company.name, "", company.initials)}</div>
        ${secondaryLogoHtml}
      </div>
      <div>
        <span class="tl-period">${company.period}</span>
        <h3>${company.name}</h3>
        <p class="tl-role">${company.role}</p>
      </div>
    </div>

    ${company.note ? `<p class="focus-note">${company.note}</p>` : ""}

    ${clientLogosHtml ? `
      <div class="client-logos">${clientLogosHtml}</div>
      <p class="client-note">Logos de clientes atendidos durante esta etapa (no son empleadores).</p>
    ` : ""}

    <ul class="bullets">${company.bullets.map((b) => `<li>${b}</li>`).join("")}</ul>

    ${company.achievements && company.achievements.length ? `
      <h4>Logros</h4>
      <div class="achievements">${company.achievements.map((a) => `<p>${a}</p>`).join("")}</div>
    ` : ""}

    <div class="comments-block" id="comments-block">
      <h4>Comentarios sobre esta etapa</h4>
      <div id="comment-list-container"><p class="comment-empty">Cargando comentarios…</p></div>
      <div id="comment-form-container"></div>
    </div>
  `;

  card.querySelector(".focus-close").addEventListener("click", closeFocus);

  overlay.hidden = false;
  document.body.style.overflow = "hidden";
  overlay.addEventListener("click", overlayBackdropClick);
  document.addEventListener("keydown", escToClose);

  loadComments(company.id);
}

function overlayBackdropClick(e) {
  if (e.target.id === "focus-overlay") closeFocus();
}

function escToClose(e) {
  if (e.key === "Escape") closeFocus();
}

function closeFocus() {
  const overlay = $("#focus-overlay");
  overlay.hidden = true;
  document.body.style.overflow = "";
  overlay.removeEventListener("click", overlayBackdropClick);
  document.removeEventListener("keydown", escToClose);
  clearDimmed();
}

// -------------------------------------------------------------------------
// Comentarios: cargar aprobados + formulario de envío
// -------------------------------------------------------------------------
async function loadComments(companyId) {
  const listContainer = $("#comment-list-container");
  const formContainer = $("#comment-form-container");
  if (!listContainer) return;

  try {
    const res = await fetch(`/api/comments?company=${encodeURIComponent(companyId)}`);
    const data = await res.json();

    renderCommentList(listContainer, data.comments || []);
    renderCommentForm(formContainer, companyId, data.open);
  } catch (err) {
    listContainer.innerHTML = `<p class="comment-empty">No se pudieron cargar los comentarios (¿está configurado el backend?).</p>`;
    renderCommentForm(formContainer, companyId, false);
  }
}

function renderCommentList(container, comments) {
  if (!comments.length) {
    container.innerHTML = `<p class="comment-empty">Aún no hay comentarios autorizados para esta etapa.</p>`;
    return;
  }
  container.innerHTML = `<ul class="comment-list">${comments
    .map(
      (c) => `
      <li class="comment-item">
        <span class="c-name">${escapeHtml(c.name)}</span><span class="c-date">${formatDate(c.date)}</span>
        <p class="c-text">${escapeHtml(c.text)}</p>
      </li>`
    )
    .join("")}</ul>`;
}

function renderCommentForm(container, companyId, isOpen) {
  if (!isOpen) {
    container.innerHTML = `<p class="comments-closed">Los comentarios nuevos están cerrados temporalmente para esta etapa.</p>`;
    return;
  }
  container.innerHTML = `
    <form class="comment-form" id="comment-form">
      <input type="text" name="name" placeholder="Tu nombre" required maxlength="80" />
      <textarea name="text" placeholder="Comparte tu comentario sobre esta experiencia..." required maxlength="600"></textarea>
      <button type="submit">Enviar comentario</button>
      <p class="comment-status" id="comment-status"></p>
    </form>
  `;

  $("#comment-form", container).addEventListener("submit", async (e) => {
    e.preventDefault();
    const form = e.target;
    const btn = form.querySelector("button");
    const status = $("#comment-status", form);
    const name = form.name.value.trim();
    const text = form.text.value.trim();
    if (!name || !text) return;

    btn.disabled = true;
    status.textContent = "Enviando…";
    status.className = "comment-status";

    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ company: companyId, name, text }),
      });
      const data = await res.json();
      if (res.ok && data.ok) {
        status.textContent = "¡Gracias! Tu comentario quedó pendiente de aprobación.";
        status.className = "comment-status ok";
        form.reset();
      } else {
        status.textContent = data.message || "No se pudo enviar el comentario.";
        status.className = "comment-status err";
      }
    } catch (err) {
      status.textContent = "Error de conexión. Intenta de nuevo más tarde.";
      status.className = "comment-status err";
    } finally {
      btn.disabled = false;
    }
  });
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

function formatDate(iso) {
  if (!iso) return "";
  try {
    return new Date(iso).toLocaleDateString("es-MX", { year: "numeric", month: "short", day: "numeric" });
  } catch {
    return "";
  }
}

// -------------------------------------------------------------------------
renderProfile();
renderSkills();
renderTimeline();
renderEducation();
renderHabits();
