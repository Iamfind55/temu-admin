import { EBaseStatus, IBaseType, IDateBetween, EDeliveryType } from "./base";
import { ICustomerType } from "./customer";
import { ILogisticType } from "./logistics";
import { IShopType } from "./shop";

export interface IOrderTypes extends IBaseType {
  order_no: string;
  total_quantity: number;
  total_price: number;
  total_discount: number;
  total_products: number;
  expected_revenue: number;
  profit: number;
  shop_id: string;
  shop: IShopType;
  customer_id: string;
  address_id: string;
  payment_slip: string;
  status: EBaseStatus;
  order_status: EOrderStatus;
  payment_status: EPaymentStatus;
  delivery_type: EDeliveryType;
  sign_in_status: ESignInStatus;
  customerData: ICustomerType;
  logistics: ILogisticType;
}

export interface IOrderWhereInput {
  order_no: string;
  keyword: string;
  order_status: EOrderStatus;
  createdAtBetween: IDateBetween;
}

export enum EOrderStatus {
  NO_PICKUP = "NO_PICKUP",
  PROCESSING = "PROCESSING",
  PACKING = "PACKING",
  SHIPPING = "SHIPPING",
  SUCCESS = "SUCCESS",
  CANCELLED = "CANCELLED",
  FAILED = "FAILED",
}

export enum ESignInStatus {
  NOT_DELIVERY = "NOT_DELIVERY",
  PACKING = "PACKING",
  ON_THE_WAY = "ON_THE_WAY",
  CANCELLED = "CANCELLED",
  SUCCESS = "SUCCESS",
  FAILED = "FAILED",
}

export enum EPaymentStatus {
  FAILED = "FAILED",
  PROCESSING = "PROCESSING",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
}
