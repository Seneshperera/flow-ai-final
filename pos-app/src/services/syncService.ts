import { select, execute } from '../lib/db';

const CLOUD_URL = 'http://localhost:8000'; // FastAPI address

export const syncService = {
  async syncSales() {
    try {
      // 1. Fetch un-synced sales with items
      const unsyncedSales = await select<any[]>('SELECT * FROM sales WHERE synced = 0');
      
      if (unsyncedSales.length === 0) return { message: 'No sales to sync' };

      const salesToPush = [];
      for (const sale of (unsyncedSales as any)) {
        const items = await select<any[]>('SELECT * FROM sale_items WHERE sale_id = ?', [sale.id]);
        salesToPush.push({
          ...sale,
          items: (items as any).map((i: any) => ({
            product_id: i.product_id,
            quantity: i.quantity,
            price: i.price,
            cost: i.cost
          }))
        });
      }

      // 2. Push to FastAPI
      const response = await fetch(`${CLOUD_URL}/sync/sales`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(salesToPush)
      });

      if (response.ok) {
        // 3. Mark as synced locally
        for (const sale of (unsyncedSales as any)) {
          await execute('UPDATE sales SET synced = 1 WHERE id = ?', [sale.id]);
        }
        return { success: true, count: unsyncedSales.length };
      }
      
      throw new Error('Cloud sync failed');
    } catch (error) {
      console.error('Sync Error:', error);
      return { success: false, error };
    }
  }
};
