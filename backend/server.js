require('dotenv').config();
const mysql = require('mysql2/promise');
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;
const config = {
  host: process.env.DB_HOST || '127.0.0.1',
  port: Number(process.env.DB_PORT) || 3307,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'taski_db',
  charset: 'utf8mb4',
};

let pool;

async function connectDB() {
  try {
    pool = await mysql.createPool(config);
    const conn = await pool.getConnection();
    conn.release();
    console.log('Connected to MySQL');
  } catch (err) {
    console.error('DB connection failed:', err.message);
    process.exit(1);
  }
}
connectDB();

app.get('/', (req, res) => res.send('Server is running!'));
app.get('/health', (req, res) => res.send('OK'));

app.get('/api/products', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM products');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/login', async (req, res) => {
  const { username, password } = req.body || {};
  try {
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

app.post('/api/orders', async (req, res) => {
  const { user_id, product_id, quantity } = req.body || {};
  try {
    const qty = Number(quantity);
    if (!qty || qty < 1) {
      return res.status(400).json({ message: 'Quantity must be at least 1' });
    }
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
    await pool.query(
      'INSERT INTO orders (user_id, product_id, quantity, total) VALUES (?, ?, ?, ?)',
      [user_id, product_id, qty, total]
    );
    await pool.query('UPDATE products SET stock = stock - ? WHERE id = ?', [
      qty,
      product_id,
    ]);
    res.status(201).json({ message: 'Order created successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
