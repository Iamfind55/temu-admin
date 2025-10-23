"use client";

import React from "react";
import Image from "next/image";
import { RootState } from "@/redux/store";
import { useParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";

// Apollo and APIs
import { GET_SHOP } from "@/api/shop";
import { useLazyQuery, useMutation } from "@apollo/client";
import {
  CartIcon,
  MinusIcon,
  PlusIcon,
  RefreshIcon,
  SearchIcon,
  TrashIcon,
} from "@/icons/page";
import { useToast } from "@/utils/toast";
import useFilter from "./hooks/useFilter";

// components
import Select from "@/components/select";
import EmptyPage from "@/components/emptyPage";
import Breadcrumb from "@/components/breadCrumb";
import IconButton from "@/components/iconButton";
import ProductCard from "@/components/productCard";
import useFetchShopProducts from "./hooks/useFetch";
import { GetShopProductData } from "@/types/product";
import ShopProductPagination from "@/components/shopProductPagination";

// api
import {
  clearCart,
  decreaseQuantity,
  increaseQuantity,
  removeFromCart,
} from "@/redux/slice/cartSlice";
import { truncateText } from "@/utils/letterLimitation";
import { GetCustomerResponse } from "@/types/customer";
import {
  QUERY_GET_CUSTOMER_ADDRESS,
  QUERY_ALL_CUSTOMERS,
} from "@/api/customer";
import { MUTATION_ADMIN_GIVE_ORDER_TO_SHOP } from "@/api/order";

const ShopPage = () => {
  const params = useParams();
  const filter = useFilter();
  const dispatch = useDispatch();
  const { errorMessage, successMessage } = useToast();
  const [subTotal, setSubTotal] = React.useState<number>(0);
  const [addressId, setAddressId] = React.useState<string>("");
  const [customerId, setCustomerId] = React.useState<string>("");
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [totalDiscount, setTotalDiscount] = React.useState<number>(0);
  const [totalQuantity, setTotalQuantity] = React.useState<number>(0);
  const fetchShopProducts = useFetchShopProducts({
    filter: filter.data,
  });

  const cartItems = useSelector((state: RootState) => state.cart.items);
  const [createOrder] = useMutation(MUTATION_ADMIN_GIVE_ORDER_TO_SHOP);
  const [getShop, { data }] = useLazyQuery(GET_SHOP, {
    fetchPolicy: "cache-and-network",
  });
  const [getCustomerAddress] = useLazyQuery(QUERY_GET_CUSTOMER_ADDRESS, {
    fetchPolicy: "cache-and-network",
  });
  const [getCustomers, { data: customerData }] =
    useLazyQuery<GetCustomerResponse>(QUERY_ALL_CUSTOMERS, {
      fetchPolicy: "no-cache",
    });

  const handleIncreaseQuantity = (id: string) => {
    dispatch(increaseQuantity(id));
  };

  const handleDecreaseQuantity = (id: string) => {
    dispatch(decreaseQuantity(id));
  };

  const handleRemoveFromCart = (id: string) => {
    dispatch(removeFromCart(id));
  };

  const handleSubmitForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const filteredCartItems = cartItems.map(({ name, ...rest }) => rest);

    if (!customerId) {
      errorMessage({ message: "Please select customer!" });
      return;
    }
    // if (!addressId) {
    //   errorMessage({ message: "Please select address!" });
    //   return;
    // }

    try {
      setIsLoading(true);
      const { data } = await createOrder({
        variables: {
          customerId: customerId,
          data: {
            // address_id: addressId,
            delivery_type: "DOOR_TO_DOOR",
            total_price: subTotal,
            total_quantity: totalQuantity,
            order_details: filteredCartItems,
            total_discount: totalDiscount,
          },
        },
      });
      if (data?.adminCreateOrderForCustomer?.success) {
        successMessage({
          message: "Create order to shop successfull!",
          duration: 3000,
        });
      } else {
        errorMessage({
          message: data?.adminCreateOrderForCustomer?.error?.details,
          duration: 3000,
        });
      }
    } catch (error) {
      if (error instanceof Error) {
        errorMessage({
          message: "Sorry, Unexpected error happend!",
          duration: 3000,
        });
      }
    } finally {
      dispatch(clearCart());
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    filter.dispatch({
      type: filter.ACTION_TYPE.SHOP_ID,
      payload: Array.isArray(params.id)
        ? params.id[0] ?? null
        : params.id ?? null,
    });
  }, []);

  React.useEffect(() => {
    getShop({
      variables: {
        adminGetShopId: params.id,
      },
    });
  }, [getShop]);

  React.useEffect(() => {
    const fetchCustomerAddress = async () => {
      try {
        const res = await getCustomerAddress({
          variables: {
            page: 1,
            limit: 10,
            sortedBy: "created_at_DESC",
            where: {
              customer_id: customerId,
              status: "ACTIVE",
            },
          },
        });
        if (res?.data.getCustomerAddresses.total > 0) {
          setAddressId(res?.data.getCustomerAddresses.data[0].id);
        }
      } catch (error) {
        console.error("Error fetching customer address:", error);
      }
    };

    if (customerId) {
      fetchCustomerAddress();
    }
  }, [customerId, getCustomerAddress]);

  React.useEffect(() => {
    const quantityTotal = cartItems.reduce(
      (sum, product) => sum + (product.quantity || 0),
      0
    );
    const discountTotal = cartItems.reduce(
      (sum, product) => sum + (product.discount || 0),
      0
    );
    const subTotal = cartItems.reduce(
      (sum, product) => sum + (product.price * product.quantity || 0),
      0
    );

    setTotalQuantity(quantityTotal);
    setSubTotal(subTotal);
    setTotalDiscount(discountTotal);
  }, [cartItems]);

  React.useEffect(() => {
    getCustomers({
      variables: {
        page: 1,
        limit: 200,
        sortedBy: "created_at_DESC",
        where: {
          status: "ACTIVE",
          customer_type: "FAKE",
        },
      },
    });
  }, [getCustomers]);

  // Re-format the structure of customer for Select
  const customerNewFormat = customerData?.getCustomers?.data.map(
    (customer) => ({
      label: customer.firstName + " " + customer.lastName,
      value: customer.id,
    })
  );

  return (
    <>
      <div className="flex items-start justify-start flex-col gap-4 text-gray-500">
        <Breadcrumb
          items={[
            { label: "Admin dashboard", value: "/admin" },
            { label: "Shop management", value: "/admin/shop" },
            { label: "Give order to shop", value: "/shop/sdfgdfs/sdfgdsfgds" },
          ]}
        />

        <div className="w-full flex items-start justify-start rounded gap-4">
          <div className="w-3/5 w-full bg-white flex items-start justify-start flex-col gap-4 p-3 rounded shadow-md">
            <div className="w-full flex items-start justify-between">
              <p className="text-sm">
                List of all product on{" "}
                <span className="text-neon_pink">{params["shop-name"]}</span>{" "}
                shop:
              </p>
              <div className="w-1/2 flex items-start justify-center gap-2">
                <div className="relative w-full mt-8">
                  <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                    <SearchIcon size={16} className="text-neon_pink" />
                  </div>
                  <input
                    required
                    type="text"
                    id="search"
                    placeholder="Search...."
                    onChange={(e) => {
                      filter.dispatch({
                        type: filter.ACTION_TYPE.KEYWORD,
                        payload: e.target.value,
                      });
                    }}
                    className="h-9 bg-white text-gray-500 border text-xs rounded block w-full ps-10 p-2 focus:outline-none focus:ring-1"
                  />
                </div>
              </div>
            </div>
            {fetchShopProducts.total ?? 0 > 0 ? (
              <div className="w-full h-auto grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-5">
                {fetchShopProducts?.data?.map((product: GetShopProductData) => (
                  <ProductCard
                    key={product.id}
                    id={product.id}
                    price={product.productData.price}
                    name={product.productData.name}
                    description={product.productData.description}
                    cover_image={product.productData.cover_image}
                    quantity={product.quantity}
                  />
                ))}
              </div>
            ) : (
              <div className="w-full flex items-center justify-center">
                <EmptyPage />
              </div>
            )}

            <div className="w-full flex items-end justify-end mb-4">
              <ShopProductPagination
                filter={filter.data}
                totalPage={Math.ceil(
                  (fetchShopProducts.total ?? 0) / filter.data.limit
                )}
                onPageChange={(e) => {
                  filter.dispatch({
                    type: filter.ACTION_TYPE.PAGE,
                    payload: e,
                  });
                }}
              />
            </div>
          </div>
          <form
            onSubmit={handleSubmitForm}
            className="w-2/5 flex items-start justify-start flex-col gap-4"
          >
            <div className="w-full bg-white p-3 rounded shadow-md">
              <div className="w-full flex items-center justify-between border-b pb-2">
                <p className="flex items-start justify-center text-sm gap-2">
                  <CartIcon size={18} />
                  Cart
                </p>
                <p
                  onClick={() => dispatch(clearCart())}
                  className="flex items-start justify-center text-sm gap-2 cursor-pointer text-neon_pink"
                >
                  <RefreshIcon />
                  Refresh
                </p>
              </div>
              <div className="w-full">
                {cartItems?.map((val, index) => (
                  <div
                    key={index + 1}
                    className="w-full border-b text-sm flex items-center justify-between px-2 my-2"
                  >
                    <p className="text-xs">{truncateText(val.name, 20)}</p>
                    <div className="flex items-center justify-start gap-6 rounded py-2 px-4">
                      <button
                        type="button"
                        className="rounded border text-white cursor-pointer p-0.5"
                        onClick={() => handleDecreaseQuantity(val.product_id)}
                      >
                        <MinusIcon size={10} className="text-gray-800" />
                      </button>
                      <p className="text-xs ">{val.quantity}</p>
                      <button
                        type="button"
                        className="rounded border text-white cursor-pointer p-0.5"
                        onClick={() => handleIncreaseQuantity(val.product_id)}
                      >
                        <PlusIcon size={10} className="text-gray-800" />
                      </button>
                    </div>
                    <p>${(val.quantity * val?.price).toFixed(2)}</p>
                    <TrashIcon
                      size={16}
                      className="cursor-pointer text-neon_pink"
                      onClick={() => handleRemoveFromCart(val.product_id)}
                    />
                  </div>
                ))}

                <div className="flex items-start justify-end text-sm gap-4 px-4">
                  <p>Total Price:</p>
                  <p className="font-bold">${subTotal.toFixed(2)}</p>
                </div>
              </div>
            </div>
            <div className="w-full bg-white p-3 rounded shadow-md flex items-start justify-start gap-4 flex-col">
              <div className="w-full flex items-start justify-start flex-col gap-2">
                <p className="text-sm">Select customer to give order:</p>
                {customerNewFormat && customerNewFormat.length > 0 && (
                  <Select
                    name="status"
                    title="Customer"
                    option={customerNewFormat}
                    className="py-1"
                    onChange={(e) => setCustomerId(e.target.value)}
                  />
                )}
              </div>
              <div className="w-full flex items-start justify-start gap-2 border rounded p-2">
                <div>
                  {data?.adminGetShop?.data.image.logo ? (
                    <Image
                      src={data?.adminGetShop?.data.image.logo}
                      width={120}
                      height={120}
                      alt="Image preview"
                      className="max-w-full h-auto border rounded"
                    />
                  ) : (
                    <Image
                      src="https://res.cloudinary.com/dvh8zf1nm/image/upload/v1738860057/default-image_uwedsh.webp"
                      width={120}
                      height={120}
                      alt="Image preview"
                      className="max-w-full h-auto border rounded"
                    />
                  )}
                </div>
                <div className="text-sm flex items-start justify-start flex-col gap-1">
                  <p>
                    Shop name:&nbsp;
                    <span className="text-neon_pink">
                      {params["shop-name"]}&nbsp; (VIP-
                      {data?.adminGetShop?.data.shop_vip})
                    </span>
                  </p>
                  <p>Email:&nbsp;{data?.adminGetShop?.data.email}</p>
                </div>
              </div>
              <IconButton
                className="rounded text-white p-2 bg-neon_pink w-full mt-4 text-xs"
                title={isLoading ? "Submiting...." : "ORDER NOW"}
                type="submit"
              />
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default ShopPage;
