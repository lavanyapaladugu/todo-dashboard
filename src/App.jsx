import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  // Load tasks
  useEffect(() => {
    fetch("http://localhost:5000/tasks")
      .then((res) => res.json())
      .then((data) => setTasks(data))
      .catch((err) => console.log(err));
  }, []);

  // Add task
  const addTask = () => {
    if (!task.trim()) {
      alert("Enter a task");
      return;
    }

    fetch("http://localhost:5000/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text: task }),
    })
      .then((res) => res.json())
      .then((data) => {
        setTasks(data);
        setTask("");
      })
      .catch((err) => {
        console.log(err);
        alert("Error adding task");
      });
  };

  // Delete task
  const deleteTask = (id) => {
    fetch(`http://localhost:5000/tasks/${id}`, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then((data) => setTasks(data))
      .catch((err) => console.log(err));
  };

  // Toggle task
  const toggleTask = (id) => {
    fetch(`http://localhost:5000/tasks/${id}`, {
      method: "PUT",
    })
      .then((res) => res.json())
      .then((data) => setTasks(data))
      .catch((err) => console.log(err));
  };
  
  // Filter logic
const filteredTasks = tasks
  .filter((t) => {
    if (filter === "completed") return t.completed;
    if (filter === "pending") return !t.completed;
    return true;
  })
  .filter((t) =>
    t.text.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container">
      <h1>Todo Dashboard</h1>

      {/* Stats */}
      <p>
        Total: {tasks.length} | Completed:{" "}
        {tasks.filter((t) => t.completed).length}
      </p>

      {/* Add Task */}
      <div className="input-section">
        <input
          type="text"
          placeholder="Enter task..."
          value={task}
          onChange={(e) => setTask(e.target.value)}
        />
        <button onClick={addTask}>Add</button>
      </div>

      {/* Filters */}
      <div className="filters">
        <button onClick={() => setFilter("all")}>All</button>
        <button onClick={() => setFilter("completed")}>Completed</button>
        <button onClick={() => setFilter("pending")}>Pending</button>
      </div>
      {/* Search */}
<input
  type="text"
  placeholder="Search task..."
  value={search}
  onChange={(e) => setSearch(e.target.value)}
  style={{ marginTop: "10px", width: "100%", padding: "8px" }}
/>

      {/* Task List */}
      <ul>
        {filteredTasks.map((t) => (
          <li key={t.id}>
            <span
              onClick={() => toggleTask(t.id)}
              style={{
                textDecoration: t.completed ? "line-through" : "none",
                cursor: "pointer",
              }}
            >
              {t.text}
            </span>

            <button onClick={() => deleteTask(t.id)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;