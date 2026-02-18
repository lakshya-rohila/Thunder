import React, { useEffect, useState } from "react";

interface ErrorToastProps {
  message: string | null;
  onClose: () => void;
}

export default function ErrorToast({ message, onClose }: ErrorToastProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (message) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
        onClose();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [message, onClose]);

  if (!visible || !message) return null;

  return (
    <div className="fixed bottom-5 right-5 bg-red-500 text-white px-6 py-4 rounded-lg shadow-lg flex items-center z-50">
      <span>{message}</span>
      <button
        onClick={() => setVisible(false)}
        className="ml-4 font-bold text-xl"
      >
        &times;
      </button>
    </div>
  );
}
