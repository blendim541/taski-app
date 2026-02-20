/**
 * ORDER PAGE — Place an order.
 * We load products for the dropdown. User picks product, quantity (capped by stock),
 * and user ID. On submit we call createOrder() (POST /api/orders). The backend
 * checks stock, inserts the order, and decreases product stock.
 */
import { useState, useEffect } from 'react';
import { getProducts, createOrder } from '../api';

export default function Order() {
  const [products, setProducts] = useState([]);
  const [user_id, setUser_id] = useState(1);
  const [product_id, setProduct_id] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load products when the page opens (for the dropdown)
  useEffect(() => {
    getProducts()
      .then(setProducts)
      .catch(() => setMessage('Could not load products'))
      .finally(() => setLoading(false));
  }, []);

  const selectedProduct = products.find((p) => p.id === Number(product_id));
  const maxQty = selectedProduct ? (selectedProduct.stock ?? 0) : 0;

  // When user changes product or maxQty changes, clamp quantity to 1..maxQty
  useEffect(() => {
    if (maxQty > 0 && (Number(quantity) > maxQty || Number(quantity) < 1)) {
      setQuantity(Math.min(Math.max(1, Number(quantity) || 1), maxQty));
    }
  }, [product_id, maxQty]);

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage(null);
    const qty = Math.min(Math.max(1, Number(quantity) || 1), maxQty);
    if (qty > maxQty) {
      setMessage(`Error: Quantity cannot exceed stock (${maxQty} available).`);
      return;
    }
    try {
      await createOrder(Number(user_id), Number(product_id), qty);
      setMessage('Order created successfully.');
      setQuantity(1);
      getProducts().then(setProducts); // Refresh product list (stock has changed)
    } catch (err) {
      setMessage('Error: ' + err.message);
    }
  }

  if (loading) return <p>Loading…</p>;

  return (
    <div className="card">
      <h1>Place order</h1>
      <form onSubmit={handleSubmit}>
        <label>User ID</label>
        <input
          type="number"
          min="1"
          value={user_id}
          onChange={(e) => setUser_id(e.target.value)}
        />
        <label>Product</label>
        <select
          value={product_id}
          onChange={(e) => {
            setProduct_id(e.target.value);
            setQuantity(1);
          }}
          required
        >
          <option value="">Select product</option>
          {products.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name} — €{Number(p.price).toFixed(2)} (stock: {p.stock ?? 0})
            </option>
          ))}
        </select>
        {selectedProduct && (
          <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem' }}>
            Price: €{Number(selectedProduct.price).toFixed(2)} · In stock: {maxQty}
          </p>
        )}
        <label>Quantity (max {maxQty})</label>
        <input
          type="number"
          min="1"
          max={maxQty}
          value={quantity}
          onChange={(e) => {
            const v = parseInt(e.target.value, 10);
            if (!isNaN(v)) setQuantity(Math.max(1, Math.min(v, maxQty)));
          }}
        />
        <button type="submit" disabled={!maxQty || quantity > maxQty}>
          Create order
        </button>
      </form>
      {message && (
        <p className={message.startsWith('Error') ? 'error' : 'success'}>
          {message}
        </p>
      )}
    </div>
  );
}
