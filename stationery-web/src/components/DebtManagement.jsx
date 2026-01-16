import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const DebtManagement = () => {
    const { user } = useContext(AuthContext);
    const [debtors, setDebtors] = useState([]);
    const [products, setProducts] = useState([]); // Fixed: Added products state using useState
    const [showAddModal, setShowAddModal] = useState(false);
    const [showDebtModal, setShowDebtModal] = useState(false);
    const [selectedDebtor, setSelectedDebtor] = useState(null);

    // Form States
    const [newDebtor, setNewDebtor] = useState({ name: '', phoneNumber: '' });
    const [debtRecord, setDebtRecord] = useState({ amount: '', description: '', productName: '', productId: '', quantity: 1 });

    const fetchDebtors = async () => {
        try {
            const res = await axios.get('http://localhost:5112/api/Debts');
            setDebtors(res.data);
        } catch (err) {
            console.error("Error fetching debtors", err);
        }
    };

    const fetchProducts = async () => {
        try {
            const res = await axios.get('http://localhost:5112/api/Products');
            setProducts(res.data);
        } catch (err) {
            console.error("Error fetching products", err);
        }
    };

    useEffect(() => {
        fetchDebtors();
        fetchProducts();
    }, []);

    const handleAddDebtor = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5112/api/Debts', newDebtor);
            setNewDebtor({ name: '', phoneNumber: '' });
            setShowAddModal(false);
            fetchDebtors();
        } catch (err) {
            alert("Failed to add customer");
        }
    };

    const handleAddDebt = async (e) => {
        e.preventDefault();
        if (!selectedDebtor) return;

        try {
            const payload = {
                amount: parseFloat(debtRecord.amount),
                description: debtRecord.description,
                productName: debtRecord.productName,
                productId: debtRecord.productId,
                quantity: parseInt(debtRecord.quantity)
            };

            await axios.post(`http://localhost:5112/api/Debts/${selectedDebtor.id}/add`, payload);

            setDebtRecord({ amount: '', description: '', productName: '', productId: '', quantity: 1 });
            setShowDebtModal(false);
            setSelectedDebtor(null);
            fetchDebtors();
        } catch (err) {
            console.error(err);
            const errorMessage = err.response?.data?.message || "Failed to add debt";
            alert(errorMessage);
        }
    };

    const openDebtModal = (debtor) => {
        setSelectedDebtor(debtor);
        setShowDebtModal(true);
    };

    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [paymentAmount, setPaymentAmount] = useState('');

    const handleDeleteRecord = async (debtorId, recordId) => {
        if (!window.confirm("Are you sure you want to delete this record? If it's a product, stock will be returned.")) return;
        try {
            await axios.delete(`http://localhost:5112/api/Debts/${debtorId}/records/${recordId}`);
            fetchDebtors();
        } catch (err) {
            console.error(err);
            alert("Failed to delete record");
        }
    };

    const handlePayDebt = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`http://localhost:5112/api/Debts/${selectedDebtor.id}/pay`, parseFloat(paymentAmount), {
                headers: { 'Content-Type': 'application/json' }
            });
            setShowPaymentModal(false);
            setPaymentAmount('');
            setSelectedDebtor(null);
            fetchDebtors();
        } catch (err) {
            console.error(err);
            alert("Payment failed");
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-black text-slate-800">Debt Management</h2>
                <h2 className="text-3xl font-black text-slate-800">Debt Management</h2>
                {['Owner', 'Staff'].includes(user?.role) && (
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="bg-indigo-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-indigo-700"
                    >
                        + Add Customer
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {debtors.map((debtor) => (
                    <div key={debtor.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 relative group">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-xl font-bold text-slate-800">{debtor.name}</h3>
                                <p className="text-sm text-slate-500 font-bold">{debtor.phoneNumber}</p>
                            </div>
                            <span className={`text-2xl font-black ${debtor.totalDebt > 0 ? "text-red-500" : "text-emerald-500"}`}>
                                ${debtor.totalDebt.toFixed(2)}
                            </span>
                        </div>

                        <div className="mb-6 max-h-40 overflow-y-auto">
                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Recent History</h4>
                            {debtor.debtHistory.slice().reverse().slice(0, 3).map((record, idx) => (
                                <div key={idx} className="flex justify-between items-center text-sm mb-2 border-b border-slate-50 pb-2 group/item">
                                    <div className="flex flex-col">
                                        <span className="text-slate-700 font-bold">
                                            {record.productName ? `${record.productName} (x${record.quantity || 1})` : (record.description || "Debt")}
                                        </span>
                                        {record.productName && record.description && (
                                            <span className="text-xs text-slate-400 block">{record.description}</span>
                                        )}
                                        <span className="text-[10px] text-slate-400 mt-1 block">
                                            {new Date(record.date).toLocaleDateString()} {new Date(record.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className={record.amount > 0 ? "text-red-500 font-bold" : "text-emerald-500 font-bold"}>
                                            {record.amount > 0 ? `+$${record.amount}` : `-$${Math.abs(record.amount)}`}
                                        </span>
                                        {['Owner', 'Staff'].includes(user?.role) && (
                                            <button
                                                onClick={() => handleDeleteRecord(debtor.id, record.recordId)}
                                                className="text-slate-400 hover:text-red-500 hidden group-hover/item:block"
                                                title="Delete Record"
                                            >
                                                ✕
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {['Owner', 'Staff'].includes(user?.role) && (
                            <div className="flex gap-2">
                                <button
                                    onClick={() => openDebtModal(debtor)}
                                    className="flex-1 py-3 bg-red-50 text-red-600 rounded-xl font-bold text-sm hover:bg-red-100 transition-all"
                                >
                                    Add Debt
                                </button>
                                <button
                                    onClick={() => { setSelectedDebtor(debtor); setShowPaymentModal(true); }}
                                    className="flex-1 py-3 bg-emerald-50 text-emerald-600 rounded-xl font-bold text-sm hover:bg-emerald-100 transition-all"
                                >
                                    Pay
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Pay Debt Modal */}
            {showPaymentModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl p-8 max-w-md w-full">
                        <h3 className="text-2xl font-bold mb-2">Record Payment</h3>
                        <p className="text-slate-500 mb-6">From {selectedDebtor?.name}</p>
                        <form onSubmit={handlePayDebt} className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Amount to Pay ($)</label>
                                <input
                                    required
                                    type="number"
                                    step="0.01"
                                    value={paymentAmount}
                                    onChange={e => setPaymentAmount(e.target.value)}
                                    className="w-full p-3 bg-slate-50 border rounded-xl"
                                    placeholder="Amount"
                                />
                            </div>
                            <div className="flex gap-3 mt-6">
                                <button type="button" onClick={() => setShowPaymentModal(false)} className="flex-1 py-3 bg-slate-100 font-bold rounded-xl">Cancel</button>
                                <button type="submit" className="flex-1 py-3 bg-emerald-600 text-white font-bold rounded-xl">Confirm Payment</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Add Customer Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl p-8 max-w-md w-full">
                        <h3 className="text-2xl font-bold mb-6">Add New Customer</h3>
                        <form onSubmit={handleAddDebtor} className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Name</label>
                                <input required type="text" value={newDebtor.name} onChange={e => setNewDebtor({ ...newDebtor, name: e.target.value })} className="w-full p-3 bg-slate-50 border rounded-xl" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Phone Number</label>
                                <input required type="text" value={newDebtor.phoneNumber} onChange={e => setNewDebtor({ ...newDebtor, phoneNumber: e.target.value })} className="w-full p-3 bg-slate-50 border rounded-xl" />
                            </div>
                            <div className="flex gap-3 mt-6">
                                <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 py-3 bg-slate-100 font-bold rounded-xl">Cancel</button>
                                <button type="submit" className="flex-1 py-3 bg-indigo-600 text-white font-bold rounded-xl">Save</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Add Debt Modal */}
            {showDebtModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl p-8 max-w-md w-full">
                        <h3 className="text-2xl font-bold mb-2">Add Debt</h3>
                        <p className="text-slate-500 mb-6">For {selectedDebtor?.name}</p>
                        <form onSubmit={handleAddDebt} className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Select Product (Stock)</label>
                                <select
                                    value={debtRecord.productId}
                                    onChange={(e) => {
                                        const prodId = e.target.value;
                                        const product = products.find(p => p.id === prodId);
                                        if (product) {
                                            setDebtRecord({
                                                ...debtRecord,
                                                productId: prodId,
                                                productName: product.name,
                                                amount: (product.price * debtRecord.quantity).toFixed(2)
                                            });
                                        } else {
                                            // Reset if manual or None
                                            setDebtRecord({ ...debtRecord, productId: '', productName: '', amount: '' });
                                        }
                                    }}
                                    className="w-full p-3 bg-slate-50 border rounded-xl"
                                >
                                    <option value="">Select a product...</option>
                                    {products.map(p => (
                                        <option key={p.id} value={p.id}>
                                            {p.name} - ${p.price} ({p.quantity} in stock)
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <label className="block text-sm font-bold text-slate-700 mb-1">Quantity</label>
                                    <input
                                        type="number"
                                        min="1"
                                        value={debtRecord.quantity}
                                        onChange={(e) => {
                                            const qty = parseInt(e.target.value) || 1;
                                            // Recalculate amount if product is selected
                                            let newAmount = debtRecord.amount;
                                            if (debtRecord.productId) {
                                                const product = products.find(p => p.id === debtRecord.productId);
                                                if (product) {
                                                    newAmount = (product.price * qty).toFixed(2);
                                                }
                                            }
                                            setDebtRecord({ ...debtRecord, quantity: qty, amount: newAmount });
                                        }}
                                        className="w-full p-3 bg-slate-50 border rounded-xl"
                                    />
                                </div>
                                <div className="flex-1">
                                    <label className="block text-sm font-bold text-slate-700 mb-1">Total Amount ($)</label>
                                    <input
                                        required
                                        type="number"
                                        step="0.01"
                                        value={debtRecord.amount}
                                        onChange={e => setDebtRecord({ ...debtRecord, amount: e.target.value })}
                                        className="w-full p-3 bg-slate-50 border rounded-xl"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Description (Optional)</label>
                                <input type="text" value={debtRecord.description} onChange={e => setDebtRecord({ ...debtRecord, description: e.target.value })} className="w-full p-3 bg-slate-50 border rounded-xl" placeholder="Notes..." />
                            </div>
                            <div className="flex gap-3 mt-6">
                                <button type="button" onClick={() => setShowDebtModal(false)} className="flex-1 py-3 bg-slate-100 font-bold rounded-xl">Cancel</button>
                                <button type="submit" className="flex-1 py-3 bg-red-600 text-white font-bold rounded-xl">Confirm Debt</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DebtManagement;
