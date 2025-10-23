"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { useMutation } from "@apollo/client";

// components
import Loading from "@/components/loading";
import Breadcrumb from "@/components/breadCrumb";
import IconButton from "@/components/iconButton";

// utils and types
import { useToast } from "@/utils/toast";
import { CREATED_BRANDING } from "@/api/brand";
import { IBrandingFormData } from "@/types/brand";
import { CLOUDINARY_URL, UPLOAD_PRESET } from "@/constants/adminData";

const AddBrandPage = () => {
  const g = useTranslations("globals");
  const { successMessage, errorMessage } = useToast();

  const [
    createBrading,
    { data: createBrandingData, error: createBradingError },
  ] = useMutation(CREATED_BRANDING);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState<IBrandingFormData>({
    name: {
      name_en: "",
    },
    image: null,
  });
  const [selectedImage, setSelectedImage] = useState<File | null>();

  useEffect(() => {
    if (createBrandingData?.createBranding?.success) {
      setFormData({
        name: {
          name_en: "",
        },
        image: null,
      });
      setSelectedImage(null);
      setIsLoading(false);
      return successMessage({
        message: "Create brand successful!.",
        duration: 3000,
      });
    } else if (
      createBrandingData?.createBranding &&
      !createBrandingData?.createBranding?.success
    ) {
      errorMessage({
        message:
          createBrandingData?.createBranding?.error?.message ||
          "Something went wrong!. Try again",
        duration: 3000,
      });
      return setIsLoading(false);
    }
  }, [createBrandingData]);

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: "image"
  ) => {
    const files = e.target.files;
    if (!files) return;
    setSelectedImage(files[0]);
  };

  const handleRemoveCoverImage = (e: any) => {
    e.preventDefault();
    setSelectedImage(null);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Validate name
    if (!formData.name.name_en.trim()) {
      newErrors.name = "Name is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    setIsLoading(true);
    const body = {
      ...formData,
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
    // });

    try {
      await createBrading({
        variables: {
          data: body,
        },
      });
    } catch (err) {
      console.error("Error creating branding:", err);
    } finally {
      setIsLoading(false);
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
          { label: "Brand", value: "/admin/brand" },
          { label: "Add new", value: "/admin/brand/create new brand" },
        ]}
      />
      <form
        className="w-full mx-auto p-6 bg-white rounded shadow-md mt-4"
        onSubmit={handleSubmit}
      >
        <h2 className="text-lg font-bold text-gray-500 mb-4">Add brand</h2>

        <div className="flex space-x-4">
          <div className="mt-4">
            <label className="block text-sm text-gray-600 mb-2">
              Brand image
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
              ) : (
                <span className="text-gray-400 text-sm">Click to upload</span>
              )}
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={(e) => handleFileChange(e, "image")}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
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

            <IconButton
              icon={isLoading && <Loading />}
              className="w-1/2 mt-4 rounded bg-primary text-white p-2 bg-base text-xs"
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

export default AddBrandPage;
