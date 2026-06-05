import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import { AuthContext } from "../context/AuthContext";

function Dashboard() {

  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);

  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [search, setSearch] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sortBy, setSortBy] = useState("recent");
  const [currentPage, setCurrentPage] = useState(1);
  const tasksPerPage = 5;

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      navigate("/");
      return;
    }
    fetchTasks();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, sortBy]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const { data } = await API.get("/tasks");
      setTasks(data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load tasks.");
    } finally {
      setLoading(false);
    }
  };

  const addTask = async (e) => {
    e.preventDefault();
    try {
      const { data } = await API.post("/tasks", { title, description });
      setTasks((prev) => [data, ...prev]);
      setTitle("");
      setDescription("");
    } catch (err) {
      console.error(err);
    }
  };

  const updateTask = async (e) => {
    e.preventDefault();
    try {
      const { data } = await API.put(`/tasks/${editingId}`, { title, description });
      setTasks((prev) => prev.map((t) => (t._id === editingId ? data : t)));
      setEditingId(null);
      setTitle("");
      setDescription("");
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (task) => {
    setEditingId(task._id);
    setTitle(task.title);
    setDescription(task.description);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setTitle("");
    setDescription("");
  };

  const deleteTask = async (id) => {
    try {
      await API.delete(`/tasks/${id}`);
      setTasks((prev) => prev.filter((t) => t._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const toggleStatus = async (id) => {
    try {
      const { data } = await API.patch(`/tasks/${id}/toggle`);
      setTasks((prev) => prev.map((t) => (t._id === id ? data : t)));
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const filteredTasks = [...tasks]
  .filter((t) =>
    t.title.toLowerCase().includes(search.toLowerCase())
  )
  .sort((a, b) =>
    sortBy === "recent"
      ? new Date(b.createdAt) - new Date(a.createdAt)
      : new Date(a.createdAt) - new Date(b.createdAt)
  );

  const totalPages = Math.ceil(filteredTasks.length / tasksPerPage);

  const startIndex =(currentPage - 1) * tasksPerPage;

  const paginatedTasks = filteredTasks.slice(startIndex,startIndex + tasksPerPage);

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === "completed").length;
  const pendingTasks = totalTasks - completedTasks;

  return (
  <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900 antialiased selection:bg-neutral-200">
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-275 mx-auto h-14 px-6 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 bg-gray-900 rounded-[7px] flex items-center justify-center text-white text-xs font-medium">
            AQ
          </div>
          <span className="text-lg font-bold tracking-tight text-gray-900">
            AvQuint
          </span>
        </div>
        <button 
          onClick={handleLogout}
          className="text-xs font-medium text-gray-800 border border-red-300 bg-red-100 rounded-lg px-3 py-1.5 hover:bg-red-300  hover:text-gray-900 transition-colors duration-150 cursor-pointer"
        >
          Sign out
        </button>
      </div>
    </nav>


    <main className="max-w-275 w-full mx-auto px-6 pt-9 pb-16 grid grid-cols-1 md:grid-cols-[320px_1fr] gap-7 items-start flex-1">
      
      {/* sidebar*/}
      <aside className="md:sticky md:top-20 flex flex-col gap-4">
        {/* box layout*/}
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-white border border-gray-200 rounded-ece p-3.5 pt-3.5 pb-3 text-center rounded-xl">
            <span className="text-2xl font-bold tracking-tight block line-height-1 mb-1 text-gray-900">
              {totalTasks}
            </span>
            <span className="text-[11px] font-medium tracking-wider text-gray-500 uppercase">
              Total
            </span>
          </div>
          <div className="bg-white border border-gray-200 rounded-ece p-3.5 pt-3.5 pb-3 text-center rounded-xl">
            <span className="text-2xl font-bold tracking-tight block line-height-1 mb-1 text-amber-600">
              {pendingTasks}
            </span>
            <span className="text-[11px] font-medium tracking-wider text-gray-500 uppercase">
              Pending
            </span>
          </div>
          <div className="bg-white border border-gray-200 rounded-ece p-3.5 pt-3.5 pb-3 text-center rounded-xl">
            <span className="text-2xl font-bold tracking-tight block line-height-1 mb-1 text-emerald-600">
              {completedTasks}
            </span>
            <span className="text-[11px] font-medium tracking-wider text-gray-500 uppercase">
              Done
            </span>
          </div>
        </div>

        {/* Input Interactive Card */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <p className="text-sm font-semibold tracking-tight text-gray-900 mb-4.5">
            {editingId ? "Edit task" : "New task"}
          </p>
          <form onSubmit={editingId ? updateTask : addTask}>
            <div className="mb-3.5">
              <label className="block text-xs font-semibold text-gray-500 mb-1.5 tracking-wide">
                Title
              </label>
              <input
                type="text"
                placeholder="What needs to be done?"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full text-sm text-gray-900 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 placeholder-neutral-400 focus:outline-none focus:border-neutral-300 focus:bg-white focus:ring-[3px] focus:ring-neutral-900/5 transition-all duration-150"
              />
            </div>
            <div className="mb-3.5">
              <label className="block text-xs font-semibold text-gray-500 mb-1.5 tracking-wide">
                Description <span className="font-normal text-neutral-300">(optional)</span>
              </label>
              <textarea
                placeholder="Add some context..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full text-sm text-gray-900 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 min-h-22.5 leading-relaxed placeholder-neutral-400 focus:outline-none focus:border-neutral-300 focus:bg-white focus:ring-[3px] focus:ring-neutral-900/5 transition-all duration-150 resize-y"
              />
            </div>
            <div className="flex flex-col gap-2 mt-4.5">
              <button 
                type="submit" 
                className="w-full text-sm font-semibold text-white bg-[#1a1a1a] border-none rounded-lg p-2.5 hover:bg-[#333] transition-colors duration-150 cursor-pointer"
              >
                {editingId ? "Save changes" : "Add task"}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(null);
                    setTitle("");
                    setDescription("");
                  }}
                  className="w-full text-xs font-medium text-[#555] bg-[#f2f2ef] border-none rounded-lg p-2.5 hover:bg-[#e8e8e5] hover:text-[#1a1a1a] transition-colors duration-150 cursor-pointer"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
      </aside>

      <div className="flex flex-col gap-3.5">
        
        <div className="flex gap-2.5 items-center">
          <input
            type="text"
            placeholder="Search tasks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 text-sm text-gray-900 bg-white border border-neutral-200 rounded-lg px-3 py-2 placeholder-neutral-400 focus:outline-none focus:border-neutral-400 transition-colors duration-150"
          />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="text-sm font-medium text-gray-600 bg-white border border-neutral-200 rounded-lg px-2.5 py-2 focus:outline-none cursor-pointer whitespace-nowrap"
          >
            <option value="recent">Sort: Newest</option>
            <option value="oldest">Sort: Oldest</option>
          </select>
        </div>

        {loading ? (
          <div className="bg-white border border-[#e8e8e5] rounded-xl py-12 text-center text-sm text-neutral-400">
            <p>Loading tasks…</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm font-medium">
            {error}
          </div>
        ) : filteredTasks.length === 0 ? (
          <div className="bg-white border border-[#e8e8e5] rounded-xl py-12 text-center text-sm text-neutral-400">
            
            <p>{search ? "No tasks match your search." : "No tasks yet. Add one to get started."}</p>
          </div>
        ) : (
          paginatedTasks.map((task) => {
            const isComplete = task.status === "completed";
            return (
              <div key={task._id} className={`bg-white border rounded-xl p-[18px_20px] flex justify-between items-start gap-4 transition-all duration-150 hover:border-[#d4d4d0] hover:shadow-[0_2px_10px_rgba(0,0,0,0.05)] ${isComplete ? "border-[#e8e8e5] opacity-55" : "border-[#e8e8e5]"}`}>
                <div className="flex-1 min-w-0">
                  <p className={`text-[14.5px] font-semibold tracking-tight leading-normal mb-1 ${
                    isComplete ? "text-neutral-400 line-through" : "text-gray-900"
                  }`}>
                    {task.title}
                  </p>
                  {task.description && (
                    <p className={`text-xs leading-relaxed mb-2.5 whitespace-pre-wrap wrap-break-words ${
                      isComplete ? "text-neutral-300 line-through" : "text-gray-500"
                    }`}>
                      {task.description}
                    </p>
                  )}
                  <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-[5px] ${
                    isComplete ? "bg-green-100/70 text-green-800" : "bg-amber-100 text-amber-800"
                  }`}>
                    <span className="w-1.5 h-1.5 rounded-full bg-currentColor shrink-0" />
                    {isComplete ? "Completed" : "Pending"}
                  </span>
                </div>

                <div className="flex gap-1.5 shrink-0 items-center">
                  <button
                    onClick={() => handleEdit(task)}
                    className="text-xs font-medium text-[#555] bg-white border border-[#e0e0dc] rounded-md px-2.5 py-1 hover:bg-[#f2f2ef] hover:text-[#1a1a1a] transition-colors duration-100 cursor-pointer"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => toggleStatus(task._id)}
                    className="text-xs font-medium text-[#555] bg-white border border-[#e0e0dc] rounded-md px-2.5 py-1 hover:bg-[#f2f2ef] hover:text-[#1a1a1a] transition-colors duration-100 cursor-pointer"
                  >
                    {isComplete ? "Reopen" : "Complete"}
                  </button>
                  <button
                    onClick={() => deleteTask(task._id)}
                    className="text-xs font-medium text-red-600 bg-white border border-[#e0e0dc] rounded-md px-2.5 py-1 hover:bg-red-50 hover:border-red-200 transition-colors duration-100 cursor-pointer"
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })
        )}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-6">
            {Array.from(
              { length: totalPages },
              (_, i) => i + 1
            ).map((page) => (
              <button
                key={page}
                onClick={() =>
                  setCurrentPage(page)
                }
                className={`w-8 h-8 rounded-md text-sm transition ${
                  currentPage === page
                    ? "bg-gray-900 text-white"
                    : "bg-white border border-gray-200 hover:bg-gray-50"
                }`}
              >
                {page}
              </button>
            ))}
          </div>
        )}
      </div>
      
    </main>
  </div>
);
}

export default Dashboard;
