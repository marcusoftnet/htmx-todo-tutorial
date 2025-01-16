import session from 'express-session';

export const sessionConfig = session({
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  cookie: {
    secure: process.env.NODE_ENV === "production", // Only true in production when using HTTPS
    httpOnly: true,
    sameSite: "Strict",
    maxAge: 24 * 60 * 60 * 1000,
  },
});

export const sessionTimeoutMiddleware = (req, res, next) => {
  if (req.session) {
    const currentTime = Date.now();
    const lastActivity = req.session.lastActivity || currentTime;

    const sessionTimeout = 30 * 60 * 1000; // 30 minutes
    if (currentTime - lastActivity > sessionTimeout) {
      req.session.destroy((err) => {
        if (err) return next(err);
        res.redirect("/"); // Redirect to login if session expired
      });
    } else {
      req.session.lastActivity = currentTime; // Update last activity timestamp
      return next();
    }
  } else {
    return next();
  }
};