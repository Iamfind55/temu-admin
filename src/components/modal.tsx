import { CancelIcon, CloseEyeIcon } from "@/icons/page";
import React, { useRef, useEffect } from "react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
  outside?: boolean
};

const MyModal = ({ isOpen, onClose, children, className, outside = false }: Props) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (outside &&
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.body.style.overflow = "hidden";
      document.addEventListener("mousedown", handleOutsideClick);
    } else {
      document.body.style.overflow = "auto";
      document.removeEventListener("mousedown", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isOpen, onClose]);

  return (
    <div>
      {isOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 transition-opacity duration-300"></div>
      )}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-center items-center">
          <div
            ref={modalRef}
            className={`relative transition-all duration-300 ease-out max-h-[90vh] overflow-y-auto p-6 rounded-2xl text-base bg-white shadow-xl w-[95%] sm:w-[90%] md:w-[80%] lg:w-[70%] xl:w-[60%] ${className || ""}`}
          >
            <button
              onClick={onClose}
              className="absolute top-3 right-3 p-1 rounded-lg bg-gray-100 hover:bg-orange-200 transition"
              aria-label="Close modal"
            >
              <CancelIcon className="w-5 h-5 text-gray-600 hover:text-gray-800" />
            </button>
            {children}
          </div>
        </div>
      )}
    </div>
  );
};

export default MyModal;
