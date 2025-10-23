import React from "react";
import { IFilter } from "@/types/filter";
import { useLazyQuery } from "@apollo/client";
import { QUERY_ALL_EMPLOYEES } from "@/api/employee";
import { GetEmployeeResponse } from "@/types/employee";

const useFetchEmployees = ({ filter }: { filter: IFilter }) => {
  const { keyword, status, limit, page, createdAtBetween } = filter;
  const numericLimit = Number(limit);

  const [getEmployees, { data, refetch }] = useLazyQuery<GetEmployeeResponse>(
    QUERY_ALL_EMPLOYEES,
    {
      fetchPolicy: "no-cache",
    }
  );

  const fetchEmployees = () => {
    getEmployees({
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
    fetchEmployees();
  }, [filter, getEmployees]);

  return {
    getEmployees,
    fetchEmployees,
    refetch,
    data: data?.getStaffs?.data?.map((employee, index) => ({
      ...employee,
      no: index + 1,
    })),
    total: data?.getStaffs?.total,
  };
};

export default useFetchEmployees;
