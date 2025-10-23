"use client";

import React, { useEffect } from "react";
import { useRouter } from "@/i18n/navigation";
import { useLazyQuery, useMutation } from "@apollo/client";

// components
import Loading from "@/components/loading";
import IconButton from "@/components/iconButton";

// utils and hooks
import { useToast } from "@/utils/toast";
import { formatDateToDDMMYYYY } from "@/utils/dateFormat";
import { ORDER_DETAILS, UPDATE_ORDER_WITH_STATUS } from "@/api/order";

// type and icons
import { ApproveIcon } from "@/icons/page";
import { EOrderStatus, ESignInStatus } from "@/types/order";
import Breadcrumb from "@/components/breadCrumb";
import Image from "next/image";

const OrderDetailsPage = ({ params }: { params: any }) => {
  const router = useRouter();
  const { successMessage, errorMessage } = useToast();

  const [updateOrderWithStatus, { loading: updateOrderWithStatusLoading }] =
    useMutation(UPDATE_ORDER_WITH_STATUS);

  const [
    getOrderDetails,
    { data: orderDetailsData, loading: orderDetailDatasLoading },
  ] = useLazyQuery(ORDER_DETAILS, {
    fetchPolicy: "cache-and-network",
  });

  useEffect(() => {
    const getParams = async () => {
      const { id: orderId } = await params;
      if (orderId) {
        await getOrderDetails({
          variables: {
            where: {
              order_no: orderId,
              createdAtBetween: {
                startDate: null,
                endDate: null,
              },
              order_status: null,
            },
            limit: null,
            page: null,
            sortedBy: null,
          },
        });
      }
    };
    getParams();
  }, [params]);

  const goBack = () => {
    router.back();
  };


  const handleConfirmOrder = async () => {
    if (updateOrderWithStatusLoading) return;
    try {
      const { data } = await updateOrderWithStatus({
        variables: {
          data: {
            ids: [orderDetailsData?.adminGetOrderDetails?.data[0].order_id],
            sign_in_status: ESignInStatus.SUCCESS,
            order_status: EOrderStatus.SUCCESS,
          },
        },
      });

      if (!data?.adminUpdateOrderWithStatus?.success) {
        return errorMessage({
          message: "Confirm order failed!.",
          duration: 3000,
        });
      }

      return successMessage({
        message: "Confirm order successful!.",
        duration: 3000,
      });
    } catch (error) {
      console.error({ error });
    }
  };

  if (orderDetailDatasLoading) return <Loading />;

  const orderDetails = orderDetailsData?.adminGetOrderDetails?.data;

  return (
    <div className="container mx-auto p-4 text-gray-500">
      <div className="w-full flex space-x-2 mb-4 justify-between items-center">
        <Breadcrumb
          items={[
            { label: "Admin dashboard", value: "/admin" },
            { label: "Order managment", value: "/admin/order" },
            { label: "Order details", value: "/order/sdfgsdfgsdfgd" },
          ]}
        />
        {orderDetails?.length &&
          [EOrderStatus.PROCESSING].includes(orderDetails[0].order_status) && (
            <div>
              <IconButton
                icon={
                  updateOrderWithStatusLoading ? (
                    <Loading />
                  ) : (
                    <ApproveIcon size={22} />
                  )
                }
                className="w-1/2 mt-4 rounded bg-green-500 text-white p-2 text-xs text-bold"
                title={"Confirm order"}
                isFront={true}
                onClick={handleConfirmOrder}
                disabled={updateOrderWithStatusLoading}
              />
            </div>
          )}
      </div>
      {orderDetails && orderDetails.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {orderDetails.map((order: any) => (
            <div
              key={order.id}
              className="bg-white shadow-md rounded-lg p-4 border border-gray-200"
            >
              <p className="text-sm mb-2 text-gray-600">
                Order Date: {formatDateToDDMMYYYY(order.created_at)}
              </p>
              <div className="flex items-center space-x-4 mb-4">
                <img
                  src={order.product_cover_image}
                  alt={order.product_name}
                  className="w-16 h-16 object-cover rounded"
                />
                <p className="text-md font-semibold">
                  {JSON.parse(order.product_name).name_en}
                </p>
              </div>
              <div className="mt-2 grid grid-cols-1 gap-1 text-sm">
                <p>
                  <strong>Order No:</strong> {order.order_no}
                </p>
                <p>
                  <strong>Quantity:</strong> {order.quantity}
                </p>
                <p>
                  <strong>Order payment:</strong> $
                  {order.price * order.quantity}
                </p>
                <p>
                  <strong>Profit:</strong> {order.profit}
                </p>
              </div>
              <div className="space-y-2 grid grid-cols-1 gap-1 text-sm">
                <p>
                  <strong>Payment status:</strong>
                  <span
                    className={`px-2 py-1 mx-2 rounded text-white ${order.payment_status === "Payment completed"
                      ? "bg-green-500"
                      : "bg-red-500"
                      }`}
                  >
                    {order.payment_status}
                  </span>
                </p>
                <p>
                  <strong>Order status:</strong>
                  <span className="px-2 py-1 mx-2 rounded bg-gray-400 text-white">
                    {order.order_status}
                  </span>
                </p>
                <p>
                  <strong>Sign in:</strong>
                  <span className="px-2 py-1 mx-2 rounded bg-gray-500 text-white">
                    {order.sign_in_status}
                  </span>
                </p>
              </div>
              <div className="mt-2 text-sm text-gray-600">
                <strong>Expected Revenue:</strong>{" "}
                <span className="text-green-500">
                  +{(order.price * order.quantity * order.profit) / 100}
                </span>
              </div>
              <div className="mt-8 border-t-2">
                <h3 className="text-md mt-5 font-semibold mb-2 text-black">Logistics Info</h3>
                <div className="flex items-center space-x-4">
                  <p><strong>Company:</strong> {order.logistics?.company_name}</p>
                  <Image src={order.logistics?.logo ?? ""} className="rounded-md" alt="logo" width={50} height={50} /></div>
              </div>
              <div className="flex items-center space-x-4">
                <p><strong>Transport modes:</strong> {order.logistics?.transport_modes?.join(", ")}</p>
              </div>
              <div className="flex items-center space-x-4">
                <p><strong>Shipping:</strong> {order.logistics?.cost}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No order details found.</p>
      )
      }
    </div >
  );
};

export default OrderDetailsPage;
