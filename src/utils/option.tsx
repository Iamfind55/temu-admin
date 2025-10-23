import { ETransportMode } from "@/enum";
import { TypeOptions } from "@/types/data";

export const transactions: any = [
  { label: "All", value: "" },
  { label: "Deposit", value: "RECHARGE" },
  { label: "Withdraw", value: "WITHDRAW" },
];

export const customer_status: any = [
  { label: "All", value: "" },
  { label: "Active", value: "ACTIVE" },
  { label: "Inactive", value: "INACTIVE" },
];


export const TransportModeOption: TypeOptions[] = [
  { label: "Air", value: ETransportMode.AIR },
  { label: "Pickup", value: ETransportMode.PICKUP },
  { label: "Rail", value: ETransportMode.RAIL },
  { label: "Road", value: ETransportMode.ROAD },
  { label: "Sea", value: ETransportMode.SEA },
  { label: "Warehouse", value: ETransportMode.WAREHOUSE },
];
export const LogisticsOpion: TypeOptions[] = [
  { label: "Active", value: "ACTIVE" },
  { label: "Inactive", value: "INACTIVE" },
];
export const shop_status: any = [
  { label: "All", value: "" },
  { label: "Frezen", value: "FROZEN" },
  { label: "Active", value: "ACTIVE" },
  { label: "Inactive", value: "INACTIVE" },
  { label: "Pending", value: "PENDING" },
];

export const vip_level: any = [
  { label: "All", value: "" },
  { label: "VIP 1", value: 1 },
  { label: "VIP 2", value: 2 },
  { label: "VIP 3", value: 3 },
  { label: "VIP 4", value: 4 },
  { label: "VIP 5", value: 5 },
];

export const times: any = [
  { label: "30 Minute", value: 30 },
  { label: "1 Hour", value: 60 },
  { label: "2 Hours", value: 120 },
  { label: "5 Hours", value: 300 },
];

export const page_limits: any = [
  { label: "10", value: 10 },
  { label: "30", value: 30 },
  { label: "50", value: 50 },
  { label: "100", value: 100 },
];

export const coin_type: any = [
  { label: "All", value: "" },
  { label: "BTC", value: "BTC" },
  { label: "ERC20", value: "ERC20" },
  { label: "TRC20", value: "TRC20" },
];

export enum useStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
  DELETED = "deleted",
  LOCKED = "locked",
  BLOCKED = "blocked",
}
