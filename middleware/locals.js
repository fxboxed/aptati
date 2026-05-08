// middleware/locals.js
export default function(req, res, next) {
  res.locals.user = req.user || null;
  res.locals.isAuthed = req.isAuthenticated ? req.isAuthenticated() : false;
  next();
}