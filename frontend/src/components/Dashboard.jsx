import React, { useEffect, useState } from 'react';
import { Search, Filter, MoreHorizontal, Loader2, TrendingUp, ShieldCheck, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getTickets } from '../services/api';

const Dashboard = ({ onSelectTicket }) => {
    const [tickets, setTickets] = useState([]);
    const [filteredTickets, setFilteredTickets] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [filters, setFilters] = useState({
        team: 'all',
        priority: 'all',
        status: 'all'
    });
    const navigate = useNavigate();

    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            const data = await getTickets();
            const sorted = (data || []).sort((a, b) => b.id - a.id);
            setTickets(sorted);
            setFilteredTickets(sorted);
            setIsLoading(false);
        };
        loadData();
    }, []);

    useEffect(() => {
        let filtered = tickets;

        // Apply search filter
        if (searchQuery) {
            filtered = filtered.filter(t =>
                t.subject?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                t.requester?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                t.id.toString().includes(searchQuery)
            );
        }

        // Apply team filter
        if (filters.team !== 'all') {
            filtered = filtered.filter(t => t.support_team === filters.team);
        }

        // Apply priority filter
        if (filters.priority !== 'all') {
            filtered = filtered.filter(t => t.priority?.toLowerCase() === filters.priority.toLowerCase());
        }

        // Apply status filter
        if (filters.status !== 'all') {
            filtered = filtered.filter(t => t.status?.toLowerCase() === filters.status.toLowerCase());
        }

        setFilteredTickets(filtered);
    }, [searchQuery, tickets, filters]);

    return (
        <div className="p-10 max-w-[1200px] mx-auto">
            {/* Header Area */}
            <div className="flex justify-between items-end mb-12">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 text-[10px] font-black uppercase rounded tracking-widest">Enterprise Support</span>
                        <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                        <span className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Live Monitoring</span>
                    </div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight">The Agency Dashboard</h1>
                </div>
                <div className="flex gap-3">
                    <button className="btn-primary" onClick={() => navigate('/reporting')}>
                        <TrendingUp size={16} /> Reports
                    </button>
                </div>
            </div>

            {/* KPI Section */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-16">
                <KpiCard
                    label="Active Tickets"
                    value={tickets.length}
                    sub="Real-time count"
                    icon={TrendingUp}
                    color="text-indigo-600"
                />
                <KpiCard
                    label="Critical Issues"
                    value={tickets.filter(t => t.priority?.toLowerCase() === 'high').length}
                    sub="Requires attention"
                    icon={ShieldCheck}
                    color="text-rose-600"
                />
                <KpiCard
                    label="Autopilot Rate"
                    value="64%"
                    sub="AI Dispatching"
                    icon={Zap}
                    color="text-amber-500"
                />
                <KpiCard
                    label="Agent Happiness"
                    value="98%"
                    sub="Internal CSAT"
                    icon={ShieldCheck}
                    color="text-emerald-500"
                />
            </div>

            {/* List Header with Filters */}
            <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">Incoming Support Stream</h3>
                    <div className="text-xs text-slate-500 font-medium">
                        Showing {filteredTickets.length} of {tickets.length} tickets
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {/* Search */}
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                        <input
                            type="text"
                            placeholder="Search tickets..."
                            className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500/20"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    {/* Team Filter */}
                    <select
                        value={filters.team}
                        onChange={(e) => setFilters({ ...filters, team: e.target.value })}
                        className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:ring-2 focus:ring-indigo-500/20 cursor-pointer"
                    >
                        <option value="all">All Teams</option>
                        <option value="Billing and Payments">Billing</option>
                        <option value="Technical Support">Technical</option>
                        <option value="Product Support">Product</option>
                        <option value="General Experience">General</option>
                    </select>

                    {/* Priority Filter */}
                    <select
                        value={filters.priority}
                        onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
                        className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:ring-2 focus:ring-indigo-500/20 cursor-pointer"
                    >
                        <option value="all">All Priorities</option>
                        <option value="high">High</option>
                        <option value="medium">Medium</option>
                        <option value="low">Low</option>
                    </select>

                    {/* Status Filter */}
                    <select
                        value={filters.status}
                        onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                        className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:ring-2 focus:ring-indigo-500/20 cursor-pointer"
                    >
                        <option value="all">All Status</option>
                        <option value="open">Open</option>
                        <option value="solved">Solved</option>
                        <option value="pending">Pending</option>
                    </select>
                </div>
            </div>

            {/* Data Table */}
            <div className="ticket-table-container">
                {/* Header */}
                <div className="grid grid-cols-12 px-8 py-5 bg-slate-900 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-800">
                    <div className="col-span-1">ID</div>
                    <div className="col-span-2">Status</div>
                    <div className="col-span-5">Subject</div>
                    <div className="col-span-2">Requester</div>
                    <div className="col-span-2 text-right">Team</div>
                </div>

                {/* Rows */}
                {isLoading ? (
                    <div className="p-20 flex flex-col items-center justify-center gap-4 bg-white">
                        <Loader2 className="animate-spin text-indigo-500" size={40} />
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Connecting to Neural Layer...</span>
                    </div>
                ) : (
                    filteredTickets.map(t => (
                        <div
                            key={t.id}
                            onClick={() => onSelectTicket(t)}
                            className="table-row group"
                        >
                            <div className="col-span-1 text-xs font-mono text-slate-400 tracking-tighter group-hover:text-indigo-600 transition-colors">#{t.id}</div>
                            <div className="col-span-2">
                                <span className={`status-badge ${t.status?.toLowerCase() === 'solved' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                                    }`}>
                                    {t.status}
                                </span>
                            </div>
                            <div className="col-span-5 text-sm font-bold text-slate-700 truncate pr-8 group-hover:text-slate-900 transition-colors">
                                {t.subject}
                            </div>
                            <div className="col-span-2 text-xs font-semibold text-slate-500">{t.requester}</div>
                            <div className="col-span-2 text-right">
                                <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded-md text-[10px] font-bold group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                                    {t.support_team}
                                </span>
                            </div>
                        </div>
                    ))
                )}
                {!isLoading && filteredTickets.length === 0 && (
                    <div className="p-20 text-center bg-white rounded-b-3xl">
                        <div className="text-slate-200 mb-4 flex justify-center"><Search size={48} /></div>
                        <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">No matching tickets found</h3>
                        <p className="text-[10px] text-slate-400 mt-2 font-medium">Try adjusting your search or filters.</p>
                    </div>
                )}
            </div>
        </div >
    );
};

const KpiCard = ({ label, value, sub, icon: Icon, color }) => (
    <div className="kpi-card group">
        <div className="flex justify-between items-start mb-4">
            <div className={`p-3 rounded-2xl bg-slate-50 border border-slate-100 group-hover:scale-110 transition-transform duration-500 ${color}`}>
                <Icon size={24} />
            </div>
            <div className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{sub}</div>
        </div>
        <div className="text-3xl font-black text-slate-900 mb-1">{value}</div>
        <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">{label}</div>
    </div>
);

export default Dashboard;
