import { formatNumber } from "@/utils/formatNumber";
import React, { InputHTMLAttributes, ReactNode } from "react";

interface cardProps extends InputHTMLAttributes<HTMLInputElement> {
  title: string;
  amount: string;
  percent?: number;
  icon: ReactNode;
}

export default function WalletCard(props: cardProps) {
  return (
    <div className="w-auto bg-white p-1 sm:p-2 rounded-md flex items-start justify-start flex-col select-none gap-1 sm:gap-2 hover:cursor-pointer group transition-all duration-300 border">
      <div className="p-2 w-full flex items-start justify-start gap-4">
        <div className="rounded-full transition-all duration-300">
          {props?.icon}
        </div>
        <div className="flex items-start justify-start flex-col gap-2">
          <p className="text-sm font-medium text-gray-500">{props?.title}</p>
          <h3 className="text-md font-medium text-gray-500">
            ${formatNumber(parseFloat(props?.amount ?? "0"))}
          </h3>
        </div>
      </div>
    </div>
  );
}
