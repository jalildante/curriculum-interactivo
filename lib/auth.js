// Autenticación simple de administrador por contraseña compartida.
// El panel admin.html envía la contraseña en el header x-admin-password.

export function isAdminAuthorized(req) {
  const provided = req.headers["x-admin-password"];
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;
  return typeof provided === "string" && provided === expected;
}

export function requireAdmin(req, res) {
  if (!isAdminAuthorized(req)) {
    res.status(401).json({ ok: false, message: "Contraseña de administrador incorrecta." });
    return false;
  }
  return true;
}
