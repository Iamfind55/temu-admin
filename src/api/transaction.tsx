import { gql } from "@apollo/client";

export const QUERY_ADMIN_GET_TRANSACTIONS = gql`
  query AdminGetTransactionHistories(
    $page: Int
    $limit: Int
    $sortedBy: BaseOrderByInput
    $where: TransactionHistoryWhereInput
  ) {
    adminGetTransactionHistories(
      page: $page
      limit: $limit
      sortedBy: $sortedBy
      where: $where
    ) {
      success
      total
      data {
        id
        amount
        coin_type
        status
        payment_slip
        transaction_status
        identifier
        created_at
        customer {
          firstName
          lastName
        }
        shop {
          store_name
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
        transaction_status
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
