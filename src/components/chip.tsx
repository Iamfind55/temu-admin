import React from "react";

type ChipProps = {
  label: string;
  selected?: boolean;
  onClick?: () => void;
  className?: string;
};

const Chip: React.FC<ChipProps> = ({ label, selected = false, onClick, className = "" }) => {
  return (
    <button
      onClick={onClick}
      className={`
        px-3 py-1 rounded-full text-sm font-medium border transition-all
        ${selected
          ? "bg-blue-600 text-white border-blue-600"
          : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"}
        ${className}
      `}
    >
      {label}
    </button>
  );
};

export default Chip;
