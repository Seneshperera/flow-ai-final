import { execute, select } from '../lib/db';

export interface Product {
  id?: number;
  name: string;
  sku: string;
  price: number;
  cost: number;
  stock: number;
  category_id?: number;
  brand_id?: number;
  unit: string;
  created_at?: string;
}

export const productService = {
  async getAll() {
    return await select<Product>(`
      SELECT p.*, c.name as category_name, b.name as brand_name 
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN brands b ON p.brand_id = b.id
      ORDER BY p.created_at DESC
    `);
  },

  async add(product: Product) {
    return await execute(
      'INSERT INTO products (name, sku, price, cost, stock, category_id, brand_id, unit) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [product.name, product.sku, product.price, product.cost, product.stock, product.category_id, product.brand_id, product.unit]
    );
  },

  async update(id: number, product: Partial<Product>) {
    // Basic dynamic update logic could be complex in SQLite, keeping it simple for now
    return await execute(
      'UPDATE products SET name = ?, sku = ?, price = ?, cost = ?, stock = ?, category_id = ?, brand_id = ?, unit = ? WHERE id = ?',
      [product.name, product.sku, product.price, product.cost, product.stock, product.category_id, product.brand_id, product.unit, id]
    );
  },

  async delete(id: number) {
    return await execute('DELETE FROM products WHERE id = ?', [id]);
  }
};
