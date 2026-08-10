// ============================================================================
// Conector a Google Sheets: aquí vive TODA la lógica de acceso a datos.
// El "repositorio" de comentarios es una hoja de cálculo de Google Sheets,
// leída/escrita con una cuenta de servicio (service account).
//
// Variables de entorno requeridas (configúralas en Vercel, ver README.md):
//   GOOGLE_SERVICE_ACCOUNT_EMAIL
//   GOOGLE_PRIVATE_KEY
//   GOOGLE_SHEET_ID
//   ADMIN_PASSWORD
// ============================================================================

import { GoogleSpreadsheet } from "google-spreadsheet";
import { JWT } from "google-auth-library";
import { randomUUID } from "node:crypto";

const COMMENTS_HEADERS = ["id", "company", "name", "text", "date", "approved"];
const SETTINGS_HEADERS = ["key", "value"];

let cachedDoc = null;

function getEnv(name) {
  const v = process.env[name];
  if (!v) throw new Error(`Falta la variable de entorno ${name}. Revisa la configuración en Vercel.`);
  return v;
}

async function getDoc() {
  if (cachedDoc) return cachedDoc;

  const auth = new JWT({
    email: getEnv("GOOGLE_SERVICE_ACCOUNT_EMAIL"),
    key: getEnv("GOOGLE_PRIVATE_KEY").replace(/\\n/g, "\n"),
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  const doc = new GoogleSpreadsheet(getEnv("GOOGLE_SHEET_ID"), auth);
  await doc.loadInfo();
  cachedDoc = doc;
  return doc;
}

async function getOrCreateSheet(doc, title, headers) {
  let sheet = doc.sheetsByTitle[title];
  if (!sheet) {
    return doc.addSheet({ title, headerValues: headers });
  }
  try {
    await sheet.loadHeaderRow();
  } catch {
    // La pestaña existe pero aún no tiene fila de encabezados (ej. recién creada a mano)
    await sheet.setHeaderRow(headers);
  }
  return sheet;
}

async function getCommentsSheet() {
  const doc = await getDoc();
  return getOrCreateSheet(doc, "Comments", COMMENTS_HEADERS);
}

async function getSettingsSheet() {
  const doc = await getDoc();
  return getOrCreateSheet(doc, "Settings", SETTINGS_HEADERS);
}

// Google Sheets convierte automáticamente "TRUE"/"FALSE" en casillas de
// verificación (booleanas) al guardarlas, así que al leerlas de vuelta
// pueden venir como boolean true/false o como texto "TRUE"/"FALSE".
function isTrueValue(v) {
  return v === true || v === "TRUE" || v === "true";
}

// ---------------------------------------------------------------------------
// Settings (abierto/cerrado global de comentarios)
// ---------------------------------------------------------------------------
export async function getCommentsOpen() {
  const sheet = await getSettingsSheet();
  const rows = await sheet.getRows();
  const row = rows.find((r) => r.get("key") === "commentsOpen");
  if (!row) {
    // por defecto: abiertos
    await sheet.addRow({ key: "commentsOpen", value: "TRUE" });
    return true;
  }
  return isTrueValue(row.get("value"));
}

export async function setCommentsOpen(open) {
  const sheet = await getSettingsSheet();
  const rows = await sheet.getRows();
  const row = rows.find((r) => r.get("key") === "commentsOpen");
  if (row) {
    row.set("value", open ? "TRUE" : "FALSE");
    await row.save();
  } else {
    await sheet.addRow({ key: "commentsOpen", value: open ? "TRUE" : "FALSE" });
  }
}

// ---------------------------------------------------------------------------
// Comentarios
// ---------------------------------------------------------------------------
function serializeRow(row) {
  return {
    id: row.get("id"),
    company: row.get("company"),
    name: row.get("name"),
    text: row.get("text"),
    date: row.get("date"),
    approved: isTrueValue(row.get("approved")),
  };
}

export async function listApprovedComments(company) {
  const sheet = await getCommentsSheet();
  const rows = await sheet.getRows();
  return rows
    .map(serializeRow)
    .filter((c) => c.company === company && c.approved)
    .sort((a, b) => new Date(b.date) - new Date(a.date));
}

export async function listAllComments() {
  const sheet = await getCommentsSheet();
  const rows = await sheet.getRows();
  return rows.map(serializeRow).sort((a, b) => new Date(b.date) - new Date(a.date));
}

export async function addComment({ company, name, text }) {
  const sheet = await getCommentsSheet();
  const row = {
    id: randomUUID(),
    company,
    name,
    text,
    date: new Date().toISOString(),
    approved: "FALSE",
  };
  await sheet.addRow(row);
  return row;
}

export async function setCommentApproved(id, approved) {
  const sheet = await getCommentsSheet();
  const rows = await sheet.getRows();
  const row = rows.find((r) => r.get("id") === id);
  if (!row) return false;
  row.set("approved", approved ? "TRUE" : "FALSE");
  await row.save();
  return true;
}

export async function deleteComment(id) {
  const sheet = await getCommentsSheet();
  const rows = await sheet.getRows();
  const row = rows.find((r) => r.get("id") === id);
  if (!row) return false;
  await row.delete();
  return true;
}
  

