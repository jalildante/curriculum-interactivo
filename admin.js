import { COMPANIES } from "./data/resume.js";

const $ = (sel, ctx = document) => ctx.querySelector(sel);

const companyName = (id) => COMPANIES.find((c) => c.id === id)?.name || id;

function getPassword() {
  return sessionStorage.getItem("admin_password") || "";
}

async function adminFetch(path, options = {}) {
  const res = await fetch(path, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      "x-admin-password": getPassword(),
      ...(options.headers || {}),
    },
  });
  const data = await res.json().catch(() => ({}));
  return { res, data };
}

// ---------------------------------------------------------------------------
// Login
// ---------------------------------------------------------------------------
$("#login-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const pwd = $("#admin-password").value;
  sessionStorage.setItem("admin_password", pwd);

  const status = $("#login-status");
  status.textContent = "Verificando…";

  const { res } = await adminFetch("/api/admin/settings");
  if (res.ok) {
    status.textContent = "";
    $("#login-screen").hidden = true;
    $("#dashboard").hidden = false;
    initDashboard();
  } else {
    sessionStorage.removeItem("admin_password");
    status.textContent = "Contraseña incorrecta o backend no configurado.";
  }
});

// Si ya había sesión en este tab, intenta entrar directo.
if (getPassword()) {
  adminFetch("/api/admin/settings").then(({ res }) => {
    if (res.ok) {
      $("#login-screen").hidden = true;
      $("#dashboard").hidden = false;
      initDashboard();
    }
  });
}

// ---------------------------------------------------------------------------
// Dashboard
// ---------------------------------------------------------------------------
let allComments = [];
let dashboardInit = false;

function initDashboard() {
  if (dashboardInit) return;
  dashboardInit = true;

  $("#open-toggle").addEventListener("change", async (e) => {
    const open = e.target.checked;
    updateToggleDesc(open, true);
    const { res, data } = await adminFetch("/api/admin/settings", {
      method: "POST",
      body: JSON.stringify({ open }),
    });
    if (!res.ok) {
      e.target.checked = !open;
      updateToggleDesc(!open);
      alert(data.message || "No se pudo actualizar.");
    }
  });

  $("#filter-select").addEventListener("change", renderComments);
  $("#refresh-btn").addEventListener("click", loadAll);

  loadAll();
}

function updateToggleDesc(open, saving = false) {
  $("#toggle-desc").textContent = saving
    ? "Guardando…"
    : open
    ? "Abiertos: cualquier visitante puede enviar un nuevo comentario."
    : "Cerrados: no se aceptan comentarios nuevos (los existentes se conservan).";
}

async function loadAll() {
  $("#comments-container").innerHTML = `<p class="admin-sub">Cargando…</p>`;
  const { res, data } = await adminFetch("/api/admin/list");
  if (!res.ok) {
    $("#comments-container").innerHTML = `<p class="admin-status">${data.message || "Error al cargar."}</p>`;
    return;
  }
  allComments = data.comments || [];
  $("#open-toggle").checked = Boolean(data.open);
  updateToggleDesc(Boolean(data.open));
  renderComments();
}

function renderComments() {
  const filter = $("#filter-select").value;
  let list = allComments;
  if (filter === "pending") list = list.filter((c) => !c.approved);
  if (filter === "approved") list = list.filter((c) => c.approved);

  const container = $("#comments-container");
  if (!list.length) {
    container.innerHTML = `<p class="admin-empty">No hay comentarios en esta vista.</p>`;
    return;
  }

  container.innerHTML = list
    .map(
      (c) => `
    <div class="admin-comment ${c.approved ? "approved" : "pending"}" data-id="${c.id}">
      <div class="ac-meta">
        <span><span class="ac-company">${companyName(c.company)}</span> · ${escapeHtml(c.name)}</span>
        <span>${formatDate(c.date)} · ${c.approved ? "Aprobado" : "Pendiente"}</span>
      </div>
      <p class="ac-text">${escapeHtml(c.text)}</p>
      <div class="ac-actions">
        ${c.approved
          ? `<button class="hide-btn" data-action="hide">Ocultar</button>`
          : `<button class="approve-btn" data-action="approve">Aprobar</button>`}
        <button class="delete-btn" data-action="delete">Borrar</button>
      </div>
    </div>`
    )
    .join("");

  container.querySelectorAll(".admin-comment").forEach((el) => {
    const id = el.dataset.id;
    el.querySelector('[data-action="approve"]')?.addEventListener("click", () => setApproved(id, true));
    el.querySelector('[data-action="hide"]')?.addEventListener("click", () => setApproved(id, false));
    el.querySelector('[data-action="delete"]')?.addEventListener("click", () => removeComment(id));
  });
}

async function setApproved(id, approved) {
  const { res, data } = await adminFetch("/api/admin/approve", {
    method: "POST",
    body: JSON.stringify({ id, approved }),
  });
  if (!res.ok) return alert(data.message || "No se pudo actualizar.");
  const item = allComments.find((c) => c.id === id);
  if (item) item.approved = approved;
  renderComments();
}

async function removeComment(id) {
  if (!confirm("¿Borrar este comentario permanentemente?")) return;
  const { res, data } = await adminFetch("/api/admin/delete", {
    method: "POST",
    body: JSON.stringify({ id }),
  });
  if (!res.ok) return alert(data.message || "No se pudo borrar.");
  allComments = allComments.filter((c) => c.id !== id);
  renderComments();
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}
function formatDate(iso) {
  if (!iso) return "";
  try {
    return new Date(iso).toLocaleString("es-MX", { dateStyle: "medium", timeStyle: "short" });
  } catch {
    return "";
  }
}
