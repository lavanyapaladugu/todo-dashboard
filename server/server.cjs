const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());

const FILE = path.join(__dirname, "tasks.json");

// Read tasks
const getTasks = () => {
  const data = fs.readFileSync(FILE);
  return JSON.parse(data);
};

// Save tasks
const saveTasks = (tasks) => {
  fs.writeFileSync(FILE, JSON.stringify(tasks, null, 2));
};

// GET
app.get("/tasks", (req, res) => {
  res.json(getTasks());
});

// POST
app.post("/tasks", (req, res) => {
  const tasks = getTasks();

  const newTask = {
    id: Date.now(),
    text: req.body.text,
    completed: false,
  };

  tasks.push(newTask);
  saveTasks(tasks);

  res.json(tasks);
});

// DELETE
app.delete("/tasks/:id", (req, res) => {
  const tasks = getTasks();

  const updated = tasks.filter((t) => t.id != req.params.id);

  saveTasks(updated);
  res.json(updated);
});

// TOGGLE
app.put("/tasks/:id", (req, res) => {
  const tasks = getTasks();

  const updated = tasks.map((t) =>
    t.id == req.params.id
      ? { ...t, completed: !t.completed }
      : t
  );

  saveTasks(updated);
  res.json(updated);
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});