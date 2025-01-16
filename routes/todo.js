import express from "express";
import {
  addTodo,
  getAllTodos,
  getTodo,
  toggleTodoCompleted,
  deleteTodo,
  updateTodo,
} from "../lib/firebase/todoService.js";
const router = express.Router();

router.get("/new", (req, res) => res.render("todo/new.ejs"));

router.post("/", async (req, res) => {
  const postedTodo = {
    title: req.body.title,
    duedate: req.body.duedate,
    completed: false,
  };
  const createdTodo = await addTodo(postedTodo);

  res.render("todo/todo-list-item.ejs", { todo: createdTodo });
});

router.get("/", async (req, res) => {
  const todos = await getAllTodos();
  res.render("todo/list.ejs", { todos });
});

router.put("/:id/toggle", async (req, res) => {
  await toggleTodoCompleted(req.params.id);
  const todo = await getTodo(req.params.id);
  res.render("todo/todo-list-item.ejs", { todo });
});

router.delete("/:id", async (req, res) => {
  await deleteTodo(req.params.id);
  res.send(); // No content
});

router.get("/:id/edit", async (req, res) => {
  const todo = await getTodo(req.params.id);
  res.render("todo/edit.ejs", { todo });
});

router.put("/:id", async (req, res) => {
  const postedTodo = req.body;
  await updateTodo(req.params.id, postedTodo);
  const todo = await getTodo(req.params.id);
  res.render("todo/todo-list-item.ejs", { todo });
});

export default router;
