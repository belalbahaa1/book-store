import React from "react";
import { useNavigate } from "react-router-dom";

const SuccessModal = ({ isOpen, onClose, message, title = "Success!" }) => {
  const navigate = useNavigate();

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
          {/* Success Icon */}
          <div className="mb-4 rounded-full bg-green-500/20 p-3 text-green-500 ring-1 ring-green-500/50 shadow-[0_0_15px_rgba(34,197,94,0.3)]">
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
              <path d="M20 6L9 17l-5-5" />
            </svg>
          </div>

          <h3 className="text-xl font-bold text-text-main mb-2 tracking-tight">
            {title}
          </h3>
          <p className="text-text-muted mb-8 text-sm leading-relaxed max-w-[260px]">
            {message}
          </p>

          <div className="grid grid-cols-2 gap-3 w-full">
            <button
              onClick={onClose}
              className="w-full rounded-xl border border-white/10 bg-surface-hover py-2.5 text-sm font-medium text-text-main hover:bg-white/5 transition-all active:scale-95"
            >
              Keep Shopping
            </button>
            <button
              onClick={() => navigate("/cart")}
              className="w-full rounded-xl bg-primary py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary/25 hover:bg-indigo-500 hover:shadow-primary/40 transition-all active:scale-95"
            >
              Go to Cart
            </button>
          </div>
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

export default SuccessModal;
