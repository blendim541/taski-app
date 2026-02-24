/**
 * BACKEND SERVER (Node.js + Express)
 * This file is the API server. It connects to MySQL and exposes routes
 * that the React frontend calls (GET products, POST login, POST orders).
 */

// Load environment variables from .env file (so we don't hardcode passwords)
require('dotenv').config();
// mysql2/promise = talk to MySQL database using async/await
const mysql = require('mysql2/promise');
// express = web framework; we use it to define routes (GET, POST) and send JSON
const express = require('express');
// cors = allow the frontend (running on a different port) to call this API
const cors = require('cors');

const app = express();
app.use(cors()); // Allow requests from the React app (e.g. localhost:5173)
app.use(express.json()); // Parse JSON in request body (for POST /api/login and /api/orders)

// Server port (from .env or default 3000)
const PORT = process.env.PORT || 3000;
// Database connection settings (from .env so each dev can use their own MySQL)
const config = {
  host: process.env.DB_HOST || '127.0.0.1',
  port: Number(process.env.DB_PORT) || 3307,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'taski_db',
  charset: 'utf8mb4', // Support all characters (e.g. accents)
};

let pool; // Reuse this connection pool for all database queries

// Connect to MySQL when the server starts
async function connectDB() {
  try {
    pool = await mysql.createPool(config); // Pool = reuse connections
    const conn = await pool.getConnection();
    conn.release(); // Test that we can connect, then release
    console.log('Connected to MySQL');
  } catch (err) {
    console.error('DB connection failed:', err.message);
    process.exit(1); // Stop the server if DB is not available
  }
}
connectDB();

// --- ROUTES ---
// Simple checks so we know the server is running
app.get('/', (req, res) => res.send('Server is running!'));
app.get('/health', (req, res) => res.send('OK'));

// GET /api/products — return all products from the database (for the Products page)
app.get('/api/products', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM products');
    res.json(rows); // Send as JSON to the frontend
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/login — check username and password, return user if correct
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body || {};
  try {
    // ? and [username, password] = parameterized query (safe from SQL injection)
    const [rows] = await pool.query(
      'SELECT id, username FROM users WHERE username = ? AND password = ?',
      [username, password]
    );
    if (rows.length > 0) {
      res.json({ message: 'Login successful', user: rows[0] });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/orders — create a new order and reduce product stock
app.post('/api/orders', async (req, res) => {
  const { user_id, product_id, quantity } = req.body || {};
  try {
    const qty = Number(quantity);
    if (!qty || qty < 1) {
      return res.status(400).json({ message: 'Quantity must be at least 1' });
    }
    // Get product to check stock and price
    const [products] = await pool.query(
      'SELECT id, price, stock FROM products WHERE id = ?',
      [product_id]
    );
    if (products.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }
    const { stock } = products[0];
    if (qty > stock) {
      return res.status(400).json({
        message: `Quantity exceeds available stock (${stock} in stock)`,
      });
    }
    const [priceRow] = products;
    const total = Number(priceRow.price) * qty;
    // Insert the order with calculated total
    await pool.query(
      'INSERT INTO orders (user_id, product_id, quantity, total) VALUES (?, ?, ?, ?)',
      [user_id, product_id, qty, total]
    );
    // Decrease stock so we don't oversell
    await pool.query('UPDATE products SET stock = stock - ? WHERE id = ?', [
      qty,
      product_id,
    ]);
    res.status(201).json({ message: 'Order created successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
//routes for admin
app.post('/api/products', async (req, res) => {
  const { name, price, stock, category } = req.body || {};

  try {
    if (!name || name.toString().trim() === '') {
      return res.status(400).json({ message: 'Product name required' });
    }

    if (!category || category.toString().trim() === '') {
      return res.status(400).json({ message: 'Category required' });
    }

    const p = Number(price);
    const s = Number(stock);

    if (isNaN(p) || isNaN(s)) {
      return res.status(400).json({
        message: 'Price and stock must be numbers'
      });
    }

    await pool.query(
      'INSERT INTO products (name, price, stock, category) VALUES (?, ?, ?, ?)',
      [name.toString().trim(), p, s, category.toString().trim()]
    );

    res.status(201).json({ message: 'Product created successfully' });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// UPDATE PRODUCT
app.put('/api/products/:id', async (req, res) => {
  const { name, category, price, stock } = req.body || {};
  const id = req.params.id;
  try {
    if (!name || name.toString().trim() === '') {
      return res.status(400).json({ message: 'Name is required' });
    }
    const p = Number(price);
    const s = Number(stock);
    if (isNaN(p) || p < 0 || isNaN(s) || s < 0) {
      return res.status(400).json({ message: 'Price and stock must be non-negative numbers' });
    }
    const [result] = await pool.query(
      'UPDATE products SET name=?, category=?, price=?, stock=? WHERE id=?',
      [name.toString().trim(), category || null, p, s, id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({ message: 'Product updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



// DELETE PRODUCT
app.delete('/api/products/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query('DELETE FROM products WHERE id=?', [id]);
    res.json({ message: 'Product deleted successfully' });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start listening for HTTP requests
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
