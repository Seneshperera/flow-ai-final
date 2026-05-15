import { useState, useEffect } from 'react';
import { productService } from '../services/productService';
import type { Product } from '../services/productService';
import { Plus, Trash2, Package } from 'lucide-react';

export default function Inventory() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newProduct, setNewProduct] = useState<Product>({
    name: '',
    sku: '',
    price: 0,
    cost: 0,
    stock: 0,
    unit: 'pcs'
  });

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    const data = await productService.getAll();
    setProducts(data);
  }

  async function handleAddProduct(e: React.FormEvent) {
    e.preventDefault();
    await productService.add(newProduct);
    setIsAdding(false);
    setNewProduct({ name: '', sku: '', price: 0, cost: 0, stock: 0, unit: 'pcs' });
    loadProducts();
  }

  async function handleDelete(id: number) {
    if (confirm('Delete this product?')) {
      await productService.delete(id);
      loadProducts();
    }
  }

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Inventory Management</h1>
        <button 
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-500 transition-all"
        >
          <Plus className="w-5 h-5" /> Add Product
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleAddProduct} className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500">Product Name</label>
              <input required className="w-full p-2 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700" value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500">SKU / Barcode</label>
              <input className="w-full p-2 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700" value={newProduct.sku} onChange={e => setNewProduct({...newProduct, sku: e.target.value})} />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500">Selling Price ($)</label>
              <input type="number" required step="0.01" className="w-full p-2 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: parseFloat(e.target.value)})} />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500">Cost Price ($)</label>
              <input type="number" required step="0.01" className="w-full p-2 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700" value={newProduct.cost} onChange={e => setNewProduct({...newProduct, cost: parseFloat(e.target.value)})} />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500">Initial Stock</label>
              <input type="number" required className="w-full p-2 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700" value={newProduct.stock} onChange={e => setNewProduct({...newProduct, stock: parseInt(e.target.value)})} />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500">Unit (e.g. pcs, kg)</label>
              <input className="w-full p-2 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700" value={newProduct.unit} onChange={e => setNewProduct({...newProduct, unit: e.target.value})} />
            </div>
          </div>
          <div className="flex gap-2 pt-2">
            <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-500">Save Product</button>
            <button type="button" onClick={() => setIsAdding(false)} className="bg-gray-100 dark:bg-gray-800 px-6 py-2 rounded-lg">Cancel</button>
          </div>
        </form>
      )}

      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 dark:bg-gray-800/50">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Product</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">SKU</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Price</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Stock</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
            {products.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                  <Package className="w-12 h-12 mx-auto mb-4 opacity-10" />
                  No products in inventory yet.
                </td>
              </tr>
            ) : (
              products.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                  <td className="px-6 py-4 font-bold">{p.name}</td>
                  <td className="px-6 py-4 text-gray-500">{p.sku}</td>
                  <td className="px-6 py-4 font-bold">${p.price.toFixed(2)}</td>
                  <td className={`px-6 py-4 font-bold ${p.stock < 10 ? 'text-red-500' : 'text-gray-900 dark:text-white'}`}>{p.stock} {p.unit}</td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => handleDelete(p.id!)} className="p-2 text-gray-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
