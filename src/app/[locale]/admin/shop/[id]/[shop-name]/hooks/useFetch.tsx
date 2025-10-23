import React from "react";
import { IProductFilter } from "@/types/filter";
import { useLazyQuery } from "@apollo/client";
import { GET_SHOP_PRODUCTS } from "@/api/product";
import { GetShopProductResponse } from "@/types/product";

const useFetchShopProducts = ({ filter }: { filter: IProductFilter }) => {
  const { keyword, limit, page, shop_id } = filter;
  const numericLimit = Number(limit);

  const [getShopProducts, { data, refetch }] =
    useLazyQuery<GetShopProductResponse>(GET_SHOP_PRODUCTS, {
      fetchPolicy: "no-cache",
    });

  const fetchShopProducts = () => {
    getShopProducts({
      variables: {
        orderBy: "created_at_DESC",
        limit: numericLimit,
        page: page,
        sortedBy: "created_at_DESC",
        where: {
          shop_id: shop_id,
          status: "ACTIVE",
          ...(keyword && { keyword: keyword }),
        },
      },
    });
  };

  React.useEffect(() => {
    fetchShopProducts();
  }, [filter, getShopProducts]);

  return {
    getShopProducts,
    fetchShopProducts,
    refetch,
    data: data?.getShopProducts?.data?.map((product, index) => ({
      ...product,
      no: index + 1,
    })),
    total: data?.getShopProducts?.total,
  };
};

export default useFetchShopProducts;
