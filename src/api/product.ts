import { gql } from "@apollo/client";

export const GET_PRODUCTS = gql`
  query Data($page: Int, $limit: Int, $where: ProductWhereInput, $sortedBy: BaseOrderByInput) {
  adminGetProducts(page: $page, limit: $limit, where: $where, sortedBy: $sortedBy) {
    total
    data {
      id
      name
      images
      image_url
      origin_image_url
      price
      market_price
      price_str
      currency
      show_price
      discount
      discount_end
      quantity
      sku
      spu
      total_star
      total_comment
      star_store
      categoryData {
        id
        name
      }
      productTag {
        id
        text_rich
        local_title
        content
        prompt_tag_text
        footer_text
        header_text
      }
      brandData {
        id
        name
      }
      brand_id
      status
      shopProductStatus
      recommended
      product_top
      product_vip
      sell_count
      created_by
      created_at
      updated_at
    }
    error {
      code
      message
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
        name
        images
        image_url
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
          name
        }
        brandData {
          id
          name
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
        name
        images
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

export const GET_SHOP_PRODUCTS = gql`query Data($where: ShopProductWhereInput, $page: Int, $limit: Int) {
  getShopProducts(where: $where, page: $page, limit: $limit) {
    total
    data {
      id
      quantity
      product_id
      productData {
        id
        name
        images
        origin_image_url
        price
        market_price
        price_str
        currency
        show_price
        discount
        discount_end
        quantity
        sku
        spu
        total_star
        total_comment
        star_store
        category_ids
        productTag {
          id
          text_rich
          local_title
          content
          prompt_tag_text
          footer_text
          header_text
        }
        brandData {
          id
          name
        }
        status
        shopProductStatus
        recommended
        product_top
        product_vip
        sell_count
        created_by
        created_at
        updated_at
      }
      shop_id
      status
      created_by
      created_at
      updated_at
      sell_count
      shopProductStatus
    }
    error {
      code
      message
      details
    }
  }
}
`;
