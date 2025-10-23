import { gql } from "@apollo/client";

export const GET_SHOPS = gql`
  query AdminGetShops(
    $where: ShopWhereInput
    $limit: Int
    $page: Int
    $sortedBy: BaseOrderByInput
  ) {
    adminGetShops(
      where: $where
      limit: $limit
      page: $page
      sortedBy: $sortedBy
    ) {
      success
      total
      data {
        created_at
        email
        fullname
        id
        image {
          logo
          cover
        }
        phone_number
        profit
        shop_vip
        store_name
        updated_at
        shop_address
        status
        request_vip_data {
          request_status
          request_vip
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

export const CREATED_SHOP = gql`
  mutation CreateShop($data: CreateShopInput!) {
    createShop(data: $data) {
      success
      data {
        id
        email
      }
      error {
        message
        code
        details
      }
    }
  }
`;

export const DELETE_SHOP = gql`
  mutation DeleteShop($deleteShopId: ID!) {
    deleteShop(id: $deleteShopId) {
      success
      data {
        id
      }
      error {
        message
        code
        details
      }
    }
  }
`;

export const UPDATE_SHOP = gql`
  mutation AdminUpdateShop($data: UpdateShopInput!) {
    adminUpdateShop(data: $data) {
      success
      data {
        id
      }
      error {
        message
        code
        details
      }
    }
  }
`;

export const GET_SHOP = gql`
  query AdminGetShop($adminGetShopId: ID!) {
    adminGetShop(id: $adminGetShopId) {
      success
      data {
        id
        fullname
        store_name
        username
        phone_number
        email
        dob
        remark
        shop_address
        image {
          logo
          cover
        }
        id_card_info {
          id_card_number
          id_card_image_front
          id_card_image_back
          id_card_image
        }
        payment_method {
          id
          bank_name
          code
          bank_account_name
          bank_account_number
          is_enable
        }
        status
        shop_vip
        profit
        created_by
        created_at
        updated_at
      }
      error {
        message
        code
        details
      }
    }
  }
`;

export const APPROVE_SHOP = gql`
  mutation AdminApproveShop($adminApproveShopId: ID!) {
    adminApproveShop(id: $adminApproveShopId) {
      success
      data {
        id
      }
      error {
        message
        code
        details
      }
    }
  }
`;

export const MUTATION_BLOCK_SHOP = gql`
  mutation AdminUpdateShop($data: UpdateShopInput!) {
    adminUpdateShop(data: $data) {
      success
      error {
        message
        code
        details
      }
    }
  }
`;

export const MUTATION_APPROVE_VIP = gql`
  mutation AdminApproveShopRequestVIP($adminApproveShopRequestVipId: ID!) {
    adminApproveShopRequestVIP(id: $adminApproveShopRequestVipId) {
      success
      error {
        message
        code
        details
      }
    }
  }
`;
