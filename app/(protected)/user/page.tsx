"use client";
import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import classNames from "classnames";
import "react-datepicker/dist/react-datepicker.css";
import Uppy from "@uppy/core";
import type { UppyFile as GenericUppyFile } from "@uppy/core";
import AwsS3 from "@uppy/aws-s3";
import { ImagePlus, User, Mail, Save } from "lucide-react";
import * as authService from "@/services/authServices";
import * as updateUser from "@/services/updateUserServices";
import * as uploadService from "@/services/uploadServices";

type UppyFile = GenericUppyFile<
  Record<string, unknown>,
  Record<string, unknown>
>;

const page = () => {
  interface FileInfo {
    id: string;
    name: string;
    size: number;
    type: string;
  }

  const [selectedImage, setSelectedImage] = useState("/user/user.svg");
  const [selectedImageName, setSelectedImageName] = useState("");
  const [isLoadingUserData, setIsLoadingUserData] = useState(true);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [photo_url, setPhoto_url] = useState("");

  const selectedFileRef = useRef<FileInfo | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
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
        setIsUploading(true);
        if (progress.bytesTotal !== null) {
          setUploadProgress(
            Math.floor((progress.bytesUploaded / progress.bytesTotal) * 100)
          );
        }
      }
    });

    // Uppy events saat upload video telah suskses
    uppyInstance.on("upload-success", (file, response) => {
      setIsUploading(false);
      setUploadSuccess(true);
      setUploadProgress(100);
      setPhoto_url(response.uploadURL || "");
      console.log("Upload successful to:", response.uploadURL);
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
      console.log("Sukses");
    } catch (error) {
      console.log("Update Failed");
      console.error(error);
    }
    console.log("Data disimpan:", {
      userName,
      userEmail,
      photo_url,
    });
  };
  return (
    <div className="flex flex-col items-center gap-[10px] w-full mt-[32px] mr-[20px] max-sm:mt-[16px]">
      {/* Header */}
      <div className="flex flex-row items-center justify-start w-full p-[20px] bg-white stroke-[#667085] shadow">
        <p className="text-[18px] text-[#4B465C] font-semibold">My Profile</p>
      </div>
      {/* Form */}
      <div className="flex flex-col items-center justify-start w-full p-[32px] bg-white stroke-[#667085] shadow">
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
                className="w-36 h-36 mb-5 rounded-full object-cover"
                // Opsional: Tambahkan key untuk memaksa re-render jika src berubah dari/ke default
                key={selectedImage}
                // Fallback jika URL gambar dari API error (misal broken link)
                onError={() => {
                  if (selectedImage !== "/user/user.svg") {
                    setSelectedImage("/user/user.svg");
                  }
                }}
              />
            )
          )}

          {selectedImageName && (
            <div className="px-2 border-2 border-orange-500 rounded mb-5">
              <span className="text-gray-500">
                Selected image: {selectedImageName}
              </span>
            </div>
          )}

          <div
            className={classNames(
              "drop-zone border-2 border-dashed rounded-[8px] px-[40px] py-[20px] w-full cursor-pointer mb-[15px] transition-all duration-300 ease-in text-center",
              isDragging ? "border-[#FD6A2A]" : "border-[#9e9e9e]",
              "hover:border-[#FD6A2A]"
            )}
            onClick={triggerFileInput}
          >
            <div className="flex flex-col justify-center items-center">
              <div className="mb-[10px]">
                <ImagePlus size={50} className="text-[#FD6A2A] text-[40px]" />
              </div>
              <p className="!text-[#FD6A2A] !text-[16px] m-0">
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
                  <ImagePlus className="text-[#FD6A2A] w-[40px] h-[40px] max-sm:w-[30px] max-sm:h-[30px]" />
                </div>
                <span className="grow truncate text-left text-black">
                  {selectedFileRef.current?.name}
                </span>
                <span className="ml-[10px] text-[14px] text-black">
                  {uploadProgress}%
                </span>
              </div>
              <div className="overflow-hidden rounded-[10px] border border-[#403D91] h-[10px]">
                <div
                  className="bg-[#FD6A2A] h-full transition-all"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          <div className="flex flex-col gap-4 w-full">
            <div className="flex items-center rounded py-2 relative">
              <User className="text-gray-400 mr-2 absolute ml-1" />
              <input
                type="text"
                className="w-full border border-gray-300 rounded px-3 py-2 text-[14px] text-black pl-8"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
              />
              <label
                className={`placeholder absolute left-[40px] text-[14px] px-[5px] pointer-events-none text-gray-400 transition-transform duration-300 ease-in-out 
                  ${userName ? "top-[-3px] bg-white" : ""}`}
              >
                Username
              </label>
            </div>

            <div className="flex items-center rounded py-2 relative">
              <Mail className="text-gray-400 mr-2 absolute ml-1" />
              <input
                type="email"
                className="w-full border border-gray-300 rounded px-3 py-2 text-[14px] text-black pl-8"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
              />
              <label
                className={`placeholder absolute left-[40px] text-[14px] px-[5px] pointer-events-none text-gray-400 transition-transform duration-300 ease-in-out 
                  ${userEmail ? "top-[-3px] bg-white" : ""}`}
              >
                Email
              </label>
            </div>
          </div>

          <div className="flex justify-end w-full mt-5">
            <button
              className="bg-orange-500 text-white px-6 py-2 rounded-[8px] flex items-center"
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

export default page;
