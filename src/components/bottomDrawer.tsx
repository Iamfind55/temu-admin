import { useEffect } from "react";
import { CancelIcon } from "@/icons/page";
import React from "react";

type DrawerTypes = {
  isOpen: boolean;
  children: React.ReactNode;
  onClose?: () => void;
  icon?: React.ReactNode;
  title?: string;
  className?: string;
};

const BottomDrawer = ({
  isOpen,
  children,
  className,
  onClose,
}: DrawerTypes) => {
  const drawerRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        drawerRef.current &&
        !drawerRef.current.contains(event.target as Node)
      ) {
        onClose && onClose(); // Close the drawer when clicking outside
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-99 bg-black bg-opacity-50 backdrop-blur-sm"></div>
      <div ref={drawerRef} className={`${className}`}>
        <div
          id="drawer-bottom-example"
          className="fixed bottom-0 left-0 right-0 w-full pt-4 overflow-y-auto transition-transform transform-none"
          tabIndex={-1}
          aria-labelledby="drawer-bottom-label"
        >
          <button
            className="flex items-end justify-end p-2 bg-gray-100 w-full"
            onClick={onClose}
          >
            <CancelIcon size={22} className="text-error" />
          </button>
          {children}
        </div>
      </div>
    </>
  );
};

export default BottomDrawer;
