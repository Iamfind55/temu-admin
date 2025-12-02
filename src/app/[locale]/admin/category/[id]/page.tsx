"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { useLazyQuery, useMutation } from "@apollo/client";

// Components
import Loading from "@/components/loading";
import IconButton from "@/components/iconButton";
import Breadcrumb from "@/components/breadCrumb";

// Utils and hooks
import { useToast } from "@/utils/toast";
import { useCategoryFilters } from "../hook/useCategoryFilters";

// Types and APIs
import { GET_ALL_CATEGORIES, GET_CATEGORY, GET_MAIN_CATEGORIES, UPDATE_CATEGORY } from "@/api/category";
import { CategoryFormData, ICategoryTypes } from "@/types/category";
import { CLOUDINARY_URL, UPLOAD_PRESET } from "@/constants/adminData";
import { useRouter } from "next/navigation";

const UpdateCategoryForm = ({ params }: { params: any }) => {
  const g = useTranslations("globals");
  const router = useRouter();
  const { successMessage, errorMessage } = useToast();

  const { filters, updateKeyword, data, categoryData, handleSelectCategory } =
    useCategoryFilters();

  const [updateCategory, { data: updateCategoryData }] =
    useMutation(UPDATE_CATEGORY);
  const [
    getMainCategories,
    { data: categoryDatas, loading: categoryDataLoading },
  ] = useLazyQuery(GET_MAIN_CATEGORIES, {
    fetchPolicy: "cache-and-network",
  });
  const [
    getCategory,
    { data: category },
  ] = useLazyQuery(GET_CATEGORY, {
    fetchPolicy: "cache-and-network",
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [categories, setCategories] = useState<ICategoryTypes[]>([]);
  const [selectedImage, setSelectedImage] = useState<File | null>();
  const [formData, setFormData] = useState<CategoryFormData>({
    name: "",
    image: null,
    parent_id: null,
    recommended: true,
  });

  const [selectedParentId, setSelectedParentId] = useState<string>("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchAllCategories = async () => {
      await getMainCategories({
        variables: {
          limit: 200,
          page: 1,
          sortedBy: "created_at_DESC",
        },
      });
    };
    fetchAllCategories();
  }, []);

  useEffect(() => {
    if (categoryDatas?.getMainCategories?.success) {
      setCategories(categoryDatas?.getMainCategories?.data);
    }
  }, [categoryDatas?.getMainCategories?.data]);

  useEffect(() => {
    if (categoryData) {
      setFormData(categoryData?.getCategory?.data);
      const parentId = categoryData?.getCategory?.data?.parent_data?.parent_data?.id;
      if (parentId) {
        setSelectedParentId(parentId);
      }
    }
  }, [categoryData]);
  useEffect(() => {
    const getParams = async () => {
      const { id: categoryId } = await params;
      if (categoryId) handleSelectCategory(categoryId);
    };
    getParams();
  }, [params]);

  useEffect(() => {
    if (updateCategoryData?.updateCategory?.success) {
      successMessage({
        message: "Update category successful!.",
        duration: 3000,
      });
      setFormData({
        name: "",
        image: null,
        parent_id: null,
        recommended: true,
      });
      setIsLoading(false);
      return goBack();
    } else if (
      updateCategoryData?.updateCategory &&
      !updateCategoryData?.updateCategory?.success
    ) {
      errorMessage({
        message:
          updateCategoryData?.updateCategory?.error?.message ||
          "Something went wrong!. Try again",
        duration: 3000,
      });
      return setIsLoading(false);
    }
  }, [updateCategoryData]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Validate name
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const goBack = () => {
    router.back();
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedParentId(e.target.value);
  };

  const fetchCagegory = async (id: string) => {
    const result = await getCategory({
      variables: {
        getCategoryId: id
      },
    });

    return result?.data.getCategory?.data
  };


  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: "image"
  ) => {
    const files = e.target.files;
    if (!files) return;
    setSelectedImage(files[0]);
  };

  const handleRemoveCoverImage = (e: React.FormEvent) => {
    e.preventDefault();
    setSelectedImage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    setIsLoading(true);
    const result = await fetchCagegory(selectedParentId)

    const body = {
      id: formData?.id,
      name: formData?.name,
      image: formData?.image,
      parent_id: result?.id || null,
      recommended: formData?.recommended,
    };

    if (selectedImage) {
      const _formData = new FormData();
      _formData.append("file", selectedImage);
      _formData.append("upload_preset", UPLOAD_PRESET);

      try {
        const response = await fetch(CLOUDINARY_URL, {
          method: "POST",
          body: _formData,
        });

        const data = await response.json();

        if (data.secure_url) {
          body.image = data.secure_url;
        }
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    }

    setFormData({
      name: "",
      image: null,
      parent_id: null,
      recommended: true,
    });

    try {
      await updateCategory({
        variables: {
          data: body,
        },
      });
    } catch (err) {
      console.error("Error creating category:", err);
    }
  };


  return (
    <>
      <Breadcrumb
        items={[
          { label: "Admin dashboard", value: "/admin" },
          { label: "Category", value: "/admin/category" },
          { label: "Edit category", value: "/admin/category/dfgsdfgsdgsd" },
        ]}
      />
      <form
        className="w-full mx-auto p-6 bg-white rounded shadow-md mt-4"
        onSubmit={handleSubmit}
      >
        <h2 className="text-md font-bold text-gray-500 mb-4">
          Update Category
        </h2>

        <div className="flex space-x-4">
          <div>
            {/* Image Upload */}
            <div className="mt-4">
              <label className="block text-sm text-gray-600 mb-2">
                Cover Image
              </label>
              <div className="relative w-40 h-40 border border-dashed border-gray-300 rounded-md flex items-center justify-center bg-gray-50 cursor-pointer hover:bg-gray-100">
                {selectedImage ? (
                  <>
                    <img
                      src={URL.createObjectURL(selectedImage)}
                      alt="Cover Preview"
                      className="w-full h-full object-cover rounded-md"
                    />
                    <button
                      type="button"
                      className="absolute top-1 right-1 z-10 bg-white p-1 rounded-full text-red-500 hover:text-red-700 shadow"
                      onClick={handleRemoveCoverImage}
                    >
                      ✕
                    </button>
                  </>
                ) : formData.image ? (
                  <>
                    <img
                      src={formData?.image}
                      alt="Cover Preview"
                      className="w-full h-full object-cover rounded-md"
                    />
                  </>
                ) : (
                  <span className="text-gray-400 text-sm">Click to upload</span>
                )}
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, "image")}
                  className="absolute inset-0 opacity-0 cursor-pointer z-0"
                />
              </div>
            </div>
          </div>

          <div className="w-full">
            <div className="mt-2">
              <div>
                <label className="block text-sm text-gray-600">{`Name`}</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                  className="mt-1 block w-full px-4 py-2 text-sm border rounded-md text-gray-500"
                  placeholder="Name..."
                />
                {errors.name && (
                  <p className="text-red-500 text-sm">{errors.name}</p>
                )}
              </div>
            </div>

            <div>
              {/* Dynamic Category Combo Boxes */}
              <div className="mt-4">
                <label className="block text-sm text-gray-600">Parent Category</label>
                <select
                  value={selectedParentId}
                  onChange={handleCategoryChange}
                  className="mt-2 block w-full px-4 py-2 text-sm border rounded-md text-gray-500"
                >
                  <option value="">None (Top Level Category)</option>
                  {categories
                    ?.filter(
                      (category) =>
                        !category.parent_id &&
                        category.id !== categoryData?.getCategory?.data?.id
                    )
                    ?.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                </select>
              </div>

              {/* Recommended Checkbox */}
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
                className="w-2/5 rounded bg-primary text-white p-2 text-xs mt-4"
                title="Save change"
                isFront={true}
                type="submit"
                disabled={isLoading}
              />
            </div>
          </div>
        </div>
      </form>
    </>
  );
};

export default UpdateCategoryForm;
