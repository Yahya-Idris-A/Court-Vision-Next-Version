"use client";
import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import classNames from "classnames";
import "react-datepicker/dist/react-datepicker.css";
import Uppy from "@uppy/core";
import type { UppyFile as GenericUppyFile } from "@uppy/core";
import AwsS3 from "@uppy/aws-s3";
import { ImagePlus, User, Mail, Save } from "lucide-react";
import { callToaster } from "@/lib/toaster";
import * as authService from "@/services/authServices";
import * as updateUser from "@/services/updateUserServices";
import * as uploadService from "@/services/uploadServices";

type UppyFile = GenericUppyFile<
  Record<string, unknown>,
  Record<string, unknown>
>;

const Page = () => {
  interface FileInfo {
    id: string;
    name: string;
    size: number;
    type: string;
  }

  const [selectedImage, setSelectedImage] = useState("/user/user.svg");
  const [isLoadingUserData, setIsLoadingUserData] = useState(true);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [photo_url, setPhoto_url] = useState("");

  const selectedFileRef = useRef<FileInfo | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const uppyRef = useRef<Uppy | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getUserData = async () => {
    setIsLoadingUserData(true); // Mulai loading
    try {
      const data = await authService.getUser();
      setUserName(data?.name || "");
      setUserEmail(data?.email || "");
      setSelectedImage(data?.photo_url || "/user/user.svg");
    } catch (error) {
      console.error("Gagal mengambil data pengguna:", error);
      setSelectedImage("/user/user.svg");
    } finally {
      setIsLoadingUserData(false); // Selesai loading
    }
  };

  // Untuk input file
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  // Handle kalau input file manual
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      selectedFileRef.current = {
        id: crypto.randomUUID(),
        name: file.name,
        size: file.size,
        type: file.type,
      };
      uppyRef.current?.addFile({
        source: "file input",
        name: file.name,
        type: file.type,
        data: file,
      });
    }
  };

  useEffect(() => {
    getUserData();

    // Set header untuk upload video biar tidak error, kalau di set di awal nanti server tidak bisa membaca token
    uploadService.setHeaders();

    // Inisiasi Uppy
    const uppyInstance = new Uppy({
      id: "basketballUploader",
      autoProceed: true,
      restrictions: {
        maxFileSize: 10000000, // 10MB
        allowedFileTypes: [".jpg", ".jpeg", ".png", ".svg"],
        maxNumberOfFiles: 1,
      },
    });

    // Set Uppy biar bisa dipakai kalau input file manual tanpa drag and drop
    uppyRef.current = uppyInstance;

    // Logic upload makai AWS S3
    uppyInstance.use(AwsS3, {
      shouldUseMultipart: false,
      async getUploadParameters(file, options) {
        const result = await uploadService.getSignedUrl(
          file.name ?? "",
          file.type,
          options.signal
        );
        const { method, url } = result.data;
        return {
          method,
          url,
          fields: {},
          headers: {
            "Content-Type": file.type,
          },
        };
      },
    });

    // Uppy events saat file ditambahkan
    uppyInstance.on("file-added", (file: UppyFile) => {
      if (file && file.id && file.name && file.size && file.type) {
        selectedFileRef.current = {
          id: file.id,
          name: file.name,
          size: file.size,
          type: file.type,
        };
        setUploadProgress(0);
      }
    });

    // Uppy events saat upload sedang berprogress
    uppyInstance.on("upload-progress", (file, progress) => {
      if (selectedFileRef && file && selectedFileRef.current?.id === file.id) {
        if (progress.bytesTotal !== null) {
          setUploadProgress(
            Math.floor((progress.bytesUploaded / progress.bytesTotal) * 100)
          );
        }
      }
    });

    // Uppy events saat upload video telah suskses
    uppyInstance.on("upload-success", (file, response) => {
      setUploadProgress(100);
      setPhoto_url(response.uploadURL || "");
      console.log("Upload successful to:", response.uploadURL);
      callToaster("success", "Upload Profile Photo Success");
    });

    // Logic drag and drop file
    const dropZone = document.querySelector(".drop-zone");

    const handleDragOver = (e: DragEvent) => {
      e.preventDefault();
      setIsDragging(true);
    };

    const handleDragLeave = (e: DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
    };

    const handleDrop = (e: DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      if (e.dataTransfer?.files && e.dataTransfer.files.length > 0) {
        console.log(e.dataTransfer.files);

        const file = e.dataTransfer.files[0];
        selectedFileRef.current = {
          id: crypto.randomUUID(),
          name: file.name,
          size: file.size,
          type: file.type,
        };
        uppyInstance.addFile({
          source: "file input",
          name: file.name,
          type: file.type,
          data: file,
        });
        e.dataTransfer.clearData();
      }
    };
    // uppyInstance.cancelAll();

    if (dropZone) {
      dropZone.addEventListener("dragover", handleDragOver as EventListener);
      dropZone.addEventListener("dragleave", handleDragLeave as EventListener);
      dropZone.addEventListener("drop", handleDrop as EventListener);
    }

    return () => {
      if (dropZone) {
        dropZone.removeEventListener(
          "dragover",
          handleDragOver as EventListener
        );
        dropZone.removeEventListener(
          "dragleave",
          handleDragLeave as EventListener
        );
        dropZone.removeEventListener("drop", handleDrop as EventListener);
      }
    };
  }, []);

  const handleSave = () => {
    // Implementasi logika penyimpanan data
    try {
      updateUser.updateUserData(userName, userEmail, photo_url);
      callToaster("success", "User Update Success");
    } catch (error) {
      callToaster("error", "User Update Failed");
    }
  };
  return (
    <div className="flex flex-col items-center gap-[10px] w-full mt-[32px] mr-[20px] max-sm:mt-[16px]">
      {/* Header */}
      <div className="flex flex-row items-center justify-start w-full p-[20px] bg-[var(--CardBackground)] border border-[var(--Border)] shadow">
        <p className="text-[18px] text-[var(--MainText)] font-semibold">
          My Profile
        </p>
      </div>
      {/* Form */}
      <div className="flex flex-col items-center justify-start w-full p-[32px] bg-[var(--CardBackground)] border border-[var(--Border)] shadow">
        {/* <FormProfile /> */}
        <div className="flex flex-col items-center w-full p-4">
          {isLoadingUserData ? (
            // Skeleton Loader
            <div
              className="w-36 h-36 mb-5 rounded-full bg-gray-300 animate-pulse"
              aria-label="Memuat gambar profil..." // Untuk aksesibilitas
            ></div>
          ) : (
            selectedImage && (
              <Image
                // Jika w-36 dan h-36 adalah 9rem (144px jika 1rem=16px)
                // Sebaiknya width dan height di props sesuai dengan ukuran di className untuk performa optimal
                width={144}
                height={144}
                src={selectedImage}
                alt="Foto Profil"
                className="w-36 h-36 max-sm:w-25 max-sm:h-25 mb-5 rounded-full object-cover"
                // Opsional: Tambahkan key untuk memaksa re-render jika src berubah dari/ke default
                key={selectedImage}
                priority
                // Fallback jika URL gambar dari API error (misal broken link)
                onError={() => {
                  if (selectedImage !== "/user/user.svg") {
                    setSelectedImage("/user/user.svg");
                  }
                }}
              />
            )
          )}
          <div
            className={classNames(
              "drop-zone border-2 border-dashed rounded-[8px] px-[40px] py-[20px] w-full cursor-pointer mb-[15px] transition-all duration-300 ease-in text-center",
              isDragging
                ? "border-[var(--MainButton)]"
                : "border-[var(--FormDefault)]",
              "hover:border-[var(--MainButton)]"
            )}
            onClick={triggerFileInput}
          >
            <div className="flex flex-col justify-center items-center">
              <div className="mb-[10px]">
                <ImagePlus
                  size={50}
                  className="text-[var(--MainButton)] text-[40px]"
                />
              </div>
              <p className="!text-[var(--TextSecondary)] !text-[16px] m-0">
                Browse Image or Drag Here to Upload
              </p>
            </div>
            {/* Hidden file input */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              accept="image/*"
              className="hidden"
            />
            {/* Hidden Uppy Dashboard (used for file picking but not displayed) */}
            <div id="uppy-dashboard" className="hidden"></div>
          </div>
          {/* Upload progress */}
          {selectedFileRef.current && (
            <div className="px-[8px] py-[12px] mb-[15px] w-full">
              <div className="flex flex-row items-center mb-[6px]">
                <div className="mr-[10px]">
                  <ImagePlus className="text-[var(--MainButton)] w-[40px] h-[40px] max-sm:w-[30px] max-sm:h-[30px]" />
                </div>
                <span className="grow truncate text-left text-[var(--MainText)]">
                  {selectedFileRef.current?.name}
                </span>
                <span className="ml-[10px] text-[14px] text-[var(--MainText)]">
                  {uploadProgress}%
                </span>
              </div>
              <div className="overflow-hidden rounded-[10px] bg-[var(--SidebarActive)] border border-[var(--SidebarActive)] h-[10px]">
                <div
                  className="bg-[var(--MainButton)] h-full transition-all"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          <div className="flex flex-col gap-4 w-full">
            <div className="flex items-center rounded py-2 relative">
              <User className="text-[var(--TextSecondary)] mr-2 absolute ml-1" />
              <input
                type="text"
                className="w-full border border-[var(--FormDefault)] rounded px-3 py-2 text-[14px] text-[var(--MainText)] pl-8"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
              />
              <label
                className={`placeholder absolute left-[40px] text-[14px] px-[5px] pointer-events-none text-[var(--TextSecondary)] transition-transform duration-300 ease-in-out 
                  ${userName ? "top-[-3px] bg-white" : ""}`}
              >
                Username
              </label>
            </div>

            <div className="flex items-center rounded py-2 relative">
              <Mail className="text-[var(--TextSecondary)] mr-2 absolute ml-1" />
              <input
                type="email"
                className="w-full border border-[var(--FormDefault)] rounded px-3 py-2 text-[14px] text-[var(--MainText)] pl-8"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
              />
              <label
                className={`placeholder absolute left-[40px] text-[14px] px-[5px] pointer-events-none text-[var(--TextSecondary)] transition-transform duration-300 ease-in-out 
                  ${userEmail ? "top-[-3px] bg-white" : ""}`}
              >
                Email
              </label>
            </div>
          </div>

          <div className="flex justify-end w-full mt-5">
            <button
              className="bg-[var(--MainButton)] text-white px-[50px] py-2 rounded-[8px] flex items-center cursor-pointer hover:bg-[var(--ButtonHover)] max-sm:w-full max-sm:justify-center"
              onClick={handleSave}
            >
              <Save className="mr-2" />
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
