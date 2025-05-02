"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Uppy from "@uppy/core";
import { Dashboard } from "@uppy/react";
import "@uppy/core/dist/style.min.css";
import "@uppy/dashboard/dist/style.min.css";
import { ImagePlus, User, Mail, Phone, Calendar, Save } from "lucide-react";

const CustomInput = React.forwardRef<HTMLInputElement, any>(
  ({ value, onClick, onChange }, ref) => (
    <input
      type="text"
      onClick={onClick}
      onChange={onChange}
      value={value}
      ref={ref}
      placeholder="Date of Birth"
      className="w-full border border-gray-300 rounded px-10 py-2 text-[14px] text-black"
    />
  )
);

const page = () => {
  const [uppy] = useState(
    () =>
      new Uppy({
        restrictions: {
          maxNumberOfFiles: 1,
          allowedFileTypes: ["image/*"],
        },
        autoProceed: true,
      })
  );
  const [focused, setFocused] = useState(false);
  const [value, setValue] = useState("");

  const [selectedImage, setSelectedImage] = useState("/user/Avatar.png");
  const [selectedImageName, setSelectedImageName] = useState("");
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userPhone, setUserPhone] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState<Date | null>(null);

  // useEffect(() => {
  //   uppy.on("complete", (result) => {
  //     if (result.successful.length > 0) {
  //       const file = result.successful[0];
  //       setSelectedImage(URL.createObjectURL(file.data));
  //       setSelectedImageName(file.name);
  //     }
  //   });

  //   return;
  // }, [uppy]);

  const handleSave = () => {
    // Implementasi logika penyimpanan data
    console.log("Data disimpan:", {
      userName,
      userEmail,
      userPhone,
      dateOfBirth,
      selectedImageName,
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
          {selectedImage && (
            <Image
              width={50} // default width, bisa diubah
              height={50} // default height, bisa diubah
              src={selectedImage}
              alt="Selected"
              className="w-36 h-36 mb-5 rounded-full object-cover"
            />
          )}

          {selectedImageName && (
            <div className="px-2 border-2 border-orange-500 rounded mb-5">
              <span className="text-gray-500">
                Selected image: {selectedImageName}
              </span>
            </div>
          )}

          <div className="drop-zone border-[2px] w-full border-dashed border-[#9e9e9e] rounded-[8px] px-[40px] py-[20px] cursor-pointer mb-[15px] transition-all duration-300 ease-in text-center hover:border-[#FD6A2A]">
            <div className="flex flex-col justify-center items-center">
              <div className="mb-[10px]">
                <ImagePlus size={50} className="text-[#FD6A2A] text-[40px]" />
              </div>
              <p className="!text-[#FD6A2A] !text-[16px] m-0">
                Browse Image or Drag Here to Upload
              </p>
            </div>
            {/* Hidden file input to trigger native file selection */}
            <input type="file" accept="image/*" className="hidden" />
            {/* Hidden Uppy Dashboard (used for file picking but not displayed) */}
            <div id="uppy-dashboard" className="hidden"></div>
          </div>

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

            <div className="flex flex-row w-full gap-[32px] justify-between">
              <div className="flex items-center rounded py-2 w-full relative">
                <Phone className="text-gray-400 mr-2 absolute ml-1" />
                <input
                  type="tel"
                  className="w-full border border-gray-300 rounded py-2 text-[14px] text-black pl-8"
                  value={userPhone}
                  onChange={(e) => setUserPhone(e.target.value)}
                />
                <label
                  className={`placeholder absolute left-[40px] text-[14px] px-[5px] pointer-events-none text-gray-400 transition-transform duration-300 ease-in-out 
                  ${userPhone ? "top-[-3px] bg-white" : ""}`}
                >
                  Phone Number
                </label>
              </div>

              <div className="flex items-center rounded py-2 w-full relative">
                <Calendar className="text-gray-400 mr-2 absolute ml-1" />
                <DatePicker
                  selected={dateOfBirth}
                  onChange={(date: Date | null) => setDateOfBirth(date)}
                  className="w-full border border-gray-300 rounded px-10 py-2 text-[14px] text-black"
                  placeholderText="Date of Birth"
                />
                <label
                  className={
                    dateOfBirth
                      ? "top-[-3px] bg-white text-gray-400 absolute left-[40px] text-[14px] px-[5px] pointer-events-none"
                      : "hidden"
                  }
                >
                  Date of Birth
                </label>
              </div>
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
