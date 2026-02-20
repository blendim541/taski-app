CREATE DATABASE IF NOT EXISTS taski_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE taski_db;
SET NAMES utf8mb4;

DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) NOT NULL,
  password VARCHAR(255) NOT NULL
);

CREATE TABLE products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  category VARCHAR(50),
  price DECIMAL(10,2) NOT NULL,
  stock INT DEFAULT 10
);

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

INSERT INTO products (name, category, price)
VALUES
('Molla', 'Fruta', 1.20),
('Dardha', 'Fruta', 1.50),
('Domate', 'Perime', 2.00),
('Shampon', 'Higjene', 4.50);

INSERT INTO users (username, password)
VALUES ('admin', 'admin');
