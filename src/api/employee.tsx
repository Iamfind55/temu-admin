import { gql } from "@apollo/client";

export const QUERY_ALL_EMPLOYEES = gql`
  query GetStaffs(
    $page: Int
    $limit: Int
    $where: StaffWhereInput
    $sortedBy: BaseOrderByInput
  ) {
    getStaffs(page: $page, limit: $limit, where: $where, sortedBy: $sortedBy) {
      success
      total
      data {
        id
        dob
        email
        image
        status
        firstName
        lastName
        username
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

export const MUTATION_DELETE_EMPLOYEE = gql`
  mutation DeleteStaff($deleteStaffId: ID!) {
    deleteStaff(id: $deleteStaffId) {
      success
      error {
        message
        code
        details
      }
    }
  }
`;

export const MUTATION_CREATE_EMPLOYEE = gql`
  mutation CreateStaff($data: CreateStaffInput!) {
    createStaff(data: $data) {
      success
      error {
        message
        code
        details
      }
    }
  }
`;

export const MUTATION_UPDATE_EMPLOYEE = gql`
  mutation UpdateStaff($data: UpdateStaffInput!) {
    updateStaff(data: $data) {
      success
      error {
        message
        code
        details
      }
    }
  }
`;
