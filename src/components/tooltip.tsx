import React from "react";

interface ToolTipProps {
  title: string;
}

export default function ToolTip({ title }: ToolTipProps) {
  return (
    <>
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-max bg-base text-white text-sm px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        {title}
      </div>
    </>
  );
}
