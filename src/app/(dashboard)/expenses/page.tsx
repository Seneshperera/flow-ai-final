"use client"

import { useState, useEffect } from 'react';
import { Plus, Trash2, DollarSign, Calendar, Tag, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [newExpense, setNewExpense] = useState({
    category: 'Rent',
    amount: '',
    description: '',
    date: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    // In a real app, fetch from server action
    setIsLoading(false);
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAdding(true);
    // Mock success
    setTimeout(() => {
      setExpenses([{ ...newExpense, id: Math.random(), amount: parseFloat(newExpense.amount) }, ...expenses]);
      toast.success("Expense logged successfully");
      setNewExpense({ category: 'Rent', amount: '', description: '', date: new Date().toISOString().split('T')[0] });
      setIsAdding(false);
    }, 500);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black tracking-tighter text-foreground">Financial Tracking</h1>
          <p className="text-muted-foreground mt-1">Log and monitor your business expenses.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Log Expense Form */}
        <div className="glass-panel p-8 border border-white/5 h-fit">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Plus className="w-5 h-5 text-primary" />
            Log New Expense
          </h2>
          <form onSubmit={handleAdd} className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Category</label>
              <select 
                value={newExpense.category}
                onChange={(e) => setNewExpense({...newExpense, category: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary/50 transition-all"
              >
                <option value="Rent" className="bg-background">Rent</option>
                <option value="Salaries" className="bg-background">Salaries</option>
                <option value="Utilities" className="bg-background">Utilities</option>
                <option value="Inventory" className="bg-background">Inventory Purchase</option>
                <option value="Marketing" className="bg-background">Marketing</option>
                <option value="Other" className="bg-background">Other</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Amount</label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input 
                  required
                  type="number"
                  step="0.01"
                  value={newExpense.amount}
                  onChange={(e) => setNewExpense({...newExpense, amount: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm outline-none focus:border-primary/50 transition-all"
                  placeholder="0.00"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Date</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input 
                  required
                  type="date"
                  value={newExpense.date}
                  onChange={(e) => setNewExpense({...newExpense, date: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm outline-none focus:border-primary/50 transition-all"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Description</label>
              <textarea 
                value={newExpense.description}
                onChange={(e) => setNewExpense({...newExpense, description: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary/50 transition-all h-24"
                placeholder="Details..."
              />
            </div>
            <button 
              disabled={isAdding}
              className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-bold shadow-lg shadow-primary/20 hover:opacity-90 transition-all flex items-center justify-center gap-2"
            >
              {isAdding ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
              Log Expense
            </button>
          </form>
        </div>

        {/* Expense History */}
        <div className="lg:col-span-2 space-y-4">
          <div className="glass-panel p-8 border border-white/5">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold tracking-tight">Recent Expenses</h2>
              <div className="text-sm font-bold text-primary">Total: ${expenses.reduce((acc, e) => acc + e.amount, 0).toFixed(2)}</div>
            </div>
            
            <div className="space-y-4">
              {expenses.length === 0 ? (
                <div className="text-center py-20 opacity-30">
                  <Tag className="w-12 h-12 mx-auto mb-4" />
                  <p>No expenses logged yet.</p>
                </div>
              ) : (
                expenses.map((expense) => (
                  <div key={expense.id} className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 group hover:border-white/10 transition-all">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
                        <Tag className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <div className="font-bold">{expense.category}</div>
                        <div className="text-xs text-muted-foreground">{expense.description || 'No description'}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <div className="font-black text-foreground">-${expense.amount.toFixed(2)}</div>
                        <div className="text-[10px] text-muted-foreground uppercase font-bold">{expense.date}</div>
                      </div>
                      <button className="p-2 text-muted-foreground hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
