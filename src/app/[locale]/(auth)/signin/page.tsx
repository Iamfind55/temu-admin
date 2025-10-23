"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useMutation } from "@apollo/client";

// components
import { NextIcon } from "@/icons/page";
import Textfield from "@/components/textField";
import IconButton from "@/components/iconButton";
import Password from "@/components/passwordTextField";

// types and untils
import { ILogins } from "@/types/login";
import { useToast } from "@/utils/toast";
import { useDispatch } from "react-redux";
import { ADMIN_SIGN_IN } from "@/api/auth";
import { login } from "@/redux/slice/authSlice";

export default function SignIn() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { successMessage, errorMessage } = useToast();
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [loginData, setLoginData] = React.useState<ILogins>({
    username: "",
    password: "",
  });

  const [shopSignIn] = useMutation(ADMIN_SIGN_IN);

  const handleLogin = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleSubmitForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    if (!loginData.username) {
      errorMessage({
        message: "Username or email is required!",
        duration: 2000,
      });
      setIsLoading(false);
      return;
    }
    if (!loginData.password) {
      errorMessage({
        message: "Password is required!",
        duration: 2000,
      });
      setIsLoading(false);
      return;
    }

    try {
      const { data } = await shopSignIn({
        variables: {
          where: {
            username: loginData?.username,
            password: loginData?.password,
          },
        },
      });

      if (data.staffLogin.success) {
        successMessage({
          message: "Login successful!",
          duration: 3000,
        });
        const res = data.staffLogin.data;

        dispatch(
          login({
            // ...res.data,
            id: res.data.id || "",
            firstName: res.data.firstName || "",
            lastName: res.data.lastName || "",
            username: res.data.username || "",
            email: res.data.email || "",
            phone_number: res.data.phone_number || "",
            dob: res.data.dob || "",
            image: res.data.image || "",
          })
        );

        document.cookie = `auth_token=${data.staffLogin.data.token}; path=/; max-age=3600`;
        router.push("/admin");
      } else {
        errorMessage({
          message: data.staffLogin.error?.message || "SignIn failed!",
          duration: 3000,
        });
      }
    } catch (err) {
      errorMessage({
        message: "Sorry. Unexpected error happend!",
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-white">
      <div className="h-auto w-full flex items-center justify-center">
        <div className="pt-20 w-full sm:border  sm:border-secondary sm:w-2/4 bg-white text-black h-auto flex items-center justify-center flex-col gap-6 rounded py-6">
          <Image
            src="https://res.cloudinary.com/dwzjfryoh/image/upload/v1760459478/Temu_logo_icon_h3c98r.png"
            alt="Logo"
            width={100}
            height={150}
          />
          <form className="w-4/5 mt-10" onSubmit={handleSubmitForm}>
            <div className="my-5">
              <Textfield
                placeholder="Enter username or email...."
                title="Username or email"
                name="username"
                type="text"
                id="email"
                required
                onChange={handleLogin}
              />
            </div>

            <Password
              placeholder="Enter password...."
              title="Password"
              name="password"
              id="password"
              required
              onChange={handleLogin}
            />

            <div className="my-5">
              <IconButton
              className="rounded text-white p-2 bg-neon_pink w-full py-4 text-xs"
              icon={isLoading ? "" : <NextIcon size={22} />}
              isFront={isLoading ? true : false}
              title={isLoading ? "Loging...." : "Login"}
              type="submit"
            />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
