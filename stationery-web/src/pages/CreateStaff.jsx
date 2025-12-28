import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const CreateStaff = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5112/api/Auth/create-staff', { username, password, role: "Staff" });
            alert("Staff member created successfully!");
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create staff');
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 p-6 flex flex-col items-center">
            <div className="w-full max-w-lg">
                <Link to="/dashboard" className="text-slate-500 font-bold mb-4 inline-block hover:text-indigo-600">&larr; Back to Dashboard</Link>
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                    <h2 className="text-2xl font-black text-indigo-600 mb-6 uppercase">Create New Staff</h2>
                    {error && <p className="text-red-500 mb-4 font-bold">{error}</p>}
                    <form onSubmit={handleCreate} className="space-y-4">
                        <div>
                            <label className="block text-slate-700 font-bold mb-2">Username</label>
                            <input
                                type="text"
                                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-100"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-slate-700 font-bold mb-2">Password</label>
                            <input
                                type="password"
                                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-100"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-all shadow-md">
                            Create Staff Account
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreateStaff;
