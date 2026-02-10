import React, { useState, useEffect } from 'react';
import Layout from './Layout';
import { AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { TrendingUp, Database, Target, Zap, Loader2 } from 'lucide-react';
import { getAnalyticsSummary } from '../services/api';

const AgencyAnalytics = () => {
    const [loading, setLoading] = useState(true);
    const [kpis, setKpis] = useState(null);
    const [categories, setCategories] = useState([]);
    const [timeline, setTimeline] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadAnalytics();
    }, []);

    const loadAnalytics = async () => {
        try {
            setLoading(true);
            const data = await getAnalyticsSummary();
            setKpis(data.kpis);
            setCategories(data.categories);
            setTimeline(data.timeline);
            setError(null);
        } catch (err) {
            console.error('Failed to load analytics:', err);
            setError('Failed to load analytics data');
        } finally {
            setLoading(false);
        }
    };

    // Colors for pie chart
    const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'];

    if (loading) {
        return (
            <Layout>
                <div className="flex items-center justify-center h-screen">
                    <div className="text-center">
                        <Loader2 className="w-12 h-12 animate-spin text-indigo-600 mx-auto mb-4" />
                        <p className="text-sm font-bold text-slate-600">Loading Analytics...</p>
                    </div>
                </div>
            </Layout>
        );
    }

    if (error) {
        return (
            <Layout>
                <div className="flex items-center justify-center h-screen">
                    <div className="text-center">
                        <p className="text-sm font-bold text-red-600">{error}</p>
                        <button
                            onClick={loadAnalytics}
                            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold"
                        >
                            Retry
                        </button>
                    </div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="p-10 max-w-[1400px] mx-auto">
                {/* Header */}
                <div className="mb-12">
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">Agency Analytics</h1>
                    <p className="text-sm text-slate-500 font-medium">ML Model Performance Dashboard</p>
                </div>

                {/* KPI Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    <KpiCard
                        label="AI Accuracy"
                        value={`${kpis?.ai_accuracy || 0}%`}
                        sub="Model Performance"
                        icon={Target}
                        color="text-indigo-600"
                    />
                    <KpiCard
                        label="Total Tickets"
                        value={kpis?.total_tickets?.toLocaleString() || '0'}
                        sub="Dataset Size"
                        icon={Database}
                        color="text-emerald-500"
                    />
                    <KpiCard
                        label="Predictions Made"
                        value={kpis?.predictions_made?.toLocaleString() || '0'}
                        sub="AI Processed"
                        icon={Zap}
                        color="text-amber-500"
                    />
                    <KpiCard
                        label="Avg Confidence"
                        value={`${kpis?.avg_confidence || 0}%`}
                        sub="Model Certainty"
                        icon={TrendingUp}
                        color="text-purple-600"
                    />
                </div>

                {/* Charts Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Prediction Activity Line Chart */}
                    <div className="glass rounded-[32px] p-8 shadow-2xl">
                        <div className="mb-6">
                            <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest mb-1">Prediction Activity</h3>
                            <p className="text-[10px] text-slate-500 font-medium">Daily AI prediction volume (Last 7 days)</p>
                        </div>
                        <div className="h-72 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={timeline}>
                                    <defs>
                                        <linearGradient id="colorActivity" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                    <XAxis
                                        dataKey="day"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fontSize: 11, fontWeight: 'bold', fill: '#64748b' }}
                                    />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fontSize: 11, fontWeight: 'bold', fill: '#64748b' }}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: '#1e293b',
                                            border: 'none',
                                            borderRadius: '12px',
                                            fontSize: '12px',
                                            fontWeight: 'bold',
                                            color: '#fff'
                                        }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="count"
                                        stroke="#6366f1"
                                        strokeWidth={3}
                                        fillOpacity={1}
                                        fill="url(#colorActivity)"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Category Distribution Pie Chart */}
                    <div className="glass rounded-[32px] p-8 shadow-2xl">
                        <div className="mb-6">
                            <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest mb-1">Category Distribution</h3>
                            <p className="text-[10px] text-slate-500 font-medium">Ticket breakdown by priority/category</p>
                        </div>
                        <div className="h-72 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={categories}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={({ category, percentage }) => `${category}: ${percentage}%`}
                                        outerRadius={100}
                                        fill="#8884d8"
                                        dataKey="count"
                                    >
                                        {categories.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: '#1e293b',
                                            border: 'none',
                                            borderRadius: '12px',
                                            fontSize: '12px',
                                            fontWeight: 'bold',
                                            color: '#fff'
                                        }}
                                    />
                                    <Legend
                                        wrapperStyle={{ fontSize: '11px', fontWeight: 'bold' }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* Model Health Insight */}
                <div className="mt-8 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-[32px] p-8 text-white shadow-2xl">
                    <div className="flex items-start justify-between">
                        <div>
                            <h3 className="text-xs font-black text-indigo-100 uppercase tracking-widest mb-3">Model Health Status</h3>
                            <p className="text-2xl font-black mb-2">
                                {kpis?.avg_confidence >= 85 ? '✅ Excellent Performance' :
                                    kpis?.avg_confidence >= 70 ? '⚠️ Good Performance' :
                                        '🔴 Needs Attention'}
                            </p>
                            <p className="text-sm font-medium text-indigo-100 leading-relaxed">
                                {kpis?.avg_confidence >= 85
                                    ? 'Model is performing optimally with high confidence scores. Continue monitoring for drift.'
                                    : kpis?.avg_confidence >= 70
                                        ? 'Model performance is acceptable but could be improved with additional training data.'
                                        : 'Model confidence is below threshold. Consider retraining with recent data.'}
                            </p>
                        </div>
                        <div className="text-right">
                            <div className="text-4xl font-black">{kpis?.avg_confidence}%</div>
                            <div className="text-xs font-bold text-indigo-200 uppercase tracking-wider">Confidence</div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

// KPI Card Component
const KpiCard = ({ label, value, sub, icon: Icon, color }) => (
    <div className="glass p-6 rounded-[24px] border border-white shadow-xl hover:shadow-2xl transition-shadow">
        <div className={`mb-3 ${color}`}>
            <Icon size={24} />
        </div>
        <div className="text-3xl font-black text-slate-900 mb-1">{value}</div>
        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</div>
        <div className="text-[9px] text-slate-400 font-bold">{sub}</div>
    </div>
);

export default AgencyAnalytics;
