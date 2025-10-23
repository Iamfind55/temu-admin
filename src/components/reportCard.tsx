// import React, { InputHTMLAttributes, ReactNode } from "react";

// interface cardProps extends InputHTMLAttributes<HTMLInputElement> {
//   title: string;
//   amount: string;
//   percent: number;
//   icon: ReactNode;
// }

// export default function ReportCard(props: cardProps) {
//   return (
//     <div className="w-auto bg-white p-4 rounded-md flex items-start justify-start flex-col select-none gap-2 hover:cursor-pointer group hover:shadow transition-all duration-300">
//       <div className="p-2 w-full flex items-center justify-between border-b">
//         <div className="flex items-start justify-start flex-col gap-1">
//           <p className="text-xs text-gray-500">{props?.title}</p>
//           <h3 className="text-lg text-gray-500">{props?.amount}</h3>
//         </div>
//         <div className="bg-neon_blue group-hover:bg-neon_pink rounded-full p-3 transition-all duration-300">
//           {props?.icon}
//         </div>
//       </div>
//       <div className="pl-2">
//         <p className="text-xs flex items-start justify-start">
//           <span className="text-green-500">{props?.percent}%</span>&nbsp; than
//           last month
//         </p>
//       </div>
//     </div>
//   );
// }

import React, { InputHTMLAttributes, ReactNode } from "react";

interface cardProps extends InputHTMLAttributes<HTMLInputElement> {
  title: string;
  amount: string;
  percent: number;
  icon: ReactNode;
}

export default function ReportCard(props: cardProps) {
  return (
    <div className="w-auto bg-white py-2 px-4 rounded-md flex items-start justify-start flex-col select-none gap-2 hover:cursor-pointer group hover:shadow transition-all duration-300 border border-gray-200">
      <div className="p-2 w-full flex items-center justify-between border-b">
        <div className="flex items-start justify-start flex-col gap-1">
          <p className="text-xs text-gray-500">{props?.title}</p>
          <h3 className="text-lg text-gray-500">{props?.amount}</h3>
        </div>
        <div className="bg-base group-hover:bg-neon_pink rounded p-3 transition-all duration-300">
          {props?.icon}
        </div>
      </div>
      <div className="pl-2">
        <p className="text-xs flex items-start justify-start">
          <span className="text-green-500">{props?.percent}%</span>&nbsp; than
          last month
        </p>
      </div>
    </div>
  );
}
