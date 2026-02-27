/**
 * LOGIN PAGE — Form to log in.
 * User types username and password. On submit we call login() (POST /api/login).
 * If the backend returns a user, we show "Logged in as ...". If not, we show the error.
 */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../api";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(null);

  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage(null);

    try {
      const data = await login(username, password);

      setMessage("Logged in as " + data.user.username);

      // redirect sipas role
      if (data.user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/user"); // ose homepage
      }

    } catch (err) {
      setMessage("Login failed: " + err.message);
    }
  }

  return (
    <div className="card">
      <h1>Login</h1>

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

      {message && <p>{message}</p>}
    </div>
  );
}
