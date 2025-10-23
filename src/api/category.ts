import { gql } from "@apollo/client";

export const GET_MAIN_CATEGORIES = gql`
  query GetCategories(
    $page: Int
    $limit: Int
    $sortedBy: BaseOrderByInput
    $where: CategoryWhereInput
  ) {
    getCategories(
      page: $page
      limit: $limit
      sortedBy: $sortedBy
      where: $where
    ) {
      success
      total
      data {
        id
        name {
          name_en
        }
        image
        status
        parent_id
        created_by
        created_at
        updated_at
        recommended
      }
      error {
        message
        code
        details
      }
    }
  }
`;

export const GET_CATEGORIES = gql`
  query AdminGetCategories(
    $page: Int
    $limit: Int
    $sortedBy: BaseOrderByInput
    $where: CategoryWhereInput
  ) {
    adminGetCategories(
      page: $page
      limit: $limit
      sortedBy: $sortedBy
      where: $where
    ) {
      success
      total
      data {
        id
        name {
          name_en
        }
        image
        status
        parent_id
        created_by
        created_at
        updated_at
        recommended
        parent_data {
          id
          name {
            name_en
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

export const GET_ALL_CATEGORIES = gql`
  query GetAllCategories($limit: Int, $page: Int, $sortedBy: BaseOrderByInput) {
    getAllCategories(limit: $limit, page: $page, sortedBy: $sortedBy) {
      success
      total
      data {
        id
        parent_id
        name {
          name_en
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

export const CREATED_CATEGORY = gql`
  mutation CreateCategory($data: CreateCategoryInput!) {
    createCategory(data: $data) {
      success
      data {
        id
        image
        name {
          name_en
        }
        recommended
        status
        parent_id
        created_by
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
export const DELETE_CATEGORY = gql`
  mutation DeleteCategory($deleteCategoryId: ID!) {
    deleteCategory(id: $deleteCategoryId) {
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
export const UPDATE_CATEGORY = gql`
  mutation UpdateCategory($data: UpdateCategoryInput!) {
    updateCategory(data: $data) {
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
export const GET_CATEGORY = gql`
  query GetCategory($getCategoryId: ID!) {
    getCategory(id: $getCategoryId) {
      success
      data {
        id
        name {
          name_en
        }
        image
        status
        parent_id
        created_by
        created_at
        updated_at
        recommended
      }
      error {
        message
        code
        details
      }
    }
  }
`;
