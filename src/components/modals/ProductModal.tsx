"use client";

import { useInventoryStore } from "@/store/useInventoryStore";
import { useInventory } from "@/hooks/useInventory";
import { useModalStore } from "@/store/useModalStore";
import { Package, Tag, DollarSign, Box } from "lucide-react";
import { useState, useEffect } from "react";

export default function ProductModal() {
  const { type, data, closeModal } = useModalStore();
  const { addProduct, updateProduct, isAdding, isUpdating } = useInventory();

  const isEdit = type === "editProduct";

  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    category: "Hardware",
    price: "",
    stock: "",
    supplier: "",
  });

  useEffect(() => {
    if (isEdit && data?.product) {
      setFormData({
        name: data.product.name,
        sku: data.product.sku,
        category: data.product.category,
        price: data.product.price.toString(),
        cost: (data.product.cost || 0).toString(),
        stock: data.product.stock.toString(),
        supplier: data.product.supplier,
      });
    }
  }, [isEdit, data]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const stockNum = parseInt(formData.stock) || 0;
    
    const newProduct = {
      name: formData.name,
      sku: formData.sku,
      category: formData.category,
      price: parseFloat(formData.price) || 0,
      cost: parseFloat((formData as any).cost) || 0,
      stock: stockNum,
      supplier: formData.supplier,
      status: (stockNum === 0 ? "Out of Stock" : stockNum < 20 ? "Low Stock" : "In Stock") as "Low Stock" | "Out of Stock" | "In Stock",
      trend: "up" as const,
    };

    if (isEdit) {
      updateProduct({ id: data.product.id, data: newProduct });
    } else {
      addProduct(newProduct);
    }
    
    closeModal();
  };

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-primary/20 text-primary border border-primary/30">
          <Package className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">{isEdit ? 'Edit Product' : 'Add New Product'}</h2>
          <p className="text-sm text-muted-foreground">{isEdit ? 'Update inventory details' : 'Enter product information'}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <label className="text-xs font-medium text-muted-foreground pl-1">Product Name</label>
          <input 
            required
            type="text" 
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-primary/50 focus:shadow-[0_0_15px_rgba(0,255,255,0.1)] transition-all" 
            placeholder="Quantum Accelerator..." 
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium text-muted-foreground pl-1">SKU</label>
            <div className="relative flex items-center">
              <Tag className="absolute left-3 w-4 h-4 text-muted-foreground" />
              <input 
                required
                type="text" 
                value={formData.sku}
                onChange={(e) => setFormData({...formData, sku: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-3 text-sm text-white outline-none focus:border-primary/50 transition-all" 
                placeholder="SKU-123" 
              />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium text-muted-foreground pl-1">Category</label>
            <select 
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-primary/50 transition-all appearance-none"
            >
              <option className="bg-background">Hardware</option>
              <option className="bg-background">Software</option>
              <option className="bg-background">Accessories</option>
              <option className="bg-background">Displays</option>
              <option className="bg-background">Power</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium text-muted-foreground pl-1">Selling Price</label>
            <div className="relative flex items-center">
              <DollarSign className="absolute left-3 w-4 h-4 text-muted-foreground" />
              <input 
                required
                type="number" 
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-3 text-sm text-white outline-none focus:border-primary/50 transition-all" 
                placeholder="0.00" 
              />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium text-muted-foreground pl-1">Cost Price</label>
            <div className="relative flex items-center">
              <DollarSign className="absolute left-3 w-4 h-4 text-muted-foreground" />
              <input 
                required
                type="number" 
                step="0.01"
                value={(formData as any).cost || ""}
                onChange={(e) => setFormData({...formData, cost: e.target.value} as any)}
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-3 text-sm text-white outline-none focus:border-primary/50 transition-all" 
                placeholder="0.00" 
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium text-muted-foreground pl-1">Initial Stock</label>
            <div className="relative flex items-center">
              <Box className="absolute left-3 w-4 h-4 text-muted-foreground" />
              <input 
                required
                type="number" 
                value={formData.stock}
                onChange={(e) => setFormData({...formData, stock: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-3 text-sm text-white outline-none focus:border-primary/50 transition-all" 
                placeholder="0" 
              />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium text-muted-foreground pl-1">Supplier</label>
            <input 
              type="text" 
              value={formData.supplier}
              onChange={(e) => setFormData({...formData, supplier: e.target.value})}
              className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-primary/50 transition-all" 
              placeholder="Supplier name" 
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-white/10">
          <button 
            type="button" 
            onClick={closeModal}
            disabled={isAdding || isUpdating}
            className="px-6 py-2.5 rounded-xl text-sm font-medium text-white hover:bg-white/5 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button 
            type="submit"
            disabled={isAdding || isUpdating}
            className="px-6 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all shadow-[0_0_15px_rgba(0,255,255,0.2)] disabled:opacity-50 flex items-center gap-2"
          >
            {(isAdding || isUpdating) && <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>}
            {isEdit ? 'Save Changes' : 'Add Product'}
          </button>
        </div>
      </form>
    </div>
  );
}
