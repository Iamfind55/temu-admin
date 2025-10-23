"use client";

import React from "react";
import Image from "next/image";
import { useLazyQuery, useMutation } from "@apollo/client";

// components
import MyModal from "@/components/modal";
import Select from "@/components/select";
import Loading from "@/components/loading";
import StatusBadge from "@/components/status";
import Breadcrumb from "@/components/breadCrumb";
import DatePicker from "@/components/datePicker";
import IconButton from "@/components/iconButton";
import Pagination1 from "@/components/pagination1";

// icons and hooks
import { useToast } from "@/utils/toast";
import useFilter from "./hooks/useFilter";
import useFetchTransactions from "./hooks/useFetch";
import { formatDateToDDMMYYYY } from "@/utils/dateFormat";
import {
  GetISingleTransactionResponse,
  ITransactions,
} from "@/types/transaction";
import { coin_type, page_limits, transactions } from "@/utils/option";
import {
  CheckCircleIcon,
  CloseEyeIcon,
  CustomerIcon,
  DepositIcon,
  ShopIcon,
} from "@/icons/page";

// APIs
import {
  MUTATION_ADMIN_APPROVE_TRANSACTION,
  MUTATION_ADMIN_REJECT_TRANSACTION,
  QUERY_ADMIN_GET_TRANSACTION,
} from "@/api/transaction";
import { useDispatch } from "react-redux";
import { removeTransactionAmount } from "@/redux/slice/amountSlice";

export default function Transactions() {
  const filter = useFilter();
  const dispatch = useDispatch();
  const fetchTransaction = useFetchTransactions({
    filter: filter.data,
  });

  const { successMessage, errorMessage } = useToast();
  const [queryTransaction, { data, loading }] =
    useLazyQuery<GetISingleTransactionResponse>(QUERY_ADMIN_GET_TRANSACTION, {
      fetchPolicy: "no-cache",
    });
  const [rejectTransaction] = useMutation(MUTATION_ADMIN_REJECT_TRANSACTION);
  const [approveTransaction] = useMutation(MUTATION_ADMIN_APPROVE_TRANSACTION);

  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  // const [showSlip, setShowSlip] = React.useState<boolean>(false);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [row, setRow] = React.useState<ITransactions | null>(null);
  const [isLoading1, setIsLoading1] = React.useState<boolean>(false);
  const [openDetail, setOpenDetail] = React.useState<boolean>(false);
  const [isOpenImage, setIsOpenImage] = React.useState<boolean>(false);
  const [transactionId, setTransactionId] = React.useState<string>("");

  const handleOpenModal = () => {
    setIsOpen(!isOpen);
  };

  const handleOpenDetail = () => {
    setOpenDetail(!openDetail);
  };

  const handleOpenImageModal = () => {
    setIsOpenImage(!isOpenImage);
  };

  const handleApproveTransaction = async () => {
    setIsLoading(true);
    try {
      const res = await approveTransaction({
        variables: {
          adminApproveRechargeTransactionHistoryId: row?.id,
        },
      });
      if (res?.data?.adminApproveRechargeTransactionHistory.success) {
        handleOpenModal();
        successMessage({
          message: "Approve transaction successfull!",
          duration: 3000,
        });
        dispatch(removeTransactionAmount(1));
        fetchTransaction.refetch();
      } else {
        errorMessage({
          message:
            res?.data?.adminApproveRechargeTransactionHistory.error.details,
          duration: 3000,
        });
      }
    } catch (error) {
      errorMessage({
        message: "Sorry. Unexpected error occur while proccessing!",
        duration: 2000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRejectTransaction = async () => {
    setIsLoading1(true);
    try {
      const res = await rejectTransaction({
        variables: {
          adminRejectTransactionHistoryId: row?.id,
        },
      });
      if (res?.data?.adminRejectTransactionHistory.success) {
        handleOpenModal();
        successMessage({
          message: "Reject transaction successfull!",
          duration: 3000,
        });
        fetchTransaction.refetch();
        dispatch(removeTransactionAmount(1));
      } else {
        errorMessage({
          message: res?.data?.adminRejectTransactionHistory.error.details,
          duration: 3000,
        });
      }
    } catch (error) {
      errorMessage({
        message: "Sorry. Unexpected error occur while proccessing!",
        duration: 2000,
      });
    } finally {
      setIsLoading1(false);
    }
  };

  React.useEffect(() => {
    queryTransaction({
      variables: {
        adminGetTransactionHistoryId: transactionId,
      },
    });
  }, [transactionId]);

  console.log("Data:::", data);

  return (
    <>
      <Breadcrumb
        items={[
          { label: "Admin dashboard", value: "/admin" },
          { label: "Transaction management", value: "/transaction" },
        ]}
      />
      <div className="bg-white rounded-md p-4 mt-4 text-sm text-gray-500">
        <div className="w-full flex flex-col sm:flex-row items-start justify-between gap-6">
          <div className="w-full sm:w-2/5 flex items-start justify-start gap-2 mt-2 sm:mt-0">
            <div className="w-2/4">
              <Select
                name="show"
                title="Show"
                option={page_limits}
                className="py-1"
                onChange={(e) => {
                  filter.dispatch({
                    type: filter.ACTION_TYPE.LIMIT,
                    payload: e.target.value,
                  });
                }}
              />
            </div>
            <div className="w-2/4">
              <Select
                name="show"
                title="Coin type"
                option={coin_type}
                className="py-1"
                onChange={(e) => {
                  filter.dispatch({
                    type: filter.ACTION_TYPE.COIN_TYPE,
                    payload: e.target.value,
                  });
                }}
              />
            </div>
            <div className="w-2/4">
              <Select
                name="show"
                title="Types"
                option={transactions}
                className="py-1"
                onChange={(e) => {
                  filter.dispatch({
                    type: filter.ACTION_TYPE.IDENTIFIER,
                    payload: e.target.value,
                  });
                }}
              />
            </div>
          </div>
          <div className="w-full sm:w-2/5 flex flex-col sm:flex-row mt-2 sm:mt-0 items-end justify-start gap-2">
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

        <table className="w-full text-sm text-left rtl:text-right text-gray-500 border rounded-md mt-4">
          <thead className="text-xs text-gray-600 uppercase bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3">
                id
              </th>
              <th scope="col" className="px-6 py-3">
                Slip
              </th>
              <th scope="col" className="px-6 py-3">
                Customer / Shop
              </th>
              <th scope="col" className="px-6 py-3">
                Types
              </th>
              <th scope="col" className="px-6 py-3">
                Amount
              </th>
              <th scope="col" className="px-6 py-3">
                Coin types
              </th>
              <th scope="col" className="px-6 py-3">
                created_at
              </th>
              <th scope="col" className="px-6 py-3">
                Status
              </th>
              <th scope="col" className="px-6 py-3">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {fetchTransaction?.data?.map((shop, index) => {
              return (
                <tr key={index + 1} className="bg-white border-b">
                  <th scope="row" className="px-6 py-4">
                    {index + 1}
                  </th>
                  <td className="px-6 py-4">
                    <Image
                      className="shadow-md rounded cursor-pointer"
                      src={
                        shop.payment_slip
                          ? shop.payment_slip
                          : "https://res.cloudinary.com/dvh8zf1nm/image/upload/v1738860057/default-image_uwedsh.webp"
                      }
                      alt="default"
                      width={50}
                      height={50}
                      onClick={() => handleOpenImageModal()}
                    />
                  </td>
                  <td className="px-6 py-4 truncate max-w-xs flex items-center justify-center gap-1">
                    {shop?.shop?.store_name ? <ShopIcon /> : <CustomerIcon />}
                    {shop?.shop?.store_name ? (
                      shop?.shop?.store_name
                    ) : (
                      <span>
                        {shop?.customer?.firstName +
                          " " +
                          shop?.customer?.lastName}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 truncate max-w-xs">
                    {/* {shop.identifier} */}
                    <StatusBadge status={shop.identifier} />
                  </td>
                  <td className="px-6 py-4 truncate max-w-xs text-center">
                    {shop.amount}
                  </td>
                  <td className="px-6 py-4 truncate max-w-xs text-center">
                    {shop.coin_type}
                  </td>
                  <td className="px-6 py-4 ">
                    {formatDateToDDMMYYYY(shop?.created_at)}
                  </td>
                  <td className="px-6 py-4 truncate max-w-xs">
                    <StatusBadge status={shop.transaction_status} />
                  </td>
                  <td className="flex space-x-2 px-6 pt-7 pb-4">
                    <div
                      onClick={() => {
                        setTransactionId(shop.id);
                        handleOpenDetail();
                      }}
                      className="flex items-center justify-center bg-yellow-100 py-1 px-2 rounded gap-1 cursor-pointer"
                    >
                      <CloseEyeIcon
                        size={16}
                        className="cursor-pointer text-yellow-500"
                      />
                    </div>
                    <div
                      onClick={() => {
                        setRow(shop);
                        handleOpenModal();
                      }}
                      className="flex items-center justify-center bg-green-100 py-1 px-2 rounded text-green-500 gap-1 cursor-pointer"
                    >
                      <CheckCircleIcon
                        size={16}
                        className="cursor-pointer text-green-500"
                      />
                      Confirm
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <div className="w-full flex items-end justify-end mb-4">
          <Pagination1
            filter={filter.data}
            totalPage={Math.ceil(
              (fetchTransaction.total ?? 0) / filter.data.limit
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

      {/* payment slip preview  */}
      <MyModal
        isOpen={isOpenImage}
        onClose={handleOpenImageModal}
        className="z-50 flex justify-center items-center w-11/12 sm:w-3/5 md:inset-0 h-auto"
      >
        <div className="w-full">
          <div className="h-[60vh]">
            <Image
              className="shadow-md rounded cursor-pointer w-full h-full border"
              src="https://res.cloudinary.com/dvh8zf1nm/image/upload/v1738860057/default-image_uwedsh.webp"
              alt="default"
              width={800}
              height={600}
              onClick={() => handleOpenImageModal()}
            />
          </div>
        </div>
      </MyModal>

      {/* view details modal  */}
      <MyModal
        isOpen={openDetail}
        onClose={handleOpenDetail}
        className="z-50 flex justify-center items-center w-2/4 md:inset-0 h-auto"
      >
        {loading ? (
          <div className="h-full w-full flex items-center justify-center">
            <Loading />
          </div>
        ) : (
          data?.adminGetTransactionHistory && (
            <div className="w-full flex flex-col gap-2 bg-white rounded-md mt-4 text-sm text-gray-500">
              {data?.adminGetTransactionHistory?.data?.customer && (
                <div className="w-full rounded border p-2">
                  <div className="w-full flex justify-between">
                    <ul className="ml-2 mt-2 flex flex-col gap-1 text-xs">
                      <h1 className="text-sm font-bold">Customer Details:</h1>
                      <Image
                        className="rounded cursor-pointer border mt-2"
                        src={
                          data?.adminGetTransactionHistory?.data?.customer.image
                            ? data?.adminGetTransactionHistory?.data?.customer
                              .image
                            : "https://res.cloudinary.com/dvh8zf1nm/image/upload/v1738860057/default-image_uwedsh.webp"
                        }
                        alt="Payment Slip"
                        width={80}
                        height={80}
                        onClick={handleOpenImageModal}
                      />
                      <li>
                        <strong>Name:</strong>&nbsp;
                        {data?.adminGetTransactionHistory?.data?.customer
                          ?.firstName ?? "N/A"}{" "}
                        {data?.adminGetTransactionHistory?.data?.customer
                          ?.lastName ?? ""}
                      </li>
                      <li>
                        <strong>Phone number:</strong>&nbsp;
                        {data?.adminGetTransactionHistory?.data?.customer
                          ?.phone_number ?? "N/A"}
                      </li>
                      <li>
                        <strong>Email:</strong>&nbsp;
                        {data?.adminGetTransactionHistory?.data?.customer
                          ?.email ?? "N/A"}
                      </li>
                      <li>
                        <strong>Username:</strong>&nbsp;
                        {data?.adminGetTransactionHistory?.data?.customer
                          ?.username ?? "N/A"}
                      </li>
                      <li>
                        <strong>Date of birth:</strong>&nbsp;
                        {data?.adminGetTransactionHistory?.data?.customer
                          ?.dob ?? "N/A"}
                      </li>
                      <li>
                        <strong>Status:</strong>&nbsp;
                        <StatusBadge
                          status={
                            data?.adminGetTransactionHistory?.data?.customer
                              ?.status ?? "Unknown"
                          }
                        />
                      </li>
                      <li>
                        <strong>Created at:</strong>&nbsp;
                        {data?.adminGetTransactionHistory?.data?.customer
                          ?.created_at ?? "N/A"}
                      </li>
                    </ul>
                  </div>
                </div>
              )}

              {data?.adminGetTransactionHistory?.data?.shop && (
                <div className="w-full rounded border p-2">
                  <div className="w-full flex justify-between">
                    <ul className="ml-2 mt-2 flex flex-col gap-1 text-xs">
                      <h1 className="text-sm font-bold">Shop Details:</h1>
                      <Image
                        className="rounded cursor-pointer border mt-2"
                        src={
                          data?.adminGetTransactionHistory?.data?.shop.image
                            .logo
                            ? data?.adminGetTransactionHistory?.data?.shop.image
                              .logo
                            : "https://res.cloudinary.com/dvh8zf1nm/image/upload/v1738860057/default-image_uwedsh.webp"
                        }
                        alt="Payment Slip"
                        width={80}
                        height={80}
                        onClick={handleOpenImageModal}
                      />
                      <li>
                        <strong>Name:</strong>&nbsp;
                        {data?.adminGetTransactionHistory?.data?.shop
                          ?.store_name ?? "N/A"}{" "}
                      </li>
                      <li>
                        <strong>Phone number:</strong>&nbsp;
                        {data?.adminGetTransactionHistory?.data?.shop
                          ?.phone_number ?? "N/A"}
                      </li>
                      <li>
                        <strong>Email:</strong>&nbsp;
                        {data?.adminGetTransactionHistory?.data?.shop?.email ??
                          "N/A"}
                      </li>
                      <li>
                        <strong>Username:</strong>&nbsp;
                        {data?.adminGetTransactionHistory?.data?.shop
                          ?.username ?? "N/A"}
                      </li>
                      <li>
                        <strong>Date of birth:</strong>&nbsp;
                        {data?.adminGetTransactionHistory?.data?.shop?.dob ??
                          "N/A"}
                      </li>
                      <li>
                        <strong>Status:</strong>&nbsp;
                        <StatusBadge
                          status={
                            data?.adminGetTransactionHistory?.data?.shop
                              ?.status ?? "Unknown"
                          }
                        />
                      </li>
                      <li>
                        <strong>Address:</strong>&nbsp;
                        <StatusBadge
                          status={
                            data?.adminGetTransactionHistory?.data?.shop
                              ?.shop_address ?? "Unknown"
                          }
                        />
                      </li>
                      <li>
                        <strong>Created at:</strong>&nbsp;
                        {data?.adminGetTransactionHistory?.data?.shop
                          ?.created_at ?? "N/A"}
                      </li>
                    </ul>
                  </div>
                </div>
              )}

              {/* Transaction Details */}
              <div className="w-full flex justify-between flex-col rounded border p-2">
                <ul className="w-full ml-2 mt-2 flex flex-col gap-1 text-xs">
                  <h1 className="text-sm font-bold">Transaction Details:</h1>
                  <li>
                    <strong>Identifier:</strong>&nbsp;
                    <StatusBadge
                      status={
                        data?.adminGetTransactionHistory?.data?.identifier ??
                        "Unknown"
                      }
                    />
                  </li>
                  <li>
                    <strong>Coin type:</strong>&nbsp;
                    {data?.adminGetTransactionHistory?.data?.coin_type ?? ""}
                  </li>
                  <li>
                    <strong>Status:</strong>&nbsp;
                    <StatusBadge
                      status={
                        data?.adminGetTransactionHistory?.data
                          ?.transaction_status ?? "Unknown"
                      }
                    />
                  </li>
                  <li>
                    <strong>Date:</strong>&nbsp;
                    {data?.adminGetTransactionHistory?.data?.created_at
                      ? formatDateToDDMMYYYY(
                        data.adminGetTransactionHistory.data.created_at
                      )
                      : ""}
                  </li>
                  <li>
                    <strong>Account address:</strong>&nbsp;
                    {data?.adminGetTransactionHistory?.data?.account_number}
                  </li>
                  <li
                    className="w-full sm:w-2/5 font-bold text-md underlined hover:text-neon_pink cursor-pointer"
                    onClick={() => {
                      const paymentSlip = data?.adminGetTransactionHistory?.data?.payment_slip;
                      if (paymentSlip === null) {
                        errorMessage({ message: "There is no payment slip available", duration: 2000 });
                      } else {
                        window.open(
                          data?.adminGetTransactionHistory?.data?.payment_slip,
                          '_blank'
                        );
                      }
                    }}
                  >
                    <strong className="w-auto flex items-center justify-center gap-2 border border-neon_pink rounded p-2">
                      <CloseEyeIcon size={18} /> VIEW PAYMENT SLIP
                    </strong>
                  </li>

                </ul>
              </div>
            </div>
          )
        )}
      </MyModal>

      {/* confirm or reject modal */}
      <MyModal
        isOpen={isOpen}
        onClose={handleOpenModal}
        className="z-50 flex justify-center items-center w-11/12 sm:w-2/5 md:inset-0 h-auto"
      >
        <div className="rounded w-full">
          <div className="w-full flex items-center justify-center flex-col">
            {/* <WithdrawIcon size={36} className="mb-6 animate-bounce" /> */}
            <DepositIcon size={36} className="mb-6 animate-bounce" />
            <h4 className="text-gray-600 text-md font-semibold mb-2">
              Confirm {row?.identifier} !
            </h4>
            <p className="text-gray-500 text-sm mb-3">
              Shop has requested to withdraw{" "}
              <span className="font-medium">
                {row?.amount}&nbsp;{row?.coin_type}
              </span>
              . Do you want to proceed?
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
              icon={isLoading1 ? <Loading /> : ""}
              isFront={isLoading1 ? true : false}
              title={isLoading1 ? "CONFIRMING...." : "REJECT"}
              onClick={() => handleRejectTransaction()}
              className="w-auto rounded bg-neon_pink text-white p-2 text-xs"
            />
            <IconButton
              type="button"
              icon={isLoading ? <Loading /> : ""}
              isFront={isLoading ? true : false}
              title={isLoading ? "CONFIRMING...." : "CONFIRM"}
              onClick={() => handleApproveTransaction()}
              className="w-auto rounded bg-green-500 text-white p-2 text-xs"
            />
          </div>
        </div>
      </MyModal>
    </>
  );
}
