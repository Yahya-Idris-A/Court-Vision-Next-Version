"use client";

import React, { useState } from "react";
import AuthenticationCard from "@/components/cards/authentication";
import { Eye, EyeOff } from "lucide-react";
import * as authService from "@/services/authServices";

const SignIn: React.FC = () => {
  const [userData, setUserData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await authService.signin(userData);
      console.log("Login Success:", response);

      localStorage.setItem("token", response.data.token);
      console.log("Token:", response.data.token);
      window.location.href = "/user";
    } catch (error: any) {
      console.error("Login failed:", error);
      alert("Login gagal. Cek email atau password!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-[5%] md:mx-[30%] my-[16px] md:my-[32px]">
      <AuthenticationCard
        authType="Sign In"
        formSlot={
          <form
            onSubmit={handleSubmit}
            className="flex flex-col justify-center w-full"
          >
            <input
              className="mb-[22px] border border-gray-300 rounded px-3 py-2 text-[14px] text-black"
              type="email"
              required
              placeholder="Email"
              value={userData.email}
              onChange={(e) =>
                setUserData({ ...userData, email: e.target.value })
              }
            />
            <div className="relative mb-[22px]">
              <input
                className="w-full border border-gray-300 rounded px-3 py-2 text-[14px] text-black"
                type={showPassword ? "text" : "password"}
                required
                placeholder="Password"
                value={userData.password}
                onChange={(e) =>
                  setUserData({ ...userData, password: e.target.value })
                }
              />
              <span
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer text-sm"
                onClick={togglePassword}
              >
                {showPassword ? <Eye /> : <EyeOff />}
              </span>
            </div>
            <label className="flex items-center mb-[22px] text-[14px] font-semibold text-[#667085]">
              <input type="checkbox" className="mr-2" />
              Remember me
            </label>
            <button
              type="submit"
              className="bg-[#FD6A2A] py-[12px] rounded-[8px] text-white text-[16px] font-semibold cursor-pointer"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-white border-opacity-50"></div>
                </div>
              ) : (
                "Sign In"
              )}
            </button>
          </form>
        }
        authChoiceSlot={
          <div className="flex flex-col w-full items-center mt-[32px]">
            <span className="text-black text-[15px] font-normal text-center">
              Don't have an account?{" "}
              <a
                href="/sign-up"
                className="text-[#403D91] hover:underline ml-1"
              >
                Sign Up
              </a>
            </span>
          </div>
        }
      />
    </div>
  );
};

export default SignIn;
