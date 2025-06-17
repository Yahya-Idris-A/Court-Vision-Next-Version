import BasicNavbar from "@/components/navbar/basicNavbar";
import Footer from "@/components/footer/footer";

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-[100dvh] responsiveFooter">
      {/* <BasicNavbar /> */}
      {children}
      {/* <Footer /> */}
    </div>
  );
}
