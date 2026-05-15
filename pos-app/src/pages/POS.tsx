import { useState, useEffect } from 'react';
import { useCartStore } from '../store/useCartStore';
import { productService } from '../services/productService';
import type { Product } from '../services/productService';
import { Search, Plus, Minus, Trash2, CreditCard, Banknote, ShoppingCart } from 'lucide-react';
import { saleService } from '../services/saleService';

export default function POS() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState('');
  const { items, addItem, updateQuantity, removeItem, getTotal, clearCart } = useCartStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    setIsLoading(true);
    try {
      const data = await productService.getAll();
      setProducts(data);
    } catch (error) {
      console.error('Failed to load products:', error);
    } finally {
      setIsLoading(false);
    }
  }

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) || 
    p.sku?.toLowerCase().includes(search.toLowerCase())
  );

  const handleCheckout = async (method: string) => {
    if (items.length === 0) return;

    try {
      await saleService.create({
        total: getTotal(),
        tax: 0,
        discount: 0,
        payment_method: method,
        items: items.map(i => ({
          product_id: i.id,
          quantity: i.quantity,
          price: i.price,
          cost: 0 // In real scenario, fetch cost from product
        }))
      });
      alert('Sale completed successfully!');
      clearCart();
      loadProducts(); // Reload to update stock
    } catch (error) {
      alert('Checkout failed: ' + error);
    }
  };

  return (
    <div className="flex h-full bg-gray-100 dark:bg-gray-950">
      {/* Product Selection Area */}
      <div className="flex-1 flex flex-col p-6 overflow-hidden">
        <div className="mb-6 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search products by name or SKU..."
            className="w-full pl-10 pr-4 py-3 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 focus:ring-2 focus:ring-blue-500 transition-all outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex-1 overflow-y-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 content-start">
          {isLoading ? (
            <p>Loading products...</p>
          ) : filteredProducts.length === 0 ? (
            <p className="col-span-full text-center py-12 text-gray-500">No products found. Add some in Inventory first!</p>
          ) : (
            filteredProducts.map((product) => (
              <button
                key={product.id}
                onClick={() => addItem({ id: product.id!, name: product.name, price: product.price })}
                disabled={product.stock <= 0}
                className="group p-4 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 hover:border-blue-500 transition-all text-left flex flex-col gap-2 shadow-sm hover:shadow-md disabled:opacity-50"
              >
                <div className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase">{product.unit}</div>
                <div className="font-bold text-gray-900 dark:text-white line-clamp-2 h-10">{product.name}</div>
                <div className="flex justify-between items-end mt-2">
                  <div className="text-lg font-black text-gray-900 dark:text-white">${product.price.toFixed(2)}</div>
                  <div className={`text-xs ${product.stock < 10 ? 'text-red-500 font-bold' : 'text-gray-400'}`}>
                    Stock: {product.stock}
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Cart Sidebar */}
      <div className="w-[400px] bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-800 flex flex-col shadow-2xl">
        <div className="p-6 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center">
          <h2 className="text-xl font-bold">Current Cart</h2>
          <button onClick={clearCart} className="text-xs text-red-500 hover:underline">Clear All</button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 text-center">
              <ShoppingCart className="w-12 h-12 mb-4 opacity-20" />
              <p>Your cart is empty.<br/>Select products to start selling.</p>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex gap-4 items-center animate-in fade-in slide-in-from-right-4 duration-200">
                <div className="flex-1">
                  <div className="font-bold text-sm text-gray-900 dark:text-white line-clamp-1">{item.name}</div>
                  <div className="text-xs text-gray-400">${item.price.toFixed(2)} / unit</div>
                </div>
                <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
                  <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-1 hover:bg-white dark:hover:bg-gray-700 rounded transition-colors"><Minus className="w-3 h-3" /></button>
                  <span className="text-xs font-bold w-6 text-center">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-1 hover:bg-white dark:hover:bg-gray-700 rounded transition-colors"><Plus className="w-3 h-3" /></button>
                </div>
                <div className="font-bold text-sm w-16 text-right">${(item.price * item.quantity).toFixed(2)}</div>
                <button onClick={() => removeItem(item.id)} className="p-2 text-gray-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
              </div>
            ))
          )}
        </div>

        {/* Summary & Checkout */}
        <div className="p-6 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-800 space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-500">
              <span>Subtotal</span>
              <span>${getTotal().toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-lg font-black text-gray-900 dark:text-white pt-2 border-t border-gray-200 dark:border-gray-700">
              <span>Total Amount</span>
              <span>${getTotal().toFixed(2)}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <button 
              onClick={() => handleCheckout('CASH')}
              disabled={items.length === 0}
              className="flex flex-col items-center gap-2 py-4 rounded-2xl bg-green-600 hover:bg-green-500 text-white transition-all disabled:opacity-50"
            >
              <Banknote className="w-6 h-6" />
              <span className="text-xs font-bold uppercase">Cash</span>
            </button>
            <button 
              onClick={() => handleCheckout('CARD')}
              disabled={items.length === 0}
              className="flex flex-col items-center gap-2 py-4 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white transition-all disabled:opacity-50"
            >
              <CreditCard className="w-6 h-6" />
              <span className="text-xs font-bold uppercase">Card</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
