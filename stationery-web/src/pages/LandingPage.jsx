import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
    return (
        <div className="min-h-screen bg-slate-50 font-sans">
            {/* Header */}
            <header className="bg-white py-6 px-8 shadow-sm border-b border-slate-100 sticky top-0 z-50">
                <div className="max-w-6xl mx-auto flex justify-between items-center">
                    <h1 className="text-3xl font-black text-indigo-600 uppercase tracking-tighter">
                        Smart<span className="text-slate-800">Stationery</span>
                    </h1>
                    <Link to="/login" className="px-6 py-2 bg-slate-900 text-white font-bold rounded-lg hover:bg-slate-800 transition-all">
                        Login
                    </Link>
                </div>
            </header>

            {/* Hero Section */}
            <section className="py-24 px-6 bg-indigo-600 text-white text-center">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-5xl md:text-7xl font-black mb-6 tracking-tight leading-tight">
                        Premium Quality for Your Workspace.
                    </h2>
                    <p className="text-xl md:text-2xl text-indigo-100 mb-12 font-medium max-w-2xl mx-auto">
                        Manage your inventory, track sales, and streamline your stationery business with our modern platform.
                    </p>
                    <Link to="/login" className="inline-block px-10 py-5 bg-white text-indigo-600 font-black text-xl rounded-2xl shadow-2xl hover:shadow-xl transform hover:-translate-y-1 transition-all">
                        Get Started
                    </Link>
                </div>
            </section>

            {/* Features */}
            <section className="py-20 px-6 max-w-6xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    <div className="p-8 bg-white rounded-3xl shadow-lg border border-slate-100 hover:shadow-xl transition-all">
                        <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6 text-3xl">📦</div>
                        <h3 className="text-2xl font-bold mb-3 text-slate-800">Inventory Tracking</h3>
                        <p className="text-slate-500 leading-relaxed font-medium">Real-time updates on stock levels so you never run out of essential items.</p>
                    </div>
                    <div className="p-8 bg-white rounded-3xl shadow-lg border border-slate-100 hover:shadow-xl transition-all">
                        <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center mb-6 text-3xl">📊</div>
                        <h3 className="text-2xl font-bold mb-3 text-slate-800">Sales Analytics</h3>
                        <p className="text-slate-500 leading-relaxed font-medium">Detailed reports on your daily sales to help you make better business decisions.</p>
                    </div>
                    <div className="p-8 bg-white rounded-3xl shadow-lg border border-slate-100 hover:shadow-xl transition-all">
                        <div className="w-16 h-16 bg-teal-100 text-teal-600 rounded-2xl flex items-center justify-center mb-6 text-3xl">🔒</div>
                        <h3 className="text-2xl font-bold mb-3 text-slate-800">Secure Access</h3>
                        <p className="text-slate-500 leading-relaxed font-medium">Role-based access control ensures only authorized staff can manage sensitive data.</p>
                    </div>
                </div>
            </section>

            {/* Services Section */}
            <section className="py-20 px-6 bg-slate-100">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <span className="text-indigo-600 font-black tracking-wider uppercase text-sm">What We Offer</span>
                        <h2 className="text-4xl font-black text-slate-900 mt-2 mb-4">Everything You Need for Your Office</h2>
                        <p className="text-slate-500 font-medium text-lg">From premium pens to essential office files, we have it all.</p>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {[
                            { name: "Writing", desc: "Pens, Pencils & Markers", icon: "✏️" },
                            { name: "Paper", desc: "Notebooks, A4 & Diaries", icon: "📒" },
                            { name: "Office", desc: "Files, Folders & Organizers", icon: "📂" },
                            { name: "Art", desc: "Paints, Brushes & Canvas", icon: "🎨" },
                        ].map((s, i) => (
                            <div key={i} className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-all text-center border border-slate-200">
                                <span className="text-4xl mb-4 block">{s.icon}</span>
                                <h3 className="font-bold text-slate-800 text-lg mb-1">{s.name}</h3>
                                <p className="text-slate-400 text-sm font-medium">{s.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Our Team Section */}
            <section className="py-24 px-6 bg-white">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <span className="text-indigo-600 font-black tracking-wider uppercase text-sm">Meet The Expert Team</span>
                        <h2 className="text-4xl font-black text-slate-900 mt-2 mb-4">The People Behind SmartStationery</h2>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            { name: "Ibrahim Abdirashid", role: "Owner & Founder", img: "/team/team-1.jpeg" },
                            { name: "Abdirahman Jama", role: "Sales & Management", img: "/team/team-2.jpg" },
                            { name: "Ayub Jama", role: "Inventory Specialist", img: "/team/team-3.jpg" },
                            { name: "Yusuf Mire", role: "Customer Support", img: "/team/team-4.jpg" },
                        ].map((member, i) => (
                            <div key={i} className="group relative">
                                <div className="aspect-[3/4] overflow-hidden rounded-2xl bg-slate-100 mb-4 shadow-lg">
                                    <img
                                        src={member.img}
                                        alt={member.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900">{member.name}</h3>
                                <p className="text-indigo-600 font-bold text-sm uppercase tracking-wide">{member.role}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <section className="py-20 px-6 bg-slate-900 text-white">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-4xl font-black mb-8">Get In Touch</h2>
                    <div className="flex flex-col md:flex-row justify-center items-center gap-10">
                        <div className="bg-slate-800 p-8 rounded-2xl w-full md:w-1/2">
                            <span className="text-4xl mb-4 block">📞</span>
                            <h3 className="text-xl font-bold mb-2">Call Us</h3>
                            <p className="text-indigo-400 font-bold text-lg">+252 63 4456789</p>
                        </div>
                        <div className="bg-slate-800 p-8 rounded-2xl w-full md:w-1/2">
                            <span className="text-4xl mb-4 block">✉️</span>
                            <h3 className="text-xl font-bold mb-2">Email Us</h3>
                            <p className="text-indigo-400 font-bold text-lg">support@smartstationery.com</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-slate-900 text-slate-400 py-12 text-center border-t border-slate-800">
                <p className="font-bold">&copy; 2025 Smart Stationery. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default LandingPage;
