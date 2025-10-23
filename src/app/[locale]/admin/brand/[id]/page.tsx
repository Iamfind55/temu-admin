"use client";

import { useRouter } from "@/i18n/navigation";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useMutation } from "@apollo/client";

// components
import Loading from "@/components/loading";
import IconButton from "@/components/iconButton";
import Breadcrumb from "@/components/breadCrumb";

// utils and hooks
import { useToast } from "@/utils/toast";
import { UPDATE_BRANDING } from "@/api/brand";
import { IBrandingFormData } from "@/types/brand";
import { useBrandFilters } from "../hook/useBrandFilters";
import { CLOUDINARY_URL, UPLOAD_PRESET } from "@/constants/adminData";

const UpdateBrandPage = ({ params }: { params: any }) => {
  const g = useTranslations("globals");
  const { successMessage, errorMessage } = useToast();
  const router = useRouter();

  const [updateBranding, { data: updateBrandingData }] =
    useMutation(UPDATE_BRANDING);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<File | null>();
  const [formData, setFormData] = useState<IBrandingFormData>({
    name: {
      name_en: "",
    },
    image: null,
  });

  const { bradingData, handleSelectBranding } = useBrandFilters();

  useEffect(() => {
    if (bradingData) setFormData(bradingData?.getBranding?.data);
  }, [bradingData]);

  useEffect(() => {
    const getParams = async () => {
      const { id: brandingId } = await params;
      if (brandingId) handleSelectBranding(brandingId);
    };
    getParams();
  }, [params]);

  useEffect(() => {
    if (updateBrandingData?.updateBranding?.success) {
      successMessage({
        message: "Update brand successful!.",
        duration: 3000,
      });

      setFormData({
        name: {
          name_en: "",
        },
        image: null,
      });
      setIsLoading(false);
      return goBack();
    } else if (
      updateBrandingData?.updateBranding &&
      !updateBrandingData?.updateBranding?.success
    ) {
      errorMessage({
        message:
          updateBrandingData?.updateBranding?.error?.message ||
          "Something went wrong!. Try again",
        duration: 3000,
      });
      setIsLoading(false);
    }
  }, [updateBrandingData]);

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
    setIsLoading(true);
    const body = {
      id: formData?.id,
      name: formData?.name,
      image: formData?.image,
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

    try {
      await updateBranding({
        variables: {
          data: body,
        },
      });
    } catch (err) {
      console.error("Error creating brand:", err);
    }
  };

  const goBack = () => {
    router.back();
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
          { label: "Edit brand", value: "/admin/brand/brand-id" },
        ]}
      />
      <form
        className="w-full mx-auto p-6 bg-white rounded shadow-md mt-4"
        onSubmit={handleSubmit}
      >
        <h2 className="text-lg font-bold text-gray-500 mb-4">Update Brand</h2>

        <div className="flex space-x-4">
          <div>
            <div className="mt-4">
              <label className="block text-sm text-gray-500 mb-2">
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
                </div>
              ))}
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

export default UpdateBrandPage;
