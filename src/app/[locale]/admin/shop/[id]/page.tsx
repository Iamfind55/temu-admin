"use client";

import React from "react";
import Image from "next/image";
import { useParams } from "next/navigation";

// graphql
import { GET_SHOP, UPDATE_SHOP } from "@/api/shop";
import { useLazyQuery, useMutation } from "@apollo/client";

// components
import Textfield from "@/components/textField";
import Breadcrumb from "@/components/breadCrumb";
import WalletCard from "@/components/walletCard";
import Password from "@/components/passwordTextField";

// utils and icons
import { useToast } from "@/utils/toast";
import {
  DepositIcon,
  LockIcon,
  PlusIcon,
  WalletIcon,
  WithdrawIcon,
} from "@/icons/page";
import { EShopStatus, IShopType } from "@/types/shop";
import { GET_SHOP_WALLET_BY_ADMIN } from "@/api/wallet";

interface CloudinaryResponse {
  secure_url?: string;
}

export default function ShopDetails() {
  const params = useParams();
  const { errorMessage, successMessage } = useToast();
  const id = Array.isArray(params?.id) ? params?.id[0] : params?.id;

  const [file, setFile] = React.useState<File | null>(null);
  const [cover, setCover] = React.useState<File | null>(null);
  const [cardFront, setCardFront] = React.useState<File | null>(null);
  const [cardBack, setCardBack] = React.useState<File | null>(null);
  const [cardPeople, setCardPeople] = React.useState<File | null>(null);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [preview, setPreview] = React.useState<string | null>(null);
  const [preview1, setPreview1] = React.useState<string | null>(null);
  const [previewCardFront, setPreviewCardFront] = React.useState<string | null>(
    null
  );
  const [previewCardBack, setPreviewCardBack] = React.useState<string | null>(
    null
  );
  const [previewCardPeople, setPreviewCardPeople] = React.useState<
    string | null
  >(null);
  const [errorMessages, setErrorMessages] = React.useState<string | null>(null);

  const [getShop, { data }] = useLazyQuery(GET_SHOP, {
    fetchPolicy: "cache-and-network",
  });

  const [adminGetShopWallet, { data: shopWallet }] = useLazyQuery(
    GET_SHOP_WALLET_BY_ADMIN,
    {
      fetchPolicy: "cache-and-network",
    }
  );

  const [shopData, setShopData] = React.useState<IShopType>({
    id: "",
    fullname: "",
    username: "",
    password: "",
    email: "",
    phone_number: "",
    dob: "",
    remark: "",
    shop_address: "",
    image: {
      logo: "",
      cover: "",
    },
    id_card_info: {
      id_card_number: "",
      id_card_image_front: "",
      id_card_image_back: "",
      id_card_image: "",
    },
    store_name: "",
    payment_method: [],
    status: EShopStatus.ACTIVE,
  });

  const [updateShopInfo] = useMutation(UPDATE_SHOP);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    const maxSizeInBytes = 800 * 1024; // 800KB in bytes

    if (selectedFile) {
      if (selectedFile.size > maxSizeInBytes) {
        setErrorMessages("File size exceeds 800KB.");
        setFile(null);
        setPreview(null);
        return;
      }

      setErrorMessages(null);
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile)); // Generate preview URL
    }
  };

  const handleChangeCover = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile1 = e.target.files?.[0];
    if (selectedFile1) {
      setErrorMessages(null);
      setCover(selectedFile1);
      setPreview1(URL.createObjectURL(selectedFile1)); // Generate preview URL
    }
  };

  const handleChangeCardFront = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile2 = e.target.files?.[0];
    if (selectedFile2) {
      setErrorMessages(null);
      setCardFront(selectedFile2);
      setPreviewCardFront(URL.createObjectURL(selectedFile2)); // Generate preview URL
    }
  };

  const handleChangeCardPeople = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile4 = e.target.files?.[0];
    if (selectedFile4) {
      setErrorMessages(null);
      setCardPeople(selectedFile4);
      setPreviewCardPeople(URL.createObjectURL(selectedFile4)); // Generate preview URL
    }
  };

  const handleChangeCardBack = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile3 = e.target.files?.[0];
    if (selectedFile3) {
      setErrorMessages(null);
      setCardBack(selectedFile3);
      setPreviewCardBack(URL.createObjectURL(selectedFile3)); // Generate preview URL
    }
  };

  const handleSubmitForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      let shopLogo: CloudinaryResponse = {};
      let shopCover: CloudinaryResponse = {};
      let shopCardFront: CloudinaryResponse = {};
      let shopCardBack: CloudinaryResponse = {};
      let shopCardPeople: CloudinaryResponse = {};

      if (file) {
        const _formData = new FormData();
        _formData.append("file", file);
        _formData.append(
          "upload_preset",
          process.env.NEXT_PUBLIC_UPLOAD_PRESET || ""
        );

        const response = await fetch(
          process.env.NEXT_PUBLIC_CLOUDINARY_URL || "",
          {
            method: "POST",
            body: _formData,
          }
        );
        shopLogo = (await response.json()) as CloudinaryResponse; // Type assertion
      }

      if (cover) {
        const _formData = new FormData();
        _formData.append("file", cover);
        _formData.append(
          "upload_preset",
          process.env.NEXT_PUBLIC_UPLOAD_PRESET || ""
        );

        const response = await fetch(
          process.env.NEXT_PUBLIC_CLOUDINARY_URL || "",
          {
            method: "POST",
            body: _formData,
          }
        );
        shopCover = (await response.json()) as CloudinaryResponse; // Type assertion
      }

      if (cardFront) {
        const _formData = new FormData();
        _formData.append("file", cardFront);
        _formData.append(
          "upload_preset",
          process.env.NEXT_PUBLIC_UPLOAD_PRESET || ""
        );

        const response = await fetch(
          process.env.NEXT_PUBLIC_CLOUDINARY_URL || "",
          {
            method: "POST",
            body: _formData,
          }
        );
        shopCardFront = (await response.json()) as CloudinaryResponse; // Type assertion
      }

      if (cardBack) {
        const _formData = new FormData();
        _formData.append("file", cardBack);
        _formData.append(
          "upload_preset",
          process.env.NEXT_PUBLIC_UPLOAD_PRESET || ""
        );

        const response = await fetch(
          process.env.NEXT_PUBLIC_CLOUDINARY_URL || "",
          {
            method: "POST",
            body: _formData,
          }
        );
        shopCardBack = (await response.json()) as CloudinaryResponse; // Type assertion
      }

      if (cardPeople) {
        const _formData = new FormData();
        _formData.append("file", cardPeople);
        _formData.append(
          "upload_preset",
          process.env.NEXT_PUBLIC_UPLOAD_PRESET || ""
        );

        const response = await fetch(
          process.env.NEXT_PUBLIC_CLOUDINARY_URL || "",
          {
            method: "POST",
            body: _formData,
          }
        );
        shopCardPeople = (await response.json()) as CloudinaryResponse; // Type assertion
      }

      const { data } = await updateShopInfo({
        variables: {
          data: {
            fullname: shopData.fullname,
            username: shopData.username,
            store_name: shopData.store_name,
            ...(shopData.password && { password: shopData.password }),
            email: shopData.email,
            phone_number: shopData.phone_number,
            remark: shopData.remark,
            shop_address: shopData.shop_address,
            image: {
              cover: shopCover.secure_url || shopData.image?.cover,
              logo: shopLogo.secure_url || shopData.image?.logo,
            },
            id_card_info: {
              id_card_image_front:
                shopCardFront.secure_url ||
                shopData.id_card_info?.id_card_image_front,
              id_card_image_back:
                shopCardBack.secure_url ||
                shopData.id_card_info?.id_card_image_back,
              id_card_image:
                shopCardPeople.secure_url ||
                shopData.id_card_info?.id_card_image,
            },
          },
        },
      });

      if (data.updateShopInformation.success) {
        successMessage({
          message: "Update shop profile successful!",
          duration: 3000,
        });
      } else {
        errorMessage({
          message: data.updateShopInformation.error.details,
          duration: 3000,
        });
      }
    } catch (error) {
      errorMessage({
        message: "Unexpected happen! Please wait.",
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
      setFile(null);
      setCover(null);
    }
  };

  React.useEffect(() => {
    getShop({
      variables: {
        adminGetShopId: id,
      },
    });
  }, [getShop]);

  React.useEffect(() => {
    adminGetShopWallet({
      variables: {
        adminGetWalletId: id,
      },
    });
  }, [adminGetShopWallet]);

  React.useEffect(() => {
    if (data?.adminGetShop?.data) {
      setShopData({
        id: data?.adminGetShop?.data.id || null,
        fullname: data?.adminGetShop?.data.fullname || null,
        username: data?.adminGetShop?.data.username || null,
        password: data?.adminGetShop?.data.password || null,
        email: data?.adminGetShop?.data.email || null,
        phone_number: data?.adminGetShop?.data.phone_number || null,
        dob: data?.adminGetShop?.data.dob || null,
        remark: data?.adminGetShop?.data.remark || null,
        shop_address: data?.adminGetShop?.data.shop_address || null,
        image: data?.adminGetShop?.data.image || {
          logo: null,
          cover: null,
        },
        id_card_info: data?.adminGetShop?.data.id_card_info || {
          id_card_image_back: null,
          id_card_image_front: null,
          id_card_number: null,
          id_card_image: null,
        },
        payment_method: data?.adminGetShop?.data.payment_method || [],
        status: data?.adminGetShop?.data.status || null,
        store_name: data?.adminGetShop?.data.store_name || null,
        shop_vip: data?.adminGetShop?.data.shop_vip || null,
        created_at: data?.adminGetShop?.data.created_at || null,
      });
    }
  }, [data?.adminGetShop?.data]);

  const reportItems = React.useMemo(() => {
    const total_balance = shopWallet?.adminGetWallet?.data?.total_balance || 0;
    const frozen_balance =
      shopWallet?.adminGetWallet?.data?.total_frozen_balance || 0;
    const withdraw_balance =
      shopWallet?.adminGetWallet?.data?.total_withdraw || 0;
    const withdrawable_balance =
      shopWallet?.adminGetWallet?.data?.total_withdraw_able_balance || 0;
    const total_recharged =
      shopWallet?.adminGetWallet?.data?.total_recharged || 0;

    return [
      {
        title: "Wallet Balance",
        amount: `${total_balance}`,
        percent: 3,
        icon: <WalletIcon size={20} className="text-neon_blue" />,
      },
      {
        title: "Recharged",
        amount: `${total_recharged}`,
        percent: 12,
        icon: <DepositIcon size={20} className="text-green-500" />,
      },
      {
        title: "Withdraw",
        amount: `${withdraw_balance}`,
        percent: 12,
        icon: <WithdrawIcon size={20} className="text-neon_pink" />,
      },
      {
        title: "Pending Balance",
        amount: `${frozen_balance}`,
        percent: 12,
        icon: <LockIcon size={20} className="text-neon_pink" />,
      },
      {
        title: "Withdrawal Balance",
        amount: `${withdrawable_balance}`,
        percent: 12,
        icon: <WithdrawIcon size={20} className="text-green-500" />,
      },
    ];
  }, [data]);

  return (
    <>
      <div className="flex items-start justify-start flex-col gap-4 text-gray-500">
        <Breadcrumb
          items={[
            { label: "Admin dashboard", value: "/admin" },
            { label: "Shop management", value: "/admin/shop" },
            { label: "Shop details", value: "/shop/dfgsdfgsdfgds" },
          ]}
        />
        <div className="w-full grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-5">
          {reportItems.map((item, index) => (
            <WalletCard
              key={index + 1}
              title={item.title}
              amount={item.amount}
              icon={item.icon}
            />
          ))}
        </div>
        <div className="bg-white w-full flex items-start justify-center gap-2 sm:flex-row flex-col">
          <form
            className="w-full py-2 flex items-start justify-start flex-col gap-2"
            onSubmit={handleSubmitForm}
          >
            <div className="w-full flex items-start justify-start flex-col gap-6">
              <div className="w-full flex items-start justify-start gap-4">
                <div className="w-2/4 flex items-start justify-start gap-6 p-2 rounded bg-white">
                  <div className="w-1/4 flex items-start justify-center flex-col gap-2">
                    <p className="text-sm">Store logo:</p>
                    {preview ? (
                      <Image
                        src={preview}
                        width={100}
                        height={100}
                        alt="Image preview"
                        className="max-w-full h-auto border rounded"
                      />
                    ) : shopData?.image?.logo ? (
                      <Image
                        src={shopData?.image?.logo}
                        width={100}
                        height={100}
                        alt="Image preview"
                        className="max-w-full h-auto border rounded"
                      />
                    ) : (
                      <Image
                        src="https://res.cloudinary.com/dvh8zf1nm/image/upload/v1738860057/default-image_uwedsh.webp"
                        width={100}
                        height={100}
                        alt="Image preview"
                        className="max-w-full h-auto border rounded"
                      />
                    )}
                    <div className="flex items-center justify-center flex-col gap-2">
                      <input
                        type="file"
                        accept=".jpg,.jpeg,.png"
                        id="file-upload"
                        onChange={handleFileChange}
                        className="block w-full hidden"
                      />
                      {errorMessages && (
                        <p className="text-red-500 text-xs">{errorMessages}</p>
                      )}
                      <div className="flex items-start justify-start gap-4">
                        <label
                          htmlFor="file-upload"
                          className="text-xs text-white border px-2 py-1 rounded flex items-center justify-center cursor-pointer bg-neon_pink"
                        >
                          <PlusIcon />
                          Select New
                        </label>
                      </div>
                    </div>
                  </div>
                  <div className="w-3/4 flex items-start justify-center flex-col gap-2">
                    <div className="flex items-center justify-start gap-6">
                      <label className="block text-gray-500 text-sm">
                        Shop cover image
                      </label>
                      <input
                        type="file"
                        accept=".jpg,.jpeg,.png"
                        id="cover-upload"
                        onChange={handleChangeCover}
                        className="block w-full hidden"
                      />
                      <label
                        htmlFor="cover-upload"
                        className="text-xs text-gray-500 hover:text-neon_pink rounded flex items-center justify-center cursor-pointer border border-dotted border-gray-200 px-2 py-0.5"
                      >
                        <PlusIcon />
                        New
                      </label>
                    </div>
                    {shopData?.image?.cover ? (
                      <div className="w-full">
                        {preview1 ? (
                          <Image
                            src={preview1}
                            width={600}
                            height={400}
                            alt="Image preview"
                            className="w-full h-32 object-cover border rounded"
                          />
                        ) : shopData?.image?.cover ? (
                          <Image
                            src={shopData?.image?.cover}
                            width={600}
                            height={400}
                            alt="Image preview"
                            className="w-full h-32 object-cover border rounded"
                          />
                        ) : (
                          <Image
                            src="https://res.cloudinary.com/dvh8zf1nm/image/upload/v1738860057/default-image_uwedsh.webp"
                            width={600}
                            height={400}
                            alt="Image preview"
                            className="w-full h-32 object-cover border rounded"
                          />
                        )}
                      </div>
                    ) : (
                      <div className="w-full flex items-center justify-center py-4 rounded-md flex-col gap-3  border border-dotted border-gray-500">
                        <input
                          type="file"
                          accept=".jpg,.jpeg,.png"
                          id="cover-upload"
                          onChange={handleChangeCover}
                          className="block w-full hidden"
                        />
                        {errorMessages && (
                          <p className="text-red-500 text-xs">
                            {errorMessages}
                          </p>
                        )}
                        <div className="flex items-start justify-start gap-4 border rounded p-4 cursor-pointer">
                          <label
                            htmlFor="cover-upload"
                            className="text-sm rounded flex items-center justify-center cursor-pointer"
                          >
                            <PlusIcon className="text-gray-500" />
                          </label>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="w-2/4 bg-white rounded px-4 py-2">
                  <div className="w-full flex items-start justify-between flex-col gap-2">
                    <div className="w-full flex items-center justify-between">
                      <label className="block text-gray-500 text-sm">
                        Upload a photo of yourself holding your ID card:
                      </label>
                      <input
                        type="file"
                        accept=".jpg,.jpeg,.png"
                        id="card-people-upload"
                        onChange={handleChangeCardPeople}
                        className="block w-full hidden"
                      />

                      <label
                        htmlFor="card-people-upload"
                        className="text-xs text-gray-500 hover:text-neon_pink rounded flex items-center justify-center cursor-pointer border border-dotted border-gray-200 px-2 py-0.5"
                      >
                        <PlusIcon />
                        New
                      </label>
                    </div>
                    {shopData?.id_card_info?.id_card_image ||
                    previewCardPeople ? (
                      <div className="w-full">
                        {previewCardPeople ? (
                          <Image
                            src={previewCardPeople}
                            width={600}
                            height={600}
                            alt="Image preview"
                            className="w-full h-32 object-cover border rounded"
                          />
                        ) : shopData?.id_card_info?.id_card_image ? (
                          <Image
                            src={shopData?.id_card_info?.id_card_image}
                            width={600}
                            height={600}
                            alt="Image preview"
                            className="w-full h-32 object-cover border rounded"
                          />
                        ) : (
                          <Image
                            src="https://res.cloudinary.com/dvh8zf1nm/image/upload/v1738860057/default-image_uwedsh.webp"
                            width={600}
                            height={600}
                            alt="Image preview"
                            className="w-full h-32 object-cover border rounded"
                          />
                        )}
                      </div>
                    ) : (
                      <div className="w-full flex items-center justify-center py-4 rounded-md flex-col gap-3  border border-dotted border-gray-500">
                        <input
                          type="file"
                          accept=".jpg,.jpeg,.png"
                          id="card-people-upload"
                          onChange={handleChangeCardPeople}
                          className="block w-full hidden"
                        />
                        {errorMessages && (
                          <p className="text-red-500 text-xs">
                            {errorMessages}
                          </p>
                        )}
                        <div className="flex items-start justify-start gap-4 border rounded p-4 cursor-pointer">
                          <label
                            htmlFor="card-people-upload"
                            className="text-sm rounded flex items-center justify-center cursor-pointer"
                          >
                            <PlusIcon className="text-gray-500" />
                          </label>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="w-full flex items-start jusitfy-start gap-4">
                <div className="w-2/4 bg-white p-4 rounded-md">
                  <div className="w-full grid grid-cols-1 gap-2 lg:grid-cols-2">
                    <Textfield
                      placeholder="Enter store name...."
                      title="Store name"
                      name="fullname"
                      id="fullname"
                      type="text"
                      required
                      //   className="py-1"
                      value={shopData.store_name || ""}
                      onChange={(e) =>
                        setShopData({
                          ...shopData,
                          store_name: e.target.value,
                        })
                      }
                    />
                    <Textfield
                      placeholder="Enter owner shop full name...."
                      title="Full name"
                      name="fullname"
                      id="fullname"
                      type="text"
                      required
                      value={shopData.fullname || ""}
                      onChange={(e) =>
                        setShopData({
                          ...shopData,
                          fullname: e.target.value,
                        })
                      }
                    />
                    <Textfield
                      placeholder="Username"
                      title="Username"
                      name="username"
                      id="username"
                      type="text"
                      required
                      value={shopData.username || ""}
                      onChange={(e) =>
                        setShopData({
                          ...shopData,
                          username: e.target.value,
                        })
                      }
                    />
                    <Textfield
                      placeholder="Enter phone number"
                      title="Phone number"
                      name="phone_number"
                      id="phone_number"
                      type="text"
                      required
                      value={shopData.phone_number || ""}
                      onChange={(e) =>
                        setShopData({
                          ...shopData,
                          phone_number: e.target.value,
                        })
                      }
                    />
                    <Textfield
                      placeholder="Enter email address...."
                      title="Email"
                      name="email"
                      id="email"
                      type="text"
                      required
                      value={shopData.email || ""}
                      onChange={(e) =>
                        setShopData({
                          ...shopData,
                          email: e.target.value,
                        })
                      }
                    />
                    <Password
                      title="Password"
                      name="password"
                      id="password"
                      required
                      value={shopData.password || "************"}
                      onChange={(e) =>
                        setShopData({
                          ...shopData,
                          password: e.target.value,
                        })
                      }
                    />
                  </div>
                  <Textfield
                    title="VIP status"
                    name="status"
                    id="status"
                    type="text"
                    value={"VIP " + shopData.shop_vip || ""}
                    readOnly
                  />
                  <Textfield
                    placeholder="Enter shop address"
                    title="Address"
                    name="shop_address"
                    id="shop_address"
                    type="text"
                    multiline
                    rows={2}
                    required
                    value={shopData.shop_address || ""}
                    onChange={(e) =>
                      setShopData({
                        ...shopData,
                        shop_address: e.target.value,
                      })
                    }
                  />
                  <Textfield
                    placeholder="Enter shop's remarks...."
                    title="Remark"
                    name="remark"
                    id="remark"
                    type="text"
                    multiline
                    rows={2}
                    value={shopData.remark || ""}
                    onChange={(e) =>
                      setShopData({
                        ...shopData,
                        remark: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="w-2/4 flex items-start justify-start flex-col gap-6 bg-white rounded p-2">
                  <div className="w-full flex items-start justify-center flex-col gap-4">
                    <div className="w-full flex items-center justify-between gap-2">
                      <label className="block text-gray-500 text-sm">
                        Front of Identify card:
                      </label>
                      <input
                        type="file"
                        accept=".jpg,.jpeg,.png"
                        id="card-front-upload"
                        onChange={handleChangeCardFront}
                        className="block w-full hidden"
                      />

                      <label
                        htmlFor="card-front-upload"
                        className="text-xs text-gray-500 hover:text-neon_pink rounded flex items-center justify-center cursor-pointer border border-dotted border-gray-200 px-2 py-0.5"
                      >
                        <PlusIcon />
                        New
                      </label>
                    </div>
                    {shopData?.id_card_info?.id_card_image_front ||
                    previewCardFront ? (
                      <div className="w-full">
                        {previewCardFront ? (
                          <Image
                            src={previewCardFront}
                            width={600}
                            height={400}
                            alt="Image preview"
                            className="w-full h-32 object-cover border rounded"
                          />
                        ) : shopData?.id_card_info?.id_card_image_front ? (
                          <Image
                            src={shopData?.id_card_info?.id_card_image_front}
                            width={600}
                            height={400}
                            alt="Image preview"
                            className="w-full h-32 object-cover border rounded"
                          />
                        ) : (
                          <Image
                            src="https://res.cloudinary.com/dvh8zf1nm/image/upload/v1738860057/default-image_uwedsh.webp"
                            width={600}
                            height={400}
                            alt="Image preview"
                            className="w-full h-32 object-cover border rounded"
                          />
                        )}
                      </div>
                    ) : (
                      <div className="w-full flex items-center justify-center py-4 rounded-md flex-col gap-3  border border-dotted border-gray-500">
                        <input
                          type="file"
                          accept=".jpg,.jpeg,.png"
                          id="card-front-upload"
                          onChange={handleChangeCardFront}
                          className="block w-full hidden"
                        />
                        {errorMessages && (
                          <p className="text-red-500 text-xs">
                            {errorMessages}
                          </p>
                        )}
                        <div className="flex items-start justify-start gap-4 border rounded p-4 cursor-pointer">
                          <label
                            htmlFor="card-front-upload"
                            className="text-sm rounded flex items-center justify-center cursor-pointer"
                          >
                            <PlusIcon className="text-gray-500" />
                          </label>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="w-full flex items-start justify-center flex-col gap-2">
                    <div className="w-full flex items-center justify-between gap-2">
                      <label className="block text-gray-500 text-sm">
                        Back of Identify card:
                      </label>
                      <input
                        type="file"
                        accept=".jpg,.jpeg,.png"
                        id="card-back-upload"
                        onChange={handleChangeCardBack}
                        className="block w-full hidden"
                      />

                      <label
                        htmlFor="card-back-upload"
                        className="text-xs text-gray-500 hover:text-neon_pink rounded flex items-center justify-center cursor-pointer border border-dotted border-gray-200 px-2 py-0.5"
                      >
                        <PlusIcon />
                        New
                      </label>
                    </div>
                    {shopData?.id_card_info?.id_card_image_back ||
                    previewCardBack ? (
                      <div className="w-full">
                        {previewCardBack ? (
                          <Image
                            src={previewCardBack}
                            width={600}
                            height={400}
                            alt="Image preview"
                            className="w-full h-32 object-cover border rounded"
                          />
                        ) : shopData?.id_card_info?.id_card_image_back ? (
                          <Image
                            src={shopData?.id_card_info?.id_card_image_back}
                            width={600}
                            height={400}
                            alt="Image preview"
                            className="w-full h-32 object-cover border rounded"
                          />
                        ) : (
                          <Image
                            src="https://res.cloudinary.com/dvh8zf1nm/image/upload/v1738860057/default-image_uwedsh.webp"
                            width={600}
                            height={400}
                            alt="Image preview"
                            className="w-full h-32 object-cover border rounded"
                          />
                        )}
                      </div>
                    ) : (
                      <div className="w-full flex items-center justify-center py-4 rounded-md flex-col gap-3  border border-dotted border-gray-500">
                        <input
                          type="file"
                          accept=".jpg,.jpeg,.png"
                          id="card-back-upload"
                          onChange={handleChangeCardBack}
                          className="block w-full hidden"
                        />
                        {errorMessages && (
                          <p className="text-red-500 text-xs">
                            {errorMessages}
                          </p>
                        )}
                        <div className="flex items-start justify-start gap-4 border rounded p-4 cursor-pointer">
                          <label
                            htmlFor="card-back-upload"
                            className="text-sm rounded flex items-center justify-center cursor-pointer"
                          >
                            <PlusIcon className="text-gray-500" />
                          </label>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* <div className="w-full flex items-start justify-start flex-col gap-2 p-2 rounded border text-sm">
                    <p className="text-md font-bold">
                      List of shop payment methods:
                    </p>
                    {shopData?.payment_method?.map((val, index) => (
                      <ul key={index + 1} className="text-xs">
                        <li>
                          <strong>ID:</strong>&nbsp;{val.id}
                        </li>
                        <li>
                          <strong>Bank name:</strong>&nbsp;{val.bank_name}
                        </li>
                        <li>
                          <strong>Bank account:</strong>&nbsp;
                          {val.bank_account_name}
                        </li>
                        <li>
                          <strong>Bank number:</strong>&nbsp;
                          {val.bank_account_number}
                        </li>
                      </ul>
                    ))}
                  </div> */}
                </div>
              </div>
            </div>

            {/* <div className="w-full flex items-center justify-end gap-4 p-4">
              <IconButton
                className="rounded text-gray-500 p-2 border bg-white text-sm uppercase"
                title="Back"
                icon={<BackIcon size={18} className="text-pink" />}
                isFront={true}
                type="button"
              />
              {shopData.status === "INACTIVE" && (
                <IconButton
                  className="rounded text-white p-2 border bg-green-500 text-sm uppercase"
                  title="Approve"
                  icon={<CheckCircleIcon size={18} className="text-pink" />}
                  isFront={true}
                  type="button"
                />
              )}

              <IconButton
                className={`rounded p-2 text-xs bg-neon_pink text-white text-sm uppercase`}
                title={isLoading ? "Saving...." : "Save change"}
                icon={isLoading ? <Loading /> : ""}
                isFront={true}
                type="submit"
              />
            </div> */}
          </form>
        </div>
      </div>
    </>
  );
}
