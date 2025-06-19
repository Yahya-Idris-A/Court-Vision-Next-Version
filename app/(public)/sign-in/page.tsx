"use client";

import React, { useState } from "react";
import AuthenticationCard from "@/components/cards/authentication";
import Carousel from "@/components/partials/carousel";
import { Eye, EyeOff } from "lucide-react";
import * as authService from "@/services/authServices";
import { callToaster } from "@/lib/toaster";

const slides = [
  { src: "/carousel/Content-1.png", alt: "Slide 1" },
  { src: "/carousel/Content-2.png", alt: "Slide 2" },
  { src: "/carousel/Content.png", alt: "Slide 3" },
];

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
    if (userData.email && userData.password) {
      setIsLoading(true);
      try {
        const response = await authService.signin(userData);
        callToaster("success", "Login Success");

        localStorage.setItem("token", response.data.token);
        window.location.href = "/user";
      } catch (error) {
        console.error("Login failed:", error);
        callToaster("error", "Login Failed");
      } finally {
        setIsLoading(false);
      }
    } else {
      callToaster("default", "Email and password must fill");
    }
  };

  return (
    <div className="mx-[80px] py-[120px] h-[100dvh] flex items-center">
      <AuthenticationCard
        authType="Welcome Back!"
        carouselSlot={<Carousel slides={slides} />}
        formSlot={
          <form
            onSubmit={handleSubmit}
            className="flex flex-col justify-center w-full gap-[40px]"
          >
            <input
              className="border border-[var(--FormDefault)] rounded px-3 py-2 h-[60px] text-[24px] text-[var(--MainText)]"
              type="email"
              required
              placeholder="Email"
              value={userData.email}
              onChange={(e) =>
                setUserData({ ...userData, email: e.target.value })
              }
            />
            <div className="relative">
              <input
                className="w-full border border-[var(--FormDefault)] rounded px-3 py-2 h-[60px] text-[24px] text-[var(--MainText)]"
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
            <button
              type="submit"
              className="bg-[var(--MainButton)] py-[12px] rounded-[8px] text-white text-[16px] font-semibold cursor-pointer"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-white"></div>
                </div>
              ) : (
                "Sign In"
              )}
            </button>
          </form>
        }
        authChoiceSlot={
          <div className="flex flex-col w-full items-start">
            <span className="text-[var(--TextSecondary)] text-[18px] font-medium">
              Don&apos;t have an account?
              <a
                href="/sign-up"
                className="text-[var(--MainButton)] hover:underline"
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
