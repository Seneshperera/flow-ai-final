import { create } from "zustand";

export interface Product {
  id: string;
  sku: string;
  name: string;
  category: string;
  stock: number;
  status: "In Stock" | "Low Stock" | "Out of Stock";
  price: number;
  supplier: string;
  trend: "up" | "down";
}

const initialProducts: Product[] = [
  { id: "p1", sku: "SKU-992", name: "Quantum CPU Accelerator", category: "Hardware", stock: 12, status: "Low Stock", price: 499.00, supplier: "Nexus Tech", trend: "up" },
  { id: "p2", sku: "SKU-445", name: "Holographic Display Unit", category: "Displays", stock: 156, status: "In Stock", price: 899.00, supplier: "VisionCore", trend: "up" },
  { id: "p3", sku: "SKU-231", name: "Neural Link Cable", category: "Accessories", stock: 0, status: "Out of Stock", price: 49.00, supplier: "Nexus Tech", trend: "down" },
  { id: "p4", sku: "SKU-877", name: "Bio-Battery Pack", category: "Power", stock: 89, status: "In Stock", price: 129.00, supplier: "EcoEnergy", trend: "up" },
  { id: "p5", sku: "SKU-544", name: "Gravity Emitter Module", category: "Hardware", stock: 5, status: "Low Stock", price: 2499.00, supplier: "Gravity Labs", trend: "down" },
];

interface InventoryState {
  products: Product[];
  searchQuery: string;
  categoryFilter: string;
  setSearchQuery: (query: string) => void;
  setCategoryFilter: (category: string) => void;
  addProduct: (product: Omit<Product, "id">) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
}

export const useInventoryStore = create<InventoryState>((set) => ({
  products: initialProducts,
  searchQuery: "",
  categoryFilter: "All Categories",
  setSearchQuery: (query) => set({ searchQuery: query }),
  setCategoryFilter: (category) => set({ categoryFilter: category }),
  addProduct: (product) => set((state) => ({
    products: [{ ...product, id: Math.random().toString(36).substr(2, 9) }, ...state.products]
  })),
  updateProduct: (id, updatedFields) => set((state) => ({
    products: state.products.map(p => p.id === id ? { ...p, ...updatedFields } : p)
  })),
  deleteProduct: (id) => set((state) => ({
    products: state.products.filter(p => p.id !== id)
  })),
}));
