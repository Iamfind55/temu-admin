"use client";

import { useRouter } from "@/i18n/navigation";
import { useEffect, useState } from "react";
import { useMutation } from "@apollo/client";

// components
import Loading from "@/components/loading";
import IconButton from "@/components/iconButton";
import Breadcrumb from "@/components/breadCrumb";

// APIs
import { UPDATE_BANNER } from "@/api/banner";
import { useTranslations } from "next-intl";

// utils and hooks
import { useToast } from "@/utils/toast";
import { IBannerFormData } from "@/types/banner";
import { useBannerFilters } from "../hook/useBannerFilters";
import { CLOUDINARY_URL, UPLOAD_PRESET } from "@/constants/adminData";

const UpdateBrandPage = ({ params }: { params: any }) => {
  const { successMessage, errorMessage } = useToast();
  const router = useRouter();

  const [updateBanner, { data: updateBannerData }] = useMutation(UPDATE_BANNER);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<File | null>();
  const [formData, setFormData] = useState<IBannerFormData>({
    name: "",
    image: null,
    link_url: "",
    position: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { bannerData, handleSelectBanner } = useBannerFilters();

  useEffect(() => {
    if (bannerData) setFormData(bannerData?.getBanner?.data);
  }, [bannerData]);

  useEffect(() => {
    const getParams = async () => {
      const { id: bannerId } = await params;
      if (bannerId) handleSelectBanner(bannerId);
    };
    getParams();
  }, [params]);

  useEffect(() => {
    if (updateBannerData?.updateBanner?.success) {
      successMessage({
        message: "Update brand successful!.",
        duration: 3000,
      });
      return router.back();
    } else if (
      updateBannerData?.updateBanner &&
      !updateBannerData?.updateBanner?.success
    ) {
      errorMessage({
        message: "Something went wrong!. Try again",
        duration: 3000,
      });
    }
  }, [updateBannerData]);

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

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Validate image
    if (!selectedImage && !formData?.image) {
      newErrors.image = "Image is required";
    }

    if (!formData?.position) {
      newErrors.position = "Position is required";
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
      await updateBanner({
        variables: {
          data: body,
        },
      });

      setFormData({
        name: "",
        image: null,
        link_url: "",
        position: "",
      });
    } catch (err) {
      console.error("Error creating brand:", err);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: string
  ) => {
    const { value } = e.target;
    const changeValue = { [field]: value };
    setFormData({ ...formData, ...changeValue });
  };

  return (
    <>
      <Breadcrumb
        items={[
          { label: "Admin dashboard", value: "/admin" },
          { label: "Banner", value: "/admin/banner" },
          { label: "Edit", value: "/admin/banner/dfgsdfgsdgsd" },
        ]}
      />
      <form
        className="w-full mt-4 mx-auto p-6 bg-white rounded shadow-md"
        onSubmit={handleSubmit}
      >
        <h2 className="text-md font-bold text-gray-500 mb-4">Update Brand</h2>

        <div className="flex space-x-4">
          <div className="mt-4">
            <label className="block text-sm text-gray-600 mb-2">
              Banner image
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
            {errors.image && (
              <p className="text-red-500 text-sm">{errors.image}</p>
            )}
          </div>

          <div className="w-full">
            <div className="mt-2">
              <label className="block text-sm text-gray-600">{`Name`}</label>
              <input
                type="text"
                name={`name`}
                value={formData.name}
                onChange={(e) => handleInputChange(e, "name")}
                className="mt-1 block w-full px-4 py-2 text-sm border rounded-md text-gray-500"
                placeholder="Name..."
              />
            </div>
            <div className="mt-2">
              <label className="block text-sm text-gray-600">{`Link url`}</label>
              <input
                type="text"
                name={`link_url`}
                value={formData.link_url}
                onChange={(e) => handleInputChange(e, "link_url")}
                className="mt-1 block w-full px-4 py-2 text-sm border rounded-md text-gray-500"
                placeholder="Link url..."
              />
            </div>
            <div className="mt-2">
              <label className="block text-sm text-gray-600">{`Position`}</label>
              <div className="w-full">
                <select
                  name="position"
                  value={formData.position} // Set the selected value
                  onChange={(e: any) => handleInputChange(e, "position")}
                  className="mt-1 border px-4 py-[8px] text-gray-400 text-sm rounded-md"
                >
                  <option value="">Select a position</option>
                  <option value={"1"}>Position 1</option>
                  <option value={"2"}>Position 2</option>
                  <option value={"3"}>Position 3</option>
                  <option value={"4"}>Position 4</option>
                  <option value={"5"}>Position 5</option>
                </select>
                {errors.position && (
                  <p className="text-red-500 text-sm">{errors.position}</p>
                )}
              </div>
            </div>

            <IconButton
              icon={isLoading && <Loading />}
              className="w-2/5 rounded bg-primary text-white p-2 bg-base text-xs mt-2"
              title="Update Now"
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
