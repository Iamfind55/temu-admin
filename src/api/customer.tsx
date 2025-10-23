import { gql } from "@apollo/client";

export const QUERY_ALL_CUSTOMERS = gql`
  query GetCustomers(
    $page: Int
    $limit: Int
    $sortedBy: BaseOrderByInput
    $where: CustomerWhereInput
  ) {
    getCustomers(
      page: $page
      limit: $limit
      sortedBy: $sortedBy
      where: $where
    ) {
      success
      total
      data {
        id
        dob
        email
        image
        status
        username
        lastName
        firstName
        phone_number
        customer_type
        created_at
        customer_address
      }
      error {
        message
        code
        details
      }
    }
  }
`;

export const MUTATION_DELETE_CUSTOMER = gql`
  mutation DeleteCustomer($deleteCustomerId: ID!) {
    deleteCustomer(id: $deleteCustomerId) {
      success
      error {
        message
        code
        details
      }
    }
  }
`;

export const MUTATION_CREATE_CUSTOMER = gql`
  mutation CreateCustomer($data: CreateCustomerInput!) {
    createCustomer(data: $data) {
      success
      error {
        message
        code
        details
      }
    }
  }
`;

export const MUTATION_UPDATE_CUSTOMER = gql`
  mutation UpdateCustomer($data: UpdateCustomerInput!) {
    updateCustomer(data: $data) {
      success
      error {
        message
        code
        details
      }
    }
  }
`;

export const QUERY_GET_CUSTOMER_ADDRESS = gql`
  query GetCustomerAddresses(
    $page: Int
    $limit: Int
    $sortedBy: BaseOrderByInput
    $where: ShopAddressWhereInput
  ) {
    getCustomerAddresses(
      page: $page
      limit: $limit
      sortedBy: $sortedBy
      where: $where
    ) {
      success
      total
      data {
        id
        address
      }
      error {
        message
        code
        details
      }
    }
  }
`;
