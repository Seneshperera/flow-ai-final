"use client";

import { useModalStore } from "@/store/useModalStore";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import ProductModal from "./modals/ProductModal";
import DeleteModal from "./modals/DeleteModal";

export default function ModalProvider() {
  const [isMounted, setIsMounted] = useState(false);
  const { isOpen, type, closeModal } = useModalStore();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          >
            {/* Modal Content container */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-lg glass-panel p-6 rounded-3xl border-white/10 shadow-[0_0_50px_rgba(0,255,255,0.1)] overflow-hidden"
            >
              <button 
                onClick={closeModal}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 text-muted-foreground hover:text-white transition-colors z-10"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Render specific modal based on type */}
              {(type === "addProduct" || type === "editProduct") && <ProductModal />}
              {type === "deleteProduct" && <DeleteModal />}

            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
