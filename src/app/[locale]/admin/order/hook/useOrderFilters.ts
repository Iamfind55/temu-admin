import { useState, useEffect } from "react";
import { useLazyQuery } from "@apollo/client";
import { PaginationState } from "@/types/pagination";
import { GET_ORDERS } from "@/api/order";
import { EOrderStatus } from "@/types/order";

interface OrderFilter extends PaginationState {
  keyword?: string;
  order_status: string;
  dateRange?: { startDate: string; endDate: string };
  sortBy?: string;
}

export const useOrderFilters = () => {
  const [filters, setFilters] = useState<OrderFilter>({
    keyword: "",
    order_status: EOrderStatus.NO_PICKUP,
    dateRange: { startDate: "", endDate: "" },
    sortBy: "created_at_DESC",
    page: 1,
    limit: 10,
  });

  const [debouncedName, setDebouncedName] = useState(filters.keyword);
  const [getOrders, { data, loading, error }] = useLazyQuery(GET_ORDERS, {
    fetchPolicy: "cache-and-network",
  });

  const fetchOrders = () => {
    getOrders({
      variables: {
        page: filters.page,
        limit: filters.limit,
        sortedBy: filters.sortBy,
        where: {
          keyword: filters.keyword || undefined,
          order_status: filters.order_status,
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

  // Debounce effect for name
  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters((prev) => ({ ...prev, keyword: debouncedName }));
    }, 800); // 800ms debounce delay

    return () => clearTimeout(timer);
  }, [debouncedName]);

  useEffect(() => {
    fetchOrders();
  }, [JSON.stringify(filters)]);

  const updateName = (name: string) => {
    setDebouncedName(name);
  };

  const updatedAtRange = (startDate: string, endDate: string) => {
    setFilters((prev) => ({ ...prev, dateRange: { startDate, endDate } }));
  };

  const handleChangeOrderStatus = (
    order_status: string | EOrderStatus.NO_PICKUP
  ) => {
    setFilters((prev) => ({ ...prev, order_status }));
  };

  const updateSortBy = (sortBy: string) => {
    setFilters((prev) => ({ ...prev, sortBy }));
  };

  // Update the page in filters and refetch the data
  const updatePage = (page: number) => {
    setFilters((prevFilters) => ({ ...prevFilters, page }));
    fetchOrders();
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
    handleChangeOrderStatus,
  };
};
