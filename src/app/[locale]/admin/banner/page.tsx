"use client";

import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { useMutation } from "@apollo/client";

// icons
import { AddIcon, EditIcon, TrashIcon } from "@/icons/page";

// components
import IconButton from "@/components/iconButton";
import Pagination from "@/components/pagination";
import Breadcrumb from "@/components/breadCrumb";
import DeleteModal from "@/components/deleteModal";

// utils, hooks
import { useToast } from "@/utils/toast";
import { replaceSize } from "@/utils/resizeImage";
import { formatDateToDDMMYYYY } from "@/utils/dateFormat";
import { useBannerFilters } from "./hook/useBannerFilters";

// APIs
import { DELETE_BANNER } from "@/api/banner";
import { IBannerTypes } from "@/types/banner";
import StatusBadge from "@/components/status";

export default function BannerPageList() {
  const g = useTranslations("globals");
  const router = useRouter();
  const { successMessage } = useToast();
  const [deleteBanner] = useMutation(DELETE_BANNER);

  const [searchInput, setSearchInput] = useState("");
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedBanner, setSelectedBanner] = useState<IBannerTypes>();
  const [banners, setBanners] = useState<IBannerTypes[]>();

  const {
    filters,
    updateName,
    updatedAtRange,
    updateSortBy,
    data,
    error,
    updatePage,
  } = useBannerFilters();

  useEffect(() => {
    if (data?.getBanners?.data) setBanners(data?.getBanners?.data);
  }, [data?.getBanners?.data]);

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
          deleteBannerId: selectedBanner?.id,
        },
      });

      successMessage({
        message: "Delete banner successful!.",
        duration: 3000,
      });
      setIsOpen(false);

      const updateBanner = banners?.filter(
        ({ id }) => id !== selectedBanner?.id
      );
      setBanners(updateBanner);
    } catch (error) {
      console.error({ error });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectBanner = (banner: IBannerTypes) => {
    setSelectedBanner(banner);
    setIsOpen(true);
  };

  const handleClickEditBanner = (banner: IBannerTypes) => {
    router.push("/admin/banner/" + banner?.id);
  };

  if (error) return <p>Error: {error.message}</p>;
  const totalItems: number = data?.getBanners?.total;

  return (
    <div className="space-y-2 flex items-start justify-start flex-col gap-4">
      <div className="w-full flex justify-between items-center">
        <Breadcrumb
          items={[
            { label: "Admin dashboard", value: "/admin" },
            { label: "Banner management", value: "/admin/banner" },
          ]}
        />
        <div>
          <IconButton
            className="rounded text-white p-2 bg-neon_pink text-sm"
            icon={<AddIcon size={18} />}
            isFront={true}
            title={"Add New"}
            onClick={() => {
              return router.push("/admin/banner/add");
            }}
          />
        </div>
      </div>

      {/* Filter Controls */}
      <div className="w-full space-x-4 my-6 flex text-gray-600 justify-between">
        <div className="flex space-x-4">
          <div>
            <p className="text-sm">Name</p>
            <input
              type="text"
              value={searchInput}
              placeholder="Search by name"
              onChange={handleSearchInput}
              onKeyDown={handleKeyPress}
              className="h-9 text-sm p-2 rounded w-full border border focus:border-b_text  focus:bg-white focus:ring-1 focus:ring-base text-gray-500 outline-none text-dark py-1 px-3 leading-8 transition-colors duration-200 ease-in-out font-rubik"
            />
          </div>
          <div className="flex gap-4">
            <div>
              <p className="mx-2 text-sm">Start date</p>
              <input
                type="date"
                onChange={(e) =>
                  updatedAtRange(
                    e.target.value,
                    filters.dateRange?.endDate || ""
                  )
                }
                className="h-9 text-sm p-2 rounded w-full border border focus:border-b_text  focus:bg-white focus:ring-1 focus:ring-base text-gray-500 outline-none text-dark py-1 px-3 leading-8 transition-colors duration-200 ease-in-out font-rubik"
              />
            </div>
            <div>
              <p className="mx-2 text-sm">End date</p>
              <input
                type="date"
                onChange={(e) =>
                  updatedAtRange(
                    filters.dateRange?.startDate || "",
                    e.target.value
                  )
                }
                className="h-9 text-sm p-2 rounded w-full border border focus:border-b_text  focus:bg-white focus:ring-1 focus:ring-base text-gray-500 outline-none text-dark py-1 px-3 leading-8 transition-colors duration-200 ease-in-out font-rubik"
              />
            </div>
          </div>
        </div>
        <div>
          <p className="text-sm">Sort</p>
          <select
            onChange={(e) => updateSortBy(e.target.value)}
            className="h-9 text-sm p-2 rounded w-full border border focus:border-b_text  focus:bg-white focus:ring-1 focus:ring-base text-gray-500 outline-none text-dark py-1 px-3 leading-8 transition-colors duration-200 ease-in-out font-rubik text-sm"
          >
            <option value="created_at_DESC">Created At (Newest)</option>
            <option value="created_at_ASC">Created At (Oldest)</option>
          </select>
        </div>
      </div>

      <div className="w-full bg-white w-auto h-auto rounded-md">
        <div className="w-full h-full overflow-y-auto">
          <table className="w-full text-sm text-left rtl:text-right text-gray-500 border">
            <thead className="text-xs text-gray-600 uppercase bg-gray-200">
              <tr>
                <th scope="col" className="px-6 py-3">
                  {g("_table_no")}
                </th>
                <th scope="col" className="px-6 py-3">
                  {g("_picture")}
                </th>
                <th scope="col" className="px-6 py-3">
                  {g("_name")}
                </th>
                <th scope="col" className="px-6 py-3">
                  Link
                </th>
                <th scope="col" className="px-6 py-3">
                  Position
                </th>
                <th scope="col" className="px-6 py-3">
                  Status
                </th>
                <th scope="col" className="px-6 py-3">
                  {g("_created_at")}
                </th>
                <th scope="col" className="px-6 py-3">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {banners?.map((banner, index) => {
                return (
                  <tr className="bg-white border-b" key={banner?.id}>
                    <th scope="row" className="px-6 py-4">
                      {(filters.page - 1) * filters.limit + index + 1}
                    </th>
                    <td className="px-6 py-4">
                      <img
                        // src={banner?.image}
                        src={`${replaceSize(50, 50, banner?.image)}`}
                        width={60}
                        height={60}
                        alt="Picture of the banner"
                      />
                    </td>
                    <td className="px-6 py-4 truncate max-w-xs">
                      {banner?.name}
                    </td>
                    <td className="px-6 py-4 truncate max-w-xs">
                      {banner?.link_url}
                    </td>
                    <td className="px-6 py-4 truncate max-w-xs text-center">
                      {banner?.position}
                    </td>
                    <td className="px-6 py-4 truncate max-w-xs">
                      {<StatusBadge status={banner.status} />}
                    </td>
                    <td className="px-6 py-4">
                      {formatDateToDDMMYYYY(banner?.created_at)}
                    </td>
                    <td className="flex space-x-2 px-6 py-4">
                      <EditIcon
                        onClick={() => handleClickEditBanner(banner)}
                        size={20}
                        className="cursor-pointer"
                      />
                      <TrashIcon
                        onClick={() => handleSelectBanner(banner)}
                        size={20}
                        className="cursor-pointer"
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="text-gray-600 flex items-end justify-end">
          <Pagination
            filter={{ page: filters.page, limit: filters.limit }}
            totalItems={totalItems}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
      <DeleteModal
        isOpen={isOpen}
        isLoading={isLoading}
        onClose={() => setIsOpen(false)}
        onConfirm={() => handleDelete()}
      />
    </div>
  );
}
