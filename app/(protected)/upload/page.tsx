"use client";
import React, { useEffect, useState, useRef } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Pencil, Calendar, Map, Video, CloudUpload } from "lucide-react";
import classNames from "classnames";

const page = () => {
  const [matchTitle, setMatchTitle] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState<Date | null>(null);
  const [matchVenue, setmatchVenue] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      simulateUpload();
    }
  };

  const simulateUpload = () => {
    setIsUploading(true);
    setUploadProgress(0);
    setUploadSuccess(false);

    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          setUploadSuccess(true);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const startAnalysis = () => {
    if (uploadSuccess) {
      console.log("Starting analysis for:", selectedFile?.name);
    }
  };

  useEffect(() => {
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
        setSelectedFile(file);
        simulateUpload();
        e.dataTransfer.clearData();
      }
    };

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
      <div className="flex flex-row items-center justify-start w-full p-[20px] bg-white stroke-[#667085] shadow">
        <p className="text-[18px] text-[#4B465C] font-semibold">
          Analyze Your Video
        </p>
      </div>
      {/* Form */}
      <div className="flex flex-col items-center justify-start w-full p-[32px] bg-white stroke-[#667085] shadow">
        <div className="flex flex-col gap-4 w-full">
          <div className="flex items-center rounded py-2 relative">
            <Pencil className="text-gray-400 mr-2 absolute ml-1" />
            <input
              type="text"
              className="w-full border border-gray-300 rounded px-3 py-2 text-[14px] text-black pl-8"
              value={matchTitle}
              onChange={(e) => setMatchTitle(e.target.value)}
            />
            <label
              className={`placeholder absolute left-[40px] text-[14px] px-[5px] pointer-events-none text-gray-400 transition-transform duration-300 ease-in-out 
                  ${matchTitle ? "top-[-3px] bg-white" : ""}`}
            >
              Match Title
            </label>
          </div>

          <div className="flex flex-row w-full gap-[32px] justify-between">
            <div className="flex items-center rounded py-2 w-full relative">
              <Calendar className="text-gray-400 mr-2 absolute ml-1" />
              <DatePicker
                selected={dateOfBirth}
                onChange={(date: Date | null) => setDateOfBirth(date)}
                className="w-full border border-gray-300 rounded px-10 py-2 text-[14px] text-black"
                placeholderText="Match Date"
              />
              <label
                className={
                  dateOfBirth
                    ? "top-[-3px] bg-white text-gray-400 absolute left-[40px] text-[14px] px-[5px] pointer-events-none"
                    : "hidden"
                }
              >
                Match Date
              </label>
            </div>
            <div className="flex flex-row w-full gap-[32px] justify-between relative">
              <div className="flex items-center rounded py-2 w-full">
                <Map className="text-gray-400 mr-2 absolute ml-1" />
                <input
                  type="tel"
                  className="w-full border border-gray-300 rounded py-2 text-[14px] text-black pl-8"
                  value={matchVenue}
                  onChange={(e) => setmatchVenue(e.target.value)}
                />
                <label
                  className={`placeholder absolute left-[40px] text-[14px] px-[5px] pointer-events-none text-gray-400 transition-transform duration-300 ease-in-out 
                  ${matchVenue ? "top-[-3px] bg-white" : ""}`}
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
              isDragging ? "border-[#FD6A2A]" : "border-[#9e9e9e]",
              "hover:border-[#FD6A2A]"
            )}
            onClick={triggerFileInput}
          >
            <div className="flex flex-col justify-center items-center">
              <div className="mb-[10px]">
                <CloudUpload className="text-[#FD6A2A] w-[80px] h-[80px] max-sm:w-[30px] max-sm:h-[30px]" />
              </div>
              <p className="text-[#FD6A2A] text-[16px] m-0">
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

          {/* Upload progress */}
          {selectedFile && (
            <div className="px-[8px] py-[12px] mb-[15px]">
              <div className="flex flex-row items-center mb-[6px]">
                <div className="mr-[10px]">
                  <Video className="text-[#FD6A2A] w-[40px] h-[40px] max-sm:w-[30px] max-sm:h-[30px]" />
                </div>
                <span className="grow truncate">{selectedFile.name}</span>
                <span className="ml-[10px] text-[14px]">{uploadProgress}%</span>
              </div>
              <div className="overflow-hidden rounded-[10px] border border-[#403D91] h-[10px]">
                <div
                  className="bg-[#FD6A2A] h-full transition-all"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Analyze button */}
          <button
            className="block w-full p-[12px] border-none rounded-[4px] bg-[#FD6A2A] text-[16px] font-medium text-white cursor-pointer disabled:opacity-60"
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

export default page;
