"use client";

import Image from "next/image";

export default function EmptyPage() {
  return (
    <div className="flex items-center justify-center z-50">
      <div className="w-full flex items-center justify-center">
        <p className="text-b_text w-auto p-4 text-center">
          <Image
            src="https://res.cloudinary.com/dvh8zf1nm/image/upload/v1738860057/empty_page_lhcbrx.png"
            alt=""
            width={350}
            height={350}
          />
        </p>
      </div>
    </div>
  );
}
