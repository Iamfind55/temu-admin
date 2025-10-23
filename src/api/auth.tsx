import { gql } from "@apollo/client";

export const ActionSignUp = gql`
  mutation ShopRegister($data: CreateShopInput!) {
    shopRegister(data: $data) {
      data {
        token
      }
      error {
        message
        code
        details
      }
      success
    }
  }
`;

export const ADMIN_SIGN_IN = gql`
  mutation StaffLogin($where: StaffWhereLoginInput) {
    staffLogin(where: $where) {
      success
      data {
        token
        data {
          id
          firstName
          lastName
          username
          email
          dob
          image
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

export const ActionLogout = gql`
  mutation ShopForgotPassword($email: String!) {
    shopForgotPassword(email: $email) {
      success
      error {
        message
        code
        details
      }
    }
  }
`;

export const RESET_PASSWORD = gql`
  mutation ShopResetPassword($data: ShopResetPasswordInput!) {
    shopResetPassword(data: $data) {
      success
      error {
        message
        code
        details
      }
    }
  }
`;
