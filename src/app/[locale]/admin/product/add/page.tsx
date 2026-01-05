"use client";

import { GET_SUB_CATEGORY } from "@/api/category";
import { CREATED_PRODUCT } from "@/api/product";
import Breadcrumb from "@/components/breadCrumb";
import IconButton from "@/components/iconButton";
import Loading from "@/components/loading";
import SearchableSelect from "@/components/searchableSelect";
import { CLOUDINARY_URL, UPLOAD_PRESET } from "@/constants/adminData";
import { ICategoryTypes } from "@/types/category";
import { IProductFormData } from "@/types/product";
import { useToast } from "@/utils/toast";
import { useLazyQuery, useMutation } from "@apollo/client";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { useBrandFilters } from "../../brand/hook/useBrandFilters";
import { IBrandingTypes } from "@/types/brand";

const AddProductForm = () => {
  const g = useTranslations("globals");
  const { successMessage, errorMessage } = useToast();
  const { data: brandDatas, updatePage, filters } = useBrandFilters();
  const [createProduct, { data: createProductData }] =
    useMutation(CREATED_PRODUCT);
  const [getAllCategories, { data: categoryDatas }] = useLazyQuery(
    GET_SUB_CATEGORY,
    {
      fetchPolicy: "cache-and-network",
    }
  );

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [categories, setCategories] = useState<ICategoryTypes[]>([]);
  const [brandings, setBrandings] = useState<IBrandingTypes[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>(""); // Retain all selected categories
  const [categoryPage, setCategoryPage] = useState<number>(1); // Root parent starts as null
  const [selectedBrandingId, setSelectedBrandingId] = useState<string | null>(
    null
  ); // Retain all selected categories
  const [selectedCoverImage, setSelectedCoverImage] = useState<File | null>();
  const [selectedMultipleImages, setSelectedMultipleImages] = useState<File[]>(
    []
  );
  const [formData, setFormData] = useState<IProductFormData>({
    name: "",
    image_url: null,
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


  const categoryBranding = async () => {
    setCategoryPage(categoryPage + 1)
  };
  const nextBranding = async () => {
    updatePage(filters.page + 1)
  };

  useEffect(() => {
    const fetchAllCategories = async () => {
      await getAllCategories({
        variables: {
          limit: 50,
          page: categoryPage,
          sortedBy: "created_at_DESC",
        },
      });
    };
    fetchAllCategories();
  }, [categoryPage]);

  useEffect(() => {
    const newData = categoryDatas?.getSubcategories?.data
    if (!newData) return;
    setCategories((prev) => {
      const merged = [...prev, ...newData];

      const unique: ICategoryTypes[] = Array.from(
        new Map(
          merged.map((item: ICategoryTypes) => [item.id, item])
        ).values()
      );

      return unique;
    });
  }, [categoryDatas?.getSubcategories?.data]);

  useEffect(() => {
    const newData = brandDatas?.getBrandings?.data;
    if (!newData) return;

    setBrandings((prev) => {
      const merged = [...prev, ...newData];

      const unique: IBrandingTypes[] = Array.from(
        new Map(
          merged.map((item: IBrandingTypes) => [item.id, item])
        ).values()
      );

      return unique;
    });
  }, [brandDatas?.getBrandings?.data]);

  const brandOptions = brandings?.map((brand) => ({
    label: brand.name,
    value: brand.id,
  })) || [];
  useEffect(() => {
    if (createProductData?.createProduct?.success) {
      // Reset the form state
      setFormData({
        name: "",
        image_url: null,
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
      setSelectedCategoryId("");

      return successMessage({
        message: "Added new product successful!.",
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
    if (!formData.name.trim()) {
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
      newErrors.image_url = "Cover image is required";
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
    field: "image_url" | "images"
  ) => {
    const files = e.target.files;
    if (!files) return;

    if (field === "image_url") {
      setSelectedCoverImage(files[0]);
    } else if (field === "images") {
      setSelectedMultipleImages([
        ...selectedMultipleImages,
        ...Array.from(files),
      ]);
    }
  };
  const categoryOptions = categories?.map((category) => ({
    label: category.name,
    value: category.id,
  })) || [];
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
      brand_id: selectedBrandingId,
      category_id: selectedCategoryId
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
          body.image_url = data.secure_url;
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

  const handleRemoveCoverImage = (e: any) => {
    e.preventDefault();
    setSelectedCoverImage(null);
  };

  const handleCategoryChange = (value: string) => {
    setSelectedCategoryId(value);
  };
  const handleBrandingChange = (brandingId: string) => {
    setSelectedBrandingId(brandingId);
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
                  name="image_url"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, "image_url")}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              </div>
              {errors.image_url && (
                <p className="text-red-500 text-sm">{errors.image_url}</p>
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
                <label className="block text-sm text-gray-600">
                  Name
                </label>
                {/* <input
                  type="text"
                  name="name"
                  value={formData.name}
                  placeholder="Name..."
                  onChange={handleChange}
                  className="mt-1 block w-full px-4 py-2 text-sm border rounded-md text-gray-600"
                  required
                /> */}
                <textarea
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Name..."
                  rows={4}
                  className="mt-1 block w-full px-4 py-2 text-sm border rounded-md text-gray-600 resize-vertical"
                  required
                />
                {errors.name && (
                  <p className="text-red-500 text-sm">{errors.name}</p>
                )}
              </div>
              <div>
                <SearchableSelect
                  label="Category"
                  options={categoryOptions}
                  value={selectedCategoryId}
                  onChange={handleCategoryChange}
                  onScrollEnd={(end) => {
                    if (end) {
                      categoryBranding()
                    }
                  }}
                  placeholder="Select a category"
                />
              </div>
              <div>
                <SearchableSelect
                  label="Brand"
                  options={brandOptions}
                  value={selectedBrandingId || ""}
                  onChange={handleBrandingChange}
                  onScrollEnd={(end) => {
                    if (end) {
                      nextBranding()
                    }
                  }}
                  placeholder="Select a brand"
                />
              </div>

              {/* <div>
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
              </div> */}
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
                  </select>
                </div>
              </div>
              {/* <div>
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
              </div> */}
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
