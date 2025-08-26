// components/ModalConfirmDelete.tsx
"use client";

import React from "react";

interface ModalConfirmDeleteProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemName?: string;
}

const ModalConfirmDelete: React.FC<ModalConfirmDeleteProps> = ({
  isOpen,
  onClose,
  onConfirm,
  itemName = "item",
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#6b728050] bg-opacity-80"
      onClick={(e) => {
        e.stopPropagation();
        onClose();
      }}
    >
      <div
        className="bg-white p-6 rounded-lg shadow-md w-[90%] max-w-sm"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-semibold text-[var(--MainText)] mb-4">
          Hapus {itemName}?
        </h2>
        <p className="text-sm text-[var(--TextSecondary)] mb-6">
          Apakah kamu yakin ingin menghapus {itemName}? Tindakan ini tidak bisa
          dibatalkan.
        </p>
        <div className="flex justify-end gap-3">
          <button
            className="px-4 py-2 text-sm text-[var(--MainText)] cursor-pointer hover:text-[var(--TextSecondary)]"
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
          >
            Batal
          </button>
          <button
            className="px-4 py-2 text-sm bg-[var(--Danger)] text-white cursor-pointer rounded hover:bg-[var(--DangerHover)]"
            onClick={(e) => {
              e.stopPropagation();
              onConfirm();
            }}
          >
            Hapus
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalConfirmDelete;
