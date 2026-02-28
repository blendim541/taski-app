/**
 * APP — Main layout and routing.
 * The nav links stay visible on every page. When you click a link,
 * only the content inside <Routes> changes (Home, Products, Login, or Order).
 */
import { Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Products from './pages/Products';
import Login from './pages/Login';
import Order from './pages/Order';
import Admin from "./pages/Admin";
import User from "./pages/User";

function App() {
  return (
    <>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/products">Products</Link>
        <Link to="/login">Login</Link>
        <Link to="/order">Place order</Link>
      </nav>
      <main className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/login" element={<Login />} />
          <Route path="/order" element={<Order />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/user" element={<User />} />
        </Routes>
      </main>
    </>
  );
}

export default App;
