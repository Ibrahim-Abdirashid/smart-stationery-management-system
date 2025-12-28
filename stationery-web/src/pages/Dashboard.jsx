import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import SalesHistory from '../SalesHistory';
import { AuthContext } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

const API_URL = "http://localhost:5112/api/Products";

function Dashboard() {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [newProduct, setNewProduct] = useState({
        name: "",
        category: "",
        price: 0,
        quantity: 0,
    });
    const [sales, setSales] = useState([]);

    const [editingId, setEditingId] = useState(null);

    const fetchProducts = async () => {
        try {
            const res = await axios.get(API_URL);
            setProducts(res.data);
        } catch (err) {
            console.error("API error", err);
            if (err.response && err.response.status === 401) logout();
        }
    };

    const fetchSales = async () => {
        try {
            const res = await axios.get("http://localhost:5112/api/Sales");
            setSales(res.data);
        } catch (err) {
            console.error("Sales API error", err);
        }
    };

    useEffect(() => {
        fetchProducts();
        fetchSales();
    }, []);

    const handleSell = async (product) => {
        if (!product || !product.id) return;

        try {
            await axios.post(
                `http://localhost:5112/api/Products/sell/${product.id}`,
                1,
                { headers: { 'Content-Type': 'application/json' } }
            );

            const newSale = {
                productName: product.name,
                price: product.price,
                saleDate: new Date().toISOString()
            };

            await axios.post("http://localhost:5112/api/Sales", newSale);

            fetchProducts();
            fetchSales();
            alert("Iibka waa guuleystay!");
        } catch (err) {
            console.error("Cillad iibinta:", err.response?.data || err.message);
            alert("Ma suurtagalin iibinta.");
        }
    };

    const handleAddProduct = async (e) => {
        e.preventDefault();
        try {
            await axios.post(API_URL, newProduct);
            setNewProduct({ name: "", category: "", price: 0, quantity: 0 });
            fetchProducts();
            alert("Alaab cusub ayaa lagu daray!");
        } catch (err) {
            alert("Cillad ku darista ah", err);
        }
    };

    const handleUpdateProduct = async (e) => {
        e.preventDefault();
        if (!editingId) return;

        try {
            await axios.put(`${API_URL}/${editingId}`, newProduct);
            setNewProduct({ name: "", category: "", price: 0, quantity: 0 });
            setEditingId(null);
            fetchProducts();
            alert("Alaabta waa la cusboonaysiiyay!");
        } catch (err) {
            alert("Cillad cusboonaysiinta ah", err);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Ma hubtaa inaad tirtirto alaabtan?")) return;
        try {
            await axios.delete(`${API_URL}/${id}`);
            fetchProducts();
        } catch (err) {
            alert("Cillad tirtiridda ah", err);
        }
    };

    const handleEdit = (product) => {
        setEditingId(product.id);
        setNewProduct({
            name: product.name,
            category: product.category,
            price: product.price,
            quantity: product.quantity
        });
    };

    return (
        <div className="min-h-screen bg-slate-50 p-6 font-sans">
            <div className="max-w-5xl mx-auto">
                <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm mb-8 border border-slate-100">
                    <div>
                        <h1 className="text-2xl font-black text-indigo-600 uppercase">
                            Smart Stationery
                        </h1>
                        <p className="text-slate-400 text-sm font-bold">Welcome, {user?.username} ({user?.role})</p>
                    </div>
                    <div className="flex items-center gap-3">
                        {user?.role === "Owner" && (
                            <Link to="/create-staff" className="px-4 py-2 bg-indigo-100 text-indigo-700 font-bold rounded-xl hover:bg-indigo-200 transaction-all">
                                + Add Staff
                            </Link>
                        )}
                        <button
                            onClick={logout}
                            className="bg-slate-200 text-slate-600 font-bold py-2 px-4 rounded-xl hover:bg-slate-300 transition-all"
                        >
                            Logout
                        </button>
                    </div>
                </div>

                {user?.role === "Owner" && (
                    <div className="bg-white p-8 rounded-2xl shadow-sm mb-8 border-l-8 border-indigo-500">
                        <h2 className="text-xl font-bold mb-6">{editingId ? "Edit Product" : "Add New Product"}</h2>
                        <form
                            onSubmit={editingId ? handleUpdateProduct : handleAddProduct}
                            className="grid grid-cols-1 md:grid-cols-5 gap-4"
                        >
                            <input
                                type="text"
                                placeholder="Name"
                                value={newProduct.name}
                                onChange={(e) =>
                                    setNewProduct({ ...newProduct, name: e.target.value })
                                }
                                className="p-3 bg-slate-50 border rounded-xl outline-none"
                                required
                            />
                            <select
                                value={newProduct.category}
                                onChange={(e) =>
                                    setNewProduct({ ...newProduct, category: e.target.value })
                                }
                                className="p-3 bg-slate-50 border rounded-xl outline-none"
                                required
                            >
                                <option value="" disabled>Select Category</option>
                                <option value="Writing">Writing (Pens, Pencils)</option>
                                <option value="Paper">Paper (Notebooks, A4)</option>
                                <option value="Office">Office Supplies (Files, Staplers)</option>
                                <option value="Art">Art Supplies</option>
                                <option value="School">School Supplies</option>
                                <option value="Technology">Technology</option>
                                <option value="Other">Other</option>
                            </select>
                            <input
                                type="number"
                                placeholder="Price"
                                value={newProduct.price}
                                min="0"
                                step="0.01"
                                onChange={(e) =>
                                    setNewProduct({
                                        ...newProduct,
                                        price: parseFloat(e.target.value),
                                    })
                                }
                                className="p-3 bg-slate-50 border rounded-xl outline-none"
                                required
                            />
                            <input
                                type="number"
                                placeholder="Quantity"
                                value={newProduct.quantity}
                                min="1"
                                onChange={(e) =>
                                    setNewProduct({
                                        ...newProduct,
                                        quantity: parseInt(e.target.value),
                                    })
                                }
                                className="p-3 bg-slate-50 border rounded-xl outline-none"
                                required
                            />
                            {editingId ? (
                                <div className="flex gap-2">
                                    <button
                                        type="submit"
                                        className="bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 w-full"
                                    >
                                        Update
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setEditingId(null);
                                            setNewProduct({ name: "", category: "", price: 0, quantity: 0 });
                                        }}
                                        className="bg-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-300 w-full"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            ) : (
                                <button
                                    type="submit"
                                    className="bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700"
                                >
                                    Save
                                </button>
                            )}
                        </form>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.map((p) => (
                        <div
                            key={p.id}
                            className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 relative group"
                        >
                            {user?.role === "Owner" && (
                                <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => handleEdit(p)}
                                        className="bg-slate-100 hover:bg-indigo-100 text-indigo-600 p-2 rounded-lg"
                                        title="Edit"
                                    >
                                        ✏️
                                    </button>
                                    <button
                                        onClick={() => handleDelete(p.id)}
                                        className="bg-slate-100 hover:bg-red-100 text-red-600 p-2 rounded-lg"
                                        title="Delete"
                                    >
                                        🗑️
                                    </button>
                                </div>
                            )}
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="text-lg font-bold">{p.name}</h3>
                                <span className="text-xs font-black bg-slate-100 text-slate-500 px-2 py-1 rounded-md uppercase">
                                    {p.category}
                                </span>
                            </div>
                            <div className="flex justify-between items-center mb-6">
                                <span className="text-3xl font-black text-indigo-600 tracking-tight">
                                    ${p.price}
                                </span>
                                <span
                                    className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${p.quantity > 5
                                        ? "bg-slate-100 text-slate-500"
                                        : p.quantity > 0
                                            ? "bg-amber-100 text-amber-700"
                                            : "bg-red-100 text-red-600"
                                        }`}
                                >
                                    {p.quantity > 0 ? `Stock: ${p.quantity}` : "Out of Stock"}
                                </span>
                            </div>
                            <button
                                onClick={() => handleSell(p)}
                                disabled={p.quantity <= 0}
                                className={`w-full py-4 rounded-xl font-bold text-sm tracking-wider transition-all transform active:scale-95 ${p.quantity > 0
                                    ? "bg-slate-900 text-white hover:bg-indigo-600 hover:shadow-lg shadow-slate-200"
                                    : "bg-slate-100 text-slate-400 cursor-not-allowed"
                                    }`}
                            >
                                {p.quantity > 0 ? "SELL ITEM" : "UNAVAILABLE"}
                            </button>
                        </div>
                    ))}
                </div>
            </div>
            <SalesHistory sales={sales} />
        </div>
    );
}

export default Dashboard;
