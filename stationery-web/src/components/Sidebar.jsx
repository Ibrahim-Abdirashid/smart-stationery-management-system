import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Sidebar = ({ activeTab, setActiveTab }) => {
    const { user, logout } = useContext(AuthContext);

    const menuItems = [
        { id: 'overview', label: 'Overview', icon: '📊' },
        { id: 'products', label: 'Products', icon: '📦' },
        { id: 'sales', label: 'Sales History', icon: '📝' },
    ];

    if (user?.role === 'Owner') {
        menuItems.push({ id: 'add-product', label: 'Add Product', icon: '➕' });
        menuItems.push({ id: 'staff', label: 'Manage Staff', icon: '👥' });
    }

    return (
        <div className="w-64 bg-slate-900 text-white min-h-screen flex flex-col fixed left-0 top-0">
            <div className="p-6 border-b border-slate-800">
                <h1 className="text-2xl font-black text-white uppercase tracking-tighter">
                    Smart<span className="text-indigo-500">Stationery</span>
                </h1>
                <p className="text-slate-500 text-xs mt-2 font-bold uppercase tracking-wider">
                    {user?.role} Portal
                </p>
            </div>

            <nav className="flex-1 p-4 space-y-2">
                {menuItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${activeTab === item.id
                                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/50'
                                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                            }`}
                    >
                        <span className="text-xl">{item.icon}</span>
                        {item.label}
                    </button>
                ))}
            </nav>

            <div className="p-4 border-t border-slate-800">
                <div className="flex items-center gap-3 px-4 py-3 mb-2">
                    <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center font-bold text-white">
                        {user?.username?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <p className="font-bold text-sm text-white">{user?.username}</p>
                        <p className="text-xs text-slate-500 capitalize">{user?.role}</p>
                    </div>
                </div>
                <button
                    onClick={logout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-red-400 hover:bg-slate-800 transition-all"
                >
                    <span>🚪</span>
                    Logout
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
