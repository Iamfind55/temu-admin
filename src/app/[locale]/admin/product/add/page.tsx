"use client";

import { IProductFormData } from "@/types/product";
import { useEffect, useState } from "react";
import { useCategoryFilters } from "../../category/hook/useCategoryFilters";
import { ICategoryTypes } from "@/types/category";
import { useBrandFilters } from "../../brand/hook/useBrandFilters";
import { CREATED_PRODUCT } from "@/api/product";
import { useLazyQuery, useMutation } from "@apollo/client";
import { CLOUDINARY_URL, UPLOAD_PRESET } from "@/constants/adminData";
import IconButton from "@/components/iconButton";
import Loading from "@/components/loading";
import { useTranslations } from "next-intl";
import { useToast } from "@/utils/toast";
import Breadcrumb from "@/components/breadCrumb";
import { GET_ALL_CATEGORIES } from "@/api/category";
import CustomTextEditor from "@/components/CustomTextEditor";

const AddProductForm = () => {
  const g = useTranslations("globals");
  const { successMessage, errorMessage } = useToast();
  const { data: brandDatas } = useBrandFilters();
  const [createProduct, { data: createProductData }] =
    useMutation(CREATED_PRODUCT);
  const [getAllCategories, { data: categoryDatas }] = useLazyQuery(
    GET_ALL_CATEGORIES,
    {
      fetchPolicy: "cache-and-network",
    }
  );

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [categories, setCategories] = useState<ICategoryTypes[]>([]);
  const [brandings, setBrandings] = useState<ICategoryTypes[]>([]);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]); // Retain all selected categories
  const [parentIds, setParentIds] = useState<(string | null)[]>([null]); // Root parent starts as null
  const [selectedBrandingId, setSelectedBrandingId] = useState<string | null>(
    null
  ); // Retain all selected categories
  const [selectedCoverImage, setSelectedCoverImage] = useState<File | null>();
  const [selectedMultipleImages, setSelectedMultipleImages] = useState<File[]>(
    []
  );
  const [formData, setFormData] = useState<IProductFormData>({
    name: {
      name_en: "",
    },
    description: {
      name_en: "",
    },
    cover_image: null,
    images: [],
    price: 0,
    discount: 0,
    quantity: 0,
    total_star: 0,
    product_top: 0,
    product_vip: 0,
    sku: "",
    spu: "",
    category_id: "",
    brand_id: "",
    recommended: true,
  });

  useEffect(() => {
    const fetchAllCategories = async () => {
      await getAllCategories({
        variables: {
          limit: 3000,
          page: 1,
          sortedBy: "created_at_DESC",
        },
      });
    };
    fetchAllCategories();
  }, []);

  useEffect(() => {
    if (categoryDatas?.getAllCategories?.success) {
      setCategories([...categories, ...categoryDatas?.getAllCategories?.data]);
    }
  }, [categoryDatas?.getAllCategories?.data]);

  useEffect(() => {
    if (brandDatas?.getBrandings?.data) {
      setBrandings([...brandings, ...brandDatas?.getBrandings?.data]);
    }
  }, [brandDatas?.getBrandings?.data]);

  useEffect(() => {
    if (createProductData?.createProduct?.success) {
      // Reset the form state
      setFormData({
        name: { name_en: "" },
        description: { name_en: "" },
        cover_image: null,
        images: [],
        price: 0,
        discount: 0,
        quantity: 0,
        total_star: 0,
        product_top: 0,
        product_vip: 0,
        sku: "",
        spu: "",
        category_id: "",
        brand_id: "",
        recommended: true,
      });
      setSelectedCoverImage(null);
      setSelectedMultipleImages([]);
      setSelectedBrandingId(null);
      setSelectedCategoryIds([]);
      setParentIds([null]);

      return successMessage({
        message: "Update category successful!.",
        duration: 3000,
      });
    } else if (
      createProductData?.createProduct &&
      !createProductData?.createProduct?.success
    ) {
      errorMessage({
        message: "Something went wrong!. Try again",
        duration: 3000,
      });
    }
  }, [createProductData]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Validate name
    if (!formData.name.name_en.trim()) {
      newErrors.name = "Name is required";
    }

    // Validate price
    if (formData.price <= 0) {
      newErrors.price = "Price must be greater than 0";
    }

    // Validate quantity
    if (formData.quantity <= 0) {
      newErrors.quantity = "Quantity must be a non-negative number";
    }

    // Validate cover image
    if (!selectedCoverImage) {
      newErrors.cover_image = "Cover image is required";
    }

    // Validate multiple images
    // if (selectedMultipleImages.length === 0) {
    //   newErrors.images = "At least one image is required";
    // }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : [
              "price",
              "discount",
              "quantity",
              "total_star",
              "product_vip",
              "sell_count",
              "product_top",
            ].includes(name)
          ? Number(value)
          : value,
    }));
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: "cover_image" | "images"
  ) => {
    const files = e.target.files;
    if (!files) return;

    if (field === "cover_image") {
      setSelectedCoverImage(files[0]);
    } else if (field === "images") {
      setSelectedMultipleImages([
        ...selectedMultipleImages,
        ...Array.from(files),
      ]);
    }
  };

  const handleRemoveImage = (index: number) => {
    setSelectedMultipleImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    // Prepare the body object
    const body: IProductFormData = {
      ...formData,
      category_id: selectedCategoryIds[selectedCategoryIds?.length - 1],
      brand_id: selectedBrandingId,
    };

    if (selectedCoverImage) {
      const _formData = new FormData();
      _formData.append("file", selectedCoverImage);
      _formData.append("upload_preset", UPLOAD_PRESET);

      try {
        const response = await fetch(CLOUDINARY_URL, {
          method: "POST",
          body: _formData,
        });

        const data = await response.json();

        if (data.secure_url) {
          body.cover_image = data.secure_url;
        }
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    }

    // Handle multiple image uploads
    if (selectedMultipleImages) {
      try {
        const uploadPromises = selectedMultipleImages.map(
          async (image: File) => {
            const _formData = new FormData();
            _formData.append("file", image);
            _formData.append("upload_preset", UPLOAD_PRESET);

            const response = await fetch(CLOUDINARY_URL, {
              method: "POST",
              body: _formData,
            });

            if (!response.ok) {
              throw new Error(`Image upload failed: ${response.statusText}`);
            }

            const data = await response.json();
            return data.secure_url;
          }
        );

        // Wait for all images to upload
        const uploadedImages = await Promise.all(uploadPromises);
        body.images = uploadedImages; // Add uploaded image URLs to the body
      } catch (error) {
        console.error("Error uploading images:", error);
        setIsLoading(false);
        return; // Exit early if image upload fails
      }
    }

    // Handle product creation
    try {
      await createProduct({
        variables: {
          data: body,
        },
      });
    } catch (err) {
      console.error("Error creating product:", err);
    } finally {
      setIsLoading(false); // Ensure loading state is cleared
    }
  };

  const handleTranslateChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: "name" | "description",
    lang: string
  ) => {
    const { value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [field]: {
        ...prev[field],
        [lang]: value,
      },
    }));
  };

  const handleRemoveCoverImage = (e: any) => {
    e.preventDefault();
    setSelectedCoverImage(null);
  };

  const handleCategoryChange =
    (index: number) => (e: React.ChangeEvent<HTMLSelectElement>) => {
      const value = e.target.value;

      // Update selected categories
      const updatedSelectedCategoryIds = [...selectedCategoryIds];
      updatedSelectedCategoryIds[index] = value;
      setSelectedCategoryIds(updatedSelectedCategoryIds);

      // Update parent IDs for the next level
      const updatedParentIds = [...parentIds];
      updatedParentIds[index + 1] = value || null; // Set parent_id for the next level
      setParentIds(updatedParentIds);

      // Ensure subsequent dropdowns are removed if category changes
      setParentIds((prev) => prev.slice(0, index + 2));
      setSelectedCategoryIds((prev) => prev.slice(0, index + 1));
    };
  const handleBrandingChange = (brandingId: string) => {
    setSelectedBrandingId(brandingId);
  };

  const handleEditorChange = (
    name: string,
    nestedKey: string,
    value: string
  ) => {
    setFormData((prev: any) => ({
      ...prev,
      [name]: {
        ...prev[name],
        [nestedKey]: value,
      },
    }));
  };

  return (
    <>
      <Breadcrumb
        items={[
          { label: "Admin dashboard", value: "/admin" },
          { label: "Product", value: "/admin/product" },
          { label: "Create new product", value: "/admin/product/add" },
        ]}
      />
      <form
        className="max-w-full h- mx-auto p-6 bg-white rounded shadow-md mt-4"
        onSubmit={handleSubmit}
      >
        <h2 className="text-md font-bold text-gray-500 mb-4">
          Create New Product
        </h2>
        <div className="flex space-x-3">
          <div className="w-1/6">
            <div className="mt-4">
              <label className="block text-sm text-gray-600 mb-2">
                Cover Image
              </label>
              <div className="relative w-40 h-40 border border-dashed border-gray-300 rounded-md flex items-center justify-center bg-gray-50 cursor-pointer hover:bg-gray-100">
                {selectedCoverImage ? (
                  <>
                    <img
                      src={URL.createObjectURL(selectedCoverImage)}
                      alt="Cover Preview"
                      className="w-full h-full object-cover rounded-md"
                    />
                    <button
                      type="button"
                      className="w-6 h-6 flex justify-center items-center absolute top-1 right-1 z-10 bg-white p-1 rounded-full text-red-500 hover:text-red-700 shadow"
                      onClick={handleRemoveCoverImage}
                    >
                      ✕
                    </button>
                  </>
                ) : (
                  <span className="text-gray-400 text-sm">Click to upload</span>
                )}
                <input
                  type="file"
                  name="cover_image"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, "cover_image")}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              </div>
              {errors.cover_image && (
                <p className="text-red-500 text-sm">{errors.cover_image}</p>
              )}
            </div>

            {/* Multiple Images */}
            <div className="mt-4 space-y-2 w-40">
              <label className="block text-sm text-gray-600">Images</label>
              {selectedMultipleImages.length > 0 && (
                <div className="mt-2 grid grid-cols-2 gap-4">
                  {selectedMultipleImages.map((image, index) => (
                    <div key={index} className="relative">
                      <img
                        src={URL.createObjectURL(image)}
                        alt={`Preview ${index}`}
                        className="w-full h-full object-cover rounded-md"
                      />
                      <button
                        type="button"
                        className="w-6 h-6 flex justify-center items-center absolute top-1 right-1 text-sm text-red-600 bg-white rounded-full p-1 hover:bg-gray-200"
                        onClick={() => handleRemoveImage(index)}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="relative w-30 h-10 border border-dashed border-red-700 rounded-md flex items-center justify-center bg-red-500 cursor-pointer hover:bg-red-600">
                <span className="text-whit-400 text-sm">
                  {!selectedMultipleImages?.length
                    ? "Add image"
                    : "Add new image"}
                </span>
                <input
                  type="file"
                  name="images"
                  accept="image/*"
                  multiple
                  onChange={(e) => handleFileChange(e, "images")}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              </div>
            </div>
          </div>

          <div className="w-5/6">
            {/* Other Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                {Object.keys(formData.name).map((lang) => (
                  <div key={lang}>
                    <label className="block text-sm text-gray-600">
                      {`Name`}
                    </label>
                    <input
                      type="text"
                      name={`name_${lang}`}
                      value={formData.name[lang]}
                      placeholder="Name..."
                      onChange={(e) => handleTranslateChange(e, "name", lang)}
                      className="mt-1 block w-full px-4 py-2 text-sm border rounded-md text-gray-600"
                      required
                    />
                    {errors.name && (
                      <p className="text-red-500 text-sm">{errors.name}</p>
                    )}
                  </div>
                ))}
              </div>

              {/* Description Translations */}
              {/* <div>
                {Object.keys(formData.description).map((lang) => (
                  <div key={lang}>
                    <label className="block text-sm text-gray-600">
                      {`Description`}
                    </label>
                    <textarea
                      name={`description_${lang}`}
                      value={formData.description[lang]}
                      placeholder="Description..."
                      onChange={(e: any) =>
                        handleTranslateChange(e, "description", lang)
                      }
                      className="mt-1 block w-full px-4 py-2 text-sm border rounded-md text-gray-600"
                    />
                  </div>
                ))}
              </div> */}
              <div>
                {/* Dynamic Category Combo Boxes */}
                <div className="mt-4">
                  <label className="block text-sm text-gray-600">
                    Category
                  </label>
                  {parentIds.map((parentId, index) => {
                    if (
                      !categories?.filter(
                        (category) => category.parent_id === parentId
                      ).length ||
                      (index != 0 && parentId === null)
                    )
                      return;
                    return (
                      <div key={"category-parent" + index} className="mt-2">
                        <select
                          value={selectedCategoryIds[index] || ""}
                          onChange={handleCategoryChange(index)}
                          className="block w-full px-4 py-2 text-sm border rounded-md text-gray-500"
                        >
                          <option value="">
                            Select a category {index === 0 ? "" : index + 1}
                          </option>
                          {categories
                            ?.filter(
                              (category) => category.parent_id === parentId
                            )
                            ?.map((category, index) => (
                              <option
                                key={category.id + index}
                                value={category.id}
                              >
                                {category.name.name_en}
                              </option>
                            ))}
                        </select>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div>
                {/* Dynamic branding Combo Boxes */}
                <div className="mt-4">
                  <label className="block text-sm text-gray-600">Brand</label>

                  <div className="mt-2">
                    <select
                      value={selectedBrandingId || ""}
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                        handleBrandingChange(e.target.value)
                      }
                      className="block w-full px-4 py-2 text-sm border rounded-md text-gray-500"
                    >
                      <option value="">Select a brand</option>
                      {brandings?.map((branding) => (
                        <option key={branding.id} value={branding.id}>
                          {branding.name.name_en}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-600">Sku</label>
                <input
                  type="text"
                  name={`sku`}
                  value={formData.sku}
                  placeholder="Sku..."
                  onChange={handleChange}
                  className="mt-1 block w-full px-4 py-2 text-sm border rounded-md text-gray-600"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600">Spu</label>
                <input
                  type="text"
                  name={`spu`}
                  value={formData.spu}
                  placeholder="Spu..."
                  onChange={handleChange}
                  className="mt-1 block w-full px-4 py-2 text-sm border rounded-md text-gray-600"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600">Price</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  className="mt-1 block w-full px-4 py-2 text-sm border rounded-md text-gray-600"
                  required
                />
                {errors.price && (
                  <p className="text-red-500 text-sm">{errors.price}</p>
                )}
              </div>
              <div>
                <label className="block text-sm text-gray-600">Discount</label>
                <input
                  type="number"
                  name="discount"
                  value={formData.discount}
                  onChange={handleChange}
                  className="mt-1 block w-full px-4 py-2 text-sm border rounded-md text-gray-600"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600">Quantity</label>
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  className="mt-1 block w-full px-4 py-2 text-sm border rounded-md text-gray-600"
                  required
                />
                {errors.quantity && (
                  <p className="text-red-500 text-sm">{errors.quantity}</p>
                )}
              </div>

              <div>
                <label className="block text-sm text-gray-600">
                  Total star
                </label>
                <input
                  type="number"
                  name="total_star"
                  value={formData.total_star}
                  onChange={handleChange}
                  className="mt-1 block w-full px-4 py-2 text-sm border rounded-md text-gray-600"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600">
                  Product VIP
                </label>
                <div>
                  <select
                    name="product_vip"
                    onChange={handleChange}
                    className="w-full mt-1 border px-4 py-[8px] text-gray-400 text-sm rounded-md"
                  >
                    <option value={0}>All</option>
                    <option value={1}>VIP 1</option>
                    <option value={2}>VIP 2</option>
                    <option value={3}>VIP 3</option>
                    <option value={4}>VIP 4</option>
                    <option value={5}>VIP 5</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-600">
                  Product top
                </label>
                <input
                  type="number"
                  name="product_top"
                  value={formData.product_top}
                  onChange={handleChange}
                  className="mt-1 block w-full px-4 py-2 text-sm border rounded-md text-gray-600"
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm text-gray-600">Description</label>
              <div className="max-h-[300px] min-[200px] rounded-md">
                <CustomTextEditor
                  name="description"
                  nestedKey="name_en" // Nested key
                  initialValue={formData.description.name_en}
                  onContentChange={handleEditorChange} // Handle content changes
                />
              </div>
            </div>

            {/* Recommended */}
            <div className="mt-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="recommended"
                  checked={formData.recommended}
                  onChange={handleChange}
                />
                <span className="text-sm text-gray-600">Recommended</span>
              </label>
            </div>
            <IconButton
              icon={isLoading && <Loading />}
              className="w-2/5 rounded bg-primary text-white p-2 bg-base text-xs mt-4"
              title="Save change"
              isFront={true}
              type="submit"
              disabled={isLoading}
            />
          </div>
        </div>
      </form>
    </>
  );
};

export default AddProductForm;
