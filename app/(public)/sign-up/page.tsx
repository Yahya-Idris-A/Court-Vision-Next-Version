"use client";

import React, { useState } from "react";
import AuthenticationCard from "@/components/cards/authentication";
import Carousel from "@/components/partials/carousel";
import { Eye, EyeOff } from "lucide-react";
import * as authService from "@/services/authServices";

const slides = [
  { src: "/carousel/Content-1.png", alt: "Slide 1" },
  { src: "/carousel/Content-2.png", alt: "Slide 2" },
  { src: "/carousel/Content.png", alt: "Slide 3" },
];

const SignUp: React.FC = () => {
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };
  const toggleConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    if (userData.password !== confirmPassword) {
      alert("Password tidak cocok!");
      setIsLoading(false);
      return;
    } else {
      try {
        const response = await authService.signup(userData);
        console.log("Sign Up Success:", response);

        localStorage.setItem("token", response.data.token);
        console.log("Token:", response.data.token);
        window.location.href = "/user";
      } catch (error) {
        console.error("Sign Up failed:", error);
        alert("Sign Up gagal. Cek email atau password!");
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="mx-[80px] max-lg:mx-[20px] py-[120px] max-lg:py-[30px] h-[100dvh] flex items-center">
      <AuthenticationCard
        authType="Create an Account"
        carouselSlot={<Carousel slides={slides} />}
        formSlot={
          <form
            onSubmit={handleSubmit}
            className="flex flex-col justify-center w-full gap-[15px]"
          >
            <input
              className="border border-[var(--FormDefault)] rounded px-3 py-2 h-[60px] text-[24px] text-[var(--MainText)]"
              type="username"
              required
              placeholder="Username"
              value={userData.name}
              onChange={(e) =>
                setUserData({ ...userData, name: e.target.value })
              }
            />
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
            <div className="relative">
              <input
                className="w-full border border-[var(--FormDefault)] rounded px-3 py-2 h-[60px] text-[24px] text-[var(--MainText)]"
                type={showConfirmPassword ? "text" : "password"}
                required
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <span
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer text-sm"
                onClick={toggleConfirmPassword}
              >
                {showConfirmPassword ? <Eye /> : <EyeOff />}
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
                "Create account"
              )}
            </button>
            <p className="text-[var(--TextSecondary)] text-[15px] text-center leading-[20px]">
              By clicking the Sign Up button you agree to our Term and Condition
              and Privacy Policy
            </p>
          </form>
        }
        authChoiceSlot={
          <div className="flex flex-col w-full max-xl:items-center items-start max-xl:mb-[20px]">
            <span className="text-[var(--TextSecondary)] text-[18px] max-lg:text-[12px] font-medium">
              Already have an account?{" "}
              <a
                href="/sign-in"
                className="text-[var(--MainButton)] hover:underline"
              >
                Sign In
              </a>
            </span>
          </div>
        }
      />
    </div>
  );
};

export default SignUp;
