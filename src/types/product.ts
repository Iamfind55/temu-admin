import { ErrorDetails } from "./base";
import { ICategoryTypes } from "./category";

export interface IProductTypes {
  id: string;
  name: { [key: string]: string };
  description: { [key: string]: string };
  cover_image: string;
  price: number;
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
  categoryData: ICategoryTypes;
  brandData: ICategoryTypes;
}

export interface IProductFormData {
  id?: string;
  name: { [key: string]: string };
  description: { [key: string]: string };
  cover_image: File | null; // Updated for file input
  images: File[]; // Array of files for multiple images
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
  name_en: string;
}

export interface ProductDescription {
  name_en: string | null;
}

type Category = {
  id: string;
  name: {
    name_en: string;
  };
  parent_id: string | null;
  image: string | null;
  subcategories?: Category[]; // Allow nesting of subcategories
};

export interface ProductData {
  id: string;
  name: ProductName;
  description: ProductDescription | null;
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
  name: {
    name_en: string;
  };
  cover_image: string;
  description: {
    name_en: string;
  };
  price: number;
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
