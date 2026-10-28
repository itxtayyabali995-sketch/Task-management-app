import { useState } from "react";
import axios from "axios";
import { X } from "lucide-react";

const TaskModal = ({ isOpen, onClose, onTaskAdded }) => {
  const [activeSubTab, setActiveSubTab] = useState("basic"); 
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [dueTime, setDueTime] = useState("");
  const [category, setCategory] = useState("Work");
  const [progress, setProgress] = useState("0%");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Token not found@!");
        setLoading(false);
        return;
      }

      
      const res = await axios.post(
        "http://localhost:8000/api/v1/task/add",
        { title, dueDate, dueTime, category, progress, description },
        {
          headers: {
            Authorization: `Bearer ${token}` 
          },
          withCredentials: true
        }
      );

      if (res.data.success) {
        if (onTaskAdded) onTaskAdded();
        onClose();
      }
    } catch (error) {
      console.error("Task creation error:", error.response?.data || error.message);
      alert(error.response?.data?.message || "Failed to create task");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/15 backdrop-blur-[1px] flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg overflow-hidden border border-gray-200">
        {/* Header */}
        <div className="bg-blue-600 text-white px-6 py-4 flex items-center justify-between">
          <h3 className="font-bold text-sm uppercase tracking-wide">Task Details</h3>
          <button onClick={onClose} className="text-white hover:text-gray-200 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sub Tabs */}
        <div className="flex border-b border-gray-200 px-6 pt-3 gap-6 text-xs font-bold text-gray-600">
          <button
            type="button"
            onClick={() => setActiveSubTab("basic")}
            className={`pb-2 border-b-2 cursor-pointer transition ${activeSubTab === "basic"
                ? "border-blue-600 text-blue-600"
                : "border-transparent hover:text-blue-500"
              }`}
          >
            BASIC
          </button>
          <button
            type="button"
            onClick={() => setActiveSubTab("more")}
            className={`pb-2 border-b-2 cursor-pointer transition ${activeSubTab === "more"
                ? "border-blue-600 text-blue-600"
                : "border-transparent hover:text-blue-500"
              }`}
          >
            MORE
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {activeSubTab === "basic" ? (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  placeholder="Task title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-xs focus:outline-none focus:ring-1 focus:ring-blue-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Due Date</label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-xs focus:outline-none focus:ring-1 focus:ring-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Due Time</label>
                  <input
                    type="time"
                    value={dueTime}
                    onChange={(e) => setDueTime(e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-xs focus:outline-none focus:ring-1 focus:ring-blue-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-xs focus:outline-none focus:ring-1 focus:ring-blue-600 bg-white"
                  >
                    <option value="Work">Work</option>
                    <option value="Personal">Personal</option>
                    <option value="Learning">Learning</option>
                    <option value="Favorite">Favorite</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Status</label>
                  <select
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-xs bg-gray-100 text-gray-500 cursor-not-allowed"
                  >
                    <option value="To Do">To Do</option>
                  </select>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Progress</label>
                <select
                  value={progress}
                  onChange={(e) => setProgress(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-xs focus:outline-none focus:ring-1 focus:ring-blue-600 bg-white"
                >
                  <option value="0%">0%</option>
                  <option value="25%">25%</option>
                  <option value="50%">50%</option>
                  <option value="75%">75%</option>
                  <option value="100%">100%</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Description</label>
                <textarea
                  rows="4"
                  placeholder="Add task description..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-xs focus:outline-none focus:ring-1 focus:ring-blue-600 resize-none"
                ></textarea>
              </div>
            </div>
          )}

          {/* Footer Buttons */}
          <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-gray-600 hover:bg-gray-100 rounded-md transition cursor-pointer"
            >
              CANCEL
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-md shadow-sm transition cursor-pointer disabled:opacity-50"
            >
              {loading ? "SAVING..." : "SAVE"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;