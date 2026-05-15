import { execute, select, getDb } from '../lib/db';

export interface Sale {
  id?: number;
  customer_id?: number;
  total: number;
  tax: number;
  discount: number;
  payment_method: string;
  created_at?: string;
  items: SaleItem[];
}

export interface SaleItem {
  product_id: number;
  quantity: number;
  price: number;
  cost: number;
}

export const saleService = {
  async create(sale: Sale) {
    // We need a transaction for this
    // Tauri SQL doesn't have a built-in 'transaction' block in the API easily, 
    // so we'll execute them sequentially. In production, consider a custom Rust command for this.
    
    const result = await execute(
      'INSERT INTO sales (customer_id, total, tax, discount, payment_method) VALUES (?, ?, ?, ?, ?)',
      [sale.customer_id, sale.total, sale.tax, sale.discount, sale.payment_method]
    );

    // In Tauri SQL, 'execute' returns { lastInsertId, rowsAffected }
    const saleId = (result as any).lastInsertId;

    for (const item of sale.items) {
      await execute(
        'INSERT INTO sale_items (sale_id, product_id, quantity, price, cost) VALUES (?, ?, ?, ?, ?)',
        [saleId, item.product_id, item.quantity, item.price, item.cost]
      );

      // Update stock
      await execute(
        'UPDATE products SET stock = stock - ? WHERE id = ?',
        [item.quantity, item.product_id]
      );
    }

    return saleId;
  },

  async getAll() {
    return await select<Sale>('SELECT * FROM sales ORDER BY created_at DESC');
  }
};
