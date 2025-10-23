export interface IBaseType {
  id: string;
  is_active?: boolean;
  created_at?: Date;
  updated_at?: Date;
  created_by?: string;
  updated_by?: string;
}

export enum BaseOrderByInput {
  created_at_ASC = "created_at_ASC",
  created_at_DESC = "created_at_DESC",
  updated_at_ASC = "updated_at_ASC",
  updated_at_DESC = "updated_at_DESC",
  sell_count_DESC = "sell_count_DESC",
  sell_count_ASC = "sell_count_ASC",
  price_DESC = "price_DESC",
  price_ASC = "price_ASC",
  position_DESC = "position_DESC",
  position_ASC = "position_ASC",
}

export enum EBaseStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}

export interface TokenData {
  id: string;
  username: string;
  type?: string;
}

export interface NameTranslateBase {
  name_en: string;
  name_es: string;
  name_ms: string;
  name_jp: string;
  name_th: string;
  name_vi: string;
  name_zh: string;
  name_zh_tw: string;
}

export enum EDeliveryType {
  STANDARD = "STANDARD", // Standard delivery (e.g., 3-5 business days)
  EXPRESS = "EXPRESS", // Express delivery (e.g., 1-2 business days)
  SAME_DAY = "SAME_DAY", // Same-day delivery
  NEXT_DAY = "NEXT_DAY", // Next-day delivery
  PICKUP = "PICKUP", // Customer picks up the order
  DIGITAL = "DIGITAL", // Digital delivery (e.g., for downloadable products)
  INTERNATIONAL = "INTERNATIONAL", // International delivery
  FREE = "FREE", // Free delivery
  DOOR_TO_DOOR = "DOOR_TO_DOOR",
}

export interface IDateBetween {
  startDate: string;
  endDate: string;
}

export interface ErrorDetails {
  message: string;
  code: string;
  details?: string;
};