import React from 'react';
import { Inbox, BarChart2, Settings, Database, LogOut } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const Layout = ({ children, rightPanel }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const NavItem = ({ icon: Icon, path, label }) => {
        const isActive = location.pathname === path;
        return (
            <div
                onClick={() => navigate(path)}
                className={`nav-item group relative ${isActive ? 'active' : ''}`}
                title={label}
            >
                <Icon size={20} />
                <div className="absolute left-16 bg-slate-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                    {label}
                </div>
            </div>
        );
    };

    return (
        <div className="app-container font-sans bg-slate-50">
            {/* 1. Left Global Nav */}
            <aside className="main-nav">
                <div className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-500/40 mb-4">
                    <Database size={20} />
                </div>

                <div className="flex-1 w-full flex flex-col items-center gap-2">
                    <NavItem icon={Inbox} path="/" label="Tickets" />
                    <NavItem icon={BarChart2} path="/reporting" label="Analytics" />
                    <NavItem icon={Database} path="/data" label="Data Explorer" />
                </div>

                <div className="flex flex-col items-center gap-4 mb-4">
                    <button
                        onClick={() => navigate('/')}
                        className="w-10 h-10 bg-slate-800 rounded-2xl flex items-center justify-center text-slate-400 hover:text-white transition-all shadow-lg"
                        title="Logout"
                    >
                        <LogOut size={18} />
                    </button>
                </div>
            </aside>

            {/* 2. Main Content */}
            <main className="flex flex-col overflow-hidden relative">
                <div className="h-full overflow-y-auto">
                    {children}
                </div>
            </main>

            {/* 3. Agency Panel */}
            {rightPanel && (
                <aside className="prediction-panel">
                    {rightPanel}
                </aside>
            )}
        </div>
    );
};

export default Layout;
