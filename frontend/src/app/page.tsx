'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';

// Dynamic Import for Map (Client Side Only)
const IndiaMonsoonMap = dynamic(() => import('@/components/visualization/IndiaMonsoonMap'), {
    ssr: false,
    loading: () => <div className="w-full h-[500px] flex items-center justify-center bg-slate-900 text-slate-500 animate-pulse">Initializing Geospatital Core...</div>
});

import RainfallTimeSeries from '@/components/visualization/RainfallTimeSeries';
import ScienceFeed from '@/components/ScienceFeed';
import StreamCard from '@/components/StreamCard';
import DemoModeToggle from '@/components/DemoModeToggle';
import { useStreamStore } from '@/store/stream-store';
import { Button } from "@/components/ui/button";

export default function Home() {
    const { monsoonData } = useStreamStore();
    const [userInput, setUserInput] = useState('');
    const [investmentCr, setInvestmentCr] = useState(50.0); // Crores

    // Simulation State
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [simProgress, setSimProgress] = useState(0);
    const [simMessage, setSimMessage] = useState('Standby');
    const [oracleAnalysis, setOracleAnalysis] = useState<any>(null); // To pass to ScienceFeed
    const [error, setError] = useState<string | null>(null);

    const runSimulation = async () => {
        if (!userInput.trim()) return;

        setIsAnalyzing(true);
        setSimProgress(0);
        setSimMessage('Establishing Uplink...');
        setOracleAnalysis(null);
        setError(null);

        try {
            const response = await fetch('http://localhost:8001/api/simulate/stream', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    user_input: userInput,
                    investment: investmentCr // Sending as Crores
                }),
            });

            if (!response.body) throw new Error('No stream');
            const reader = response.body.getReader();
            const decoder = new TextDecoder();

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value, { stream: true });
                const lines = chunk.split('\n').filter(l => l.trim() !== '');

                for (const line of lines) {
                    try {
                        const data = JSON.parse(line);

                        if (data.status === 'progress') {
                            setSimProgress(data.progress);
                            setSimMessage(data.message);
                        } else if (data.status === 'oracle_analysis') {
                            setOracleAnalysis(data.data);
                            setSimProgress(100);
                            setSimMessage('Analysis Complete');
                        }
                    } catch (e) {
                        console.error("Parse Error", e);
                    }
                }
            }
        } catch (e: any) {
            setError(e.message || "Simulation Failed");
        } finally {
            setIsAnalyzing(false);
        }
    };

    return (
        <main className="min-h-screen bg-black text-white p-4 font-sans overflow-hidden">
            {/* Top Bar */}
            <header className="flex justify-between items-center mb-6 px-2">
                <div>
                    <h1 className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-amber-500 to-orange-600 tracking-tighter">
                        ORACLE INDIA
                    </h1>
                    <p className="text-xs text-zinc-500 uppercase tracking-widest">Monsoon Resilience Engine v2.0</p>
                </div>
                <div className="flex gap-4">
                    <DemoModeToggle />
                    <div className="text-right">
                        <div className="text-xs text-zinc-600 uppercase">System Status</div>
                        <div className="text-emerald-500 text-xs font-mono">● ONLINE (MUMBAI-NET)</div>
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-12 gap-6 h-[calc(100vh-100px)]">

                {/* LEFT COLUMN: Controls & Stream Status */}
                <div className="col-span-3 flex flex-col gap-6">
                    {/* Input Console */}
                    <div className="bg-slate-900/60 border border-slate-700 rounded-xl p-5 shadow-lg">
                        <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Tactical Intervention</label>
                        <textarea
                            className="w-full h-24 bg-black/40 border border-slate-700 rounded-lg p-3 text-sm text-slate-200 focus:outline-none focus:border-amber-500 mb-4 resize-none"
                            placeholder="e.g. 'Deploy Cloud Seeding in Marathwada'..."
                            value={userInput}
                            onChange={(e) => setUserInput(e.target.value)}
                        />

                        <div className="mb-4">
                            <div className="flex justify-between text-xs text-slate-400 mb-1">
                                <span>Budget Allocation</span>
                                <span>₹{investmentCr} Cr</span>
                            </div>
                            <input
                                type="range"
                                min="1" max="1000" step="10"
                                value={investmentCr}
                                onChange={(e) => setInvestmentCr(Number(e.target.value))}
                                className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                            />
                        </div>

                        <Button
                            onClick={runSimulation}
                            disabled={isAnalyzing}
                            className={`w-full font-bold uppercase tracking-wider ${isAnalyzing ? 'bg-slate-800' : 'bg-amber-600 hover:bg-amber-700'}`}
                        >
                            {isAnalyzing ? `Analyzing (${simProgress}%)` : 'Execute Strategy'}
                        </Button>

                        {isAnalyzing && (
                            <div className="mt-2 text-center text-xs text-amber-500/80 font-mono animate-pulse">
                                {'>'} {simMessage}
                            </div>
                        )}
                        {error && <div className="mt-2 text-xs text-red-500">{error}</div>}
                    </div>

                    {/* Stream Card (Monsoon Status) */}
                    <StreamCard />

                    {/* Time Series Chart */}
                    {monsoonData && <RainfallTimeSeries data={[{ year: monsoonData.year, deviation: monsoonData.deviation_percent, rainfall: monsoonData.all_india_rainfall_mm }]} />}
                </div>

                {/* CENTER COLUMN: Map Visualization */}
                <div className="col-span-6 flex flex-col gap-4">
                    <div className="flex-1 bg-slate-900/30 rounded-xl border border-slate-800 relative overflow-hidden">
                        {/* Pass the regional/state data to the map */}
                        <IndiaMonsoonMap data={monsoonData?.states || {}} />

                        {/* Map Overlay Stats */}
                        <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur px-3 py-2 rounded border border-white/10 text-xs">
                            <div className="text-slate-400">Active Stream</div>
                            <div className="font-mono text-white">MONSOON_V4.STREAM</div>
                        </div>
                    </div>
                </div>

                {/* RIGHT COLUMN: Oracle Analysis */}
                <div className="col-span-3 h-full">
                    <ScienceFeed status={simMessage} oracleData={oracleAnalysis} userFunding={investmentCr} />
                </div>

            </div>
        </main>
    );
}