const API_BASE = import.meta.env.VITE_API_URL || '';

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || data.error || res.statusText);
  return data;
}

export async function getProducts() {
  return request('/api/products');
}

export async function login(username, password) {
  return request('/api/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  });
}

export async function createOrder(user_id, product_id, quantity) {
  return request('/api/orders', {
    method: 'POST',
    body: JSON.stringify({ user_id, product_id, quantity }),
  });
}
