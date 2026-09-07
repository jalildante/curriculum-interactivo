import { requireAdmin } from "../../lib/auth.js";
import { getCommentsOpen, setCommentsOpen } from "../../lib/sheets.js";

export default async function handler(req, res) {
  if (!requireAdmin(req, res)) return;

  try {
    if (req.method === "GET") {
      const open = await getCommentsOpen();
      return res.status(200).json({ ok: true, open });
    }

    if (req.method === "POST") {
      const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body || {};
      await setCommentsOpen(Boolean(body.open));
      return res.status(200).json({ ok: true, open: Boolean(body.open) });
    }

    res.setHeader("Allow", "GET, POST");
    return res.status(405).json({ ok: false, message: "Método no permitido." });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ok: false, message: "Error del servidor." });
  }
}
