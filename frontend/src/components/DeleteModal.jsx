import React from "react";

const DeleteModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] px-4">
      {/* Modal Box */}
      <div className="bg-white rounded-sm shadow-xl w-full max-w-[480px] p-6 animate-in fade-in duration-200">
        
        {/* Title */}
        <h2 className="text-[20px] font-medium text-gray-900 mb-3">
          Confirm Deletion
        </h2>
        
        {/* Description */}
        <p className="text-gray-600 text-[15px] mb-8 leading-relaxed">
          This action cannot be done. Are you sure you want to permanently delete
          this task from Tasker?
        </p>
        
        {/* Buttons (DISAGREE & AGREE) */}
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-[#1976D2] font-semibold text-sm rounded hover:bg-blue-50 transition-colors uppercase"
          >
            Disagree
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-[#1976D2] font-semibold text-sm rounded hover:bg-blue-50 transition-colors uppercase"
          >
            Agree
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;