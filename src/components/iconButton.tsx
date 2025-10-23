import React, { ButtonHTMLAttributes } from "react";

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: any;
  isFront?: boolean; // Optional boolean prop
  onClick?: () => void; // Optional onClick function
}

export default function IconButton({
  icon,
  isFront,
  onClick,
  ...props
}: IconButtonProps) {
  return (
    <button
      {...props}
      onClick={onClick} // Assign onClick function
      className={`flex items-center justify-center hover:opacity-90 transition duration-300 active:scale-105 ${props.className} py-1 sm:py-2 px-2 sm:px-4 font-heebo w-auto`}
    >
      {isFront && <i>{icon ? icon : ""}</i>}
      &nbsp;&nbsp;{props.title}&nbsp;&nbsp;
      {!isFront && <i>{icon ? icon : ""}</i>}
    </button>
  );
}
