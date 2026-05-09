import { create } from "zustand";

type ModalType = "addProduct" | "editProduct" | "deleteProduct" | null;

interface ModalState {
  type: ModalType;
  isOpen: boolean;
  data: any;
  openModal: (type: ModalType, data?: any) => void;
  closeModal: () => void;
}

export const useModalStore = create<ModalState>((set) => ({
  type: null,
  isOpen: false,
  data: {},
  openModal: (type, data = {}) => set({ isOpen: true, type, data }),
  closeModal: () => set({ isOpen: false, type: null, data: {} }),
}));
