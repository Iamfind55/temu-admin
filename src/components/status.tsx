import React from "react";

interface StatusBadgeProps {
  status: string;
}

const useStatus = {
  ACTIVE: "ACTIVE",
  SUCCESS: "SUCCESS",
  INACTIVE: "INACTIVE",
  DELETED: "DELETED",
  FAILED: "FAILED",
  LOCKED: "LOCKED",
  BLOCKED: "BLOCKED",
  PENDING: "PENDING",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
  CANCLED: "CANCLED",
  CANCELLED: "CANCELLED",
  COMPLETED: "COMPLETED",
  CONNECTED: "CONNECTED",
  WITHDRAW: "WITHDRAW",
  RECHARGE: "RECHARGE",
  NO_PICKUP: "NO_PICKUP",
  NOT_DELIVERY: "NOT_DELIVERY",
};

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {

  const getStatusStyles = (status: string) => {
    switch (status) {
      case useStatus.ACTIVE:
        return {
          className: "bg-green-100 text-green-500",
          weight: "bg-green-500",
        };
      case useStatus.CONNECTED:
        return {
          className: "bg-green-100 text-green-500",
          weight: "bg-green-500",
        };
      case useStatus.APPROVED:
        return {
          className: "bg-green-100 text-green-500",
          weight: "bg-green-500",
        };
      case useStatus.SUCCESS:
        return {
          className: "bg-green-100 text-green-500",
          weight: "bg-green-500",
        };
      case useStatus.INACTIVE:
        return {
          className: "bg-red-100 text-red-500",
          weight: "bg-red-500",
        };
      case useStatus.COMPLETED:
        return {
          className: "bg-green-100 text-green-500",
          weight: "bg-green-500",
        };
      case useStatus.RECHARGE:
        return {
          className: "bg-green-100 text-green-500",
          weight: "bg-green-500",
        };
      case useStatus.WITHDRAW:
        return {
          className: "bg-red-100 text-red-500",
          weight: "bg-red-500",
        };
      case useStatus.DELETED:
        return {
          className: "bg-red-100 text-red-500",
          weight: "bg-red-500",
        };
      case useStatus.DELETED:
        return {
          className: "bg-red-100 text-red-500",
          weight: "bg-red-500",
        };
      case useStatus.CANCELLED:
        return {
          className: "bg-red-100 text-red-500",
          weight: "bg-red-500",
        };
      case useStatus.REJECTED:
        return {
          className: "bg-red-100 text-red-500",
          weight: "bg-red-500",
        };
      case useStatus.FAILED:
        return {
          className: "bg-red-100 text-red-500",
          weight: "bg-red-500",
        };
      case useStatus.LOCKED:
        return {
          className: "bg-cyan-100 text-secondary",
          weight: "bg-secondary",
        };
      case useStatus.PENDING:
        return {
          className: "bg-yellow-200 text-yellow-500",
          weight: "bg-yellow-500",
        };
      case useStatus.BLOCKED:
        return {
          className: "bg-cyan-100 text-white",
          weight: "bg-white",
        };
      case useStatus.NO_PICKUP:
        return {
          className: "bg-red-200 text-red-500",
          weight: "bg-red-500",
        };
      case useStatus.NOT_DELIVERY:
        return {
          className: "bg-gray-200 text-gray-500",
          weight: "bg-gray-500",
        };
      default:
        return {
          className: "bg-gray-200 text-gray-500",
          weight: "bg-b_text",
        };
    }
  };

  const { className, weight } = getStatusStyles(status);

  return (
    <span
      className={`${className} inline-flex items-center text-xs font-medium px-2.5 py-4 rounded-lg`}
    >
      <span className={`w-2 h-2 me-1 rounded-full ${weight}`}></span>
      {status}
    </span>
  );
};

export default StatusBadge;
