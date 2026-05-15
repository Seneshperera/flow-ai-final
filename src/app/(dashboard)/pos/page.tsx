"use client"

import { useState, useEffect } from 'react';

import { Search, Plus, Minus, Trash2, CreditCard, Banknote, ShoppingCart, Loader2, User, Percent, ReceiptText } from 'lucide-react';
import { getPOSProducts, createSale, getCustomers } from '@/actions/pos-actions';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function POSPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [cart, setCart] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const [discount, setDiscount] = useState(0);
  const [taxRate, setTaxRate] = useState(0); // e.g., 0.1 for 10%
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>('');
  const [customers, setCustomers] = useState<any[]>([]);
  const [amountPaid, setAmountPaid] = useState<number>(0);

  useEffect(() => {
    loadProducts();
    loadCustomers();
  }, []);

  async function loadProducts() {
    setIsLoading(true);
    try {
      const data = await getPOSProducts();
      setProducts(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  async function loadCustomers() {
    try {
      const data = await getCustomers();
      setCustomers(data);
    } catch (error) {
      console.error(error);
    }
  }

  const addItem = (product: any) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === product.id);
      if (existing) {
        return prev.map(i => i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      setCart(prev => prev.filter(i => i.id !== id));
      return;
    }
    setCart(prev => prev.map(i => i.id === id ? { ...i, quantity } : i));
  };

  const getSubtotal = () => cart.reduce((acc, i) => acc + i.price * i.quantity, 0);
  const getTaxAmount = () => getSubtotal() * taxRate;
  const getTotal = () => getSubtotal() + getTaxAmount() - discount;

  const [selectedMethod, setSelectedMethod] = useState<'CASH' | 'CARD'>('CASH');

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    setIsCheckingOut(true);
    try {
      await createSale({
        total: getTotal(),
        tax: getTaxAmount(),
        discount: discount,
        paymentMethod: selectedMethod,
        amountPaid: amountPaid || getTotal(),
        customerId: selectedCustomerId || undefined,
        items: cart.map(i => ({
          productId: i.id,
          quantity: i.quantity,
          price: i.price,
          cost: i.cost || 0
        }))
      });
      toast.success("Sale completed successfully!");
      setCart([]);
      setDiscount(0);
      setAmountPaid(0);
      loadProducts();
    } catch (error) {
      toast.error("Checkout failed");
    } finally {
      setIsCheckingOut(false);
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) || 
    p.sku?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex h-[calc(100vh-120px)] gap-6">
      {/* Product Grid */}
      <div className="flex-1 flex flex-col gap-6">
        <div className="relative group">
          <div className="absolute inset-0 bg-primary/10 blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity rounded-2xl"></div>
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5 z-10" />
          <input
            type="text"
            placeholder="Search products by name or SKU..."
            className="w-full pl-12 pr-4 py-4 rounded-2xl bg-card border border-border focus:border-primary/50 focus:ring-0 transition-all outline-none relative z-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex-1 overflow-y-auto pr-2 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 content-start custom-scrollbar">
          {isLoading ? (
            <div className="col-span-full h-64 flex items-center justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-secondary" />
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="col-span-full text-center py-20 bg-secondary/10 rounded-3xl border border-border">
              <p className="text-muted-foreground">No products found.</p>
            </div>
          ) : (
            filteredProducts.map((product) => {
              const stock = product.inventories.reduce((acc: any, inv: any) => acc + inv.quantity, 0);
              return (
                <button
                  key={product.id}
                  onClick={() => addItem(product)}
                  disabled={stock <= 0}
                  className="group p-5 bg-card hover:bg-accent/50 rounded-3xl border border-border hover:border-primary/30 transition-all text-left flex flex-col gap-3 relative overflow-hidden disabled:opacity-50"
                >
                  <div className="absolute top-0 right-0 w-16 h-16 bg-primary/5 blur-2xl rounded-full translate-x-1/2 -translate-y-1/2"></div>
                  <div className="text-[10px] font-black text-secondary uppercase tracking-widest">{product.category}</div>
                  <div className="font-bold text-lg leading-tight line-clamp-2 h-12">{product.name}</div>
                  <div className="flex justify-between items-end mt-2">
                    <div className="text-xl font-black text-foreground">${product.price.toFixed(2)}</div>
                    <div className={`text-xs font-medium px-2 py-1 rounded-full ${stock < 10 ? 'bg-red-500/10 text-red-400' : 'bg-green-500/10 text-green-400'}`}>
                      {stock} left
                    </div>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Cart Sidebar */}
      <div className="w-[420px] bg-card rounded-[40px] border border-border flex flex-col overflow-hidden shadow-2xl relative">
        <div className="absolute inset-0 bg-gradient-to-b from-secondary/5 to-transparent pointer-events-none"></div>
        
        <div className="p-8 border-b border-border flex justify-between items-center relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-secondary/20 flex items-center justify-center">
              <ShoppingCart className="w-5 h-5 text-secondary" />
            </div>
            <h2 className="text-xl font-black">Current Order</h2>
          </div>
          <button onClick={() => setCart([])} className="text-xs font-bold text-muted-foreground hover:text-foreground transition-colors">CLEAR</button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-6 relative z-10 custom-scrollbar">
          {/* Customer Selection */}
          <div className="flex items-center gap-3 bg-secondary/10 p-3 rounded-2xl border border-border">
            <User className="w-5 h-5 text-secondary" />
            <select 
              value={selectedCustomerId}
              onChange={(e) => setSelectedCustomerId(e.target.value)}
              className="bg-transparent text-sm font-bold w-full outline-none appearance-none"
            >
              <option value="" className="bg-background text-foreground">Walk-in Customer</option>
              {customers.map(c => (
                <option key={c.id} value={c.id} className="bg-background text-foreground">{c.name}</option>
              ))}
            </select>
          </div>

          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center opacity-40 py-10">
              <div className="w-20 h-20 rounded-full border-2 border-dashed border-border mb-6 flex items-center justify-center">
                <ShoppingCart className="w-8 h-8" />
              </div>
              <p className="text-sm">Your order is empty.<br/>Select items to get started.</p>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="flex gap-4 items-center animate-in fade-in slide-in-from-right-4">
                <div className="flex-1">
                  <div className="font-bold text-base leading-none mb-1">{item.name}</div>
                  <div className="text-xs text-muted-foreground">${item.price.toFixed(2)} / unit</div>
                </div>
                <div className="flex items-center gap-3 bg-secondary/10 rounded-2xl p-1.5 border border-border">
                  <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-8 h-8 flex items-center justify-center hover:bg-secondary/20 rounded-xl transition-colors"><Minus className="w-3 h-3" /></button>
                  <span className="text-sm font-black w-4 text-center">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-8 h-8 flex items-center justify-center hover:bg-secondary/20 rounded-xl transition-colors"><Plus className="w-3 h-3" /></button>
                </div>
                <div className="font-black text-base w-20 text-right">${(item.price * item.quantity).toFixed(2)}</div>
              </div>
            ))
          )}
        </div>

        <div className="p-8 bg-secondary/30 border-t border-border space-y-4 relative z-10">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2 bg-secondary/10 px-3 py-2 rounded-xl border border-border">
              <Percent className="w-4 h-4 text-muted-foreground" />
              <input 
                type="number"
                placeholder="Tax %"
                className="bg-transparent text-xs font-bold w-full outline-none"
                value={taxRate * 100 || ''}
                onChange={(e) => setTaxRate(parseFloat(e.target.value) / 100 || 0)}
              />
            </div>
            <div className="flex items-center gap-2 bg-secondary/10 px-3 py-2 rounded-xl border border-border">
              <ReceiptText className="w-4 h-4 text-muted-foreground" />
              <input 
                type="number"
                placeholder="Discount $"
                className="bg-transparent text-xs font-bold w-full outline-none"
                value={discount || ''}
                onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
              />
            </div>
          </div>

          <div className="space-y-2 pt-2">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Subtotal</span>
              <span>${getSubtotal().toFixed(2)}</span>
            </div>
            {taxRate > 0 && (
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Tax ({(taxRate * 100).toFixed(0)}%)</span>
                <span>${getTaxAmount().toFixed(2)}</span>
              </div>
            )}
            {discount > 0 && (
              <div className="flex justify-between text-xs text-red-500">
                <span>Discount</span>
                <span>-${discount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-2xl font-black pt-4 border-t border-border">
              <span>Total</span>
              <span className="text-primary font-black">${getTotal().toFixed(2)}</span>
            </div>
          </div>
          
          <div className="flex flex-col gap-4 pt-2">
            <div className="grid grid-cols-2 gap-2 bg-secondary/10 p-1 rounded-2xl border border-border">
              <button 
                onClick={() => setSelectedMethod('CASH')}
                className={`flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-black transition-all ${selectedMethod === 'CASH' ? 'bg-card shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
              >
                <Banknote className="w-4 h-4 text-green-500" /> CASH
              </button>
              <button 
                onClick={() => setSelectedMethod('CARD')}
                className={`flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-black transition-all ${selectedMethod === 'CARD' ? 'bg-card shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
              >
                <CreditCard className="w-4 h-4 text-primary" /> CARD
              </button>
            </div>

            {selectedCustomerId && (
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black text-muted-foreground uppercase">Amount Paid (for dues)</label>
                <input 
                  type="number"
                  className="w-full bg-secondary/10 border border-border rounded-xl px-4 py-2 text-sm font-bold text-foreground outline-none focus:border-primary/50 transition-all"
                  placeholder="Leave empty for full payment"
                  value={amountPaid || ''}
                  onChange={(e) => setAmountPaid(parseFloat(e.target.value) || 0)}
                />
              </div>
            )}

            <button 
              onClick={handleCheckout}
              disabled={cart.length === 0 || isCheckingOut}
              className="w-full py-4 rounded-2xl bg-primary text-primary-foreground font-black text-lg hover:opacity-90 transition-all disabled:opacity-30 shadow-lg shadow-primary/20 flex items-center justify-center gap-3"
            >
              {isCheckingOut ? <Loader2 className="w-6 h-6 animate-spin" /> : <ReceiptText className="w-6 h-6" />}
              {isCheckingOut ? 'PROCESSING...' : 'COMPLETE SALE'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
