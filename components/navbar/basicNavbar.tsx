"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { Menu, X, LogIn } from "lucide-react";
import styles from "./basicNavbar.module.css";
import Image from "next/image";

export default function Navbar() {
  const [user, setUser] = useState<string | null>(null);
  const navbarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setUser(localStorage.getItem("token"));
  }, []);

  return (
    <nav id="navbar" className={`${styles.navbar}`} ref={navbarRef}>
      <input type="checkbox" id="sidebar-active" className="hidden" />
      <label id="overlay" htmlFor="sidebar-active" />
      <div className="flex flex-row justify-between items-center w-full">
        <Link href="/home" className="h-full flex items-center mr-auto">
          <Image
            src="/companyLogo/Logo.png"
            alt="Logo"
            width={44}
            height={44}
            className="object-cover size-[44px]"
          />
        </Link>
        <label
          htmlFor="sidebar-active"
          className="hidden max-sm:block cursor-pointer"
        >
          <Menu className="text-[40px] text-white" />
        </label>
      </div>

      <div className={`${styles.linksContainer}`}>
        <label
          htmlFor="sidebar-active"
          className="hidden pt-[20px] max-sm:block cursor-pointer"
        >
          <X className="text-[40px] text-white" />
        </label>

        {["Home", "Features", "Contact"].map((page) => (
          <Link
            key={page}
            href="/home"
            className="hover:text-[#FD6A2A] text-[20px] font-semibold rounded-[8px] h-full flex items-center cursor-pointer max-sm:h-auto max-sm:hover:bg-[#FD6A2A] max-sm:hover:text-white max-sm:w-full max-sm:py-2.5 max-sm:px-4.5 text-white"
          >
            {page}
          </Link>
        ))}

        {!user ? (
          <div className="max-sm:w-full">
            <Link
              href="/sign-in"
              className="bg-[#FD6A2A] text-white px-4.5 py-2.5 rounded-[8px] flex gap-[8px] text-[20px] font-semibold items-center cursor-pointer max-sm:h-auto max-sm:w-full max-sm:justify-center whitespace-nowrap"
            >
              Sign In
              <LogIn className="text-[24px] max-sm:text-[20px] text-white" />
            </Link>
          </div>
        ) : (
          <div className="max-sm:w-full">
            <Link
              href="/profile/dashboard"
              className="bg-[#FD6A2A] text-white px-4.5 py-2.5 rounded-[8px] flex gap-[8px] text-[20px] font-semibold items-center cursor-pointer max-sm:h-auto max-sm:w-full max-sm:justify-center"
            >
              Dashboard
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
