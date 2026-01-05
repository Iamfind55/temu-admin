"use client";

import React from "react";
import Image from "next/image";

// utils, hooks
import { useSelector, useDispatch } from "react-redux";
import { useMutation } from "@apollo/client";
import { useToast } from "@/utils/toast";

// components
import Textfield from "@/components/textField";
import DatePicker from "@/components/datePicker";
import { IEmployee } from "@/types/employee";
import { MUTATION_UPDATE_EMPLOYEE } from "@/api/employee";
import { CLOUDINARY_URL, UPLOAD_PRESET } from "@/constants/adminData";
import { login } from "@/redux/slice/authSlice";
import Loading from "@/components/loading";

export default function Profile() {
  const dispatch = useDispatch();
  const { successMessage, errorMessage } = useToast();
  const [imageLoading, setImageLoading] = React.useState<boolean>(true);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [selectedImage, setSelectedImage] = React.useState<File | null>(null);
  const [profileData, setProfileData] = React.useState<IEmployee>({
    id: "",
    dob: "",
    email: "",
    image: "",
    status: "",
    lastName: "",
    username: "",
    password: "",
    firstName: "",
    created_at: "",
  });

  const { admin } = useSelector((state: any) => state.auth);
  const [updateEmployee] = useMutation(MUTATION_UPDATE_EMPLOYEE);

  React.useEffect(() => {
    if (admin) {
      setProfileData({
        id: admin.id || "",
        dob: admin.dob || "",
        firstName: admin.firstName || "",
        lastName: admin.lastName || "",
        image: admin.image || "",
        email: admin.email || "",
        status: admin.status || "",
        created_at: admin.created_at || "",
        username: admin.username || "",
        password: admin.password || "",
      });
    }
  }, [admin]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileData((prev) => ({
          ...prev,
          image: reader.result as string,
        }));
      };
      reader.readAsDataURL(file);
      setImageLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let imageUrl = profileData.image;

      // Upload image to Cloudinary if a new image is selected
      if (selectedImage) {
        const formData = new FormData();
        formData.append("file", selectedImage);
        formData.append("upload_preset", UPLOAD_PRESET);

        const response = await fetch(CLOUDINARY_URL, {
          method: "POST",
          body: formData,
        });

        const data = await response.json();
        if (data.secure_url) {
          imageUrl = data.secure_url;
        }
      }

      // Update employee profile
      const result = await updateEmployee({
        variables: {
          data: {
            id: profileData.id,
            firstName: profileData.firstName,
            lastName: profileData.lastName,
            dob: profileData.dob,
            image: imageUrl,
          },
        },
      });

      if (result.data?.updateStaff?.success) {
        // Update Redux store with new data
        dispatch(
          login({
            ...admin,
            firstName: profileData.firstName,
            lastName: profileData.lastName,
            dob: profileData.dob,
            image: imageUrl,
          })
        );

        successMessage({
          message: "Profile updated successfully!",
          duration: 3000,
        });
        setSelectedImage(null);
      } else {
        errorMessage({
          message: result.data?.updateStaff?.error?.message || "Update failed",
          duration: 3000,
        });
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      errorMessage({
        message: "Something went wrong. Please try again.",
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-start justify-center flex-col gap-6">
      <form onSubmit={handleSubmit} className="border w-full px-4 py-6 rounded bg-white">
        <div className="flex items-start justify-center flex-col gap-4">
          <h3 className="font-bold text-gray-500">Update admin profile:</h3>
          <div className="flex items-start justify-start gap-4 text-gray-500">
            <div>
              <Image
                src={
                  profileData.image ||
                  "https://res.cloudinary.com/dvh8zf1nm/image/upload/v1738860057/default-image_uwedsh.webp"
                }
                width={80}
                height={80}
                alt="Image preview"
                className={`max-w-full h-auto border rounded transition-opacity duration-200 ${
                  imageLoading ? "opacity-0" : "opacity-100"
                }`}
                onLoad={() => setImageLoading(false)}
              />
            </div>
            <div className="flex items-start justify-start flex-col gap-3">
              <label className="block text-gray-500 text-xs">
                Upload new profile image:
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-xs file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>
          </div>
        </div>
        <div className="w-full grid grid-cols-2 gap-2 lg:grid-cols-2 mt-4">
          <Textfield
            name="firstName"
            id="firstName"
            title="First name"
            required
            color="text-gray-500"
            value={profileData.firstName}
            onChange={handleChange}
          />
          <Textfield
            name="lastName"
            id="lastName"
            title="Last name"
            required
            color="text-gray-500"
            value={profileData.lastName}
            onChange={handleChange}
          />
          <Textfield
            name="email"
            id="email"
            title="Email"
            required
            color="text-gray-500"
            value={profileData.email}
            readOnly={true}
          />
          <DatePicker
            name="dob"
            title="Date of birth"
            value={
              profileData.dob
                ? new Date(profileData.dob).toISOString().split("T")[0]
                : ""
            }
            required
            className="py-1"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setProfileData((prev) => ({ ...prev, dob: e.target.value }))
            }
          />
          <Textfield
            name="username"
            id="username"
            title="Username"
            required
            color="text-gray-500"
            value={profileData.username}
            readOnly={true}
          />
          <Textfield
            name="password"
            id="password"
            title="Password"
            required
            color="text-gray-500"
            value={profileData.password}
            readOnly={true}
          />
        </div>
        <div className="flex justify-end mt-6">
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? "Updating..." : "Update Profile"}
          </button>
        </div>
      </form>
      {isLoading && <Loading />}
    </div>
  );
}
