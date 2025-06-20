"use client";

import { useState, useEffect } from "react";

export default function Home() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState("pending");
  const [editId, setEditId] = useState(null);
  const [message, setMessage] = useState("");

  const API = "http://localhost:5000/tasks";

  useEffect(() => {
    fetch(API)
      .then(res => res.json())
      .then(data => setTasks(data))
      .catch(() => setMessage("Could not load tasks"));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title) {
      setMessage("Please enter a title");
      return;
    }

    const task = { title, status };
    let url = API;
    let method = "POST";
    if (editId) {
      url = API + "/" + editId;
      method = "PUT";
    }

    fetch(url, {
      method: method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(task),
    })
      .then(() => {
        setTitle("");
        setStatus("pending");
        setEditId(null);
        setMessage(editId ? "Task updated" : "Task added");
        return fetch(API);
      })
      .then(res => res.json())
      .then(data => setTasks(data));
  };

  const handleEdit = (task) => {
    setTitle(task.title);
    setStatus(task.status);
    setEditId(task.id);
  };

  const handleDelete = (id) => {
    fetch(API + "/" + id, { method: "DELETE" })
      .then(() => {
        setMessage("Task deleted");
        return fetch(API);
      })
      .then(res => res.json())
      .then(data => setTasks(data));
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-gray-800 rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-center text-white mb-4">Task Manager</h2>
        {message && (
          <div className="mb-4 text-center py-2 px-3 rounded bg-blue-600 text-white">
            {message}
          </div>
        )}
        <form onSubmit={handleSubmit} className="mb-6 space-y-3">
          <input
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Task title"
            className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none"
          />
          <select
            value={status}
            onChange={e => setStatus(e.target.value)}
            className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none"
          >
            <option value="pending">Pending</option>
            <option value="done">Done</option>
          </select>
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded"
          >
            {editId ? "Update" : "Add"}
          </button>
        </form>
        <ul className="space-y-3">
          {tasks.map(task => (
            <li
              key={task.id}
              className="bg-gray-700 rounded p-4 flex justify-between items-center"
            >
              <div>
                <div className="font-semibold text-white">{task.title}</div>
                <div className="text-sm text-gray-300 capitalize">{task.status}</div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(task)}
                  className="bg-yellow-400 hover:bg-yellow-500 text-xs px-3 py-1 rounded font-semibold"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(task.id)}
                  className="bg-red-500 hover:bg-red-600 text-xs px-3 py-1 rounded font-semibold text-white"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}