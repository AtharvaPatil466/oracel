import React from 'react';

interface ScienceFeedProps {
    status: string;
    papers?: any[];
}

const ScienceFeed: React.FC<ScienceFeedProps> = ({ status, papers = [] }) => {
    const isIdle = (status === 'Standby' || status === 'Neural Link Error') && papers.length === 0;

    return (
        <div className="flex flex-col h-full bg-zinc-900/40 opacity-90 rounded-2xl border border-white/5 overflow-hidden">
            <div className="p-4 border-b border-white/5 bg-white/5">
                <h2 className="text-xs font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse"></span>
                    Science & Research Feed
                </h2>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {isIdle ? (
                    <div className="h-full flex flex-col items-center justify-center text-zinc-600 gap-3 opacity-50">
                        <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                        </svg>
                        <span className="text-xs uppercase tracking-widest">Awaiting Simulation Data</span>
                    </div>
                ) : (
                    <div className="space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {papers.map((paper, i) => (
                            <div key={i} className="p-3 bg-white/5 hover:bg-white/10 rounded-lg border border-white/5 transition-colors cursor-pointer group">
                                <div className="flex justify-between items-start mb-1">
                                    <h3 className="text-sm font-bold text-blue-200 group-hover:text-blue-400 transition-colors line-clamp-2">{paper.title}</h3>
                                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">{paper.relevance}</span>
                                </div>
                                <div className="text-xs text-zinc-400">{paper.author}</div>
                                <div className="text-[10px] text-zinc-600 mt-1 italic">{paper.journal}</div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="p-3 border-t border-white/5 bg-black/20 text-[10px] text-zinc-600 text-center font-mono">
                CONNECTED TO ARXIV.ORG [SIMULATED]
            </div>
        </div>
    );
};

export default ScienceFeed;
