/**
 * LOGIN PAGE — Form to log in.
 * User types username and password. On submit we call login() (POST /api/login).
 * If the backend returns a user, we show "Logged in as ...". If not, we show the error.
 */
import { useState } from 'react';
import { login } from '../api';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState(null);  // Success or error text
  const [user, setUser] = useState(null);       // After login, we store the user here

  async function handleSubmit(e) {
    e.preventDefault(); // Don't reload the page
    setMessage(null);
    try {
      const data = await login(username, password);
      setUser(data.user);
      setMessage('Logged in as ' + data.user.username);
    } catch (err) {
      setMessage('Login failed: ' + err.message);
    }
  }

  return (
    <div className="card">
      <h1>Login</h1>
      {user ? (
        <p className="success">{message}</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <label>Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Log in</button>
        </form>
      )}
      {message && !user && <p className="error">{message}</p>}
    </div>
  );
}
