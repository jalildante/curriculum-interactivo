import { listApprovedComments, addComment, getCommentsOpen } from "../lib/sheets.js";

function isValidCompany(v) {
  return typeof v === "string" && /^[a-z0-9-]{1,60}$/.test(v);
}

export default async function handler(req, res) {
  try {
    if (req.method === "GET") {
      const company = req.query.company;
      if (!isValidCompany(company)) {
        return res.status(400).json({ ok: false, message: "Empresa inválida." });
      }
      const [comments, open] = await Promise.all([listApprovedComments(company), getCommentsOpen()]);
      return res.status(200).json({ ok: true, comments, open });
    }

    if (req.method === "POST") {
      const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body || {};
      const { company, name, text } = body;

      if (!isValidCompany(company)) {
        return res.status(400).json({ ok: false, message: "Empresa inválida." });
      }
      const cleanName = typeof name === "string" ? name.trim().slice(0, 80) : "";
      const cleanText = typeof text === "string" ? text.trim().slice(0, 600) : "";
      if (!cleanName || !cleanText) {
        return res.status(400).json({ ok: false, message: "Nombre y comentario son obligatorios." });
      }

      const open = await getCommentsOpen();
      if (!open) {
        return res.status(403).json({ ok: false, message: "Los comentarios están cerrados temporalmente." });
      }

      await addComment({ company, name: cleanName, text: cleanText });
      return res.status(201).json({ ok: true, message: "Comentario enviado, queda pendiente de aprobación." });
    }

    res.setHeader("Allow", "GET, POST");
    return res.status(405).json({ ok: false, message: "Método no permitido." });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ok: false, message: "Error del servidor." });
  }
}
