"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "@/i18n/navigation";
import { useMutation } from "@apollo/client";

// API, Utils
import { useToast } from "@/utils/toast";
import {
  APPROVE_SHOP,
  DELETE_SHOP,
  MUTATION_APPROVE_VIP,
  MUTATION_BLOCK_SHOP,
  // UPDATE_SHOP,
} from "@/api/shop";
import { formatDateToDDMMYYYY } from "@/utils/dateFormat";
import { page_limits, shop_status, vip_level } from "@/utils/option";
import {
  BlockUserIcon,
  CartIcon,
  CheckCircleIcon,
  CloseEyeIcon,
  SearchIcon,
  TrashIcon,
  VIPIcon,
} from "@/icons/page";

// hooks and types
import useFilter from "./hook/useFilter";
import useFetchShops from "./hook/useFetch";
import { EShopStatus, IShopType } from "@/types/shop";

// components
import Select from "@/components/select";
import StatusBadge from "@/components/status";
import EmptyPage from "@/components/emptyPage";
import Breadcrumb from "@/components/breadCrumb";
import DatePicker from "@/components/datePicker";
import DeleteModal from "@/components/deleteModal";
import Pagination1 from "@/components/pagination1";
import MyModal from "@/components/modal";
import IconButton from "@/components/iconButton";
import Loading from "@/components/loading";
import { useDispatch } from "react-redux";
import { removeVipAmount } from "@/redux/slice/amountSlice";

export default function ShopPageList() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { successMessage, errorMessage } = useToast();

  const filter = useFilter();
  const fetchShops = useFetchShops({
    filter: filter.data,
  });

  const [deleteShop] = useMutation(DELETE_SHOP);
  const [approveShop, { loading: approveShopLoading }] =
    useMutation(APPROVE_SHOP);
  const [blockShop] = useMutation(MUTATION_BLOCK_SHOP);
  const [approveVIP] = useMutation(MUTATION_APPROVE_VIP);

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [openModal, setIsOpenModal] = useState<boolean>(false);
  const [openVIPModal, setOpenVIPModal] = useState<boolean>(false);
  const [selectedShop, setSelectedShop] = useState<IShopType | null>(null);
  const [openBlockModal, setIsOpenBlockModal] = useState<boolean>(false);

  const handleOpenModal = () => {
    setIsOpenModal(!openModal);
  };

  const handleOpenVIPApproveModal = () => {
    setOpenVIPModal(!openVIPModal);
  };

  const handleOpenBlockModal = () => {
    setIsOpenBlockModal(!openBlockModal);
  };

  const handleDelete = async () => {
    try {
      setIsLoading(true);

      await deleteShop({
        variables: {
          deleteShopId: selectedShop?.id,
        },
      });

      successMessage({
        message: "Delete shop successful!.",
        duration: 3000,
      });
      setIsOpen(false);
      fetchShops.refetch();
    } catch (error) {
      console.error({ error });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectShop = (shop: IShopType) => {
    setSelectedShop(shop);
    setIsOpen(true);
  };

  const handleApproveShop = async () => {
    if (approveShopLoading) return;
    try {
      setIsLoading(true);
      const { data } = await approveShop({
        variables: {
          adminApproveShopId: selectedShop?.id,
        },
      });

      if (!data?.adminApproveShop?.success) {
        return errorMessage({
          message: data?.adminApproveShop?.error.message,
          duration: 3000,
        });
      }
      successMessage({
        message: "Approve shop successful!.",
        duration: 3000,
      });
    } catch (error) {
      errorMessage({
        message: "Sorry, Unexpected error occurred!.",
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
      fetchShops.refetch();
      handleOpenModal();
    }
  };

  const handleBlockAndUnblockShop = async () => {
    try {
      setIsLoading(true);
      const { data } = await blockShop({
        variables: {
          data: {
            id: selectedShop?.id,
            status: selectedShop?.status === "INACTIVE" ? "ACTIVE" : "INACTIVE",
          },
        },
      });

      if (!data?.adminUpdateShop?.success) {
        return errorMessage({
          message: data?.adminUpdateShop?.error.message,
          duration: 3000,
        });
      }
      successMessage({
        message:
          selectedShop?.status === "INACTIVE"
            ? "Shop has been unblock!"
            : "Shop has been blocked!",
        duration: 3000,
      });
    } catch (error) {
      errorMessage({
        message: "Sorry, Unexpected error occurred!",
        duration: 3000,
      });
    } finally {
      setSelectedShop(null);
      setIsLoading(false);
      fetchShops.refetch();
      handleOpenBlockModal();
    }
  };

  const handleVIPApprovement = async () => {
    try {
      setIsLoading(true);
      const { data } = await approveVIP({
        variables: {
          adminApproveShopRequestVipId: selectedShop?.id,
        },
      });

      if (!data?.adminApproveShopRequestVIP?.success) {
        return errorMessage({
          message: data?.adminApproveShopRequestVIP?.error.message,
          duration: 3000,
        });
      }
      successMessage({
        message: "Approve shop to be VIP successful!.",
        duration: 3000,
      });
      dispatch(removeVipAmount(1));
    } catch (error) {
      errorMessage({
        message: "Sorry, Unexpected error occurred!.",
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
      fetchShops.refetch();
      handleOpenVIPApproveModal();
    }
  };

  return (
    <div className="space-y-2">
      <Breadcrumb
        items={[
          { label: "Admin dashboard", value: "/admin" },
          { label: "Shop management", value: "/shop" },
        ]}
      />

      <div className="bg-white w-full rounded py-2 px-4 flex items-start justify-start flex-col gap-2">
        <div className="w-full flex flex-col sm:flex-row items-start justify-between gap-6">
          <div className="w-full sm:w-2/5 flex items-start justify-start gap-2 mt-2 sm:mt-0">
            <div className="w-1/4">
              <Select
                name="show"
                title="Show"
                option={page_limits}
                className="p-1"
                onChange={(e) => {
                  filter.dispatch({
                    type: filter.ACTION_TYPE.LIMIT,
                    payload: e.target.value,
                  });
                }}
              />
            </div>
            <div className="w-1/4">
              <Select
                name="status"
                title="Status"
                option={shop_status}
                className="py-1"
                onChange={(e) => {
                  filter.dispatch({
                    type: filter.ACTION_TYPE.STATUS,
                    payload: e.target.value,
                  });
                }}
              />
            </div>
            <div className="w-1/4">
              <Select
                name="status"
                title="VIP level"
                option={vip_level}
                className="py-1"
                onChange={(e) => {
                  filter.dispatch({
                    type: filter.ACTION_TYPE.SHOP_VIP,
                    payload: e.target.value,
                  });
                }}
              />
            </div>
          </div>
          <div className="w-full sm:w-3/5 flex flex-col sm:flex-row mt-2 sm:mt-0 items-end justify-start gap-2">
            <div className="relative w-full border rounded">
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
                className="h-8 bg-white text-gray-500 text-sm rounded ps-10 p-2 focus:outline-none focus:ring-1"
              />
            </div>
            <DatePicker
              name="start_date"
              title="Start date"
              className="py-1"
              value={filter.state.createdAtBetween.startDate ?? ""}
              onChange={(e) => {
                filter.dispatch({
                  type: filter.ACTION_TYPE.CREATED_AT_START_DATE,
                  payload: e.target.value,
                });
              }}
            />
            <DatePicker
              name="end_date"
              title="End date"
              className="py-1"
              value={filter.state.createdAtBetween.endDate ?? ""}
              onChange={(e) => {
                filter.dispatch({
                  type: filter.ACTION_TYPE.CREATED_AT_END_DATE,
                  payload: e.target.value,
                });
              }}
            />
          </div>
        </div>

        <div className="overflow-x-auto w-full bg-white h-auto rounded-md">
          {fetchShops.total ?? 0 > 0 ? (
            <table className="w-auto text-sm text-left rtl:text-right text-gray-500 border rounded">
              <thead className="text-xs text-gray-600 uppercase bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    id
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Profile
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Store name
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Email
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Phone Number
                  </th>
                  <th scope="col" className="px-6 py-3">
                    VIP Level
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Request VIP
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Created at
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {fetchShops?.data?.map((shop, index) => {
                  return (
                    <tr
                      className={`bg-white border-b ${shop.status === "INACTIVE" && "text-red-500"
                        }`}
                      key={shop?.id + index}
                    >
                      <th scope="row" className="px-6 py-4">
                        {index + 1}
                      </th>
                      <td className="px-6 py-4">
                        <Image
                          className="shadow-md rounded"
                          src={
                            shop?.image?.logo &&
                              typeof shop?.image?.logo === "string" &&
                              shop?.image?.logo.startsWith("http")
                              ? shop?.image?.logo
                              : "https://res.cloudinary.com/dvh8zf1nm/image/upload/v1738860057/default-image_uwedsh.webp"
                          }
                          alt="default"
                          width={50}
                          height={50}
                        />
                      </td>
                      <td className="px-6 py-4 truncate max-w-xs">
                        {shop?.store_name}
                      </td>
                      <td className="px-6 py-4 truncate max-w-xs">
                        {shop?.email}
                      </td>
                      <td className="px-6 py-4 truncate max-w-xs">
                        {shop?.phone_number}
                      </td>
                      <td className="px-6 py-4 truncate max-w-xs">
                        {shop?.shop_vip}
                      </td>
                      <td className="px-6 py-4 truncate max-w-xs flex items-start justify-start gap-2">
                        <StatusBadge
                          status={
                            shop.request_vip_data?.request_status ?? "NULL"
                          }
                        />
                        {shop?.request_vip_data?.request_vip && (
                          <span className="bg-neon_pink text-white px-2 rounded">
                            VIP&nbsp;{shop?.request_vip_data?.request_vip}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 truncate max-w-xs">
                        <StatusBadge status={shop.status} />
                      </td>
                      <td className="px-6 py-4">
                        {formatDateToDDMMYYYY(shop?.created_at)}
                      </td>
                      <td className="flex space-x-2 px-6 py-4 mt-2.5">
                        {shop?.request_vip_data?.request_vip &&
                          shop?.request_vip_data?.request_status !==
                          "APPROVED" ? (
                          <VIPIcon
                            size={18}
                            className="cursor-pointer hover:text-neon_pink"
                            onClick={() => {
                              setSelectedShop(shop);
                              handleOpenVIPApproveModal();
                            }}
                          />
                        ) : (
                          ""
                        )}

                        {[EShopStatus.PENDING].includes(shop.status) && (
                          <CheckCircleIcon
                            onClick={() => {
                              setSelectedShop(shop);
                              handleOpenModal();
                            }}
                            size={18}
                            className="cursor-pointer text-green-500 hover:text-neon_pink"
                          />
                        )}
                        <CloseEyeIcon
                          onClick={() => router.push(`/admin/shop/${shop.id}`)}
                          size={18}
                          className="cursor-pointer hover:text-neon_pink"
                        />
                        <TrashIcon
                          onClick={() => handleSelectShop(shop)}
                          size={18}
                          className="cursor-pointer hover:text-neon_pink"
                        />
                        <CartIcon
                          onClick={() =>
                            router.push(
                              `/admin/shop/${shop.id}/${shop.store_name}`
                            )
                          }
                          size={18}
                          className="cursor-pointer hover:text-neon_pink"
                        />
                        <BlockUserIcon
                          size={18}
                          onClick={() => {
                            setSelectedShop(shop);
                            handleOpenBlockModal();
                          }}
                          className="cursor-pointer hover:text-neon_pink"
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <EmptyPage />
          )}

          <div className="flex items-end justify-end text-gray-600">
            <Pagination1
              filter={filter.data}
              totalPage={Math.ceil((fetchShops.total ?? 0) / filter.data.limit)}
              onPageChange={(e) => {
                filter.dispatch({
                  type: filter.ACTION_TYPE.PAGE,
                  payload: e,
                });
              }}
            />
          </div>
        </div>
      </div>

      <DeleteModal
        isOpen={isOpen}
        isLoading={isLoading}
        onClose={() => setIsOpen(false)}
        onConfirm={() => handleDelete()}
      />

      {/* confirm or reject modal */}
      <MyModal
        isOpen={openModal}
        onClose={handleOpenModal}
        className="z-50 flex justify-center items-center w-11/12 sm:w-2/5 md:inset-0 h-auto"
      >
        <div className="rounded w-full">
          <div className="w-full flex items-center justify-center flex-col">
            <h4 className="text-gray-600 text-md font-semibold mb-2">
              Approve confirmation!
            </h4>
            <p className="text-gray-500 text-sm mb-3">
              Have you review shop detail already?. Do you want to proceed?
            </p>
          </div>
          <div className="flex flex-col lg:flex-row items-center justify-center rounded mt-2 gap-2">
            <IconButton
              className="w-auto rounded order text-gray-500 border p-2 text-xs"
              type="button"
              title="CLOSE"
              onClick={() => handleOpenModal()}
            />
            <IconButton
              type="button"
              icon={isLoading ? <Loading /> : ""}
              isFront={isLoading ? true : false}
              title={isLoading ? "CONFIRMING...." : "CONFIRM"}
              onClick={() => handleApproveShop()}
              className="w-auto rounded bg-green-500 text-white p-2 text-xs"
            />
          </div>
        </div>
      </MyModal>

      {/* block and unblock modal modal */}
      <MyModal
        isOpen={openBlockModal}
        onClose={handleOpenBlockModal}
        className="z-50 flex justify-center items-center w-11/12 sm:w-2/5 md:inset-0 h-auto"
      >
        <div className="rounded w-full">
          <div className="w-full flex items-center justify-center flex-col">
            <h4 className="text-gray-600 text-md font-semibold mb-2">
              {selectedShop?.status === "INACTIVE" ? "Unblock" : "Block"}
              &nbsp; confirmation!
            </h4>
            <p className="text-gray-500 text-sm mb-3">
              Are you sure you want to{" "}
              {selectedShop?.status === "INACTIVE" ? "Unblock" : "block"} this
              shop?
            </p>
          </div>
          <div className="flex flex-col lg:flex-row items-center justify-center rounded mt-2 gap-2">
            <IconButton
              className="w-auto rounded order text-gray-500 border p-2 text-xs"
              type="button"
              title="CLOSE"
              onClick={() => handleOpenBlockModal()}
            />
            <IconButton
              type="button"
              icon={isLoading ? <Loading /> : ""}
              isFront={isLoading ? true : false}
              title={
                isLoading
                  ? "BLOCKING...."
                  : selectedShop?.status === "INACTIVE"
                    ? "UNBLOCK"
                    : "BlOCK"
              }
              onClick={() => handleBlockAndUnblockShop()}
              className="w-auto rounded bg-neon_pink text-white p-2 text-xs"
            />
          </div>
        </div>
      </MyModal>

      <MyModal
        isOpen={openVIPModal}
        onClose={handleOpenVIPApproveModal}
        className="z-50 flex justify-center items-center w-11/12 sm:w-2/5 md:inset-0 h-auto"
      >
        <div className="rounded w-full">
          <div className="w-full flex items-center justify-center flex-col">
            <h4 className="text-gray-600 text-md font-semibold mb-2">
              VIP approvement confirmation!
            </h4>
            <p className="text-gray-500 text-sm mb-3">
              Are you sure you want to shop to be{" "}
              <strong className="text-neon_pink">
                VIP-
                {selectedShop?.request_vip_data?.request_vip}
              </strong>{" "}
              level?
            </p>
          </div>
          <div className="flex flex-col lg:flex-row items-center justify-center rounded mt-2 gap-2">
            <IconButton
              className="w-auto rounded order text-gray-500 border p-2 text-xs"
              type="button"
              title="CLOSE"
              onClick={() => handleOpenVIPApproveModal()}
            />
            <IconButton
              type="button"
              icon={isLoading ? <Loading /> : ""}
              isFront={isLoading ? true : false}
              title={isLoading ? "Approving...." : "Approve Now"}
              onClick={() => handleVIPApprovement()}
              className="w-auto rounded bg-neon_pink text-white p-2 text-xs"
            />
          </div>
        </div>
      </MyModal>
    </div>
  );
}
