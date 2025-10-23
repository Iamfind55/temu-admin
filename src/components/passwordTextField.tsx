"use client";

import { Link } from "@/i18n/navigation";
import { CloseEyeIcon, OpenEyeIcon } from "@/icons/page";
import React, { InputHTMLAttributes, useState } from "react";

interface TextfieldProps extends InputHTMLAttributes<HTMLInputElement> {
  helperText?: string;
}

export default function Password(props: TextfieldProps) {
  const [ispassword, setIspassword] = useState(true);
  return (
    <div className="block select-none ">
      <label
        className={`${props.color} block text-sm text-gray-500`}
        htmlFor={props?.id}
      >
        {props?.title}{" "}
        {props?.required && <span className="text-red-500">&nbsp;*</span>}
      </label>
      <div className="flex items-center relative">
        <input
          id={props?.id}
          type={ispassword ? "password" : "text"}
          className={`${props.color} text-gray-500 text-sm rounded w-full border pr-[50px] focus:bg-white focus:ring-1 focus:ring-primary outline-none py-1 px-3 leading-8 transition-colors duration-200 ease-in-out font-sans`}
          {...props}
        />
        <button
          type="button"
          className="absolute right-0 w-[40px] text-base p-3 pt-4"
          onClick={() => setIspassword((res) => !res)}
        >
          {ispassword ? <OpenEyeIcon /> : <CloseEyeIcon />}
        </button>
      </div>
      <div className="text-end">
        <Link href="#">
          <i className="text-sm text-error">{props?.helperText}</i>
        </Link>
      </div>
    </div>
  );
}
