"use client";

import React from 'react';
import PolicyAlignmentCard from './PolicyAlignmentCard';
import { formatINR, formatCrores } from '@/utils/currency';

// Updated interfaces to match backend response
interface ResearchVector {
    focus: string;
    institutions: string[]; // List of Indian Institutions
}

interface OracleAnalysis {
    mechanism: string;
    description: string;
    feasibility_score: number;
    bottleneck: {
        description: string;
        current_capability: string;
        required_capability: string;
        gap_ratio: number;
    };
    research_vectors: ResearchVector[];
    economic_context: {
        cost_per_unit_inr: number;
        roi_years: number;
        benefit_description: string;
    };
    policy_context: any; // Passed to PolicyAlignmentCard
    active_papers?: any[];
}

interface ScienceFeedProps {
    status: string;
    oracleData?: OracleAnalysis | null;
    userFunding?: number; // In Crores INR
}

const ScienceFeed: React.FC<ScienceFeedProps> = ({ status, oracleData, userFunding = 0 }) => {

    if (!oracleData) {
        // Idle State (Unchanged)
        return (
            <div className="flex flex-col h-full bg-slate-900/40 opacity-90 rounded-2xl border border-white/5 overflow-hidden p-6 items-center justify-center text-slate-600 gap-4">
                <div className="w-16 h-16 rounded-full border-2 border-white/5 flex items-center justify-center animate-pulse">
                    <span className="text-2xl">⚡</span>
                </div>
                <div className="text-center">
                    <p className="text-sm font-bold uppercase tracking-widest text-slate-500">Awaiting Analysis</p>
                    <p className="text-xs text-slate-700 mt-2">Enter a strategy (e.g. "Cloud Seeding") to identify leverage points.</p>
                </div>
            </div>
        );
    }

    const { bottleneck, economic_context, research_vectors, policy_context, active_papers } = oracleData;
    const gapColor = bottleneck.gap_ratio > 3 ? 'text-red-400' : bottleneck.gap_ratio > 1.5 ? 'text-amber-400' : 'text-emerald-400';

    // Checks if user funding is sufficient (simple check)
    // Assuming userFunding is in Crores, cost is in raw INR
    const costInCrores = economic_context.cost_per_unit_inr / 10000000;
    const isFunded = userFunding >= costInCrores;

    return (
        <div className="flex flex-col h-full bg-slate-900/80 backdrop-blur-md rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
            {/* Header */}
            <div className="p-4 border-b border-white/10 bg-black/40">
                <h2 className="text-xs font-black text-amber-500 uppercase tracking-widest flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                    Oracle of Delphi Analysis
                </h2>
                <div className="text-xl font-bold text-white mt-1">{oracleData.mechanism}</div>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2">{oracleData.description}</p>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-hide">

                {/* SECTION 1: BOTTLENECK CARD */}
                <div className="bg-white/5 rounded-xl p-4 border border-white/10 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-2 opacity-10 text-6xl font-black">gap</div>
                    <h3 className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                        ⚡ Technical Bottleneck
                    </h3>

                    <div className="flex flex-col gap-4 relative z-10">
                        {/* Current vs Required */}
                        <div className="flex justify-between items-center text-xs">
                            <div className="text-slate-500">Current: <span className="text-slate-300">{bottleneck.current_capability}</span></div>
                        </div>

                        {/* Gap Visual */}
                        <div className="flex items-center justify-center gap-4 py-2 bg-black/20 rounded-lg">
                            <div className={`text-4xl font-black ${gapColor}`}>
                                {bottleneck.gap_ratio}x
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Scale Gap</span>
                                <span className="text-[10px] text-slate-400">Improvement Factor</span>
                            </div>
                        </div>

                        <div className="flex justify-between items-center text-xs">
                            <div className="text-slate-500">Required: <span className="text-slate-300">{bottleneck.required_capability}</span></div>
                        </div>
                    </div>

                    <p className="mt-4 text-xs text-slate-400 italic border-t border-white/5 pt-3">
                        "{bottleneck.description}"
                    </p>
                </div>

                {/* SECTION 2: POLICY ALIGNMENT (NEW) */}
                <PolicyAlignmentCard policy={policy_context} />

                {/* SECTION 3: ECONOMICS */}
                <div className={`rounded-xl p-4 border transition-colors ${isFunded ? 'bg-emerald-900/10 border-emerald-500/20' : 'bg-red-900/10 border-red-500/20'}`}>
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">💰 Economic Feasibility</h3>
                    <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-bold text-white">{formatINR(economic_context.cost_per_unit_inr)}</span>
                        <span className="text-xs text-slate-400">estimated cost</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1 text-xs text-slate-400">
                        <span className="bg-emerald-500/10 text-emerald-400 px-1 rounded">ROI: {economic_context.roi_years} Years</span>
                        <span>• {economic_context.benefit_description}</span>
                    </div>

                    <div className="mt-3 text-xs font-medium flex items-center gap-1.5 border-t border-white/5 pt-2">
                        {isFunded ? (
                            <span className="text-emerald-400">✅ Sufficient Allocation (Your budget: {formatCrores(userFunding)})</span>
                        ) : (
                            <span className="text-red-400">⚠️ Allocation Insufficient (Need {formatCrores(costInCrores)})</span>
                        )}
                    </div>
                </div>

                {/* SECTION 4: RESEARCH VECTORS & PAPERS */}
                <div className="space-y-3">
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">🔬 Active Research (India)</h3>

                    {/* Institutions */}
                    <div className="flex flex-wrap gap-2 mb-2">
                        {research_vectors.flatMap(v => v.institutions).map((inst, i) => (
                            <span key={i} className="px-2 py-1 bg-blue-900/20 text-blue-300 text-[10px] rounded border border-blue-800/50">
                                {inst}
                            </span>
                        ))}
                    </div>

                    {/* Papers */}
                    {active_papers && active_papers.map((paper: any, i: number) => (
                        <div key={i} className="p-3 bg-white/5 hover:bg-white/10 rounded-lg border border-white/5 transition-all group cursor-pointer">
                            <div className="text-xs font-bold text-slate-200 mb-1">{paper.title}</div>
                            <div className="flex justify-between items-center text-[10px] text-slate-500">
                                <span>{paper.authors[0]} et al. ({paper.year})</span>
                                <span className="text-blue-400">{paper.institution}</span>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
};

export default ScienceFeed;
