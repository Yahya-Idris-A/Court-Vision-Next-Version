import BasicNavbar from "@/components/navbar/basicNavbar";
import Footer from "@/components/footer/footer";
import { NavbarProvider } from "@/components/navbar/basicNavbarContext";

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <BasicNavbar />
      {children}
      <Footer />
    </div>
  );
}
