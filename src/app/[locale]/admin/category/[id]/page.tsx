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
import { GET_ALL_CATEGORIES, UPDATE_CATEGORY } from "@/api/category";
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
    getAllCategories,
    { data: categoryDatas, loading: categoryDataLoading },
  ] = useLazyQuery(GET_ALL_CATEGORIES, {
    fetchPolicy: "cache-and-network",
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [categories, setCategories] = useState<ICategoryTypes[]>([]);
  const [selectedImage, setSelectedImage] = useState<File | null>();
  const [formData, setFormData] = useState<CategoryFormData>({
    name: {
      name_en: "",
    },
    image: null,
    parent_id: null,
    recommended: true,
  });

  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]); // Retain all selected categories
  const [parentIds, setParentIds] = useState<(string | null)[]>([null]); // Root parent starts as null
  const [errors, setErrors] = useState<Record<string, string>>({});

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
    if (categoryData) {
      setFormData(categoryData?.getCategory?.data);
      setParentIds([categoryData?.getCategory?.data?.parent_id]);
      setSelectedCategoryIds([categoryData?.getCategory?.data?.parent_id]);
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
        name: {
          name_en: "",
        },
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
    if (!formData.name.name_en.trim()) {
      newErrors.name = "Name is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const goBack = () => {
    router.back();
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
    const body = {
      id: formData?.id,
      name: formData?.name,
      image: formData?.image,
      parent_id: selectedCategoryIds?.length
        ? selectedCategoryIds[selectedCategoryIds?.length - 1]
        : null,
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

    // setFormData({
    //   name: {
    //     name_en: "",
    //   },
    //   image: null,
    //   parent_id: null,
    //   recommended: true,
    // });

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

  const handleTranslateChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: "name",
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
              {Object.keys(formData.name).map((lang) => (
                <div key={lang}>
                  <label className="block text-sm text-gray-600">{`Name`}</label>
                  <input
                    type="text"
                    name={`name_${lang}`}
                    value={formData.name[lang]}
                    onChange={(e) => handleTranslateChange(e, "name", lang)}
                    className="mt-1 block w-full px-4 py-2 text-sm border rounded-md text-gray-500"
                    placeholder="Name..."
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm">{errors.name}</p>
                  )}
                </div>
              ))}
            </div>

            <div>
              {/* Dynamic Category Combo Boxes */}
              <div className="mt-4">
                <label className="block text-sm text-gray-600">Category</label>
                {parentIds.map((parentId, index) => {
                  if (
                    !categories?.filter(
                      (category) => category.parent_id === parentId
                    ).length ||
                    (index != 0 && parentId === null)
                  )
                    return;
                  return (
                    <div key={index} className="mt-2">
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
                            (category) =>
                              category.id !==
                                categoryData?.getCategory?.data?.id ||
                              !parentIds.includes(category?.id)
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
                className="w-2/5 rounded bg-primary text-white p-2 bg-base text-xs mt-4"
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
