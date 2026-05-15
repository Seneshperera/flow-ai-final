import Database from '@tauri-apps/plugin-sql';

let db: Database | null = null;

export async function getDb() {
  if (db) return db;
  db = await Database.load('sqlite:pos.db');
  await initDb(db);
  return db;
}

async function initDb(database: Database) {
  // Create tables if they don't exist
  await database.execute(`
    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE
    );

    CREATE TABLE IF NOT EXISTS brands (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE
    );

    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      sku TEXT UNIQUE,
      price REAL NOT NULL,
      cost REAL NOT NULL,
      stock INTEGER DEFAULT 0,
      category_id INTEGER,
      brand_id INTEGER,
      unit TEXT DEFAULT 'pcs',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (category_id) REFERENCES categories (id),
      FOREIGN KEY (brand_id) REFERENCES brands (id)
    );

    CREATE TABLE IF NOT EXISTS customers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      phone TEXT,
      email TEXT,
      address TEXT,
      balance REAL DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS sales (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      customer_id INTEGER,
      total REAL NOT NULL,
      tax REAL DEFAULT 0,
      discount REAL DEFAULT 0,
      payment_method TEXT,
      synced INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (customer_id) REFERENCES customers (id)
    );

    CREATE TABLE IF NOT EXISTS sale_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      sale_id INTEGER NOT NULL,
      product_id INTEGER NOT NULL,
      quantity INTEGER NOT NULL,
      price REAL NOT NULL,
      cost REAL NOT NULL,
      FOREIGN KEY (sale_id) REFERENCES sales (id),
      FOREIGN KEY (product_id) REFERENCES products (id)
    );

    CREATE TABLE IF NOT EXISTS expenses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      category TEXT NOT NULL,
      amount REAL NOT NULL,
      description TEXT,
      date TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Seed default data if necessary
  const categories = await database.select<{ id: number }[]>('SELECT id FROM categories LIMIT 1');
  if (categories.length === 0) {
    await database.execute("INSERT INTO categories (name) VALUES ('General')");
  }
}

// Basic CRUD Helpers
export async function execute(query: string, values?: any[]) {
  const database = await getDb();
  return await database.execute(query, values);
}

export async function select<T>(query: string, values?: any[]): Promise<T[]> {
  const database = await getDb();
  return await database.select<T[]>(query, values);
}
