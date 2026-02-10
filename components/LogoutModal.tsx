"use client";

interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function LogoutModal({ isOpen, onClose, onConfirm }: LogoutModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl p-8 w-full max-w-sm shadow-2xl animate-in fade-in zoom-in duration-200">
        <h2 className="text-xl font-bold text-gray-800 text-center mb-2">Logout</h2>
        <p className="text-gray-500 text-center mb-8">
          Are you sure you want to log out of your account?
        </p>
        
        <div className="flex gap-4">
          <button
            onClick={onClose}
            className="flex-1 py-3 px-4 rounded-lg border border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
          >
            No
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-3 px-4 rounded-lg bg-[#E59416] text-white font-semibold hover:bg-[#D97706] transition-colors shadow-lg shadow-orange-200"
          >
            Yes, Log out
          </button>
        </div>
      </div>
    </div>
  );
}