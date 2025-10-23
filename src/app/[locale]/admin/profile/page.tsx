"use client";

import React from "react";
import Image from "next/image";

// utils, hooks
import { useSelector } from "react-redux";

// components
import Textfield from "@/components/textField";
import DatePicker from "@/components/datePicker";
import { IEmployee } from "@/types/employee";

export default function Profile() {
  const [imageLoading, setImageLoading] = React.useState<boolean>(true);
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

  return (
    <div className="flex items-start justify-center flex-col gap-6">
      <div className="border w-full px-4 py-6 rounded bg-white">
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
            readOnly={true}
          />
          <Textfield
            name="lastName"
            id="lastName"
            title="Last name"
            required
            color="text-gray-500"
            value={profileData.lastName}
            readOnly={true}
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
            name="birthday"
            title="Date of birth"
            value={
              profileData.dob
                ? new Date(profileData.dob).toISOString().split("T")[0]
                : ""
            }
            required
            className="py-1"
            readonly={true}
          />
          <Textfield
            name="username"
            id="username"
            title="Username"
            required
            color="text-gray-500"
            value={profileData.email}
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
      </div>
    </div>
  );
}
