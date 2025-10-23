"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { useMutation } from "@apollo/client";

// Components
import IconButton from "@/components/iconButton";
import Breadcrumb from "@/components/breadCrumb";
import Pagination from "@/components/pagination";
import DeleteModal from "@/components/deleteModal";

// Utils and Hooks
import { useToast } from "@/utils/toast";
import { IProductTypes } from "@/types/product";
import { formatDateToDDMMYYYY } from "@/utils/dateFormat";
import { useProductFilters } from "@/app/[locale]/admin/product/hook/useProductFilters";

// APIs and Components
import { DELETE_PRODUCT } from "@/api/product";
import { AddIcon, EditIcon, TrashIcon } from "@/icons/page";
import EmptyPage from "@/components/emptyPage";
import { useRouter } from "@/i18n/navigation";

export default function Product() {
  const g = useTranslations("globals");
  const router = useRouter();
  const { successMessage, errorMessage } = useToast();
  const [deleteProduct, { data: deleteProductData }] =
    useMutation(DELETE_PRODUCT);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [searchInput, setSearchInput] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<IProductTypes>();
  const [products, setProducts] = useState<IProductTypes[]>();
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const {
    filters,
    updateKeyword,
    updatedAtRange,
    updateSortBy,
    data,
    error,
    updatePage,
    updateProductVip,
  } = useProductFilters();

  useEffect(() => {
    if (data?.adminGetProducts?.data) setProducts(data?.adminGetProducts?.data);
  }, [data?.adminGetProducts?.data]);

  useEffect(() => {
    if (deleteProductData?.deleteProduct?.success) {
      return successMessage({
        message: "Delete category successful!.",
        duration: 3000,
      });
    } else if (
      deleteProductData?.deleteProduct &&
      !deleteProductData?.deleteProduct?.success
    ) {
      errorMessage({
        message: "Something went wrong!. Try again",
        duration: 3000,
      });
    }
  }, [deleteProductData?.deleteProduct?.success]);

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

  const handleSelectProduct = (product: IProductTypes) => {
    setSelectedProduct(product);
    setIsOpen(true);
  };

  const handleClickEditProduct = (product: IProductTypes) => {
    router.push("/admin/product/" + product?.id);
  };

  const handleDelete = async () => {
    try {
      setIsLoading(true);

      await deleteProduct({
        variables: {
          deleteProductId: selectedProduct?.id,
        },
      });

      setIsOpen(false);

      const updateCategories = products?.filter(
        ({ id }) => id !== selectedProduct?.id
      );
      setProducts(updateCategories);
    } catch (error) {
      console.error({ error });
    } finally {
      setIsLoading(false);
    }
  };

  if (error) return <p>Error: {error.message}</p>;
  const totalItems: number = data?.adminGetProducts?.total;

  return (
    <div className="space-y-2 flex items-start justify-start flex-col gap-4">
      <div className="w-full flex justify-between items-center">
        <Breadcrumb
          items={[
            { label: "Admin dashboard", value: "/admin" },
            { label: "Product management", value: "/admin/product" },
          ]}
        />
        <div>
          <IconButton
            className="rounded text-white p-2 bg-neon_pink text-sm"
            icon={<AddIcon size={22} />}
            title={"Add New"}
            isFront={true}
            onClick={() => {
              return router.push("/admin/product/add");
            }}
          />
        </div>
      </div>

      {/* Filter Controls */}
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
              className="mt-1 block w-full px-4 py-2 text-sm border rounded-md text-gray-500"
            />
          </div>
          <div>
            <p className="text-gray-500 text-sm">Product VIP</p>
            <select
              onChange={(e) => updateProductVip(Number(e.target.value))}
              className="mt-1 border px-4 py-[8px] text-gray-400 text-sm rounded-md"
            >
              <option value={0}>All</option>
              <option value={1}>VIP 1</option>
              <option value={2}>VIP 2</option>
              <option value={3}>VIP 3</option>
              <option value={4}>VIP 4</option>
              <option value={5}>VIP 5</option>
            </select>
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
                className="mt-1 block w-full px-4 py-2 text-sm border rounded-md text-gray-500"
              />
            </div>
            <div>
              <p className="mx-2 text-sm text-gray-500">End date</p>
              <input
                type="date"
                onChange={(e) =>
                  updatedAtRange(
                    filters.dateRange?.startDate || "",
                    e.target.value
                  )
                }
                className="mt-1 block w-full px-4 py-2 text-sm border rounded-md text-gray-500"
              />
            </div>
          </div>
        </div>
        <div>
          <p className="text-gray-500 text-sm">Sort</p>
          <select
            onChange={(e) => updateSortBy(e.target.value)}
            className="border px-4 py-2 text-gray-400 text-sm"
          >
            <option value="created_at_DESC">Created At (Newest)</option>
            <option value="created_at_ASC">Created At (Oldest)</option>
            <option value="price_DESC">Price (High to Low)</option>
            <option value="price_ASC">Price (Low to High)</option>
            <option value="sell_count_DESC">Sell Count (High to Low)</option>
            <option value="sell_count_ASC">Sell Count (Low to High)</option>
          </select>
        </div>
      </div>

      {/* Table */}
      {products?.length === 0 ? (
        <div className="w-full bg-white">
          <EmptyPage />
        </div>
      ) : (
        <div className="w-full bg-white w-auto h-screen rounded-md">
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
                    {g("_category")}
                  </th>
                  <th scope="col" className="px-6 py-3">
                    {g("_brand")}
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Product VIP
                  </th>
                  <th scope="col" className="px-6 py-3">
                    {g("_price")}
                  </th>
                  <th scope="col" className="px-6 py-3">
                    {g("_quantity")}
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Sell count
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
                {products?.map((product, index) => {
                  return (
                    <tr className="bg-white border-b" key={product?.id}>
                      <th scope="row" className="px-6 py-4">
                        {(filters.page - 1) * filters.limit + index + 1}
                      </th>
                      <td className="px-6 py-4">
                        <img
                          src={product?.cover_image}
                          width={60}
                          height={60}
                          alt="Picture of the product"
                        />
                      </td>
                      <td className="px-6 py-4">{product?.name?.name_en}</td>
                      <td className="px-6 py-4 truncate max-w-xs">
                        {product?.categoryData?.name?.name_en}
                      </td>
                      <td className="px-6 py-4 truncate max-w-xs">
                        {product?.brandData?.name?.name_en || ""}
                      </td>
                      <td className="px-6 py-4 truncate max-w-xs">
                        {product?.product_vip || "0"}
                      </td>
                      <td className="px-6 py-4">${product?.price}</td>
                      <td className="px-6 py-4">{product?.quantity}</td>
                      <td className="px-6 py-4">{product?.sell_count}</td>
                      <td className="px-6 py-4">
                        {formatDateToDDMMYYYY(product?.created_at)}
                      </td>
                      <td className="flex items-center space-x-2 px-6 py-4">
                        <EditIcon
                          onClick={() => handleClickEditProduct(product)}
                          size={20}
                          className="cursor-pointer my-2"
                        />
                        <TrashIcon
                          onClick={() => handleSelectProduct(product)}
                          size={20}
                          className="cursor-pointer my-2"
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="w-full text-gray-600 flex items-end justify-end bg-white">
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
    </div>
  );
}
