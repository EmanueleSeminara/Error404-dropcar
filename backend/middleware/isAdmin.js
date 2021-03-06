// Controllo se il ruolo dell'utente loggato è admin
module.exports = (req, res, next) => {
  if (req.isAuthenticated() && req.user.role == "admin") return next();

  return res.status(401).json({ error: "not autorized" });
};
