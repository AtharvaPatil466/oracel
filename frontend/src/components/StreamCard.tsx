"use client";

import React, { useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { formatINR } from '@/utils/currency';
import { ArrowDown, ArrowUp, AlertTriangle, Droplets } from 'lucide-react';
import { useStreamStore } from '@/store/stream-store';

const StreamCard: React.FC = () => {
    const { monsoonData } = useStreamStore();

    if (!monsoonData) {
        return (
            <Card className="bg-slate-900/50 border-slate-700 animate-pulse h-32">
                <CardContent className="flex items-center justify-center h-full text-slate-500">
                    Waiting for Monsoon Data...
                </CardContent>
            </Card>
        );
    }

    const isDeficit = monsoonData.deviation_percent < 0;
    const statusColor = isDeficit ? "text-red-400" : "text-green-400";

    return (
        <Card className="bg-slate-900/80 border-slate-700 backdrop-blur-md">
            <CardContent className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className={`p-2 rounded-full ${isDeficit ? 'bg-red-500/20' : 'bg-green-500/20'}`}>
                            <Droplets className={`w-5 h-5 ${statusColor}`} />
                        </div>
                        <div>
                            <h3 className="text-slate-200 font-semibold">{monsoonData.year} Monsoon</h3>
                            <p className="text-xs text-slate-500">IMD | All-India Rainfall</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className={`text-xl font-mono font-bold ${statusColor} flex items-center justify-end`}>
                            {isDeficit ? <ArrowDown className="w-4 h-4 mr-1" /> : <ArrowUp className="w-4 h-4 mr-1" />}
                            {Math.abs(monsoonData.deviation_percent)}%
                        </div>
                        <p className="text-xs text-slate-400">{monsoonData.status}</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-slate-800/50 p-2 rounded">
                        <span className="text-slate-500 block">Onset Date</span>
                        <span className="text-slate-200 font-mono">{monsoonData.onset_date}</span>
                    </div>
                    <div className="bg-slate-800/50 p-2 rounded">
                        <span className="text-slate-500 block">Ag Impact</span>
                        <span className="text-amber-400 font-mono">
                            {isDeficit ? "High Risk" : "Stable"}
                        </span>
                    </div>
                </div>

                {monsoonData.deviation_percent < -10 && (
                    <div className="flex items-center gap-2 text-xs text-amber-400 bg-amber-500/10 p-2 rounded border border-amber-500/20">
                        <AlertTriangle className="w-4 h-4" />
                        <span>Critical Deficit Alert Active</span>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default StreamCard;
