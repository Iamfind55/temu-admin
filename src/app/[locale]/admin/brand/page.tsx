"use client";

import { useRouter } from "@/i18n/navigation";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useMutation } from "@apollo/client";

// Components
import IconButton from "@/components/iconButton";
import Pagination from "@/components/pagination";
import DeleteModal from "@/components/deleteModal";

// Icons and utils
import { useToast } from "@/utils/toast";
import { DELETE_BRANDING } from "@/api/brand";
import { IBrandingTypes } from "@/types/brand";
import { replaceSize } from "@/utils/resizeImage";
import { useBrandFilters } from "./hook/useBrandFilters";
import { formatDateToDDMMYYYY } from "@/utils/dateFormat";
import { AddIcon, EditIcon, TrashIcon } from "@/icons/page";
import Breadcrumb from "@/components/breadCrumb";
import StatusBadge from "@/components/status";

export default function BrandPageList() {
  const g = useTranslations("globals");
  const router = useRouter();
  const { successMessage } = useToast();
  const [deleteBranding] = useMutation(DELETE_BRANDING);

  const [searchInput, setSearchInput] = useState("");
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedBranding, setSelectedBranding] = useState<IBrandingTypes>();
  const [brandings, setBrandings] = useState<IBrandingTypes[]>();

  const {
    filters,
    updateKeyword,
    updatedAtRange,
    updateSortBy,
    data,
    error,
    updatePage,
  } = useBrandFilters();

  useEffect(() => {
    if (data?.getBrandings?.data) setBrandings(data?.getBrandings?.data);
  }, [data?.getBrandings?.data]);

  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
    updateKeyword(e.target.value); // Triggers debounce logic
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      updateKeyword(searchInput); // Immediately trigger search on "Enter"
    }
  };

  const handlePageChange = (page: number) => {
    updatePage(page); // Update filter state with new page
  };

  const handleDelete = async () => {
    try {
      setIsLoading(true);

      await deleteBranding({
        variables: {
          deleteBrandingId: selectedBranding?.id,
        },
      });

      successMessage({
        message: "Delete branding successful!.",
        duration: 3000,
      });
      setIsOpen(false);

      const updateBranding = brandings?.filter(
        ({ id }) => id !== selectedBranding?.id
      );
      setBrandings(updateBranding);
    } catch (error) {
      console.error({ error });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectBranding = (branding: IBrandingTypes) => {
    setSelectedBranding(branding);
    setIsOpen(true);
  };

  const handleClickEditBranding = (branding: IBrandingTypes) => {
    router.push("/admin/brand/" + branding?.id);
  };

  if (error) return <p>Error: {error.message}</p>;
  const totalItems: number = data?.getBrandings?.total;

  return (
    <div className="space-y-2 flex items-start justify-start flex-col gap-4">
      <div className="flex justify-between items-center w-full">
        <Breadcrumb
          items={[
            { label: "Admin dashboard", value: "/admin" },
            { label: "Brand management", value: "/admin/brand" },
          ]}
        />
        <div>
          <IconButton
            className="rounded text-white p-2 bg-neon_pink text-sm"
            icon={<AddIcon size={18} />}
            isFront={true}
            title={"Add New"}
            onClick={() => {
              return router.push("/admin/brand/add");
            }}
          />
        </div>
      </div>

      {/* Filter Controls */}
      <div className="w-full space-x-4 flex text-gray-600 justify-between">
        <div className="flex space-x-4">
          <div>
            <p className="text-sm text-gray-500">Name</p>
            <input
              type="text"
              value={searchInput}
              placeholder="Search by keyword"
              onChange={handleSearchInput}
              onKeyDown={handleKeyPress}
              className="h-9 text-sm p-2 rounded w-full border border focus:border-b_text  focus:bg-white focus:ring-1 focus:ring-base text-gray-500 outline-none text-dark py-1 px-3 leading-8 transition-colors duration-200 ease-in-out font-rubik"
            />
          </div>
          <div className="flex gap-4">
            <div>
              <p className="mx-2 text-gray-500 text-sm">Start date</p>
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
              <p className="mx-2 text-gray-500 text-sm">End date</p>
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
          <p className="text-sm text-gray-500">Sort</p>
          <select
            onChange={(e) => updateSortBy(e.target.value)}
            className="h-9 text-sm p-2 rounded w-full border border focus:border-b_text  focus:bg-white focus:ring-1 focus:ring-base text-gray-500 outline-none text-dark py-1 px-3 leading-8 transition-colors duration-200 ease-in-out font-rubik"
          >
            <option value="created_at_DESC">Created At (Newest)</option>
            <option value="created_at_ASC">Created At (Oldest)</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="w-full bg-white w-auto h-auto rounded-md">
        <div className="w-full h-full overflow-y-auto">
          <table className="w-full text-sm text-left rtl:text-right text-gray-500 border">
            <thead className="text-xs text-gray-600 uppercase bg-gray-50 border-b">
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
              {brandings?.map((branding, index) => {
                return (
                  <tr className="bg-white border-b" key={branding?.id}>
                    <th scope="row" className="px-6 py-4">
                      {(filters.page - 1) * filters.limit + index + 1}
                    </th>
                    <td className="px-6 py-4">
                      <img
                        // src={branding?.image}
                        src={`${replaceSize(
                          50,
                          50,
                          branding?.image
                            ? branding?.image
                            : "https://res.cloudinary.com/dvh8zf1nm/image/upload/v1738860057/default-image_uwedsh.webp"
                        )}`}
                        width={60}
                        height={60}
                        alt="Picture of the branding"
                      />
                    </td>
                    <td className="px-6 py-4 truncate max-w-xs">
                      {branding?.name?.name_en}
                    </td>
                    <td className="px-6 py-4 truncate max-w-xs">
                      {<StatusBadge status={branding.status} />}
                    </td>
                    <td className="px-6 py-4">
                      {formatDateToDDMMYYYY(branding?.created_at)}
                    </td>
                    <td className="flex space-x-2 px-6 py-4">
                      <EditIcon
                        onClick={() => handleClickEditBranding(branding)}
                        size={20}
                        className="cursor-pointer"
                      />
                      <TrashIcon
                        onClick={() => handleSelectBranding(branding)}
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
