import { EBaseStatus, ErrorDetails, IBaseType, IDateBetween } from "./base";
import { IPaymentMethod } from "./shop";

export interface ICustomerType extends IBaseType {
  firstName: string;
  lastName: string;
  username: string;
  password: string;
  email: string;
  phone_number: string;
  dob: Date;
  image: string;
  customer_type?: string;
  customer_address?: string;
  status: EBaseStatus;
  payment_method: [IPaymentMethod];
}

export interface ICustomerWhereInput {
  status: EBaseStatus;
  keyword: string;
  createdAtBetween: IDateBetween;
}

export interface ICustomerWhereLoginInput {
  username: string;
  password: string;
}

export interface ICustomerLoginResponse {
  token: string;
  data: ICustomerType;
}

export interface GetCustomerResponse {
  getCustomers: {
    success: boolean;
    total: number;
    data: ICustomerType[];
    error?: ErrorDetails;
  };
}

export interface ICustomer {
  id: string;
  dob: string;
  email: string;
  image: string;
  lastName: string;
  username: string;
  password: string;
  firstName: string;
  phone_number: string;
  status?: string;
  customer_type?: string;
  customer_address?: string;
}
