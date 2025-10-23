import { ErrorDetails, IBaseType, IDateBetween } from "./base";

export interface IShopType extends IBaseType {
  fullname?: string | null;
  username?: string | null;
  password?: string | undefined;
  email?: string | null;
  dob?: string;
  status: EShopStatus;
  shop_vip?: number | 1;
  shop_star?: number | 1;
  profit?: number | 0;
  payment_method?: IPaymentMethod[];
  image: IShopImage;
  id_card_info: IShopIdCardInfo;
  request_vip_data?: IrequestVIP;
  store_name?: string | null;
  remark?: string | null;
  phone_number?: string | null;
  shop_address?: string | null;
}

export interface IrequestVIP {
  request_status?: string;
  request_vip?: string;
}

export interface GetShopResponse {
  adminGetShops: {
    success: boolean;
    total: number;
    data: IShopType[];
    error?: ErrorDetails;
  };
}

export interface IShopResetPassword {
  new_password: string | null;
  token: string | null;
}

export interface IShopWhereInput {
  shop_id: string | null;
  status: EShopStatus;
  keyword: string | null;
  shop_vip: number;
  createdAtBetween: IDateBetween;
}

export interface IShopWhereLoginInput {
  username: string | null;
  password: string | null;
}

export interface IShopLoginResponse {
  token: string | null;
  data: IShopType;
}

export enum EShopRole {
  Shop = "Shop",
  ADMIN = "ADMIN",
}

export interface IShopImage {
  logo: string;
  cover: string;
}

export interface IShopIdCardInfo {
  id_card_number: string;
  id_card_image_front: string;
  id_card_image_back: string;
  id_card_image: string;
}

export interface IPaymentMethod {
  id: string | null;
  code: string | null;
  bank_name: string | null;
  bank_account_name: string | null;
  bank_account_number: string | null;
  is_enable: boolean;
}

export enum EShopStatus {
  PENDING = "PENDING",
  ACTIVE = "ACTIVE",
  FROZEN = "FROZEN",
  INACTIVE = "INACTIVE",
}
