import { useState, useEffect } from 'react';
import { getProducts } from '../api';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
