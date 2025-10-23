import React from "react";
import { IFilter } from "@/types/filter";
import { useLazyQuery } from "@apollo/client";
import { QUERY_ADMIN_GET_TRANSACTIONS } from "@/api/transaction";
import { GetITransactionResponse } from "@/types/transaction";

const useFetchTransactions = ({ filter }: { filter: IFilter }) => {
  const { identifier, coin_type, limit, page, createdAtBetween } = filter;
  const numericLimit = Number(limit);

  const [getTransactions, { data, refetch }] =
    useLazyQuery<GetITransactionResponse>(QUERY_ADMIN_GET_TRANSACTIONS, {
      fetchPolicy: "no-cache",
    });

  const fetchEmployees = () => {
    getTransactions({
      variables: {
        orderBy: "created_at_DESC",
        limit: numericLimit,
        page: page,
        where: {
          ...(coin_type && { coin_type: coin_type }),
          ...(identifier && { identifier: identifier }),
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
  }, [filter, getTransactions]);

  return {
    getTransactions,
    fetchEmployees,
    refetch,
    data: data?.adminGetTransactionHistories?.data?.map(
      (transaction, index) => ({
        ...transaction,
        no: index + 1,
      })
    ),
    total: data?.adminGetTransactionHistories?.total,
  };
};

export default useFetchTransactions;
