import { useState, useEffect } from "react";
import { useLazyQuery } from "@apollo/client";
import { PaginationState } from "@/types/pagination";
import { GET_BRANDING, GET_BRANDINGS } from "@/api/brand";

interface BrandFilter extends PaginationState {
  keyword?: string;
  dateRange?: { startDate: string; endDate: string };
  sortBy?: string;
}

export const useBrandFilters = () => {
  const [filters, setFilters] = useState<BrandFilter>({
    keyword: "",
    dateRange: { startDate: "", endDate: "" },
    sortBy: "created_at_DESC",
    page: 1,
    limit: 10,
  });
  const [selectedBradingId, setSelectedBradingId] = useState<string>();

  const [debouncedKeyword, setDebouncedKeyword] = useState(filters.keyword);
  const [getBrandings, { data, loading, error }] = useLazyQuery(GET_BRANDINGS, {
    fetchPolicy: "cache-and-network",
  });
  const [getBranding, { data: bradingData }] = useLazyQuery(GET_BRANDING, {
    fetchPolicy: "cache-and-network",
  });

  const fetchBrandings = () => {
    getBrandings({
      variables: {
        page: filters.page,
        limit: filters.limit,
        sortedBy: filters.sortBy,
        where: {
          keyword: filters.keyword || undefined,
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
  const fetchBrading = () => {
    try {
      getBranding({
        variables: {
          getBrandingId: selectedBradingId,
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
    fetchBrandings();
  }, [JSON.stringify(filters)]);

  useEffect(() => {
    if (selectedBradingId) fetchBrading();
  }, [selectedBradingId]);

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
    fetchBrandings();
  };

  const handleSelectBranding = (bradingId: string) => {
    setSelectedBradingId(bradingId);
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
    bradingData,
    handleSelectBranding,
  };
};
