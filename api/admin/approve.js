import { requireAdmin } from "../../lib/auth.js";
import { setCommentApproved } from "../../lib/sheets.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ ok: false, message: "Método no permitido." });
  }
  if (!requireAdmin(req, res)) return;

  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body || {};
    const { id, approved } = body;
    if (!id) return res.status(400).json({ ok: false, message: "Falta el id del comentario." });

    const found = await setCommentApproved(id, Boolean(approved));
    if (!found) return res.status(404).json({ ok: false, message: "Comentario no encontrado." });

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ok: false, message: "Error del servidor." });
  }
}
