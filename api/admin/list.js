import { requireAdmin } from "../../lib/auth.js";
import { listAllComments, getCommentsOpen } from "../../lib/sheets.js";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ ok: false, message: "Método no permitido." });
  }
  if (!requireAdmin(req, res)) return;

  try {
    const [comments, open] = await Promise.all([listAllComments(), getCommentsOpen()]);
    return res.status(200).json({ ok: true, comments, open });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ok: false, message: "Error del servidor." });
  }
}
