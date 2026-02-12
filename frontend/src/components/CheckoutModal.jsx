import React, { useState } from "react";

const CheckoutModal = ({ isOpen, onClose, onConfirm, total }) => {
  const [location, setLocation] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onConfirm({ location, phoneNumber });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="relative z-10 w-full max-w-md transform overflow-hidden rounded-2xl bg-surface border border-white/10 p-6 shadow-2xl transition-all animate-in fade-in zoom-in-95 duration-200">
        <div className="flex flex-col">
          <h3 className="text-xl font-bold text-text-main mb-2 tracking-tight text-center">
            Complete Your Order
          </h3>
          <p className="text-text-muted mb-6 text-sm text-center">
            Total Amount:{" "}
            <span className="text-primary font-bold">${total.toFixed(2)}</span>
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-muted mb-1">
                Delivery Location
              </label>
              <textarea
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Enter your full address"
                className="w-full rounded-xl bg-background border border-white/10 p-3 text-text-main placeholder:text-text-muted/30 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all resize-none h-24"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-muted mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                required
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="e.g. +1 234 567 890"
                className="w-full rounded-xl bg-background border border-white/10 p-3 text-text-main placeholder:text-text-muted/30 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
              />
            </div>

            <div className="flex gap-3 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 rounded-xl bg-surface-hover border border-white/10 py-3 text-sm font-medium text-text-main hover:bg-white/5 transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 rounded-xl bg-primary py-3 text-sm font-semibold text-white shadow-lg shadow-primary/25 hover:bg-indigo-600 transition-all hover:scale-[1.02] active:scale-95"
              >
                Confirm Order
              </button>
            </div>
          </form>
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

export default CheckoutModal;
