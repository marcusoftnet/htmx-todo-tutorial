// In-memory array to store todos for testing
let todos = [];

export async function getAllTodos() {
  return new Promise((resolve) => {
    resolve(todos);
  });
}

export async function getTodo(todoId) {
  return new Promise((resolve) => {
    const todo = todos.find(t => t.id === todoId);
    resolve(todo || null);
  });
}

export async function updateTodo(todoId, updates) {
  return new Promise((resolve) => {
    const todoIndex = todos.findIndex(t => t.id === todoId);
    if (todoIndex !== -1) {
      todos[todoIndex] = { ...todos[todoIndex], ...updates };
    }
    resolve();
  });
}

export async function deleteTodo(todoId) {
  return new Promise((resolve) => {
    todos = todos.filter(t => t.id !== todoId);
    resolve();
  });
}

export async function toggleTodoCompleted(todoId) {
  return new Promise((resolve) => {
    const todoIndex = todos.findIndex(t => t.id === todoId);
    if (todoIndex !== -1) {
      todos[todoIndex].completed = !todos[todoIndex].completed;
    }
    resolve();
  });
}