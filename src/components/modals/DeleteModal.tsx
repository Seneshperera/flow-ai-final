"use client";

import { useInventory } from "@/hooks/useInventory";
import { useModalStore } from "@/store/useModalStore";
import { AlertTriangle } from "lucide-react";

export default function DeleteModal() {
  const { data, closeModal } = useModalStore();
  const { deleteProduct, isDeleting } = useInventory();

  const handleDelete = () => {
    if (data?.id) {
      deleteProduct(data.id);
    }
    closeModal();
  };

  return (
    <div className="flex flex-col items-center text-center p-4">
      <div className="w-16 h-16 rounded-full bg-destructive/20 border border-destructive/50 flex items-center justify-center mb-4 shadow-[0_0_30px_rgba(255,50,50,0.3)]">
        <AlertTriangle className="w-8 h-8 text-destructive" />
      </div>
      
      <h2 className="text-xl font-bold text-white mb-2">Delete Product</h2>
      <p className="text-sm text-muted-foreground mb-8">
        Are you sure you want to delete <span className="text-white font-medium">{data?.productName}</span>? This action cannot be undone.
      </p>

      <div className="flex items-center gap-4 w-full">
        <button 
          onClick={closeModal}
          disabled={isDeleting}
          className="flex-1 py-3 rounded-xl glass-panel border-white/10 text-white font-medium hover:bg-white/5 transition-colors disabled:opacity-50"
        >
          Cancel
        </button>
        <button 
          onClick={handleDelete}
          disabled={isDeleting}
          className="flex-1 py-3 rounded-xl bg-destructive text-white font-semibold hover:bg-destructive/90 transition-all shadow-[0_0_20px_rgba(255,50,50,0.2)] hover:scale-105 active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {isDeleting && <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>}
          Yes, Delete
        </button>
      </div>
    </div>
  );
}
