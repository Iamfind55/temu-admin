"use client";

import React from "react";
import Image from "next/image";
import { useParams } from "next/navigation";

// components and utils
import MyModal from "@/components/modal";
import StatusBadge from "@/components/status";
import Breadcrumb from "@/components/breadCrumb";

import { formatDateToDDMMYYYY } from "@/utils/dateFormat";

export default function TransactionDetails() {
  const params = useParams();
  const [isOpenImage, setIsOpenImage] = React.useState<boolean>(false);

  const handleOpenImageModal = () => {
    setIsOpenImage(!isOpenImage);
  };
  return (
    <>
      <Breadcrumb
        items={[
          { label: "Admin dashboard", value: "/admin" },
          { label: "Transaction", value: "/admin/transaction" },
          { label: "Transaction details", value: `/transaction/${params.id}` },
        ]}
      />
      <div className="flex items-start justify-start gap-2 flex-col bg-white rounded-md p-4 mt-4 text-sm text-gray-500">
        <div className="w-full rounded border p-2">
          <div className="w-3/4 flex items-start justify-between">
            <ul className="ml-2 mt-2 flex items-start justify-start gap-1 flex-col text-xs">
              <h1 className="text-sm font-bold">Customer or Shop details:</h1>
              <li>
                <strong>Profile:</strong>&nbsp; Profile
              </li>
              <li>
                <strong>Name:</strong>&nbsp; Peter
              </li>
              <li>
                <strong>Phone number:</strong>&nbsp; Peter
              </li>
              <li>
                <strong>Email:</strong>&nbsp; Peter
              </li>
              <li>
                <strong>Username:</strong>&nbsp; Peter
              </li>
              <li>
                <strong>Date of birth:</strong>&nbsp; Peter
              </li>
              <li>
                <strong>Status:</strong>&nbsp; Active
              </li>
              <li>
                <strong>Created at:</strong>&nbsp; Peter
              </li>
            </ul>
            <div className="mt-2 flex items-start justify-start gap-1 flex-col text-xs">
              <h1 className="text-sm font-bold">Payment method details:</h1>
              <ul className="border rounded p-2">
                <li>
                  <strong>Id:</strong>&nbsp;
                  8f7d9c1a-f81d-4d4e-b9c0-8fc960045953
                </li>
                <li>
                  <strong>Bank name:</strong>&nbsp; BCELONE
                </li>
                <li>
                  <strong>Bank account name:</strong>&nbsp; Peter
                </li>
                <li>
                  <strong>Bank account number:</strong>&nbsp; 1234567899876
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="flex items-start justify-between w-full rounded border p-2">
          <ul className="w-1/2 ml-2 mt-2 flex items-start justify-start gap-1 flex-col text-xs">
            <h1 className="text-sm font-bold">Transaction details:</h1>
            <li>
              <strong>ID:</strong>&nbsp; 8406dc36-3b46-47b6-b295-d749597e063f
            </li>
            <li>
              <strong>Identifier:</strong>&nbsp;
              <StatusBadge status="WITHDRAW" />
            </li>
            <li>
              <strong>Coin type:</strong>&nbsp; ERC20
            </li>
            <li>
              <strong>Status:</strong>&nbsp;
              <StatusBadge status="REJECTED" />
            </li>
            <li>
              <strong>Date:</strong>&nbsp;
              {formatDateToDDMMYYYY("2025-02-27T08:26:19.133Z")}
            </li>
          </ul>
          <div className="w-1/2 flex items-start justify-start flex-col gap-2">
            <strong>Payment slip:</strong>
            <div className="h-[30vh]">
              <Image
                className="rounded cursor-pointer w-full h-full border"
                src="https://res.cloudinary.com/dvh8zf1nm/image/upload/v1738860057/default-image_uwedsh.webp"
                alt="default"
                width={200}
                height={200}
                onClick={() => handleOpenImageModal()}
              />
            </div>
          </div>
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
    </>
  );
}
