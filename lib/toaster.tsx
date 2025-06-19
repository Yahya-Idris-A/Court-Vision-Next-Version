import { toast } from "react-hot-toast";

type ToastType = "success" | "error" | "loading" | "default";

/**
 * Fungsi terpusat untuk menampilkan notifikasi toast.
 * @param type - Jenis toast ('success', 'error', 'loading', 'default').
 * @param message - Pesan yang ingin ditampilkan.
 */
export const callToaster = (type: ToastType, message: string) => {
  // Opsi kustom untuk setiap jenis toast jika diperlukan
  const options = {
    duration: 4000, // Durasi default
  };

  switch (type) {
    case "success":
      toast.success(message, {
        ...options,
      });
      break;

    case "error":
      toast.error(message, {
        ...options,
      });
      break;

    default:
      toast(message, options);
      break;
  }
};
