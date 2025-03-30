import { useEffect, useState } from "react";
import axios from "axios";
import './index.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [filter, setFilter] = useState("all");
  const [darkMode, setDarkMode] = useState(true);
  const [showMenu, setShowMenu] = useState(false);
  const [currentPage, setCurrentPage] = useState("home");
  const [showConfirmClear, setShowConfirmClear] = useState(false);
  const [toast, setToast] = useState(null);

  const toggleDarkMode = () => setDarkMode(prev => !prev);

  const showToast = (message, duration = 3000) => {
    setToast(message);
    setTimeout(() => setToast(null), duration);
  };

  useEffect(() => {
    axios.get("http://localhost:5000/api/tasks")
      .then(res => setTasks(res.data))
      .catch(err => console.error("Error fetching tasks:", err));
  }, []);

  const addTask = (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;

    axios.post("http://localhost:5000/api/tasks", { title: newTask, priority })
      .then(res => setTasks([...tasks, res.data]))
      .catch(err => console.error("Error adding task:", err));

    setNewTask("");
  };

  const toggleCompletion = (id, completed) => {
    axios.put(`http://localhost:5000/api/tasks/${id}`, { completed: !completed })
      .then(() => {
        setTasks(tasks.map(task =>
          task._id === id ? { ...task, completed: !completed } : task
        ));
      })
      .catch(err => console.error("Error updating task:", err));
  };

  const deleteTask = (id) => {
    axios.delete(`http://localhost:5000/api/tasks/${id}`)
      .then(() => setTasks(tasks.filter(task => task._id !== id)))
      .catch(err => console.error("Error deleting task:", err));
  };

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="flex justify-center items-center min-h-screen bg-black">
        <div className="w-[375px] min-h-[667px] sm:rounded-xl bg-white text-gray-900 dark:bg-gray-900 dark:text-white transition-colors duration-300 shadow-lg p-5">

          {/* HOME PAGE */}
          {currentPage === "home" && (
            <>
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Task List</h1>
                <div className="flex items-center gap-2">
                  <button
                    onClick={toggleDarkMode}
                    className="text-sm hover:bg-gray-300 hover:dark:bg-gray-700 dark:text-white px-3 py-1 rounded transition duration-300 hover:scale-105"
                  >
                    {darkMode ? "☀️ Light" : "🌙 Dark"}
                  </button>
                  <div className="relative">
                    <button
                      onClick={() => setShowMenu(prev => !prev)}
                      className="text-base border rounded border-gray-500 hover:bg-gray-300 hover:dark:bg-gray-700 dark:text-white px-3 py-1 transition duration-300 hover:scale-105"
                      title="More options"
                    >
                      ⋮
                    </button>
                    {showMenu && (
                      <div className="absolute right-0 mt-2 w-40 origin-top-right bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded shadow-lg z-50">
                        <ul className="text-sm text-gray-800 dark:text-white">
                          <li
                            onClick={() => {
                              setCurrentPage("settings");
                              setShowMenu(false);
                            }}
                            className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                          >
                            Settings
                          </li>
                          <li
                            onClick={() => {
                              setShowConfirmClear(true);
                              setShowMenu(false);
                            }}
                            className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                          >
                            Clear Tasks
                          </li>
                          <li
                            onClick={() => {
                              setCurrentPage("about");
                              setShowMenu(false);
                            }}
                            className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                          >
                            About
                          </li>
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Filter */}
              <div className="mb-5">
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="border p-2 w-full mb-2 bg-gray-300 text-gray-900 border-gray-300 dark:bg-gray-800 dark:text-white dark:border-gray-600 rounded"
                >
                  <option value="all">All Tasks</option>
                  <option value="completed">Completed Tasks</option>
                  <option value="pending">Pending Tasks</option>
                </select>
              </div>

              {/* Task Input */}
              <form onSubmit={addTask} className="mb-5">
                <input
                  type="text"
                  placeholder="Enter a task..."
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                  className="border p-2 w-full mb-2 bg-gray-300 text-gray-900 border-gray-300 dark:bg-gray-800 dark:text-white dark:border-gray-600 rounded"
                />
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="border p-2 w-full mb-2 bg-gray-300 text-gray-900 border-gray-300 dark:bg-gray-800 dark:text-white dark:border-gray-600 rounded"
                >
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
                <button
                  type="submit"
                  className="px-2 py-1 text-sm rounded transition duration-500 hover:opacity-80 bg-blue-500 text-white w-full hover:scale-105"
                >
                  Add Task
                </button>
              </form>

              {/* Task List */}
              <ul className="mt-5 border rounded p-3 bg-gray-300 text-gray-900 border-gray-300 dark:bg-gray-800 dark:text-white dark:border-gray-600">
                {tasks.length === 0 && (
                  <p className="text-center text-gray-400 dark:text-gray-500 italic mt-0">
                    You don’t have any tasks yet. Add one above! 🎉
                  </p>
                )}
                {tasks
                  .filter(task => {
                    if (filter === "completed") return task.completed;
                    if (filter === "pending") return !task.completed;
                    return true;
                  })
                  .map(task => (
                    <li key={task._id} className="mb-3 px-3 py-2 rounded-lg shadow-md flex justify-between items-center bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-all duration-300 hover:shadow-lg">
                      <span>{task.title} - {task.priority}</span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => toggleCompletion(task._id, task.completed)}
                          className={`px-2 py-1 text-sm rounded ${task.completed ? "bg-green-500" : "bg-gray-500"} text-white hover:scale-105 transition-transform`}
                        >
                          {task.completed ? "Completed" : "Mark Done"}
                        </button>
                        <button
                          onClick={() => deleteTask(task._id)}
                          className="px-2 py-1 text-sm bg-red-500 text-white rounded hover:scale-105 transition-transform"
                        >
                          Delete
                        </button>
                      </div>
                    </li>
                  ))}
              </ul>
            </>
          )}

          {/* Settings Page */}
          {currentPage === "settings" && (
            <>
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Settings</h1>
                <button
                  onClick={() => setCurrentPage("home")}
                  className="text-sm bg-gray-300 dark:bg-gray-700 dark:text-white px-3 py-1 rounded hover:scale-105 transition"
                >
                  ← Back
                </button>
              </div>
              <div className="space-y-4 text-sm">
                <p className="text-gray-600 dark:text-gray-400">No settings yet — coming soon!</p>
              </div>
            </>
          )}

          {/* About Page */}
          {currentPage === "about" && (
            <>
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">About</h1>
                <button
                  onClick={() => setCurrentPage("home")}
                  className="text-sm bg-gray-300 dark:bg-gray-700 dark:text-white px-3 py-1 rounded hover:scale-105 transition"
                >
                  ← Back
                </button>
              </div>
              <div className="space-y-4 text-sm">
                <p>This is a <strong>Full-Stack Task Manager App</strong> built using:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li><strong>Frontend:</strong> React, TailwindCSS</li>
                  <li><strong>Backend:</strong> Node.js, Express</li>
                  <li><strong>Database:</strong> MongoDB (Mongoose)</li>
                </ul>
                <p className="text-gray-600 dark:text-gray-400">
                  Built for a technical demonstration to showcase CRUD operations, UI/UX design, and full-stack architecture.
                </p>
                <p className="text-xs text-gray-400 italic">
                  Developed by David Sanchez — 2025
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* ✅ Toast */}
      {toast && (
        <div className="fixed bottom-5 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-4 py-2 rounded shadow-lg z-50 animate-fade-in-up">
          {toast}
        </div>
      )}

      {/* ✅ Clear Tasks Modal */}
      {showConfirmClear && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-80">
            <h2 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">Clear All Tasks?</h2>
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
              This action cannot be undone.
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowConfirmClear(false)}
                className="px-4 py-2 bg-gray-300 dark:bg-gray-700 text-black dark:text-white rounded hover:opacity-80"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  axios.delete("http://localhost:5000/api/tasks/clear")
                    .then(() => {
                      setTasks([]);
                      setShowConfirmClear(false);
                      showToast("✅ All tasks cleared.");
                    })
                    .catch(err => {
                      console.error("Error clearing tasks:", err);
                      showToast("❌ Failed to clear tasks.");
                    });
                }}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
