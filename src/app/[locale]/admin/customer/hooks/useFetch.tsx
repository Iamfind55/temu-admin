import React from "react";
import { IFilter } from "@/types/filter";
import { useLazyQuery } from "@apollo/client";
import { QUERY_ALL_CUSTOMERS } from "@/api/customer";
import { GetCustomerResponse } from "@/types/customer";

const useFetchCustomers = ({ filter }: { filter: IFilter }) => {
  const { keyword, status, limit, page, createdAtBetween } = filter;
  const numericLimit = Number(limit);

  const [getCustomers, { data, refetch }] = useLazyQuery<GetCustomerResponse>(
    QUERY_ALL_CUSTOMERS,
    {
      fetchPolicy: "no-cache",
    }
  );

  const fetchCustomers = () => {
    getCustomers({
      variables: {
        orderBy: "created_at_DESC",
        limit: numericLimit,
        page: page,
        where: {
          ...(status && { status: status }),
          ...(keyword && { keyword: keyword }),
          ...(createdAtBetween?.startDate &&
            createdAtBetween.endDate && {
              createdAtBetween: {
                startDate: createdAtBetween.startDate,
                endDate: createdAtBetween.endDate,
              },
            }),
        },
      },
    });
  };

  React.useEffect(() => {
    fetchCustomers();
  }, [filter, getCustomers]);

  return {
    getCustomers,
    fetchCustomers,
    refetch,
    data: data?.getCustomers?.data?.map((customer, index) => ({
      ...customer,
      no: index + 1,
    })),
    total: data?.getCustomers?.total,
  };
};

export default useFetchCustomers;
