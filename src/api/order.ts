import { gql } from "@apollo/client";

export const GET_ORDERS = gql`
  query AdminGetOrders(
    $limit: Int
    $page: Int
    $sortedBy: BaseOrderByInput
    $where: OrderWhereInput
  ) {
    adminGetOrders(
      limit: $limit
      page: $page
      sortedBy: $sortedBy
      where: $where
    ) {
      success
      total
      data {
        id
        order_no
        customer_id
        customerData {
          id
          firstName
          lastName
        }
        shop {
          id
          store_name
          fullname
        }
        logistics {
          id
          company_name
          logo
          cost
          status
          transport_modes
          created_by
          created_at
          updated_at
        }
        order_status
        payment_slip
        payment_status
        profit
        delivery_type
        sign_in_status
        total_discount
        total_price
        total_products
        total_quantity
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

export const ORDER_DETAILS = gql`
  query AdminGetOrderDetails(
    $where: OrderDetailWhereInput!
    $limit: Int
    $page: Int
    $sortedBy: BaseOrderByInput
  ) {
    adminGetOrderDetails(
      where: $where
      limit: $limit
      page: $page
      sortedBy: $sortedBy
    ) {
      success
      total
      data {
        id
        order_no
        product_name
        product_cover_image
        sku
        spu
        quantity
        price
        discount
        profit
        product_id
        order_id
        category_id
        status
        payment_status
        sign_in_status
        order_status
        inventory {
          my_inventory
          total_inventory
        }
        shop_id
        delivery_type
        customer_id
        logistics {
          company_name
          cost
          transport_modes
          logo
        }
        order {
          id
          order_no
          created_at
        }
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

export const UPDATE_ORDER_WITH_STATUS = gql`
  mutation AdminUpdateOrderWithStatus($data: AdminUpdateOrderByStatusInput!) {
    adminUpdateOrderWithStatus(data: $data) {
      success
      total
      data {
        id
        order_status
        payment_status
        sign_in_status
      }
      error {
        message
        code
        details
      }
    }
  }
`;

export const MUTATION_ADMIN_GIVE_ORDER_TO_SHOP = gql`
  mutation AdminCreateOrderForCustomer(
    $customerId: ID!
    $data: CreateOrderInput!
  ) {
    adminCreateOrderForCustomer(customer_id: $customerId, data: $data) {
      success
      message
      error {
        message
        code
        details
      }
    }
  }
`;
