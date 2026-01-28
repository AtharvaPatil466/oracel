import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface PolicyContext {
    political_feasibility_score: number;
    relevant_ministries: string[];
    existing_programs: string[];
    alignment_notes: string;
}

interface PolicyAlignmentCardProps {
    policy: PolicyContext;
}

const PolicyAlignmentCard: React.FC<PolicyAlignmentCardProps> = ({ policy }) => {
    const getScoreColor = (score: number) => {
        if (score >= 0.8) return "bg-green-500/20 text-green-400 border-green-500/50";
        if (score >= 0.6) return "bg-yellow-500/20 text-yellow-400 border-yellow-500/50";
        return "bg-red-500/20 text-red-400 border-red-500/50";
    };

    const getScoreLabel = (score: number) => {
        if (score >= 0.8) return "HIGH ALIGNMENT";
        if (score >= 0.6) return "MEDIUM ALIGNMENT";
        return "LOW ALIGNMENT";
    };

    return (
        <Card className="bg-slate-900/50 border-slate-700">
            <CardContent className="p-4 space-y-4">
                {/* Header with Feasibility Score */}
                <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">
                        🏛️ Policy & Governance
                    </h3>
                    <Badge className={`${getScoreColor(policy.political_feasibility_score)} border`}>
                        {getScoreLabel(policy.political_feasibility_score)} ({Math.round(policy.political_feasibility_score * 100)}%)
                    </Badge>
                </div>

                {/* Ministries */}
                <div className="space-y-1">
                    <span className="text-xs text-slate-500 uppercase">Relevant Ministries</span>
                    <div className="flex flex-wrap gap-2">
                        {policy.relevant_ministries.map((m, i) => (
                            <span key={i} className="px-2 py-1 text-xs bg-slate-800 text-slate-300 rounded border border-slate-700">
                                {m}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Existing Programs */}
                <div className="space-y-1">
                    <span className="text-xs text-slate-500 uppercase">Aligns with Programs</span>
                    <ul className="text-sm text-slate-300 list-disc list-inside">
                        {policy.existing_programs.map((prog, i) => (
                            <li key={i}>{prog}</li>
                        ))}
                    </ul>
                </div>

                {/* Notes */}
                <div className="p-2 bg-blue-900/20 border border-blue-800/50 rounded text-xs text-blue-200">
                    ℹ️ {policy.alignment_notes}
                </div>

            </CardContent>
        </Card>
    );
};

export default PolicyAlignmentCard;
