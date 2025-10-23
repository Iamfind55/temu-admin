import { ArrowNextIcon } from "@/icons/page";
import Image from "next/image";
import React, { InputHTMLAttributes } from "react";

interface cardProps extends InputHTMLAttributes<HTMLInputElement> {
  image?: string;
  title?: string;
  description?: string;
  link?: string;
}

export default function ServiceCard(props: cardProps) {
  return (
    <div className="flex items-start justify-start flex-col select-none gap-2 w-full">
      <div className="max-w-sm bg-white rounded border border-gray-200 rounded-lg shadow hover:shadow-lg transition-shadow duration-300 ease-out">
        <a href="#">
          <Image
            className="rounded-t-lg"
            src={props?.image ?? ""}
            alt=""
            width={500}
            height={500}
          />
        </a>
        <div className="p-3">
          <a href="#">
            <h5 className="mb-2 text-secondary font-bold tracking-tight">
              {props?.title}
            </h5>
          </a>
          <p className="mb-3 font-normal text-sm text-b_text">
            {props?.description}
          </p>
          <br />
          <a
            href="#"
            className="flex items-center justify-start px-3 py-2 text-sm font-medium text-center text-base rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none"
          >
            <span>Read more</span> &nbsp; <ArrowNextIcon size={22} />
          </a>
        </div>
      </div>
    </div>
  );
}
