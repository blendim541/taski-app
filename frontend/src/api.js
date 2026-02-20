/**
 * API — Helper functions to call the backend.
 * All requests go to the same origin (e.g. localhost:5173); Vite's proxy
 * forwards /api/* to the backend (localhost:3000) so we don't get CORS errors.
 *
 * VITE_API_URL: if you set it in .env, the frontend will call that URL instead
 * (useful when the backend is on another machine or port).
 */
const API_BASE = import.meta.env.VITE_API_URL || '';

// Generic request: send path + options, parse JSON, throw if response is not OK
async function request(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || data.error || res.statusText);
  return data;
}

// GET /api/products — used by Products page and Order page (to fill the dropdown)
export async function getProducts() {
  return request('/api/products');
}

// POST /api/login — send username and password, get back { message, user } or error
export async function login(username, password) {
  return request('/api/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  });
}

// POST /api/orders — create an order; backend checks stock and updates it
export async function createOrder(user_id, product_id, quantity) {
  return request('/api/orders', {
    method: 'POST',
    body: JSON.stringify({ user_id, product_id, quantity }),
  });
}
