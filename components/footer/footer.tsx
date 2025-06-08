import { Instagram, Twitter, MapPin, Mail, Phone } from "lucide-react";
import Image from "next/image";

const Footer = () => {
  return (
    <div className="bg-[#403D91]">
      <div className="grid grid-cols-2 max-sm:grid-cols-1 gap-[30%] mx-[70px] py-[24px] max-sm:gap-7">
        {/* Column 1: Logo & Social Media */}
        <div className="flex flex-col gap-[12px]">
          <Image
            src="/companyLogo/Logo.png"
            alt="Company Logo"
            width={44}
            height={44}
            className="w-[44px] h-[44px]"
          />
          <p className="text-white text-[16px] font-normal">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit
          </p>
          <div className="flex flex-row gap-[12px] md:gap-[24px]">
            <Instagram className="text-white cursor-pointer" />
            <Twitter className="text-white cursor-pointer" />
          </div>
        </div>

        {/* Column 2: Contact Info */}
        <div className="flex flex-col gap-[8px] max-sm:mt-[24px]">
          <h3 className="text-white text-[16px] font-bold">Contact Info</h3>
          <div className="flex flex-row gap-[8px]">
            <div className="min-w-[40px]">
              <MapPin className="text-white" />
            </div>
            <p className="text-white text-[14px] font-normal">
              Ini Alamat Ini Alamat Ini Alamat Ini Alamat Ini Alamat Ini Alamat
              Ini Alamat Ini Alamat Ini Alamat Ini Alamat Ini Alamat Ini Alamat
              Ini Alamat Ini Alamat Ini Alamat Ini Alamat Ini Alamat
            </p>
          </div>
          <div className="flex flex-row gap-[8px]">
            <div className="min-w-[40px]">
              <Mail className="text-white" />
            </div>
            <div className="flex flex-col gap-[8px]">
              <p className="text-white text-[14px] font-normal">
                corporate@bola.com
              </p>
              <p className="text-white text-[14px] font-normal">
                bolabasket@gmail.com
              </p>
            </div>
          </div>
          <div className="flex flex-row gap-[8px]">
            <div className="min-w-[40px]">
              <Phone className="text-white" />
            </div>
            <p className="text-white text-[14px] font-normal">
              +62 82112882656
            </p>
          </div>
        </div>
      </div>

      <hr className="border-white my-4" />

      <p className="text-white text-[16px] font-bold text-center">
        © Copyright {new Date().getFullYear()}, Court Vision
      </p>
    </div>
  );
};
export default Footer;
