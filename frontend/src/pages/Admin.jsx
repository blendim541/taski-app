import { useEffect, useState } from "react";

export default function Admin() {
  const [products, setProducts] = useState([]);

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [category, setCategory] = useState("");

  const API = "http://localhost:3000/api/products";

  // GET PRODUCTS
  const fetchProducts = async () => {
    const res = await fetch(API);
    const data = await res.json();
    setProducts(data);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // ADD PRODUCT (POST)
  const addProduct = async () => {
    if (!name || !price || !stock || !category) {
      alert("Fill all fields");
      return;
    }

    await fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, price, stock, category }),
    });

    setName("");
    setPrice("");
    setStock("");
    setCategory("");

    fetchProducts();
  };

  // DELETE PRODUCT
  const deleteProduct = async (id) => {
    await fetch(`${API}/${id}`, {
      method: "DELETE",
    });

    fetchProducts();
  };

  // UPDATE PRODUCT (EDIT)
  const updateProduct = async (id) => {
    const newName = prompt("New name:");
    const newPrice = prompt("New price:");
    const newStock = prompt("New stock:");
    const newCategory = prompt("New category:");

    if (!newName || !newPrice || !newStock || !newCategory) return;

    await fetch(`${API}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: newName,
        price: newPrice,
        stock: newStock,
        category: newCategory,
      }),
    });

    fetchProducts();
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Admin Panel</h1>

      <h3>Add Product</h3>
      <input placeholder="name" value={name} onChange={(e)=>setName(e.target.value)} />
      <input placeholder="price" value={price} onChange={(e)=>setPrice(e.target.value)} />
      <input placeholder="stock" value={stock} onChange={(e)=>setStock(e.target.value)} />
      <input placeholder="category" value={category} onChange={(e)=>setCategory(e.target.value)} />
      <button onClick={addProduct}>Add</button>

      <hr />

      <h3>Products</h3>

      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>Name</th>
            <th>Category</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {products.map((p) => (
            <tr key={p.id}>
              <td>{p.name}</td>
              <td>{p.category}</td>
              <td>{p.price}</td>
              <td>{p.stock}</td>
              <td>
                <button onClick={()=>updateProduct(p.id)}>Edit</button>
                <button onClick={()=>deleteProduct(p.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
