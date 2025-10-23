import React from "react";
import { GET_SHOPS } from "@/api/shop";
import { IFilter } from "@/types/filter";
import { useLazyQuery } from "@apollo/client";
import { GetShopResponse } from "@/types/shop";

const useFetchShops = ({ filter }: { filter: IFilter }) => {
  const { keyword, status, limit, page, sort_by, shop_vip, createdAtBetween } =
    filter;
  const numericLimit = Number(limit);
  const numbericShop_vip = Number(shop_vip);
  console.log(numbericShop_vip);
  console.log(typeof numbericShop_vip);
  const [getShops, { data, refetch }] = useLazyQuery<GetShopResponse>(
    GET_SHOPS,
    {
      fetchPolicy: "no-cache",
    }
  );

  const fetchShops = () => {
    getShops({
      variables: {
        orderBy: sort_by ? sort_by : "created_at_DESC",
        limit: numericLimit,
        page: page,
        where: {
          ...(status && { status: status }),
          ...(shop_vip && { shop_vip: numbericShop_vip }),
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
    fetchShops();
  }, [filter]);

  return {
    getShops,
    fetchShops,
    refetch,
    data: data?.adminGetShops?.data?.map((shop, index) => ({
      ...shop,
      no: index + 1,
    })),
    total: data?.adminGetShops?.total,
  };
};

export default useFetchShops;
