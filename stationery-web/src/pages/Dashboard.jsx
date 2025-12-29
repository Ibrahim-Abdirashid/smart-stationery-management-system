import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import SalesHistory from '../SalesHistory';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

const API_URL = "http://localhost:5112/api/Products";

function Dashboard() {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [activeTab, setActiveTab] = useState('overview'); // Controls the view
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
            setActiveTab('products'); // Redirect to products after add
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
        setActiveTab('add-product'); // Switch to form
    };

    const renderContent = () => {
        // Calculate Metrics
        const totalRevenue = sales.reduce((acc, curr) => acc + (curr.price || 0), 0);
        const today = new Date().toISOString().split('T')[0];
        const todaysSales = sales.filter(s => s.saleDate && s.saleDate.startsWith(today));
        const todaysRevenue = todaysSales.reduce((acc, curr) => acc + (curr.price || 0), 0);
        const lowStockCount = products.filter(p => p.quantity < 5).length;

        switch (activeTab) {
            case 'overview':
                return (
                    <div>
                        <h2 className="text-3xl font-black text-slate-800 mb-8">Dashboard Overview</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                                <span className="text-4xl mb-2 block">💰</span>
                                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Total Revenue</h3>
                                <p className="text-3xl font-black text-indigo-600">${totalRevenue.toFixed(2)}</p>
                            </div>
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                                <span className="text-4xl mb-2 block">📈</span>
                                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Today's Revenue</h3>
                                <p className="text-3xl font-black text-emerald-500">${todaysRevenue.toFixed(2)}</p>
                                <p className="text-xs text-slate-400 font-bold mt-1">{todaysSales.length} Transactions</p>
                            </div>
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                                <span className="text-4xl mb-2 block">📦</span>
                                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Total Products</h3>
                                <p className="text-3xl font-black text-slate-800">{products.length}</p>
                            </div>
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                                <span className="text-4xl mb-2 block">⚠️</span>
                                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Low Stock</h3>
                                <p className={`text-3xl font-black ${lowStockCount > 0 ? 'text-red-500' : 'text-slate-300'}`}>{lowStockCount}</p>
                            </div>
                        </div>

                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                            <h3 className="text-xl font-bold mb-6 text-slate-800">Recent Transactions</h3>
                            <SalesHistory sales={sales.slice().reverse().slice(0, 5)} />
                        </div>
                    </div>
                );
            case 'products':
                return (
                    <div>
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-3xl font-black text-slate-800">Product Inventory</h2>
                            {user?.role === 'Owner' && (
                                <button onClick={() => setActiveTab('add-product')} className="bg-indigo-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-indigo-700">+ Add Product</button>
                            )}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {products.map((p) => (
                                <div key={p.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 relative group">
                                    {user?.role === "Owner" && (
                                        <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => handleEdit(p)} className="bg-slate-100 hover:bg-indigo-100 text-indigo-600 p-2 rounded-lg" title="Edit">✏️</button>
                                            <button onClick={() => handleDelete(p.id)} className="bg-slate-100 hover:bg-red-100 text-red-600 p-2 rounded-lg" title="Delete">🗑️</button>
                                        </div>
                                    )}
                                    <div className="flex justify-between items-start mb-4">
                                        <h3 className="text-lg font-bold">{p.name}</h3>
                                        <span className="text-xs font-black bg-slate-100 text-slate-500 px-2 py-1 rounded-md uppercase">{p.category}</span>
                                    </div>
                                    <div className="flex justify-between items-center mb-6">
                                        <span className="text-3xl font-black text-indigo-600 tracking-tight">${p.price}</span>
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${p.quantity > 5 ? "bg-slate-100 text-slate-500" : p.quantity > 0 ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-600"}`}>
                                            {p.quantity > 0 ? `Stock: ${p.quantity}` : "Out of Stock"}
                                        </span>
                                    </div>
                                    <button onClick={() => handleSell(p)} disabled={p.quantity <= 0} className={`w-full py-4 rounded-xl font-bold text-sm tracking-wider transition-all transform active:scale-95 ${p.quantity > 0 ? "bg-slate-900 text-white hover:bg-indigo-600 hover:shadow-lg shadow-slate-200" : "bg-slate-100 text-slate-400 cursor-not-allowed"}`}>
                                        {p.quantity > 0 ? "SELL ITEM" : "UNAVAILABLE"}
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            case 'sales':
                return <SalesHistory sales={sales} />;
            case 'add-product':
                return (
                    <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                        <h2 className="text-2xl font-black text-indigo-600 mb-6">{editingId ? "Edit Product" : "Add New Product"}</h2>
                        <form onSubmit={editingId ? handleUpdateProduct : handleAddProduct} className="space-y-6">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Product Name</label>
                                <input type="text" value={newProduct.name} onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })} className="w-full p-4 bg-slate-50 border rounded-xl outline-none focus:ring-2 focus:ring-indigo-100" required />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Category</label>
                                <select value={newProduct.category} onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })} className="w-full p-4 bg-slate-50 border rounded-xl outline-none focus:ring-2 focus:ring-indigo-100" required>
                                    <option value="" disabled>Select Category</option>
                                    <option value="Writing">Writing (Pens, Pencils)</option>
                                    <option value="Paper">Paper (Notebooks, A4)</option>
                                    <option value="Office">Office Supplies (Files, Staplers)</option>
                                    <option value="Art">Art Supplies</option>
                                    <option value="School">School Supplies</option>
                                    <option value="Technology">Technology</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Price ($)</label>
                                    <input type="number" value={newProduct.price} min="0" step="0.01" onChange={(e) => setNewProduct({ ...newProduct, price: parseFloat(e.target.value) })} className="w-full p-4 bg-slate-50 border rounded-xl outline-none focus:ring-2 focus:ring-indigo-100" required />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Quantity</label>
                                    <input type="number" value={newProduct.quantity} min="1" onChange={(e) => setNewProduct({ ...newProduct, quantity: parseInt(e.target.value) })} className="w-full p-4 bg-slate-50 border rounded-xl outline-none focus:ring-2 focus:ring-indigo-100" required />
                                </div>
                            </div>

                            {editingId ? (
                                <div className="flex gap-4">
                                    <button type="submit" className="flex-1 bg-emerald-600 text-white font-bold py-4 rounded-xl hover:bg-emerald-700 transition-all">Update Product</button>
                                    <button type="button" onClick={() => { setEditingId(null); setNewProduct({ name: "", category: "", price: 0, quantity: 0 }); setActiveTab('products'); }} className="flex-1 bg-slate-200 text-slate-600 font-bold py-4 rounded-xl hover:bg-slate-300 transition-all">Cancel</button>
                                </div>
                            ) : (
                                <button type="submit" className="w-full bg-indigo-600 text-white font-bold py-4 rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200">Save Product</button>
                            )}
                        </form>
                    </div>
                );
            case 'staff':
                navigate('/create-staff');
                return null;
            default:
                return <div>Select a menu item</div>;
        }
    };

    return (
        <div className="flex min-h-screen bg-slate-50 font-sans">
            <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
            <main className="flex-1 ml-64 p-10">
                {renderContent()}
            </main>
        </div>
    );
}

export default Dashboard;
