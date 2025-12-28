import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:5112/api/Auth/login', { username, password });
            login(res.data.token);
            navigate('/dashboard');
        } catch (err) {
            setError('Invalid credentials');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-100">
            <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-slate-200">
                <h2 className="text-3xl font-black text-indigo-600 mb-6 text-center uppercase tracking-tight">Login</h2>
                {error && <p className="text-red-500 mb-4 text-center font-bold bg-red-50 p-2 rounded-lg">{error}</p>}
                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-slate-700 font-bold mb-2">Username</label>
                        <input
                            type="text"
                            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-100 transition-all font-medium text-slate-700"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-slate-700 font-bold mb-2">Password</label>
                        <input
                            type="password"
                            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-100 transition-all font-medium text-slate-700"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-xl text-lg shadow-lg shadow-indigo-200 transition-all transform hover:scale-[1.02]">
                        LOGIN
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
