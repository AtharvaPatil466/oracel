import React from 'react';

// Define the Oracle Response Interface
interface ResearchVector {
    search_query: string;
    focus: string;
}

interface OracleAnalysis {
    mechanism: string;
    feasibility_score: number;
    bottleneck: {
        description: string;
        current_capability: string;
        required_capability: string;
        gap_ratio: number;
    };
    research_vectors: ResearchVector[];
    funding_estimate: {
        amount_usd: number;
        timeframe_years: number;
    };
}

interface ScienceFeedProps {
    status: string;
    oracleData?: OracleAnalysis | null;
    userFunding?: number; // In Billions
}

const ScienceFeed: React.FC<ScienceFeedProps> = ({ status, oracleData, userFunding = 0 }) => {

    // Convert user funding to USD for comparison
    const userFundingUSD = userFunding * 1_000_000_000;

    if (!oracleData) {
        // Idle State
        return (
            <div className="flex flex-col h-full bg-zinc-900/40 opacity-90 rounded-2xl border border-white/5 overflow-hidden p-6 items-center justify-center text-zinc-600 gap-4">
                <div className="w-16 h-16 rounded-full border-2 border-white/5 flex items-center justify-center animate-pulse">
                    <span className="text-2xl">⚡</span>
                </div>
                <div className="text-center">
                    <p className="text-sm font-bold uppercase tracking-widest text-zinc-500">Awaiting Analysis</p>
                    <p className="text-xs text-zinc-700 mt-2">Enter a strategy to identify leverage points.</p>
                </div>
            </div>
        );
    }

    const { bottleneck, funding_estimate, research_vectors } = oracleData;
    const gapColor = bottleneck.gap_ratio > 5 ? 'text-red-400' : bottleneck.gap_ratio > 2 ? 'text-yellow-400' : 'text-emerald-400';
    const isFunded = userFundingUSD >= funding_estimate.amount_usd;

    return (
        <div className="flex flex-col h-full bg-zinc-900/60 backdrop-blur-md rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
            {/* Header */}
            <div className="p-4 border-b border-white/10 bg-black/40">
                <h2 className="text-xs font-black text-blue-400 uppercase tracking-widest flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                    Oracle of Delphi Analysis
                </h2>
                <div className="text-xl font-bold text-white mt-1">{oracleData.mechanism}</div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-6">

                {/* SECTION 1: BOTTLENECK CARD */}
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <h3 className="text-xs font-bold text-amber-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                        ⚡ Critical Bottleneck Identified
                    </h3>

                    <div className="flex flex-col gap-4 relative">
                        {/* Current State */}
                        <div className="flex justify-between items-end border-b border-white/5 pb-2">
                            <span className="text-xs text-zinc-500 uppercase">Current Capability</span>
                            <span className="text-sm font-mono text-zinc-300 text-right max-w-[60%]">{bottleneck.current_capability}</span>
                        </div>

                        {/* Gap Arrow */}
                        <div className="flex items-center justify-center gap-2 py-2">
                            <div className={`text-3xl font-black ${gapColor}`}>
                                {bottleneck.gap_ratio}x
                            </div>
                            <div className="text-xs text-zinc-500 font-bold uppercase tracking-wider">Improvement Needed</div>
                            <span className="text-2xl text-zinc-600">↓</span>
                        </div>

                        {/* Required State */}
                        <div className="flex justify-between items-end border-t border-white/5 pt-2">
                            <span className="text-xs text-zinc-500 uppercase">Required</span>
                            <span className="text-sm font-bold font-mono text-white text-right max-w-[60%] border-l-2 border-emerald-500 pl-2">
                                {bottleneck.required_capability}
                            </span>
                        </div>
                    </div>

                    <p className="mt-4 text-xs text-zinc-400 italic border-t border-white/5 pt-3">
                        "{bottleneck.description}"
                    </p>
                </div>

                {/* SECTION 2: FUNDING CALLOUT */}
                <div className={`rounded-xl p-4 border transition-colors ${isFunded ? 'bg-emerald-900/10 border-emerald-500/20' : 'bg-red-900/10 border-red-500/20'}`}>
                    <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1">🎯 Close This Gap</h3>
                    <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-bold text-white">${(funding_estimate.amount_usd / 1_000_000).toFixed(0)}M</span>
                        <span className="text-xs text-zinc-400">over {funding_estimate.timeframe_years} years</span>
                    </div>

                    <div className="mt-2 text-xs font-medium flex items-center gap-1.5">
                        {isFunded ? (
                            <>
                                <span className="text-emerald-400">✅ Sufficient Allocation</span>
                                <span className="text-zinc-600">(${userFunding}B provided)</span>
                            </>
                        ) : (
                            <>
                                <span className="text-red-400">⚠️ Allocation Insufficient</span>
                                <span className="text-zinc-500">Increase slider</span>
                            </>
                        )}
                    </div>
                </div>

                {/* SECTION 3: LABS / VECTORS */}
                <div className="space-y-3">
                    <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest pl-1">🔬 Research Vectors</h3>
                    {research_vectors.map((vector, i) => (
                        <div key={i} className="p-3 bg-white/5 hover:bg-white/10 rounded-lg border border-white/5 transition-all group cursor-default">
                            <div className="text-[10px] text-blue-400 font-bold uppercase tracking-wider mb-1">Focus: {vector.focus}</div>
                            <div className="text-xs text-zinc-300 font-mono italic opacity-70 group-hover:opacity-100">
                                query: "{vector.search_query}"
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
};

export default ScienceFeed;
