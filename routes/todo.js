import express from "express";
import {
  addTodo,
  getAllTodos,
  getTodo,
  toggleTodoCompleted,
  deleteTodo,
  updateTodo,
  getTodosByTitle,
} from "../lib/firebase/todoService.js";

const router = express.Router();

const getCounters = (todos) => {
  const today = new Date();

  return todos
    .map((todo) => ({
      late: new Date(todo.duedate) < today ? 1 : 0,
      completed: todo.completed ? 1 : 0,
    }))
    .reduce(
      (acc, curr) => ({
        total: acc.total + 1,
        late: acc.late + curr.late,
        completed: acc.completed + curr.completed,
      }),
      { total: 0, late: 0, completed: 0 }
    );
};

// Routes
// GET
router.get("/new", (req, res) => res.render("todo/new.ejs"));

router.get("/counters", async (req, res) => {
  const todos = await getAllTodos();
  const counters = getCounters(todos);
  res.render("todo/counters.ejs", { counters });
});

router.get("/:id", async (req, res) => {
  const todo = await getTodo(req.params.id);
  res.render("todo/todo-list-item.ejs", { todo });
});

router.get("/:id/edit", async (req, res) => {
  const todo = await getTodo(req.params.id);
  res.render("todo/edit.ejs", { todo });
});

router.get("/", async (req, res) => {
  const todos = await getAllTodos();
  const counters = getCounters(todos);
  res.render("todo/list.ejs", { todos, counters, addSwapOOB: true });
});

// VALIDATION routes
const validateDueDate = (inputDueDate) => {
  if (!inputDueDate) return "Due date is required.";

  const dueDate = new Date(inputDueDate);
  if (isNaN(dueDate.getTime())) return "Invalid date format.";

  const today = new Date().setHours(0, 0, 0, 0);
  if (dueDate < today) return "The due date has already passed.";

  return "";
};

router.post("/duedate", (req, res) => {
  const { duedate } = req.body;
  const errormessage = validateDueDate(duedate);
  return res.render("todo/partials/duedate.ejs", { errormessage, duedate });
});

const validateTitle = async (title) => {
  const matchingTodos = await getTodosByTitle(title);
  return matchingTodos.length > 0 ? `You are already doing '${title}'` : "";
};

router.post("/title", async (req, res) => {
  const { title } = req.body;
  const errormessage = await validateTitle(title);

  return res.render("todo/partials/title.ejs", { errormessage, title });
});

// ACTION routes
const TRIGGER_HEADER = "HX-Trigger";

router.post("/", async (req, res) => {
  const postedTodo = {
    title: req.body.title,
    duedate: req.body.duedate,
    completed: false,
  };
  const createdTodo = await addTodo(postedTodo);

  res.setHeader(
    TRIGGER_HEADER,
    `{"ITEM_UPDATED": "The ${req.params.id} item was created"}`
  );
  res.render("todo/todo-list-item.ejs", { todo: createdTodo });
});

router.put("/:id/toggle", async (req, res) => {
  await toggleTodoCompleted(req.params.id);
  const todo = await getTodo(req.params.id);

  res.setHeader(
    TRIGGER_HEADER,
    `{"ITEM_UPDATED": "The ${req.params.id} completion was toggled"}`
  );
  res.render("todo/todo-list-item.ejs", { todo });
});

router.delete("/:id", async (req, res) => {
  await deleteTodo(req.params.id);

  res.setHeader(
    TRIGGER_HEADER,
    `{"ITEM_UPDATED": "The ${req.params.id} item was deleted"}`
  );
  res.send();
});

router.put("/:id", async (req, res) => {
  const postedTodo = req.body;
  await updateTodo(req.params.id, postedTodo);
  const todo = await getTodo(req.params.id);

  res.setHeader(
    TRIGGER_HEADER,
    `{"ITEM_UPDATED": "The ${req.params.id} completion was updated"}`
  );
  res.render("todo/todo-list-item.ejs", { todo });
});

export default router;
