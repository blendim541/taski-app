import { useState } from 'react';
import { login } from '../api';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState(null);
  const [user, setUser] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
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
