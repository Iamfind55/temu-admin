"use client";

import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { useMutation } from "@apollo/client";

// components
import MyModal from "@/components/modal";
import Loading from "@/components/loading";
import IconButton from "@/components/iconButton";
import Pagination from "@/components/pagination";
import Breadcrumb from "@/components/breadCrumb";
import DeleteModal from "@/components/deleteModal";

// icons and types
import { formatDateToDDMMYYYY } from "@/utils/dateFormat";
import { CheckCircleIcon, CloseEyeIcon } from "@/icons/page";
import { EOrderStatus, ESignInStatus, IOrderTypes } from "@/types/order";

// Utils and hooks
import { useToast } from "@/utils/toast";
import { formatNumber } from "@/utils/formatNumber";
import { useOrderFilters } from "./hook/useOrderFilters";

// APIs
import { DELETE_BANNER } from "@/api/banner";
import { UPDATE_ORDER_WITH_STATUS } from "@/api/order";
import StatusBadge from "@/components/status";

export default function OrderPageList() {
  const g = useTranslations("globals");
  const router = useRouter();
  const { successMessage, errorMessage } = useToast();
  const [deleteBanner] = useMutation(DELETE_BANNER);
  const [updateOrderWithStatus, { loading: updateOrderWithStatusLoading }] =
    useMutation(UPDATE_ORDER_WITH_STATUS);

  const [selectedOrderIds, setSelectedOrderIds] = useState<string[]>([]);
  const [searchInput, setSearchInput] = useState<string>("");
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isOpenUpdateModal, setIsOpenUpdateModal] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedOrder, setSelectedOrder] = useState<IOrderTypes>();
  const [orders, setOrders] = useState<IOrderTypes[]>();
  const [activeTab, setActiveTab] = useState<EOrderStatus>(
    EOrderStatus.NO_PICKUP
  );

  const {
    filters,
    updateName,
    updatedAtRange,
    updateSortBy,
    data,
    error,
    updatePage,
    loading,
    handleChangeOrderStatus,
  } = useOrderFilters();

  useEffect(() => {
    if (data?.adminGetOrders?.data) setOrders(data?.adminGetOrders?.data);
  }, [data?.adminGetOrders?.data]);

  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
    updateName(e.target.value); // Triggers debounce logic
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      updateName(searchInput); // Immediately trigger search on "Enter"
    }
  };

  const handlePageChange = (page: number) => {
    updatePage(page); // Update filter state with new page
  };

  const handleDelete = async () => {
    try {
      setIsLoading(true);

      await deleteBanner({
        variables: {
          deleteBannerId: selectedOrder?.id,
        },
      });

      successMessage({
        message: "Delete banner successful!.",
        duration: 3000,
      });
      setIsOpen(false);

      const updateBanner = orders?.filter(({ id }) => id !== selectedOrder?.id);
      setOrders(updateBanner);
    } catch (error) {
      console.error({ error });
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmOrder = async (order: IOrderTypes) => {
    if (updateOrderWithStatusLoading || !order?.id) return;
    setSelectedOrderIds([order?.id]);
    setIsOpenUpdateModal(true);
  };

  const isCheckedBox = (id: string) => {
    return selectedOrderIds.some((_id) => _id === id); // ✅ Returns true/false
  };

  const handleUpdateManyOrderStatus = async () => {
    if (updateOrderWithStatusLoading || !selectedOrderIds.length) return;
    let order_status: EOrderStatus = EOrderStatus.PACKING;
    let sign_in_status: ESignInStatus = ESignInStatus.PACKING;
    if (activeTab === EOrderStatus.PACKING) {
      order_status = EOrderStatus.SHIPPING;
      sign_in_status = ESignInStatus.ON_THE_WAY;
    } else if (activeTab === EOrderStatus.SHIPPING) {
      order_status = EOrderStatus.SUCCESS;
      sign_in_status = ESignInStatus.SUCCESS;
    }

    try {
      const { data } = await updateOrderWithStatus({
        variables: {
          data: {
            ids: selectedOrderIds,
            sign_in_status: sign_in_status,
            order_status: order_status,
          },
        },
      });

      if (!data?.adminUpdateOrderWithStatus?.success) {
        return errorMessage({
          message: "Confirm order failed!.",
          duration: 3000,
        });
      }

      successMessage({
        message: "Confirm order successful!.",
        duration: 3000,
      });

      const updatedOrders = orders?.filter(
        (item) => !selectedOrderIds.includes(item.id)
      );
      setOrders(updatedOrders);
      setIsOpenUpdateModal(false);
      setSelectedOrderIds([]);
    } catch (error) {
      console.error({ error });
    }
  };

  const handleViewOrderDetail = async (order: IOrderTypes) => {
    router.push(`/admin/order/${order.order_no}`);
  };

  const filteredOrders = orders?.filter(
    (order) => order.order_status === activeTab
  );

  const handleCheckBox = (order: IOrderTypes) => {
    const existOrderId = selectedOrderIds.find((id) => id === order.id);
    if (existOrderId) {
      const _updateOrderIds = selectedOrderIds.filter((id) => id !== order.id);
      return setSelectedOrderIds(_updateOrderIds);
    }

    return setSelectedOrderIds([...selectedOrderIds, order.id]);
  };

  const handleCheckAllBox = () => {
    if (orders?.length === selectedOrderIds?.length)
      return setSelectedOrderIds([]);

    const _orderIds: string[] = orders?.map(({ id }) => id) as string[];
    return setSelectedOrderIds([..._orderIds]);
  };

  const handleOpenModal = () => {
    setIsOpenUpdateModal(!isOpenUpdateModal);
  };

  if (error) return <p>Error: {error.message}</p>;

  const totalItems: number = data?.adminGetOrders?.total;


  return (
    <div className="space-y-2 flex items-start justify-start flex-col gap-4">
      <div className="hidden w-full sm:flex justify-between items-center">
        <Breadcrumb
          items={[
            { label: "Admin dashboard", value: "/admin" },
            { label: "Order management", value: "/admin/order" },
          ]}
        />
      </div>

      {/* Tabs */}
      <div className="w-full flex overflow-auto space-x-4 border-b-2 py-1">
        {Object.values(EOrderStatus).map((status) => (
          <button
            key={status}
            className={`px-4 py-1 rounded text-xs ${activeTab === status ? "bg-neon_pink text-white" : "text-gray-600"
              }`}
            onClick={() => {
              handleChangeOrderStatus(status);
              setActiveTab(status);
            }}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Filter Controls */}
      <div className="w-full mb-6 text-gray-600 mt-6">
        <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
          {/* Left Side Filters */}
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            {/* Search */}
            <div className="w-full sm:w-2/5">
              <p className="text-sm text-gray-500 mb-1">Search</p>
              <input
                type="text"
                value={searchInput}
                placeholder="Enter order no, customer name..."
                onChange={handleSearchInput}
                onKeyDown={handleKeyPress}
                className="h-9 text-sm p-2 rounded w-full border focus:border-b_text focus:bg-white focus:ring-1 focus:ring-base text-gray-500 outline-none"
              />
            </div>

            {/* Date Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="w-full sm:w-auto">
                <p className="text-sm text-gray-500 mb-1">Start date</p>
                <input
                  type="date"
                  onChange={(e) =>
                    updatedAtRange(
                      e.target.value,
                      filters.dateRange?.endDate || ""
                    )
                  }
                  className="h-9 text-sm p-2 rounded w-full border focus:border-b_text focus:bg-white focus:ring-1 focus:ring-base text-gray-500 outline-none"
                />
              </div>
              <div className="w-full sm:w-auto">
                <p className="text-sm text-gray-500 mb-1">End date</p>
                <input
                  type="date"
                  onChange={(e) =>
                    updatedAtRange(
                      filters.dateRange?.startDate || "",
                      e.target.value
                    )
                  }
                  className="h-9 text-sm p-2 rounded w-full border focus:border-b_text focus:bg-white focus:ring-1 focus:ring-base text-gray-500 outline-none"
                />
              </div>
            </div>

            {/* Update Button */}
            {selectedOrderIds?.length > 0 && (
              <div className="flex items-end">
                <IconButton
                  className="rounded bg-green-500 text-white p-2 text-sm"
                  type="button"
                  title="Update"
                  onClick={() => handleOpenModal()}
                />
              </div>
            )}
          </div>

          {/* Sort */}
          <div className="w-full sm:w-auto">
            <p className="text-sm text-gray-500 mb-1">Sort</p>
            <select
              onChange={(e) => updateSortBy(e.target.value)}
              className="h-9 text-sm p-2 rounded w-full border focus:border-b_text focus:bg-white focus:ring-1 focus:ring-base text-gray-500 outline-none"
            >
              <option value="created_at_DESC">Created At (Newest)</option>
              <option value="created_at_ASC">Created At (Oldest)</option>
            </select>
          </div>
        </div>
      </div>


      {loading ? (
        <div className="flex items-center justify-center min-h-[500px] w-full">
          <Loading color="green" size="lg" />
        </div>
      ) : (
        <div className="w-full lg:w-[calc(100vw-320px)] rounded-md pb-4">
          <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
            <table className="w-full min-w-[1200px] text-sm text-left rtl:text-right text-gray-500 border">
              <thead className="text-xs text-gray-600 uppercase bg-gray-50 border-b">
                <tr>
                  <th scope="col" className="px-2 py-3">
                    <div className="flex space-x-2">
                      {[
                        EOrderStatus.PROCESSING,
                        EOrderStatus.PACKING,
                        EOrderStatus.SHIPPING,
                      ].includes(activeTab) && (
                          <input
                            className="cursor-pointer"
                            type="checkbox"
                            name="checkAll"
                            checked={
                              selectedOrderIds?.length > 0 &&
                              orders?.length === selectedOrderIds.length
                            }
                            onChange={() => handleCheckAllBox()}
                          />
                        )}
                      <div>{g("_table_no")}</div>
                    </div>
                  </th>
                  <th scope="col" className="px-2 py-3">
                    {g("_customer")}
                  </th>
                  <th scope="col" className="px-2 py-3">
                    Shop
                  </th>
                  <th scope="col" className="px-2 py-3">
                    Total product
                  </th>
                  <th scope="col" className="px-2 py-3">
                    {g("_total_price")}
                  </th>
                  <th scope="col" className="px-2 py-3">
                    {g("_discount")}
                  </th>
                  <th scope="col" className="px-2 py-3">
                    {g("_profit")}
                  </th>
                  <th scope="col" className="px-2 py-3">
                    Shipping
                  </th>
                  <th scope="col" className="px-2 py-3">
                    Order status
                  </th>
                  <th scope="col" className="px-2 py-3">
                    Payment status
                  </th>
                  <th scope="col" className="px-2 py-3">
                    Sign in status
                  </th>
                  <th scope="col" className="px-2 py-3">
                    Date
                  </th>
                  <th scope="col" className="px-2 py-3">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders?.map((order, index) => {
                  return (
                    <tr className="bg-white border-b" key={order?.id}>
                      <th scope="row" className="px-2 py-4">
                        <div className="flex space-x-2">
                          {[
                            EOrderStatus.PROCESSING,
                            EOrderStatus.PACKING,
                            EOrderStatus.SHIPPING,
                          ].includes(order.order_status) && (
                              <input
                                className="cursor-pointer"
                                type="checkbox"
                                name="id"
                                checked={isCheckedBox(order.id)}
                                onChange={() => handleCheckBox(order)}
                              />
                            )}
                          <span>
                            {(filters.page - 1) * filters.limit + index + 1}
                          </span>
                        </div>
                      </th>

                      <td className="px-2 py-4 truncate">
                        {`${order?.customerData?.firstName || ""} ${order?.customerData?.lastName || ""
                          }`}
                      </td>
                      <td className="px-2 py-4 truncate">
                        {`${order?.shop?.store_name || order?.shop?.fullname || ""}`}
                      </td>
                      <td className="px-2 py-4 truncate">
                        {order?.total_products}
                      </td>
                      <td className="px-2 py-4 truncate">
                        ${formatNumber(order?.total_price)}
                      </td>
                      <td className="px-2 py-4 truncate">
                        {order?.total_discount}
                      </td>
                      <td className="px-2 py-4 truncate">
                        {order?.profit}
                      </td>
                      <td className="px-2 py-4 truncate">
                        <div>
                          {order?.logistics?.company_name}
                          <p className="text-center text-xs">{order?.logistics?.cost < 1 ? "Free" : order?.logistics?.cost}</p>
                        </div>
                      </td>
                      <td className="px-2 py-4 truncate">
                        <StatusBadge status={order?.order_status} />
                      </td>
                      <td className="px-2 py-4 truncate">
                        <StatusBadge status={order?.payment_status} />
                      </td>
                      <td className="px-2 py-4 truncate">
                        <StatusBadge status={order?.sign_in_status} />
                      </td>
                      <td className="px-2 py-4">
                        {formatDateToDDMMYYYY(order?.created_at)}
                      </td>
                      <td>
                        <div className="flex items-center h-full w-full justify-center">{[
                          EOrderStatus.PROCESSING,
                          EOrderStatus.PACKING,
                          EOrderStatus.SHIPPING,
                        ].includes(order.order_status) && (
                            <CheckCircleIcon
                              onClick={() => handleConfirmOrder(order)}
                              size={20}
                              className="cursor-pointer hover:text-neon_pink"
                            />
                          )}
                          <CloseEyeIcon
                            onClick={() => handleViewOrderDetail(order)}
                            size={20}
                            className="cursor-pointer hover:text-neon_pink"
                          /></div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="text-gray-600 flex items-end justify-end bg-white">
            <Pagination
              filter={{ page: filters.page, limit: filters.limit }}
              totalItems={totalItems}
              onPageChange={handlePageChange}
            />
          </div>
        </div>

      )}

      <DeleteModal
        isOpen={isOpen}
        isLoading={isLoading}
        onClose={() => setIsOpen(false)}
        onConfirm={() => handleDelete()}
      />

      <MyModal
        isOpen={isOpenUpdateModal}
        onClose={handleOpenModal}
        className="z-50 flex justify-center items-center w-11/12 sm:w-2/5 md:inset-0 h-auto"
      >
        <div className="rounded  w-full">
          <h4 className="text-gray-500 text-sm mb-3 text-center">
            {`If you update the `}
            <span className="text-neon_pink font-bold text-lg">
              {activeTab === EOrderStatus.PROCESSING
                ? "processing"
                : activeTab === EOrderStatus.PACKING
                  ? "packing"
                  : "shipping"}
            </span>
            {` status, it will automatically update to the `}
            <span className="text-neon_pink font-bold text-lg">
              {activeTab === EOrderStatus.PROCESSING
                ? "packing"
                : activeTab === EOrderStatus.PACKING
                  ? "shipping"
                  : "success"}
            </span>
            {` status.`}
          </h4>
          <div className="flex flex-col lg:flex-row items-start justify-between rounded items-center mt-4">
            <div className="w-full flex items-center justify-center gap-4 p-4 ">
              <IconButton
                className="w-auto rounded text-base p-2 border text-sm"
                type="button"
                title="Cancel"
                onClick={() => handleOpenModal()}
              />
              <IconButton
                className="w-auto rounded text-white p-2 bg-base text-sm"
                icon={
                  updateOrderWithStatusLoading ? (
                    <Loading />
                  ) : (
                    <CheckCircleIcon size={16} />
                  )
                }
                isFront={true}
                title="Ok"
                onClick={() => handleUpdateManyOrderStatus()}
              />
            </div>
          </div>
        </div>
      </MyModal>
    </div>
  );
}
