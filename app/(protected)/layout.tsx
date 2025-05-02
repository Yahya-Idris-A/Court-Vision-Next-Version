import AuthNavbar from "@/components/navbar/authNavbar";
import Sidebar from "@/components/navbar/sidebar";

const user = { user: { name: "John Doe" } }; // Simulasi props atau state userData. Nanti bisa diganti pakai context/auth hooks

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-row justify-between items-center w-full gap-[32px] max-sm:gap-[16px]">
      <Sidebar />
      <div className="flex flex-col items-center justify-start min-h-screen w-full">
        <AuthNavbar userData={user} />
        <div className="pr-[10px] w-full">{children}</div>
      </div>
    </div>
  );
}
