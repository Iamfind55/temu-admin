import { gql } from "@apollo/client";

export const GET_BANNERS = gql`
  query GetBanners(
    $limit: Int
    $page: Int
    $sortedBy: BaseOrderByInput
    $where: BannerWhereInput
  ) {
    getBanners(limit: $limit, page: $page, sortedBy: $sortedBy, where: $where) {
      success
      total
      data {
        id
        name
        image
        link_url
        position
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

export const CREATED_BANNER = gql`
  mutation CreateBanner($data: CreateBannerInput!) {
    createBanner(data: $data) {
      success
      data {
        id
        name
        image
        link_url
        position
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
export const DELETE_BANNER = gql`
  mutation DeleteBanner($deleteBannerId: ID!) {
    deleteBanner(id: $deleteBannerId) {
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
export const UPDATE_BANNER = gql`
  mutation UpdateBanner($data: UpdateBannerInput!) {
    updateBanner(data: $data) {
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
export const GET_BANNER = gql`
  query GetBanner($getBannerId: ID!) {
    getBanner(id: $getBannerId) {
      success
      data {
        id
        name
        image
        link_url
        position
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
