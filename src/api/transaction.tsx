import { gql } from "@apollo/client";

export const QUERY_ADMIN_GET_TRANSACTIONS = gql`
  query Data($where: TransactionHistoryWhereInput) {
  adminGetTransactionHistories(where: $where) {
    total
    data {
      id
      identifier
      amount
      coin_type
      payment_slip
      wallet_id
      status
      shop_id
      customer_id
      account_number
      created_by
      created_at
      updated_at
      customer {
        id
        firstName
        lastName
        username
        email
        phone_number
        dob
        image
        customer_address
        status
        customer_type
        created_by
        created_at
        updated_at
      }
      shop {
        id
        fullname
        store_name
        username
        phone_number
        email
        dob
        remark
        shop_address
        status
        shop_vip
        profit
        created_by
        created_at
        updated_at
        request_vip_data {
          request_vip
          request_status
          requested_at
          profit
        }
        totalFollower
        totalProduct
      }
    }
    error {
      message
      code
    }
  }
}
`;

export const QUERY_ADMIN_GET_TRANSACTION = gql`
  query AdminGetTransactionHistory($adminGetTransactionHistoryId: ID!) {
    adminGetTransactionHistory(id: $adminGetTransactionHistoryId) {
      success
      data {
        id
        amount
        coin_type
        identifier
        payment_slip
        status
        wallet_id
        created_at
        shop_id
        account_number
        customer {
          id
          firstName
          lastName
          email
          phone_number
          username
          image
          created_at
          status
          dob
          payment_method {
            id
            bank_name
            bank_account_name
            bank_account_number
          }
        }
        shop {
          id
          fullname
          image {
            cover
            logo
          }
          phone_number
          email
          created_at
          store_name
          status
          username
          shop_address
          dob
          payment_method {
            id
            bank_name
            bank_account_name
            bank_account_number
          }
        }
      }
      error {
        message
        code
        details
      }
    }
  }
`;

export const MUTATION_ADMIN_APPROVE_TRANSACTION = gql`
  mutation AdminApproveRechargeTransactionHistory(
    $adminApproveRechargeTransactionHistoryId: ID!
  ) {
    adminApproveRechargeTransactionHistory(
      id: $adminApproveRechargeTransactionHistoryId
    ) {
      success
      error {
        message
        code
        details
      }
    }
  }
`;

export const MUTATION_ADMIN_REJECT_TRANSACTION = gql`
  mutation AdminRejectTransactionHistory(
    $adminRejectTransactionHistoryId: ID!
  ) {
    adminRejectTransactionHistory(id: $adminRejectTransactionHistoryId) {
      success
      error {
        message
        code
        details
      }
    }
  }
`;
