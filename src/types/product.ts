import { ErrorDetails } from "./base";
import { ICategoryTypes } from "./category";

export interface IProductTypes {
  id: string;
  name: string
  cover_image: string;
  image_url: string;
  origin_image_url:string;
  price: number;
  market_price: string;
  price_str: string;
  currency: string;
  show_price: string;
  discount: number;
  quantity: number;
  sell_count: number;
  product_vip: number;
  sku: string;
  spu: string;
  category_id: string;
  brand_id: string;
  recommended: boolean;
  images: string[];
  created_at: string;
  updated_at: string;
  total_star: string;
  total_comment: number;
  categoryData: ICategoryTypes;
  brandData: ICategoryTypes;
  productTag: ProductTag
}

export interface ProductTag {
  id: string;
  text_rich: any[];
  local_title: string | null;
  content: string | null;
  prompt_tag_text: string | null;
  footer_text: string | null;
  header_text: string | null;
}
export interface IProductFormData {
  id?: string;
  name: string;
  image_url: File | null | string; // Updated for file input
  images: File[] | string[]; // Array of files for multiple images
  price: number;
  discount: number;
  quantity: number;
  total_star: number;
  product_vip: number;
  sell_count?: number;
  product_top: number;
  sku: string;
  spu: string;
  category_id: string | null;
  brand_id: string | null;
  recommended: boolean;
  status?: string;
  total_comment?: number;
}

// apao
export interface ProductName {
  name: string;
}

export interface ProductDescription {
  name: string | null;
}

type Category = {
  id: string;
  name: {
    name: string;
  };
  parent_id: string | null;
  image: string | null;
  subcategories?: Category[]; // Allow nesting of subcategories
};

export interface ProductData {
  id: string;
  name: string;
  images?: string[];
  cover_image: string;
  price: number;
  discount?: number | null;
  quantity?: number | null;
  sku?: string | null;
  spu?: string | null;
  total_star?: number | null;
  total_comment?: number | null;
  category_ids?: string[] | null;
  categories?: Category[] | null;
  brand_id?: string | null;
  status?: string | null;
  recommended?: boolean | null;
  product_top?: boolean | null;
  product_vip?: number | null;
  created_at?: string | null;
}

export interface ShopProductData {
  id: string;
  name: string;
  cover_image: string;
  origin_image_url: string;
  price: number;
  market_price: string;
  star_store?: string;
  total_comment?: number;
  total_start?: number;
  sell_count?: string;
  quantity: string;

}

export interface GetShopProductData {
  id: string;
  productData: ShopProductData;
  quantity: number;
  product_id: string;
}

export interface GetShopProductResponse {
  getShopProducts: {
    success: boolean;
    total: number;
    data: GetShopProductData[];
    error?: ErrorDetails;
  };
}
