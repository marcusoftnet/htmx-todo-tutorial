import express from "express";

const { PORT, APP_NAME, GOOGLE_CLIENT_ID } = process.env;

const app = express();

// Middleware
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get("/", (req, res) => {
  return res.render("main.ejs", { APP_NAME, GOOGLE_CLIENT_ID });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});