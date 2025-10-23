"use client";

import { useRouter } from "@/i18n/navigation";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useMutation } from "@apollo/client";

// Components
import IconButton from "@/components/iconButton";
import Pagination from "@/components/pagination";
import Breadcrumb from "@/components/breadCrumb";
import DeleteModal from "@/components/deleteModal";

// Utils and hooks
import { useToast } from "@/utils/toast";
import { formatDateToDDMMYYYY } from "@/utils/dateFormat";
import { useCategoryFilters } from "./hook/useCategoryFilters";

// Icons and types
import { ICategoryTypes } from "@/types/category";
import { AddIcon, EditIcon, TrashIcon } from "@/icons/page";

// APIs
import { DELETE_CATEGORY } from "@/api/category";
import StatusBadge from "@/components/status";

export default function Category() {
  const g = useTranslations("globals");
  const router = useRouter();
  const { successMessage, errorMessage } = useToast();
  const [deleteCategory] = useMutation(DELETE_CATEGORY);

  const [searchInput, setSearchInput] = useState("");
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<ICategoryTypes>();
  const [categories, setCategories] = useState<ICategoryTypes[]>();

  const {
    filters,
    updateKeyword,
    updatedAtRange,
    updateSortBy,
    data,
    error,
    updatePage,
  } = useCategoryFilters();

  useEffect(() => {
    if (data?.adminGetCategories?.data)
      setCategories(data?.adminGetCategories?.data);
  }, [data?.adminGetCategories?.data]);

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

      await deleteCategory({
        variables: {
          deleteCategoryId: selectedCategory?.id,
        },
      });

      setIsLoading(false);

      successMessage({
        message: "Create category successful!.",
        duration: 3000,
      });
      setIsOpen(false);

      const updateCategories = categories?.filter(
        ({ id }) => id !== selectedCategory?.id
      );
      setCategories(updateCategories);
    } catch (error) {
      console.error({ error });
    }
  };

  const handleSelectCategory = (category: ICategoryTypes) => {
    setSelectedCategory(category);
    setIsOpen(true);
  };

  const handleClickEditCategory = (category: ICategoryTypes) => {
    router.push("/admin/category/" + category?.id);
  };

  if (error) return <p>Error: {error.message}</p>;

  const totalItems: number = data?.adminGetCategories?.total;

  return (
    <div className="space-y-2 flex items-start justify-start flex-col gap-4">
      <div className="w-full flex justify-between items-center">
        <Breadcrumb
          items={[
            { label: "Admin dashboard", value: "/admin" },
            { label: "Category management", value: "/admin/category" },
          ]}
        />
        <div>
          <IconButton
            className="rounded text-white p-2 bg-neon_pink text-sm"
            icon={<AddIcon size={22} />}
            isFront={true}
            title={"Add New"}
            onClick={() => {
              return router.push("/admin/category/add");
            }}
          />
        </div>
      </div>

      <div className="w-full space-x-4 mb-6 flex text-gray-600 justify-between">
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
                  Parent category
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
              {categories?.map((category, index) => {
                return (
                  <tr className="bg-white border-b" key={category?.id}>
                    <th scope="row" className="px-6 py-4">
                      {(filters.page - 1) * filters.limit + index + 1}
                    </th>
                    <td className="px-6 py-4">
                      <img
                        src={
                          category?.image
                            ? category?.image
                            : "https://res.cloudinary.com/dvh8zf1nm/image/upload/v1738860057/default-image_uwedsh.webp"
                        }
                        width={60}
                        height={60}
                        alt="Picture of the category"
                      />
                    </td>
                    <td className="px-6 py-4 truncate max-w-xs">
                      {category?.name?.name_en}
                    </td>
                    <td className="px-6 py-4 truncate max-w-xs">
                      {category?.parent_data?.name?.name_en}
                    </td>
                    <td className="px-6 py-4 truncate max-w-xs">
                      {<StatusBadge status={category.status} />}
                    </td>
                    <td className="px-6 py-4">
                      {formatDateToDDMMYYYY(category?.created_at)}
                    </td>
                    <td className="flex space-x-2 px-6 py-4 gap-2">
                      <EditIcon
                        onClick={() => handleClickEditCategory(category)}
                        size={20}
                        className="cursor-pointer"
                      />
                      <TrashIcon
                        onClick={() => handleSelectCategory(category)}
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
