import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Loader2, Database, AlertCircle, Terminal, HardDrive } from 'lucide-react';
import Layout from './Layout';

const DataTableView = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await axios.get('http://127.0.0.1:8000/api/data');
                setData(response.data);
                setError(null);
            } catch (err) {
                console.error("Error fetching data:", err);
                setError("Failed to fetch data from API. Ensure the backend is running.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <Layout>
            <div className="p-10 max-w-[1400px] mx-auto">
                <div className="flex items-center justify-between mb-12">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-slate-900 rounded-[22px] flex items-center justify-center text-indigo-400 shadow-2xl">
                            <Database size={28} />
                        </div>
                        <div>
                            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Source Data Explorer</h2>
                            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest flex items-center gap-2">
                                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                                Connected to SQLite: data/db/tickets.db
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <div className="px-4 py-2 bg-slate-100 rounded-xl flex items-center gap-3 border border-slate-200">
                            <HardDrive size={16} className="text-slate-400" />
                            <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">{data.length} Records Ingested</span>
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-40">
                        <Loader2 className="animate-spin text-indigo-500 mb-6" size={48} />
                        <h3 className="text-xs font-black text-slate-400 uppercase tracking-[4px]">Synchronizing Neural Source...</h3>
                    </div>
                ) : error ? (
                    <div className="bg-rose-50 border border-rose-100 p-8 rounded-[32px] flex items-center gap-6 text-rose-600 shadow-xl">
                        <AlertCircle size={48} />
                        <div>
                            <p className="text-lg font-black tracking-tight">System Connection Failure</p>
                            <p className="text-sm opacity-80 font-medium">{error}</p>
                        </div>
                    </div>
                ) : (
                    <div className="ticket-table-container">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-900 text-[10px] font-black uppercase text-slate-400 tracking-widest">
                                        <th className="px-8 py-5">System ID</th>
                                        <th className="px-8 py-5">Subject Header</th>
                                        <th className="px-8 py-5">Requester Source</th>
                                        <th className="px-8 py-5">Current Status</th>
                                        <th className="px-8 py-5">Target Team</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.map((item) => (
                                        <tr key={item.id} className="border-b border-slate-50 hover:bg-slate-50/80 transition-all group">
                                            <td className="px-8 py-6 text-xs font-mono text-slate-300 group-hover:text-indigo-600 transition-colors">#{item.id}</td>
                                            <td className="px-8 py-6">
                                                <div className="text-sm font-bold text-slate-800 tracking-tight group-hover:text-indigo-600 transition-colors">{item.subject}</div>
                                            </td>
                                            <td className="px-8 py-6 text-xs font-black text-slate-500 uppercase tracking-tighter">{item.requester}</td>
                                            <td className="px-8 py-6">
                                                <span className={`text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-tighter shadow-sm ${item.status?.toLowerCase() === 'solved' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                                                    }`}>
                                                    {item.status}
                                                </span>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-2">
                                                    <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.support_team}</span>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default DataTableView;
