import { useState, useEffect } from "react";
import axios from "axios";
import TaskCard from "./TaskCard";
import { ClipboardList, Plus } from "lucide-react";
import DeleteModal from "./DeleteModal"; 
import EditModal from "./EditModal";

const Home = ({ activeTab = "all", refreshTrigger, onOpenModal }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [taskToDelete, setTaskToDelete] = useState(null); 
  const [taskToEdit, setTaskToEdit] = useState(null);

  const fetchTasks = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/v1/task/get", {
         withCredentials: true
      });
      if (res.data.success || res.data.tasks) { 
        setTasks(res.data.tasks || []);
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [refreshTrigger]);

  // Handle Toggle Favorite Function (Ab Component ke andar hai)
  const handleToggleFavorite = async (taskId) => {
    try {
      // 1. UI par instant change ke liye local state update
      setTasks((prevTasks) =>
        prevTasks.map((t) =>
          t._id === taskId ? { ...t, isFavorite: !t.isFavorite } : t
        )
      );

      // 2. Backend API call (port 8000 par)
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:8000/api/v1/task/favorite/${taskId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true
        }
      );
    } catch (error) {
      console.error("Favorite toggle karne me error aaya:", error);
    }
  };

  const handleDeleteClick = (id) => {
    setTaskToDelete(id);
  };

  const confirmDelete = async () => {
    if (!taskToDelete) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:8000/api/v1/task/delete/${taskToDelete}`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true
      });
      setTasks(tasks.filter((t) => t._id !== taskToDelete));
      setTaskToDelete(null); 
    } catch (error) {
      console.error("Delete task failed:", error);
    }
  };

  const filteredTasks = tasks.filter((task) => {
    if (activeTab === "all") return true;
    if (activeTab === "favorite") {
      return task.isFavorite === true || task.category?.toLowerCase() === "favorite";
    }
    return task.category?.toLowerCase() === activeTab.toLowerCase();
  });

  return (
    <div className="p-8 max-w-7xl mx-auto flex flex-col justify-between min-h-[calc(100vh-80px)] relative">
      <div>
        <div className="bg-white rounded-md border border-gray-200 p-4 mb-12 shadow-sm flex items-center gap-2">
          <ClipboardList className="w-5 h-5 text-blue-600" />
          <h2 className="font-bold text-blue-900 text-xs uppercase tracking-wider">
            {activeTab === "all" ? "ALL TASK" : `${activeTab} TASKS`}
          </h2>
        </div>

        {loading ? (
          <div className="flex items-center justify-center gap-2.5 py-36">
            <div className="w-3 h-3 bg-blue-300 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
            <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
            <div className="w-3 h-3 bg-blue-300 rounded-full animate-bounce"></div>
          </div>
        ) : filteredTasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center my-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-5 text-gray-600">
              <ClipboardList className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No tasks yet</h3>
            <button
              type="button"
              onClick={onOpenModal}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-5 py-2.5 rounded-md shadow-sm transition cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Create Your First Task
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTasks.map((task) => (
              <TaskCard 
                 key={task._id} 
                 task={task} 
                 onDelete={handleDeleteClick} 
                 onEdit={(taskData) => setTaskToEdit(taskData)}
                 onToggleFavorite={handleToggleFavorite} 
              />
            ))}
          </div>
        )}
      </div>

      <footer className="text-center text-xs text-gray-400 py-6">
        © 2026 EVS. All rights reserved.
      </footer>

      {/* Delete Confirmation Modal */}
      <DeleteModal 
        isOpen={!!taskToDelete} 
        onClose={() => setTaskToDelete(null)} 
        onConfirm={confirmDelete} 
      />

      {/* Edit Modal */}
      <EditModal 
        isOpen={!!taskToEdit} 
        task={taskToEdit} 
        onClose={() => setTaskToEdit(null)} 
        onTaskUpdated={() => {
          fetchTasks();
          setTaskToEdit(null);
        }} 
      />
    </div>
  );
};

export default Home;