import { useState, useEffect } from "react";
import { useLazyQuery } from "@apollo/client";
import { PaginationState } from "@/types/pagination";
import { GET_CATEGORIES, GET_CATEGORY } from "@/api/category";

interface CategoryFilter extends PaginationState {
  keyword?: string;
  dateRange?: { startDate: string; endDate: string };
  sortBy?: string;
  parentId: string;
}

export const useCategoryFilters = () => {
  const [filters, setFilters] = useState<CategoryFilter>({
    keyword: "",
    parentId: "",
    dateRange: { startDate: "", endDate: "" },
    sortBy: "created_at_DESC",
    page: 1,
    limit: 10,
  });
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>();

  const [debouncedKeyword, setDebouncedKeyword] = useState(filters.keyword);
  const [getCategories, { data, loading, error }] = useLazyQuery(
    GET_CATEGORIES,
    {
      fetchPolicy: "cache-and-network",
    }
  );
  const [getCategory, { data: categoryData, loading: categoryDataLoading }] =
    useLazyQuery(GET_CATEGORY, {
      fetchPolicy: "cache-and-network",
    });

  const fetchCategories = () => {
    getCategories({
      variables: {
        page: filters.page,
        limit: filters.limit,
        sortedBy: filters.sortBy,
        where: {
          keyword: filters.keyword || undefined,
          parent_id: filters.parentId || undefined,
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
  const fetchCategory = () => {
    try {
      getCategory({
        variables: {
          getCategoryId: selectedCategoryId,
        },
      });
    } catch (error) {
      console.error("", { error });
    }
  };

  // Debounce effect for keyword
  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters((prev) => ({ ...prev, keyword: debouncedKeyword }));
    }, 800); // 800ms debounce delay

    return () => clearTimeout(timer);
  }, [debouncedKeyword]);

  useEffect(() => {
    fetchCategories();
  }, [JSON.stringify(filters)]);

  useEffect(() => {
    if (selectedCategoryId) fetchCategory();
  }, [selectedCategoryId]);

  const updateKeyword = (keyword: string) => {
    setDebouncedKeyword(keyword);
  };

  const updatedAtRange = (startDate: string, endDate: string) => {
    setFilters((prev) => ({ ...prev, dateRange: { startDate, endDate } }));
  };

  const updateSortBy = (sortBy: string) => {
    setFilters((prev) => ({ ...prev, sortBy }));
  };

  // Update the page in filters and refetch the data
  const updatePage = (page: number) => {
    setFilters((prevFilters) => ({ ...prevFilters, page }));
    fetchCategories();
  };

  const handleSelectCategory = (categoryId: string) => {
    setSelectedCategoryId(categoryId);
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
    categoryData,
    handleSelectCategory,
  };
};
