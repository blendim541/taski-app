-- ============================================================
-- DATABASE SCHEMA (MySQL)
-- Run this file once in TablePlus (or any MySQL client) to
-- create the database and tables. The backend (server.js) reads
-- from these tables.
-- ============================================================

-- Create the database and set UTF-8 so we can store any language
CREATE DATABASE IF NOT EXISTS taski_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE taski_db;
SET NAMES utf8mb4;

-- Remove old tables if they exist (order matters: orders references products and users)
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS users;

-- Table: users — people who can log in and place orders
-- id: auto-generated number (1, 2, 3...); PRIMARY KEY = unique identifier
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) NOT NULL,
  password VARCHAR(255) NOT NULL
);

-- Table: products — items we sell (name, category, price, how many in stock)
CREATE TABLE products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  category VARCHAR(50),
  price DECIMAL(10,2) NOT NULL,
  stock INT DEFAULT 10
);

-- Table: orders — each row = one order (which user bought which product, how many, total price)
-- FOREIGN KEY = user_id must exist in users table, product_id must exist in products table
CREATE TABLE orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  product_id INT NOT NULL,
  quantity INT NOT NULL,
  total DECIMAL(10,2) NOT NULL DEFAULT 0,
  order_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (product_id) REFERENCES products(id)
);

-- Insert some sample products so the app has data to show
INSERT INTO products (name, category, price)
VALUES
('Molla', 'Fruta', 1.20),
('Dardha', 'Fruta', 1.50),
('Domate', 'Perime', 2.00),
('Shampon', 'Higjene', 4.50);

-- Insert one user so you can log in (username: admin, password: admin)
INSERT INTO users (username, password)
VALUES ('admin', 'admin');
