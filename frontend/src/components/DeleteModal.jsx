import React from "react";

const DeleteModal = ({ isOpen, onClose, message, title = "Item Removed" }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="relative z-10 w-full max-w-sm transform overflow-hidden rounded-2xl bg-surface border border-white/10 p-6 shadow-2xl transition-all animate-in fade-in zoom-in-95 duration-200">
        <div className="flex flex-col items-center text-center">
          {/* Delete Icon */}
          <div className="mb-4 rounded-full bg-red-500/20 p-3 text-red-500 ring-1 ring-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.3)]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 6h18" />
              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
              <line x1="10" y1="11" x2="10" y2="17" />
              <line x1="14" y1="11" x2="14" y2="17" />
            </svg>
          </div>

          <h3 className="text-xl font-bold text-text-main mb-2 tracking-tight">
            {title}
          </h3>
          <p className="text-text-muted mb-8 text-sm leading-relaxed max-w-[260px]">
            {message}
          </p>

          <button
            onClick={onClose}
            className="w-full rounded-xl bg-surface-hover border border-white/10 py-2.5 text-sm font-medium text-text-main hover:bg-white/5 transition-all active:scale-95"
          >
            Okay
          </button>
        </div>

        {/* Close Button X */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-text-muted/50 hover:text-text-main p-1 rounded-full hover:bg-white/5 transition-all"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M18 6L6 18" />
            <path d="M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default DeleteModal;
