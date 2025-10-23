import { ErrorDetails } from "./base";

export interface ICustomer {
  firstName: string;
  lastName: string;
}

export interface IShop {
  store_name: string;
}

export interface ITransactions {
  id: string;
  amount: number;
  coin_type: string;
  status: string;
  payment_slip: string;
  transaction_status: string;
  customer?: ICustomer;
  shop?: IShop;
  identifier: string;
  created_at: string;
}

export interface GetITransactionResponse {
  adminGetTransactionHistories: {
    success: boolean;
    total: number;
    data: ITransactions[];
    error?: ErrorDetails;
  };
}

// New types for transaction
export interface PaymentMethod {
  id: string;
  bank_name: string;
  bank_account_name: string;
  bank_account_number: string;
}

export interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone_number: string;
  username: string;
  image: string;
  created_at: string;
  status: string;
  dob: string;
  payment_method?: PaymentMethod[];
}

export interface ShopImage {
  cover: string;
  logo: string;
}

export interface IShop {
  id: string;
  fullname: string;
  image: ShopImage;
  phone_number: string;
  email: string;
  created_at: string;
  store_name: string;
  status: string;
  username: string;
  shop_address: string;
  dob: string;
  payment_method?: PaymentMethod;
}

export interface ITransaction {
  id: string;
  amount: number;
  coin_type: string;
  identifier: string;
  payment_slip: string;
  status: string;
  transaction_status: string;
  wallet_id: string;
  created_at: string;
  shop_id: string;
  account_number: string;
  customer?: Customer;
  shop?: IShop;
}

export interface GetISingleTransactionResponse {
  adminGetTransactionHistory: {
    success: boolean;
    total: number;
    data: ITransaction;
    error?: ErrorDetails;
  };
}
