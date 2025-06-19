"use client";

import React from "react";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  UserCircle,
  Upload,
  ClipboardCheck,
  LogOut,
} from "lucide-react";
import { callToaster } from "@/lib/toaster";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const [isSidebarExpanded, setIsSidebarExpanded] = React.useState(true);
  const toggleSidebar = () => {
    setIsSidebarExpanded((prev) => !prev);
    console.log("Sidebar toggled:", !isSidebarExpanded);
  };
  const pathname = usePathname();

  const logout = () => {
    localStorage.clear();
    callToaster("success", "Logout Success");
    window.location.href = "/sign-in";
  };

  const linkClasses = (routeMatch: string | string[]) => {
    const isActive = Array.isArray(routeMatch)
      ? routeMatch.some((r) => pathname?.includes(r))
      : pathname?.includes(routeMatch);
    return `flex flex-row justify-start items-center w-full max-sm:w-fit px-[16px] hover:bg-[var(--SidebarHover)] max-sm:px-[10px] rounded-[6px] py-[8px] cursor-pointer overflow-x-hidden ${
      isActive ? "bg-[var(--SidebarActive)]" : "bg-transparant"
    }`;
  };

  const iconClasses = (routeMatch: string | string[]) => {
    const isActive = Array.isArray(routeMatch)
      ? routeMatch.some((r) => pathname?.includes(r))
      : pathname?.includes(routeMatch);
    return `w-10 h-10 max-sm:w-5 max-sm:h-5 overflow-visible ${
      isActive ? "text-[var(--MainButton)]" : "text-[var(--TextSecondary)]"
    }`;
  };

  const textClasses = (routeMatch: string | string[]) => {
    const isActive = Array.isArray(routeMatch)
      ? routeMatch.some((r) => pathname?.includes(r))
      : pathname?.includes(routeMatch);
    return `text-[20px] font-normal ml-[8px] max-sm:hidden transition-all duration-300 ease-in-out transform ${
      isActive ? "text-[var(--MainButton)]" : "text-[var(--TextSecondary)]"
    } ${isSidebarExpanded ? "opacity-100" : "opacity-0"}`;
  };
  return (
    <div
      className={`border-r bg-[var(--CardBackground)] border border-[var(--Border)] shadow transition-all duration-300 ease-in-out transform sm:flex h-[100dvh] sticky max-sm:w-[100px] top-0 z-50 ${
        isSidebarExpanded ? "w-[400px]" : "w-[125px]"
      }`}
    >
      <aside className="flex h-full flex-col w-full break-words px-2 overflow-x-hidden columns-1">
        {/* Top */}
        <div className="mt-4 relative pb-2">
          <div className="flex flex-col space-y-1 items-center">
            {/* MENU HEADER */}
            <div className="flex flex-col items-center gap-[20px] w-full px-[18px] max-sm:px-[10px]">
              <div
                className={`flex flex-row items-center w-full max-sm:justify-center`}
              >
                <h5
                  className={`text-[var(--Logo)] text-[18px] text-center max-sm:text-[8px] font-bold ${
                    isSidebarExpanded ? "mr-[35px] max-sm:mr-0" : "mr-0"
                  }`}
                >
                  COURT VISION
                </h5>
              </div>

              {/* Menu Items */}
              <Link href="/user" className={linkClasses("/user")}>
                <UserCircle className={iconClasses("/user")} />
                <h2 className={textClasses("/user")}>Profile</h2>
              </Link>

              <Link href="/upload" className={linkClasses("/upload")}>
                <Upload className={iconClasses("/upload")} />
                <h2 className={textClasses("/upload")}>Upload</h2>
              </Link>

              <Link
                href="/analyze"
                className={linkClasses(["/analyze", "/detail-analyze"])}
              >
                <ClipboardCheck
                  className={iconClasses(["/analyze", "/detail-analyze"])}
                />
                <h2 className={textClasses(["/analyze", "/detail-analyze"])}>
                  Analyze
                </h2>
              </Link>
            </div>
          </div>
        </div>
        {/* Bottom */}
        <div className="bottom-0 mt-auto whitespace-nowrap mb-1 transition duration-200 block">
          <div className="border border-t-1 border-[var(--FormDefault)] mb-3"></div>
          {/* Logout */}
          <div className="flex flex-col items-center gap-[20px] w-full px-[18px] max-sm:px-[10px] mb-[10px]">
            <div
              onClick={logout}
              className="flex flex-row items-center w-full max-sm:w-fit px-[18px] max-sm:px-[10px] cursor-pointer rounded-[6px] bg-[var(--Danger)] py-[8px] hover:bg-[var(--DangerHover)] hover:scale-95"
            >
              <LogOut className="w-10 h-10 max-sm:w-5 max-sm:h-5 text-white overflow-visible" />
              <h2
                className={`text-white text-[20px] font-normal ml-[8px] max-sm:hidden transition-all duration-300 ease-in-out transform ${
                  isSidebarExpanded ? "opacity-100" : "opacity-0"
                }`}
              >
                Sign Out
              </h2>
            </div>
          </div>
        </div>
      </aside>
      <div className="relative max-sm:hidden">
        <button
          type="button"
          className="absolute top-[0px] right-[-25px] flex h-[40px] w-[40px] items-center justify-center rounded-r-2xl bg-[var(--CardBackground)] text-black hover:scale-105 transition-shadow duration-300 ease-in-out cursor-pointer"
          onClick={toggleSidebar}
        >
          {isSidebarExpanded ? (
            <ChevronLeft size={30} />
          ) : (
            <ChevronRight size={30} />
          )}
        </button>
      </div>
    </div>
  );
}
