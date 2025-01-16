import express from "express";
import { OAuth2Client } from 'google-auth-library';

const router = express.Router();

router.post("/login", async (req, res) => {
  const { credential } = req.body;

  try {
    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const sessionData = {
        id: payload.sub,
        name: payload.name,
        email: payload.email,
        picture: payload.picture,
      };
    req.session.regenerate((err) => {
      req.session.user = sessionData;
      return res.redirect("/");
    });
  } catch (err) {
    console.error(err);
    res.status(401).send({ message: "Authentication failed" });
  }
});

router.get("/logout", (req, res) => {
  req.session.destroy(() => {
    return res.redirect("/");
  });
});

export default router;