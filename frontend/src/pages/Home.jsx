/**
 * HOME PAGE — First page you see.
 * Simple welcome and links to Products, Login, and Place order.
 */
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="card">
      <h1>Taski</h1>
      <p>
        <Link to="/products">View products</Link> · <Link to="/login">Login</Link> · <Link to="/order">Place order</Link>
      </p>
    </div>
  );
}
