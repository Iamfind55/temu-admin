import { useState, useEffect } from "react";
import { useLazyQuery } from "@apollo/client";
import { PaginationState } from "@/types/pagination";
import { GET_BANNER, GET_BANNERS } from "@/api/banner";

interface BannerFilter extends PaginationState {
  name?: string;
  dateRange?: { startDate: string; endDate: string };
  sortBy?: string;
}

export const useBannerFilters = () => {
  const [filters, setFilters] = useState<BannerFilter>({
    name: "",
    dateRange: { startDate: "", endDate: "" },
    sortBy: "created_at_DESC",
    page: 1,
    limit: 10,
  });
  const [selectedBannerId, setSelectedBannerId] = useState<string>();

  const [debouncedName, setDebouncedName] = useState(filters.name);
  const [getBanners, { data, loading, error }] = useLazyQuery(GET_BANNERS, {
    fetchPolicy: "cache-and-network",
  });
  const [getBanner, { data: bannerData }] = useLazyQuery(GET_BANNER, {
    fetchPolicy: "cache-and-network",
  });

  const fetchBanners = () => {
    getBanners({
      variables: {
        page: filters.page,
        limit: filters.limit,
        sortedBy: filters.sortBy,
        where: {
          name: filters.name || undefined,
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
      getBanner({
        variables: {
          getBannerId: selectedBannerId,
        },
      });
    } catch (error) {
      console.error("", { error });
    }
  };

  // Debounce effect for name
  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters((prev) => ({ ...prev, name: debouncedName }));
    }, 800); // 800ms debounce delay

    return () => clearTimeout(timer);
  }, [debouncedName]);

  useEffect(() => {
    fetchBanners();
  }, [JSON.stringify(filters)]);

  useEffect(() => {
    console.log("===---", { selectedBannerId });
    if (selectedBannerId) fetchBrading();
  }, [selectedBannerId]);

  const updateName = (name: string) => {
    setDebouncedName(name);
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
    fetchBanners();
  };

  const handleSelectBanner = (bradingId: string) => {
    setSelectedBannerId(bradingId);
  };

  return {
    filters,
    updateName,
    updatedAtRange,
    updateSortBy,
    data,
    loading,
    error,
    updatePage,
    bannerData,
    handleSelectBanner,
  };
};
