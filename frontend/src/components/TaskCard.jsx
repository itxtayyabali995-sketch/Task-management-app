import React from "react";
import { 
  Calendar, 
  Clock, 
  Trash2, 
  Star, 
  CircleDashed, 
  CheckCircle2, 
  SquarePen 
} from "lucide-react";

// 1. Props me onToggleFavorite add kiya
const TaskCard = ({ task, onDelete, onEdit, onToggleFavorite }) => {
  const getThemeColor = (category) => {
    switch (category?.toLowerCase()) {
      case "personal":
        return { bar: "bg-orange-500", icon: "text-orange-500" };
      case "learning":
        return { bar: "bg-green-600", icon: "text-green-600" };
      case "work":
        return { bar: "bg-purple-700", icon: "text-purple-700" };
      default:
        return { bar: "bg-blue-600", icon: "text-blue-600" };
    }
  };

  const theme = getThemeColor(task.category);

  return (
    <div className="bg-white rounded-md shadow-[0_2px_10px_rgb(0,0,0,0.04)] border border-gray-100 p-5 relative flex flex-col justify-between min-h-[220px] hover:shadow-md transition-all">
      <div className={`absolute left-0 top-6 w-1 h-7 rounded-r-md ${theme.bar}`}></div>

      {/* Main Content */}
      <div className="pl-3">
        
        {/* Title */}
        <h3 className="font-semibold text-[17px] text-gray-800 mb-3.5 tracking-tight">
          {task.title}
        </h3>
        
        {/* Date & Time Row */}
        <div className="flex items-center gap-7 text-[13px] text-gray-700 font-medium mb-4">
          <div className="flex items-center gap-2">
            <Calendar className={`w-[15px] h-[15px] ${theme.icon}`} strokeWidth={2.5} />
            <span>{task.dueDate}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className={`w-[15px] h-[15px] ${theme.icon}`} strokeWidth={2.5} />
            <span>{task.dueTime}</span>
          </div>
        </div>

        {/* Description */}
        <p className="text-[13px] text-gray-600 mb-5 leading-relaxed line-clamp-2 min-h-[40px]">
          {task.description || "No description provided."}
        </p>
        
        {/* Progress & Status Row */}
        <div className="flex items-center gap-7 text-[13px] text-gray-600 mb-2">
           <div className="flex items-center gap-2">
             <CircleDashed className={`w-[16px] h-[16px] ${theme.icon}`} strokeWidth={2.5} />
             <span>Progress: <span className="font-bold text-gray-800">{task.progress}</span></span>
           </div>
           <div className="flex items-center gap-2">
             <CheckCircle2 className={`w-[16px] h-[16px] ${theme.icon}`} strokeWidth={2.5} />
             <span>Status: <span className="font-bold text-gray-800">{task.status || "To Do"}</span></span>
           </div>
        </div>
      </div>

      {/* Action Buttons (Footer) */}
      <div className="flex items-center justify-between mt-auto pt-6 pl-3">
        <div className="flex items-center gap-4">
          
          {/* EDIT BUTTON */}
          <button 
            onClick={() => onEdit(task)} 
            className="text-[#1976D2] hover:text-blue-800 transition-colors cursor-pointer"
            title="Edit Task"
          >
            <SquarePen className="w-5 h-5" strokeWidth={2} />
          </button>

          {/* DELETE BUTTON */}
          <button 
            onClick={() => onDelete(task._id)} 
            className="text-[#D32F2F] hover:text-red-800 transition-colors cursor-pointer"
            title="Delete Task"
          >
            <Trash2 className="w-5 h-5" strokeWidth={2} />
          </button>

        </div>
        
        {/* Favorite Icon (Star) - 2. Yahan onClick add kiya */}
        <button 
          onClick={() => onToggleFavorite(task._id)} 
          className="text-[#1976D2] hover:text-blue-800 transition-colors cursor-pointer"
          title="Toggle Favorite"
        >
          <Star className={`w-[22px] h-[22px] ${task.isFavorite ? "fill-[#1976D2]" : ""}`} strokeWidth={2} />
        </button>
      </div>
      
    </div>
  );
};

export default TaskCard;