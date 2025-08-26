import { useState, useEffect } from "react";

// Tipe untuk breakpoint yang didefinisikan
export type Breakpoint = "sm" | "md" | "lg";

const getBreakpoint = (width: number): Breakpoint => {
  if (width < 768) {
    // Di bawah 768px (Mobile)
    return "sm";
  }
  if (width < 1024) {
    // Antara 768px dan 1024px (Tablet)
    return "md";
  }
  return "lg"; // Di atas 1024px (Desktop)
};

export const useBreakpoint = (): Breakpoint => {
  const [breakpoint, setBreakpoint] = useState<Breakpoint>("lg");

  useEffect(() => {
    // Fungsi yang akan dijalankan saat ukuran window berubah
    const handleResize = () => {
      setBreakpoint(getBreakpoint(window.innerWidth));
    };

    // Panggil sekali saat mount untuk mengatur nilai awal
    handleResize();

    // Tambahkan event listener untuk event 'resize'
    window.addEventListener("resize", handleResize);

    // Fungsi cleanup: hapus event listener saat komponen di-unmount
    // Untuk mencegah memory leak
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []); // Array dependensi kosong agar efek ini hanya berjalan sekali (saat mount dan unmount)

  return breakpoint;
};
