import { gql } from "@apollo/client";

export const GET_PRODUCTS = gql`
  query AdminGetProducts(
    $page: Int
    $limit: Int
    $sortedBy: BaseOrderByInput
    $where: ProductWhereInput
  ) {
    adminGetProducts(
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
        cover_image
        price
        sell_count
        product_vip
        quantity
        created_at
        updated_at
        categoryData {
          id
          name {
            name_en
          }
        }
        brandData {
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

export const GET_PRODUCT = gql`
  query GetProduct($getProductId: ID!) {
    getProduct(id: $getProductId) {
      success
      data {
        id
        name {
          name_en
        }
        description {
          name_en
        }
        images
        cover_image
        price
        discount
        quantity
        sku
        spu
        total_star
        total_comment
        category_ids
        categoryData {
          id
          name {
            name_en
          }
        }
        brandData {
          id
          name {
            name_en
          }
        }
        brand_id
        status
        recommended
        product_top
        product_vip
        sell_count
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

export const CREATED_PRODUCT = gql`
  mutation CreateProduct($data: CreateProductInput!) {
    createProduct(data: $data) {
      success
      data {
        id
        name {
          name_en
        }
        description {
          name_en
        }
        images
        cover_image
        price
        discount
        quantity
        sku
        spu
        total_star
        total_comment
        category_ids
        brand_id
        status
        recommended
        product_top
        product_vip
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

export const DELETE_PRODUCT = gql`
  mutation DeleteProduct($deleteProductId: ID!) {
    deleteProduct(id: $deleteProductId) {
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

export const UPDATE_PRODUCT = gql`
  mutation UpdateProduct($data: UpdateProductInput!) {
    updateProduct(data: $data) {
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

export const GET_SHOP_PRODUCTS = gql`
  query GetShopProducts(
    $page: Int
    $limit: Int
    $sortedBy: BaseOrderByInput
    $where: ShopProductWhereInput
  ) {
    getShopProducts(
      page: $page
      limit: $limit
      sortedBy: $sortedBy
      where: $where
    ) {
      success
      total
      data {
        id
        productData {
          id
          name {
            name_en
          }
          cover_image
          description {
            name_en
          }
          price
        }
        quantity
        product_id
      }
      error {
        message
        code
        details
      }
    }
  }
`;
