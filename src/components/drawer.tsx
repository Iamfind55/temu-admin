import React from "react";

type DrawerTypes = {
  isOpen: boolean;
  children: React.ReactNode;
  onClose?: () => void;
  icon?: React.ReactNode;
  title?: string;
  className?: string;
};

const Drawer = ({ isOpen, children, className }: DrawerTypes) => {
  if (!isOpen) return null;

  return (
    <>
      <div className={`${className}`}>{children}</div>
    </>
  );
};

export default Drawer;
