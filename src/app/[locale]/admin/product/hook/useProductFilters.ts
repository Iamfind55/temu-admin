import { useState, useEffect } from "react";
import { useLazyQuery } from "@apollo/client";
import { GET_PRODUCTS } from "@/api/product";
import { PaginationState } from "@/types/pagination";

interface ProductFilter extends PaginationState {
  keyword?: string;
  product_vip?: number;
  dateRange?: { startDate: string; endDate: string };
  sortBy?: string;
}

export const useProductFilters = () => {
  const [filters, setFilters] = useState<ProductFilter>({
    keyword: "",
    dateRange: { startDate: "", endDate: "" },
    product_vip: 0,
    sortBy: "created_at_DESC",
    page: 1,
    limit: 10,
  });

  const [debouncedKeyword, setDebouncedKeyword] = useState(filters.keyword);
  const [getProducts, { data, loading, error }] = useLazyQuery(GET_PRODUCTS, {
    fetchPolicy: "cache-and-network",
  });

  const fetchProducts = async () => {
    await getProducts({
      variables: {
        page: filters.page,
        limit: filters.limit,
        sortedBy: filters.sortBy,
        where: {
          keyword: filters.keyword || undefined,
          product_vip: filters.product_vip || undefined,
          createdAtBetween:
            filters.dateRange?.startDate && filters.dateRange?.endDate
              ? {
                  startDate: filters.dateRange.startDate,
                  endDate: filters.dateRange.endDate,
                }
              : undefined,
        },
      },
    });
  };

  // Debounce effect for keyword
  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters((prev) => ({ ...prev, keyword: debouncedKeyword }));
    }, 800); // 800ms debounce delay

    return () => clearTimeout(timer);
  }, [debouncedKeyword]);

  useEffect(() => {
    fetchProducts();
  }, [JSON.stringify(filters)]);

  const updateKeyword = (keyword: string) => {
    setDebouncedKeyword(keyword);
  };

  const updatedAtRange = (startDate: string, endDate: string) => {
    setFilters((prev) => ({ ...prev, dateRange: { startDate, endDate } }));
  };

  const updateSortBy = (sortBy: string) => {
    setFilters((prev) => ({ ...prev, sortBy }));
  };

  const updateProductVip = (product_vip: number) => {
    setFilters((prev) => ({ ...prev, product_vip }));
  };

  // Update the page in filters and refetch the data
  const updatePage = (page: number) => {
    setFilters((prevFilters) => ({ ...prevFilters, page }));
    // fetchProducts();
  };

  return {
    filters,
    updateKeyword,
    updatedAtRange,
    updateSortBy,
    data,
    loading,
    error,
    updatePage,
    updateProductVip,
  };
};
