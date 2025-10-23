"use client";

import { useEffect, useState } from "react";
import { useMutation } from "@apollo/client";
import IconButton from "@/components/iconButton";
import { useTranslations } from "next-intl";
import Loading from "@/components/loading";
import { useToast } from "@/utils/toast";
import { CREATED_BANNER } from "@/api/banner";
import { IBannerFormData } from "@/types/banner";
import { CLOUDINARY_URL, UPLOAD_PRESET } from "@/constants/adminData";

const AddBannerPage = () => {
  const g = useTranslations("globals");
  const { successMessage, errorMessage } = useToast();

  const [createBanner, { data: createBannerData }] =
    useMutation(CREATED_BANNER);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState<IBannerFormData>({
    name: "",
    image: null,
    link_url: "",
    position: "",
  });

  const [selectedImage, setSelectedImage] = useState<File | null>();

  useEffect(() => {
    if (createBannerData?.createBanner?.success) {
      return successMessage({
        message: "Create banner successful!.",
        duration: 3000,
      });
    } else if (
      createBannerData?.createBanner &&
      !createBannerData?.createBanner?.success
    ) {
      errorMessage({
        message: "Something went wrong!. Try again",
        duration: 3000,
      });
    }
  }, [createBannerData]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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

    setFormData({
      name: "",
      image: null,
      link_url: "",
      position: "",
    });

    try {
      await createBanner({
        variables: {
          data: body,
        },
      });
    } catch (err) {
      console.error("Error creating bannering:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangeInput = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: string
  ) => {
    const { value } = e.target;
    const changeValue = { [field]: value };
    setFormData({ ...formData, ...changeValue });
  };

  return (
    <form
      className="w-3/4 mx-auto p-6 bg-white rounded shadow-md"
      onSubmit={handleSubmit}
    >
      <h2 className="text-2xl font-semibold text-gray-700 mb-4">Add banner</h2>

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
        </div>

        <div className="w-full">
          <div className="mt-2">
            <div>
              <label className="block text-sm text-gray-600">{`Name`}</label>
              <input
                type="text"
                name={`name`}
                value={formData.name}
                onChange={(e) => handleChangeInput(e, "name")}
                className="mt-1 block w-full px-4 py-2 text-sm border rounded-md text-gray-500"
                placeholder="Name..."
              />
            </div>
          </div>
          <div className="mt-2">
            <div>
              <label className="block text-sm text-gray-600">{`Link url`}</label>
              <input
                type="text"
                name={`link_url`}
                value={formData.link_url}
                onChange={(e) => handleChangeInput(e, "link_url")}
                className="mt-1 block w-full px-4 py-2 text-sm border rounded-md text-gray-500"
                placeholder="Link url..."
              />
            </div>
          </div>
          <div className="mt-2">
            <div>
              <label className="block text-sm text-gray-600">{`Position`}</label>
              <input
                type="text"
                name={`position`}
                value={formData.position}
                onChange={(e) => handleChangeInput(e, "position")}
                className="mt-1 block w-full px-4 py-2 text-sm border rounded-md text-gray-500"
                placeholder="Position..."
              />
            </div>
          </div>

          <IconButton
            icon={isLoading && <Loading />}
            className="w-1/2 mt-4 rounded bg-primary text-white p-2 bg-base text-xs"
            title={g("_save_button")}
            isFront={true}
            type="submit"
            disabled={isLoading}
          />
        </div>
      </div>
    </form>
  );
};

export default AddBannerPage;
