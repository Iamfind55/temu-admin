import { gql } from "@apollo/client";

// export const GET_MAIN_CATEGORIES = gql`
//   query GetCategories(
//     $page: Int
//     $limit: Int
//     $sortedBy: BaseOrderByInput
//     $where: CategoryWhereInput
//   ) {
//     getCategories(
//       page: $page
//       limit: $limit
//       sortedBy: $sortedBy
//       where: $where
//     ) {
//       success
//       total
//       data {
//         id
//         name
//         image
//         status
//         parent_id
//         created_by
//         created_at
//         updated_at
//         recommended
//       }
//       error {
//         message
//         code
//         details
//       }
//     }
//   }
// `;

export const GET_SUB_CATEGORY = gql`
query GetSubcategories($where: CategoryWhereInput, $limit: Int, $page: Int, $sortedBy: BaseOrderByInput) {
  getSubcategories(where: $where, limit: $limit, page: $page, sortedBy: $sortedBy) {
    success
    total
    data {
      id
      name
      image
      oring_image_url
      status
      parent_id
      created_by
      created_at
      updated_at
      recommended
      parent_data {
        id
      name
      image
      oring_image_url
      status
      parent_id
      }
    }
    error {
      message
    }
  }
}`

export const GET_CATEGORIES = gql`
  query Data($where: CategoryWhereInput) {
  getCategories(where: $where) {
    data {
      id
      image
      name
      status
      oring_image_url
      parent_data {
        id
        image
        oring_image_url
      }
      subcategories {
        name
        image
        oring_image_url
        id
        created_at
        parent_data {
          id
          name
        }
        subcategories {
          name
          image
          id
          oring_image_url
        }
      }
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
        name
      }
      error {
        message
        code
        details
      }
    }
  }
`;

export const GET_MAIN_CATEGORIES = gql`query GetMainCategories($where: CategoryWhereInput, $page: Int, $limit: Int) {
  getMainCategories(where: $where, page: $page, limit: $limit) {
    success
    total
    data {
      id
      name
      image
      oring_image_url
      status
      parent_id
      created_by
      created_at
      updated_at
      recommended
    }
  }
}`
export const CREATED_CATEGORY = gql`
  mutation CreateCategory($data: CreateCategoryInput!) {
    createCategory(data: $data) {
      success
      data {
        id
        image
        name
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
        name
        image
        status
        oring_image_url
        parent_id
        created_by
        created_at
        updated_at
        recommended
         parent_data {
        id
        name
        image
        oring_image_url
        status
        parent_id
          parent_data {
          id
          image
          oring_image_url
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

