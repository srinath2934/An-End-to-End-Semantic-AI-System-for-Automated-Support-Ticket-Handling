import React from 'react';
import { Zap, Clock, Check, Shield, Cpu, Activity } from 'lucide-react';

const PredictionResult = ({ result, onApply }) => {
    if (!result) {
        return (
            <div className="h-full flex flex-col items-center justify-center p-12 text-center">
                <div className="w-20 h-20 bg-slate-50 border border-slate-100 rounded-[32px] flex items-center justify-center mb-6 shadow-sm">
                    <Zap size={32} className="text-slate-200" />
                </div>
                <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-2">Neural Link Inactive</h3>
                <p className="text-[10px] text-slate-400 font-medium px-8">Select a ticket or type context to initiate the Agency intelligence layer.</p>
            </div>
        );
    }

    const { category, confidence, team, priority, eta, suggested_action, routing_status } = result;
    const confScore = Math.round(confidence * 100);

    return (
        <div className="h-full flex flex-col">
            {/* Header */}
            <div className="p-8 border-b border-slate-100 bg-white/50 backdrop-blur-md sticky top-0 z-10">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <div className="p-2 bg-indigo-600 rounded-xl text-white shadow-lg shadow-indigo-500/30">
                            <Cpu size={18} />
                        </div>
                        <h2 className="text-lg font-black text-slate-900 tracking-tight">The Agency AI</h2>
                    </div>
                    <span className="text-[10px] font-black text-slate-400 border border-slate-200 px-2 py-1 rounded-lg">CORE v4.2</span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-indigo-600 transition-all duration-1000 ease-out shadow-[0_0_10px_#6366f1]"
                        style={{ width: `${confScore}%` }}
                    ></div>
                </div>
                <div className="flex justify-between mt-2">
                    <span className="text-[9px] font-black text-indigo-600 uppercase tracking-widest">Confidence Score</span>
                    <span className="text-[10px] font-black text-slate-800">{confScore}%</span>
                </div>
            </div>

            <div className="flex-1 p-8 space-y-10 overflow-y-auto">
                {/* Routing Status */}
                <div className={`p-4 rounded-2xl flex items-center gap-3 border ${routing_status === 'AUTO-DISPATCH' ? 'bg-emerald-50 border-emerald-100 text-emerald-800' : 'bg-rose-50 border-rose-100 text-rose-800'
                    }`}>
                    <Activity size={18} />
                    <div className="flex-1">
                        <div className="text-[10px] font-black uppercase tracking-widest opacity-60">Agency Decision</div>
                        <div className="text-xs font-black">{routing_status}</div>
                    </div>
                </div>

                {/* Classification */}
                <section>
                    <Label text="Neural Classification" />
                    <div className="glass p-5 rounded-2xl border-indigo-200 relative overflow-hidden group">
                        <div className="absolute -top-4 -right-4 p-4 opacity-5 group-hover:rotate-12 transition-transform">
                            <Shield size={80} />
                        </div>
                        <div className="text-xs font-black text-indigo-700 uppercase mb-1">Inferred Category</div>
                        <div className="text-xl font-black text-slate-900 leading-tight">{category}</div>
                    </div>
                </section>

                {/* Metadata */}
                <section>
                    <Label text="System Metadata" />
                    <div className="space-y-4">
                        <MetaRow label="Target Team" value={team} />
                        <MetaRow label="Urgency" value={priority} high={priority?.toLowerCase() === 'high'} />
                        <MetaRow label="Predictive ETA" value={eta} icon={<Clock size={12} />} />
                    </div>
                </section>

                {/* Macro Suggestion */}
                <section>
                    <div className="flex justify-between items-center mb-3">
                        <Label text="Suggested Response" />
                        <span
                            onClick={() => onApply && onApply(suggested_action)}
                            className="text-[10px] font-black text-indigo-600 cursor-pointer hover:underline uppercase"
                        >
                            Sync to Editor
                        </span>
                    </div>
                    <div className="bg-slate-900 rounded-2xl p-6 shadow-2xl relative">
                        <div className="absolute top-4 right-4 text-emerald-400 flex items-center gap-1">
                            <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping"></div>
                            <span className="text-[8px] font-black tracking-widest">VERIFIED</span>
                        </div>
                        <p className="text-slate-100 text-xs leading-relaxed font-mono opacity-80">
                            {suggested_action}
                        </p>
                    </div>
                    <button
                        onClick={() => onApply && onApply(suggested_action)}
                        className="btn-accent w-full mt-6 justify-center"
                    >
                        <Zap size={16} /> Apply Suggested Macro
                    </button>
                </section>
            </div>
        </div>
    );
};

const Label = ({ text }) => (
    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[2px] mb-3">{text}</h3>
);

const MetaRow = ({ label, value, high, icon }) => (
    <div className="flex justify-between items-center py-2 border-b border-slate-50">
        <span className="text-[11px] font-bold text-slate-400">{label}</span>
        <div className={`flex items-center gap-2 text-[10px] font-black px-2.5 py-1 rounded-lg uppercase tracking-wider ${high ? 'bg-rose-100 text-rose-700' : 'bg-slate-100 text-slate-600'
            }`}>
            {icon} {value}
        </div>
    </div>
);

export default PredictionResult;
