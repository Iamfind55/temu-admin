import React from "react";
import Link from "next/link";
import { NextIcon } from "@/icons/page";

interface BreadcrumbItem {
  label: string;
  value: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
  return (
    <nav className="flex items-center space-x-1 text-gray-400 text-sm">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <React.Fragment key={index}>
            {!isLast ? (
              <>
                <Link href={item.value} className="text-gray-500 text-sm">
                  {item.label}
                </Link>
                <NextIcon
                  className="text-gray-500 text-sm font-bold"
                  size={20}
                />
              </>
            ) : (
              <span className="text-gray-500 text-sm">{item.label}</span>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};

export default Breadcrumb;
