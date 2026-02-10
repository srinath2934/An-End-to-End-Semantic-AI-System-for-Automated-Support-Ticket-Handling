import React, { useState, useEffect } from 'react';
import { Send, Zap, MessageSquare, User, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const TicketForm = ({ onAnalyze, onSubmit, isLoading, suggestedAction, initialText }) => {
    const [text, setText] = useState('');
    const navigate = useNavigate();

    // Set initial text once when ticket loads
    useEffect(() => {
        if (initialText) setText(initialText);
    }, [initialText]);

    // Sync AI suggestion to the editor when it arrives
    useEffect(() => {
        if (suggestedAction) setText(suggestedAction);
    }, [suggestedAction]);

    return (
        <div className="flex flex-col h-full bg-slate-50">
            {/* Header / Meta */}
            <div className="px-8 py-6 border-b border-slate-200 bg-white flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 border border-slate-200">
                        <User size={24} />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h2 className="text-xl font-black text-slate-800 tracking-tight">Support Ticket #1024</h2>
                            <span className="px-2 py-0.5 bg-rose-100 text-rose-700 text-[10px] font-black uppercase rounded">High Priority</span>
                        </div>
                        <p className="text-xs text-slate-500 font-medium">Requested by <span className="text-indigo-600 font-bold">The Customer</span> via Email</p>
                    </div>
                </div>
                <div></div>
            </div>

            {/* Editor Area */}
            <div className="p-8 flex-1 overflow-y-auto">
                <div className="max-w-3xl mx-auto space-y-8">
                    {/* Customer Message (Read Only) */}
                    <div className="p-6 bg-white border border-slate-200 rounded-3xl shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-5">
                            <MessageSquare size={80} />
                        </div>
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Original Message</div>
                        <p className="text-slate-700 text-sm leading-relaxed font-medium italic">
                            "{initialText}"
                        </p>
                    </div>

                    {/* Agent Response Area */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 bg-indigo-500 rounded-full"></span>
                                <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest">Neural Draft</h3>
                            </div>
                            {suggestedAction && (
                                <span className="text-[10px] font-bold text-indigo-600 animate-pulse">AI is suggesting an action...</span>
                            )}
                        </div>

                        <div className="relative group/editor">
                            <textarea
                                className="w-full h-64 p-8 bg-slate-900 text-slate-100 border-none rounded-3xl shadow-2xl font-mono text-sm leading-relaxed focus:ring-4 focus:ring-indigo-500/20 transition-all placeholder:text-slate-600"
                                placeholder="Type your response or use AI Suggestion..."
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                            />
                            <div className="absolute bottom-4 right-4 flex gap-2">
                                <button
                                    onClick={() => onAnalyze(initialText)}
                                    disabled={isLoading}
                                    className="bg-white/10 hover:bg-white/20 text-white text-[10px] font-bold px-4 py-2 rounded-xl backdrop-blur-md transition-all flex items-center gap-2"
                                >
                                    {isLoading ? <NeuralLoader className="animate-spin" size={14} /> : <Zap size={14} className="text-amber-400" />}
                                    Re-Analyze
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer Actions */}
            <div className="px-8 py-6 bg-white border-t border-slate-200 flex justify-between items-center shadow-[0_-10px_20px_-10px_rgba(0,0,0,0.05)]">
                <button
                    onClick={() => navigate('/')}
                    className="text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors"
                >
                    Cancel and close
                </button>
                <div className="flex gap-4">
                    <button className="btn-primary" onClick={() => onSubmit(text)}>
                        <Send size={16} /> Submit as Solved
                    </button>
                </div>
            </div>
        </div>
    );
};

const NeuralLoader = ({ className, size }) => (
    <Zap className={`animate-pulse ${className}`} size={size} />
);

export default TicketForm;
