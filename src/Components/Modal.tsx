import React, { ReactNode } from "react";

interface ModalProps {
  children: ReactNode;
  isOpen: boolean;
  onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ children, isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50">
      <div className="p-5 bg-white rounded-lg shadow-lg z-50">
        {children}
        <button onClick={onClose} className="mt-2.5">
          Close
        </button>
      </div>
    </div>
  );
};

export default Modal;
