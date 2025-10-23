"use client";

import React, { ReactNode } from "react";

// components
import Breadcrumb from "@/components/breadCrumb";
import ReportCard from "@/components/reportCard";
import {
  AppleIcon,
  CartCancelIcon,
  CartIcon,
  CartPlusIcon,
  DepositIcon,
} from "@/icons/page";
import { useLazyQuery } from "@apollo/client";
import { QUERY_ADMIN_DASHBOARD } from "@/api/dashboard";
import { formatStringAndNumber } from "@/utils/formatNumber";

type ReportItem = {
  title: string;
  amount: string;
  percent: number;
  icon: ReactNode;
};

export default function DashboardPage() {
  const [getDashboards, { data }] = useLazyQuery(QUERY_ADMIN_DASHBOARD, {
    fetchPolicy: "cache-and-network",
  });

  React.useEffect(() => {
    getDashboards();
  }, [getDashboards]);

  // Helper function to format currency with 2 decimal places
  const formatCurrency = (value: number | string | undefined): string => {
    if (value === undefined) return "0.00";
    const numString = String(value).replace(/,/g, '');
    const numValue = parseFloat(numString);

    if (isNaN(numValue)) return "0.00";

    const [integerPart, decimalPart] = numValue.toFixed(2).split('.');
    const formattedInteger = parseInt(integerPart).toLocaleString('en-US');

    return `${formattedInteger}.${decimalPart}`;
  };

  const reportItems: ReportItem[] = [
    {
      title: "My Products",
      amount: `${formatStringAndNumber(data?.adminGetProductDashboard?.data?.total || "0")}`,
      percent: Number(data?.adminGetProductDashboard?.data?.increase) || 0,
      icon: <AppleIcon size={18} className="text-white" />,
    },

    {
      title: "Total Income",
      amount: `$${formatCurrency(data?.adminGetTotalIncomeDashboard?.data?.total || "0")}`,
      percent: Number(data?.adminGetTotalIncomeDashboard?.data?.increase) || 0,
      icon: <DepositIcon size={18} className="text-white" />,
    },
    {
      title: "Total Orders",
      amount: `${formatStringAndNumber(data?.adminGetTotalOrderDashboard?.data?.total || "0")}`,
      percent: Number(data?.adminGetTotalOrderDashboard?.data?.increase) || 0,
      icon: <CartIcon size={18} className="text-white" />,
    },
    {
      title: "New Orders",
      amount: `${formatStringAndNumber(data?.adminGetTotalNewOrderDashboard?.data?.total || "0")}`,
      percent:
        Number(data?.adminGetTotalNewOrderDashboard?.data?.increase) || 0,
      icon: <CartPlusIcon size={18} className="text-white" />,
    },
    {
      title: "Total Canceled Orders",
      amount: `${formatStringAndNumber(data?.adminGetTotalCanceledOrderDashboard?.data?.total || "0")}`,
      percent:
        Number(data?.adminGetTotalCanceledOrderDashboard?.data?.increase) || 0,
      icon: <CartCancelIcon size={18} className="text-white" />,
    },
    {
      title: "Total today's income",
      amount: `$${formatCurrency(data?.adminGetTotalTodayIncomeDashboard?.data?.total || "0")}`,
      percent:
        Number(data?.adminGetTotalTodayIncomeDashboard?.data?.increase) || 0,
      icon: <DepositIcon size={18} className="text-white" />,
    },
  ];
  return (
    <div className="text-b_text flex items-start justify-start flex-col gap-4">
      <Breadcrumb items={[{ label: "Dashboard", value: "/client" }]} />
      <div className="w-full flex items-start justify-between">
        <div className="w-full grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {reportItems.map((item, index) => (
            <ReportCard
              key={index}
              title={item.title}
              amount={item.amount}
              percent={item.percent}
              icon={item.icon}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
