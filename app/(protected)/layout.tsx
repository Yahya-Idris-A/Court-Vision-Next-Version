import AuthNavbar from "@/components/navbar/authNavbar";
import Sidebar from "@/components/navbar/sidebar";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-row justify-between w-full gap-[32px] max-sm:gap-[16px]">
      <Sidebar />
      <div className="flex flex-col items-center justify-start min-h-screen w-full">
        <AuthNavbar />
        <div className="w-full">{children}</div>
      </div>
    </div>
  );
}
