import { gql } from "@apollo/client";

export const GET_SHOP_WALLET_BY_ADMIN = gql`
  query AdminGetWallet($adminGetWalletId: ID!) {
    adminGetWallet(id: $adminGetWalletId) {
      success
      data {
        id
        name
        status
        shop_id
        total_balance
        total_frozen_balance
        total_recharged
        total_withdraw
        total_withdraw_able_balance
        created_at
      }
      error {
        message
        code
        details
      }
    }
  }
`;
