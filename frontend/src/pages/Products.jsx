/**
 * PRODUCTS PAGE — Lists all products from the database.
 * On load we call getProducts() (which hits GET /api/products). We show
 * loading until the data arrives, then render name, category, price, and stock.
 */
import { useState, useEffect } from 'react';
import { getProducts } from '../api';

export default function Products() {
  const [products, setProducts] = useState([]);   // List of products from API
  const [loading, setLoading] = useState(true);    // true while we're fetching
  const [error, setError] = useState(null);       // Error message if fetch fails

  // Run once when the component mounts (empty dependency array [])
  useEffect(() => {
    getProducts()
      .then(setProducts)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading products…</p>;
  if (error) return <p className="error">Error: {error}</p>;

  return (
    <div>
      <h1>Products</h1>
      {products.length === 0 ? (
        <p>No products.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {products.map((p) => (
            <li key={p.id} className="card">
              <strong>{p.name}</strong> — {p.category}
              <br />
              Price: €{Number(p.price).toFixed(2)} · Stock: {p.stock != null ? p.stock : 0}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
