import express from "express";
import {
  sessionConfig,
  sessionTimeoutMiddleware,
} from "./middleware/session.js";
import authRoutes from "./routes/auth.js";
import todoRoutes, { getAppViewData } from "./routes/todo.js";
import morgan from "morgan";

const envs = process.env;

const app = express();

// Middleware
app.use(express.static("public"));
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(sessionConfig);
app.use(sessionTimeoutMiddleware);

// Routes
app.use("/auth", authRoutes);
app.use("/todo", todoRoutes);

app.get("/", (req, res) => {
  return res.render("main.ejs", { envs, user: req?.session?.user });
});

app.get("/nav", (req, res) => {
  const templateName = req?.session?.user ? "userProfile.ejs" : "googleSignIn.ejs";
  return res.render(`partials/auth/${templateName}`, {
      envs,
      user: req?.session?.user,
    })
});

app.get("/main", async (req, res) => {
  if (!req?.session?.user) {
    return res.send("<h2>Log in to see your Todo list</h2>");
  } else {
    return res.render("todo/app.ejs", await getAppViewData());
  }
});

// Start server
app.listen(envs.PORT, () => {
  console.log(`Server listening on http://localhost:${envs.PORT}`);
});
