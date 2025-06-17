"use client";
// import dependency
import React, { useEffect, useState, useRef } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Pencil, Calendar, Map, Video, CloudUpload } from "lucide-react";
import classNames from "classnames";
import Uppy from "@uppy/core";
import type { UppyFile as GenericUppyFile } from "@uppy/core";
import AwsS3 from "@uppy/aws-s3";
import DropTarget from "@uppy/drop-target";
import * as uploadService from "@/services/uploadServices";

type UppyFile = GenericUppyFile<
  Record<string, unknown>,
  Record<string, unknown>
>;

const Page = () => {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState<Date | null>(null);
  const [venue, setVenue] = useState("");
  const [video_url, setvideo_url] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  interface FileInfo {
    id: string;
    name: string;
    size: number;
    type: string;
  }
  const selectedFileRef = useRef<FileInfo | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const uppyRef = useRef<Uppy | null>(null);

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

  // Fungsi buat upload data analisis
  const startAnalysis = () => {
    if (uploadSuccess) {
      console.log("Starting analysis for:", selectedFileRef.current?.name);
      console.log("Title:", title);
      console.log("Venue:", venue);
      console.log("Date:", date);
      console.log("URL:", video_url);
      const dateUp = date?.toISOString().split("T")[0] ?? "";
      try {
        uploadService.uploadAllData(title, dateUp, venue, video_url);
        console.log("Sukses");
        window.location.href = "/analyze";
      } catch (error) {
        console.log("Gagal upload");
        console.error(error);
      }
    }
  };

  // Logic upload video
  useEffect(() => {
    // Set header untuk upload video biar tidak error, kalau di set di awal nanti server tidak bisa membaca token
    uploadService.setHeaders();

    // Inisiasi Uppy
    const uppyInstance = new Uppy({
      id: "basketballUploader",
      autoProceed: true,
      restrictions: {
        maxFileSize: 1000000000, // 1GB
        allowedFileTypes: [".mp4", ".mov", ".avi", ".mkv"],
        maxNumberOfFiles: 1,
      },
    });

    // Set Uppy biar bisa dipakai kalau input file manual tanpa drag and drop
    uppyRef.current = uppyInstance;

    // Logic upload makai AWS S3
    uppyInstance.use(AwsS3, {
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

      async createMultipartUpload(file) {
        const metadata: Record<string, string> = {};
        Object.keys(file.meta || {}).forEach((key) => {
          if (file.meta[key] != null) {
            metadata[key] = file.meta[key].toString();
          }
        });
        try {
          return await uploadService.createMultipartUpload(
            file.name ?? "",
            file.type,
            metadata
          );
        } catch (error) {
          console.error("Error creating multipart upload:", error);
          throw new Error("Failed to create multipart upload");
        }
      },
      async signPart(_file, options) {
        const { uploadId, key, partNumber, signal } = options;
        signal?.throwIfAborted();
        if (uploadId == null || key == null || partNumber == null) {
          throw new Error(
            "Cannot sign without a key, an uploadId, and a partNumber"
          );
        }
        try {
          return await uploadService.signPart(
            uploadId!,
            key,
            partNumber,
            signal
          );
        } catch (error) {
          console.error("Error signing part:", error);
          throw new Error("Failed to sign part");
        }
      },
      async listParts(_file, options) {
        const { uploadId, key, signal } = options;
        signal?.throwIfAborted();
        try {
          return await uploadService.listParts(uploadId!, key, signal);
        } catch (error) {
          console.error("Error listing parts:", error);
          throw new Error("Failed to list parts");
        }
      },
      async completeMultipartUpload(_file, options) {
        const { uploadId, key, signal, parts } = options;
        signal?.throwIfAborted();
        try {
          return await uploadService.completeMultipartUpload(
            uploadId!,
            key,
            parts,
            signal
          );
        } catch (error) {
          console.error("Error completing multipart upload:", error);
          throw new Error("Failed to complete multipart upload");
        }
      },
      async abortMultipartUpload(_file, options) {
        const { uploadId, key, signal } = options;
        try {
          return await uploadService.abortMultipartUpload(
            uploadId!,
            key,
            signal
          );
        } catch (error) {
          console.error("Error aborting multipart upload:", error);
          throw new Error("Failed to abort multipart upload");
        }
      },
    });

    // Dropzone support
    uppyInstance.use(DropTarget, {
      target: "#uppy-dashboard",
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
      setvideo_url(response.uploadURL || "");
      console.log("Upload successful to:", response.uploadURL);
    });

    // Uppy events saat upload video error
    uppyInstance.on("upload-error", (file, error) => {
      setIsUploading(false);
      console.error("Upload failed:", error);
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

  return (
    <div className="flex flex-col items-center gap-[10px] w-full mt-[32px] mr-[20px] max-sm:mt-[16px]">
      {/* Header */}
      <div className="flex flex-row items-center justify-start w-full p-[20px] bg-[var(--CardBackground)] border border-[var(--Border)] shadow">
        <p className="text-[18px] text-[var(--MainText)] font-semibold">
          Analyze Your Video
        </p>
      </div>
      {/* Form */}
      <div className="flex flex-col items-center justify-start w-full p-[32px] bg-[var(--CardBackground)] border border-[var(--Border)] shadow">
        <div className="flex flex-col gap-4 w-full">
          <div className="flex items-center rounded py-2 relative">
            <Pencil className="text-[var(--TextSecondary)] mr-2 absolute ml-1" />
            <input
              type="text"
              className="w-full border border-[var(--FormDefault)] rounded px-3 py-2 text-[14px] text-[var(--MainText)] pl-8"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <label
              className={`placeholder absolute left-[40px] text-[14px] px-[5px] pointer-events-none text-[var(--TextSecondary)] transition-transform duration-300 ease-in-out 
                  ${title ? "top-[-3px] bg-white" : ""}`}
            >
              Match Title
            </label>
          </div>

          <div className="flex flex-row max-sm:flex-col w-full gap-[32px] max-sm:gap-4 justify-between">
            <div className="flex items-center rounded py-2 w-full relative">
              <Calendar className="text-[var(--TextSecondary)] mr-2 absolute ml-1" />
              <DatePicker
                selected={date}
                onChange={(date: Date | null) => setDate(date)}
                className="w-full border border-[var(--FormDefault)] rounded px-10 py-2 text-[14px] text-[var(--MainText)]"
                placeholderText="Match Date"
              />
              <label
                className={
                  date
                    ? "top-[-3px] bg-white text-[var(--TextSecondary)] absolute left-[40px] text-[14px] px-[5px] pointer-events-none"
                    : "hidden"
                }
              >
                Match Date
              </label>
            </div>
            <div className="flex flex-row w-full gap-[32px] justify-between relative">
              <div className="flex items-center rounded py-2 w-full">
                <Map className="text-[var(--TextSecondary)] mr-2 absolute ml-1" />
                <input
                  type="tel"
                  className="w-full border border-[var(--FormDefault)] rounded py-2 text-[14px] text-[var(--MainText)] pl-8"
                  value={venue}
                  onChange={(e) => setVenue(e.target.value)}
                />
                <label
                  className={`placeholder absolute left-[40px] text-[14px] px-[5px] pointer-events-none text-[var(--TextSecondary)] transition-transform duration-300 ease-in-out 
                  ${venue ? "top-[-3px] bg-white" : ""}`}
                >
                  Match Venue
                </label>
              </div>
            </div>
          </div>
        </div>
        {/* Upload Video */}
        <div className="w-full mx-[112px mt-[32px]">
          {/* Drop zone */}
          <div
            className={classNames(
              "drop-zone border-2 border-dashed rounded-[8px] px-[40px] py-[20px] cursor-pointer mb-[15px] transition-all duration-300 ease-in text-center",
              isDragging
                ? "border-[var(--MainButton)]"
                : "border-[var(--FormDefault)]",
              "hover:border-[var(--MainButton)]"
            )}
            onClick={triggerFileInput}
          >
            <div className="flex flex-col justify-center items-center">
              <div className="mb-[10px]">
                <CloudUpload className="text-[var(--MainButton)] w-[80px] h-[80px] max-sm:w-[30px] max-sm:h-[30px]" />
              </div>
              <p className="text-[var(--TextSecondary)] text-[16px] m-0">
                Browse Video or Drag Here to Upload
              </p>
            </div>
          </div>

          {/* Hidden file input */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            accept="video/*"
            className="hidden"
          />
          {/* Hidden Uppy Dashboard (used for file picking but not displayed) */}
          <div id="uppy-dashboard" className="hidden"></div>

          {/* Upload progress */}
          {selectedFileRef.current && (
            <div className="px-[8px] py-[12px] mb-[15px]">
              <div className="flex flex-row items-center mb-[6px]">
                <div className="mr-[10px]">
                  <Video className="text-[var(--MainButton)] w-[40px] h-[40px] max-sm:w-[30px] max-sm:h-[30px]" />
                </div>
                <span className="grow truncate text-[var(--MainText)]">
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

          {/* Analyze button */}
          <button
            className="block w-full p-[12px] border-none rounded-[4px] bg-[var(--MainButton)] text-[16px] font-medium text-white cursor-pointer disabled:opacity-60"
            disabled={!uploadSuccess}
            onClick={startAnalysis}
          >
            {isUploading ? "Uploading..." : "Analyze"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Page;
