"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Package, Search, Plus, MoreHorizontal, AlertTriangle, ArrowUpRight, ArrowDownRight, Filter, Edit2, Trash2 } from "lucide-react";
import { useInventoryStore } from "@/store/useInventoryStore";
import { useInventory } from "@/hooks/useInventory";
import { useModalStore } from "@/store/useModalStore";
import { useState, useMemo } from "react";

export default function InventoryPage() {
  const { searchQuery, categoryFilter, setSearchQuery, setCategoryFilter } = useInventoryStore();
  const { products = [], isLoading } = useInventory();
  const { openModal } = useModalStore();
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            product.sku.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = categoryFilter === "All Categories" || product.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchQuery, categoryFilter]);

  const categories = ["All Categories", ...Array.from(new Set(products.map(p => p.category)))];

  const totalProducts = products.length;
  const lowStockCount = products.filter(p => p.status === 'Low Stock').length;
  const outOfStockCount = products.filter(p => p.status === 'Out of Stock').length;

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Inventory</h1>
          <p className="text-muted-foreground mt-1">Manage your product catalog and stock levels.</p>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => openModal("addProduct")}
            className="px-4 py-2 rounded-xl bg-primary text-primary-foreground font-semibold flex items-center gap-2 hover:bg-primary/90 transition-all hover:scale-105 active:scale-95 shadow-[0_0_15px_rgba(0,255,255,0.3)]"
          >
            <Plus className="w-4 h-4" /> Add Product
          </button>
        </div>
      </header>

      {/* Floating Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0 }}
          className="glass-panel p-6 rounded-2xl flex items-center gap-4 border-white/5 relative overflow-hidden group hover:border-primary/50 transition-colors"
        >
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-primary/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500"></div>
          <div className="p-3 rounded-xl bg-primary/20 text-primary border border-primary/20 relative z-10">
            <Package className="w-5 h-5" />
          </div>
          <div className="relative z-10">
            <div className="text-sm text-muted-foreground">Total Products</div>
            <motion.div 
              key={totalProducts}
              initial={{ scale: 1.5, color: "var(--primary)" }}
              animate={{ scale: 1, color: "#fff" }}
              className="text-2xl font-bold text-white"
            >
              {totalProducts}
            </motion.div>
          </div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="glass-panel p-6 rounded-2xl flex items-center gap-4 border-white/5 relative overflow-hidden group hover:border-secondary/50 transition-colors"
        >
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-secondary/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500"></div>
          <div className="p-3 rounded-xl bg-secondary/20 text-secondary border border-secondary/20 relative z-10">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div className="relative z-10">
            <div className="text-sm text-muted-foreground">Low Stock Alerts</div>
            <motion.div 
              key={lowStockCount}
              initial={{ scale: 1.5, color: "var(--secondary)" }}
              animate={{ scale: 1, color: "#fff" }}
              className="text-2xl font-bold text-white"
            >
              {lowStockCount}
            </motion.div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="glass-panel p-6 rounded-2xl flex items-center gap-4 border-white/5 relative overflow-hidden group hover:border-destructive/50 transition-colors"
        >
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-destructive/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500"></div>
          <div className="p-3 rounded-xl bg-destructive/20 text-destructive border border-destructive/20 relative z-10">
            <Package className="w-5 h-5" />
          </div>
          <div className="relative z-10">
            <div className="text-sm text-muted-foreground">Out of Stock</div>
            <motion.div 
              key={outOfStockCount}
              initial={{ scale: 1.5, color: "var(--destructive)" }}
              animate={{ scale: 1, color: "#fff" }}
              className="text-2xl font-bold text-white"
            >
              {outOfStockCount}
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Advanced Search & Filtering */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-panel rounded-2xl border-white/5 overflow-hidden flex flex-col"
      >
        <div className="p-4 border-b border-white/5 flex flex-col md:flex-row items-center justify-between bg-black/20 gap-4">
          <div className="relative flex items-center gap-2 w-full md:w-96">
            <Search className="w-4 h-4 text-primary absolute left-3 glow-text" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name or SKU..." 
              className="bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder:text-muted-foreground w-full outline-none focus:border-primary/50 focus:bg-white/10 transition-colors shadow-inner"
            />
          </div>
          <div className="flex gap-3 w-full md:w-auto">
            <div className="relative flex items-center min-w-[150px]">
              <Filter className="w-4 h-4 text-muted-foreground absolute left-3 pointer-events-none" />
              <select 
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="bg-white/5 border border-white/10 rounded-xl pl-9 pr-8 py-2.5 text-sm text-white outline-none focus:border-primary/50 transition-colors appearance-none w-full"
              >
                {categories.map(c => <option key={c} value={c} className="bg-background">{c}</option>)}
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto min-h-[400px]">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground bg-black/40 border-b border-white/5">
              <tr>
                <th className="px-6 py-4 font-medium uppercase tracking-wider">Product</th>
                <th className="px-6 py-4 font-medium uppercase tracking-wider">SKU</th>
                <th className="px-6 py-4 font-medium uppercase tracking-wider">Category</th>
                <th className="px-6 py-4 font-medium uppercase tracking-wider">Stock</th>
                <th className="px-6 py-4 font-medium uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 font-medium uppercase tracking-wider">Price</th>
                <th className="px-6 py-4 font-medium text-right uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <motion.tr key={`skeleton-${i}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="border-b border-white/5">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-white/5 animate-pulse"></div>
                          <div className="flex flex-col gap-2">
                            <div className="w-32 h-4 bg-white/5 rounded animate-pulse"></div>
                            <div className="w-20 h-3 bg-white/5 rounded animate-pulse"></div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4"><div className="w-16 h-4 bg-white/5 rounded animate-pulse"></div></td>
                      <td className="px-6 py-4"><div className="w-24 h-4 bg-white/5 rounded animate-pulse"></div></td>
                      <td className="px-6 py-4"><div className="w-12 h-4 bg-white/5 rounded animate-pulse"></div></td>
                      <td className="px-6 py-4"><div className="w-20 h-6 bg-white/5 rounded-full animate-pulse"></div></td>
                      <td className="px-6 py-4"><div className="w-16 h-4 bg-white/5 rounded animate-pulse"></div></td>
                      <td className="px-6 py-4"><div className="w-8 h-8 ml-auto bg-white/5 rounded-lg animate-pulse"></div></td>
                    </motion.tr>
                  ))
                ) : filteredProducts.length === 0 ? (
                  <motion.tr initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <td colSpan={7} className="px-6 py-12 text-center text-muted-foreground">
                      No products found matching your filters.
                    </td>
                  </motion.tr>
                ) : (
                  filteredProducts.map((item, index) => (
                    <motion.tr 
                      key={item.id} 
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-b border-white/5 hover:bg-white/[0.03] transition-colors group"
                    >
                      <td className="px-6 py-4 font-medium text-white flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-primary/50 transition-colors relative overflow-hidden">
                          <Package className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                          {item.status === 'Low Stock' && <div className="absolute inset-0 bg-secondary/10 animate-pulse"></div>}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-white group-hover:text-primary transition-colors">{item.name}</span>
                          <span className="text-xs text-muted-foreground">{item.supplier}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-muted-foreground font-mono text-xs">{item.sku}</td>
                      <td className="px-6 py-4 text-muted-foreground">{item.category}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className="text-white font-medium">{item.stock}</span>
                          {item.trend === 'up' ? (
                            <ArrowUpRight className="w-3 h-3 text-green-400 drop-shadow-[0_0_5px_rgba(74,222,128,0.5)]" />
                          ) : (
                            <ArrowDownRight className="w-3 h-3 text-red-400 drop-shadow-[0_0_5px_rgba(248,113,113,0.5)]" />
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border relative flex items-center gap-2 w-fit ${
                          item.status === 'In Stock' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                          item.status === 'Low Stock' ? 'bg-secondary/10 text-secondary border-secondary/20 shadow-[0_0_10px_rgba(150,0,255,0.2)]' :
                          'bg-destructive/10 text-destructive border-destructive/20 shadow-[0_0_10px_rgba(255,50,50,0.2)]'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            item.status === 'In Stock' ? 'bg-green-400' :
                            item.status === 'Low Stock' ? 'bg-secondary animate-pulse' :
                            'bg-destructive animate-pulse'
                          }`}></span>
                          {item.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-white font-medium">${item.price.toFixed(2)}</td>
                      <td className="px-6 py-4 text-right relative">
                        <button 
                          onClick={() => setActiveDropdown(activeDropdown === item.id ? null : item.id)}
                          className="p-2 rounded-lg hover:bg-white/10 text-muted-foreground hover:text-white transition-colors"
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </button>

                        <AnimatePresence>
                          {activeDropdown === item.id && (
                            <>
                              <div className="fixed inset-0 z-10" onClick={() => setActiveDropdown(null)}></div>
                              <motion.div 
                                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                                className="absolute right-8 top-12 z-20 w-40 glass-panel border-white/10 rounded-xl overflow-hidden flex flex-col shadow-2xl"
                              >
                                <button 
                                  onClick={() => { setActiveDropdown(null); openModal("editProduct", { product: item }); }}
                                  className="px-4 py-2.5 text-left text-sm text-white hover:bg-white/10 flex items-center gap-2 transition-colors"
                                >
                                  <Edit2 className="w-4 h-4 text-primary" /> Edit
                                </button>
                                <button 
                                  onClick={() => { setActiveDropdown(null); openModal("deleteProduct", { id: item.id, productName: item.name }); }}
                                  className="px-4 py-2.5 text-left text-sm text-destructive hover:bg-destructive/10 flex items-center gap-2 transition-colors"
                                >
                                  <Trash2 className="w-4 h-4" /> Delete
                                </button>
                              </motion.div>
                            </>
                          )}
                        </AnimatePresence>
                      </td>
                    </motion.tr>
                  ))
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
