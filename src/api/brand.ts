import { gql } from "@apollo/client";

export const GET_BRANDINGS = gql`
  query GetBrandings(
    $where: BrandingWhereInput
    $limit: Int
    $page: Int
    $sortedBy: BaseOrderByInput
  ) {
    getBrandings(
      where: $where
      limit: $limit
      page: $page
      sortedBy: $sortedBy
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

export const CREATED_BRANDING = gql`
  mutation CreateBranding($data: CreateBrandingInput!) {
    createBranding(data: $data) {
      success
      data {
        id
        name {
          name_en
        }
        image
        status
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

export const DELETE_BRANDING = gql`
  mutation DeleteBranding($deleteBrandingId: ID!) {
    deleteBranding(id: $deleteBrandingId) {
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

export const UPDATE_BRANDING = gql`
  mutation UpdateBranding($data: UpdateBrandingInput!) {
    updateBranding(data: $data) {
      success
      data {
        id
        name {
          name_en
        }
        image
        status
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

export const GET_BRANDING = gql`
  query GetBranding($getBrandingId: ID!) {
    getBranding(id: $getBrandingId) {
      success
      data {
        id
        name {
          name_en
        }
        image
        status
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
