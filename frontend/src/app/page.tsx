'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import OracleMap to avoid SSR issues with Cesium
const OracleMap = dynamic(() => import('@/components/OracleMap'), {
    ssr: false,
    loading: () => (
        <div className="w-full h-full flex items-center justify-center bg-gray-900 animate-pulse text-white font-mono">
            Initializing Neural Interface...
        </div>
    )
});

import RadialOrbitalTimeline from '@/components/RadialOrbitalTimeline';
import FundingSlider from '@/components/FundingSlider';
import ScienceFeed from '@/components/ScienceFeed';

export default function Home() {
    const [simulationStatus, setSimulationStatus] = useState('Standby');
    const [livesSaved, setLivesSaved] = useState(0);
    const [userInput, setUserInput] = useState('');
    const [mitigatedData, setMitigatedData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [progress, setProgress] = useState(0);
    const [simulationMessage, setSimulationMessage] = useState('');
    const [investment, setInvestment] = useState(1.0); // Billions
    const [papers, setPapers] = useState<any[]>([]);

    const runSimulation = async () => {
        if (!userInput.trim()) return;

        setIsLoading(true);
        setError(null);
        setSimulationStatus('Analyzing Interventions...');
        setProgress(0);
        setSimulationMessage('Initializing connection...');
        setPapers([]); // Reset papers

        try {
            const response = await fetch('http://localhost:8001/api/simulate/stream', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_input: userInput,
                    investment: investment
                }),
            });

            if (!response.ok) throw new Error('Neural interface communication failed');
            if (!response.body) throw new Error('ReadableStream not supported');

            const reader = response.body.getReader();
            const decoder = new TextDecoder();

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value, { stream: true });
                const lines = chunk.split('\n').filter(line => line.trim() !== '');

                for (const line of lines) {
                    try {
                        const data = JSON.parse(line);

                        if (data.status === 'progress') {
                            setProgress(data.progress);
                            setSimulationMessage(data.message);
                        } else if (data.status === 'complete') {
                            setProgress(100);
                            setSimulationStatus('Optimal Path Found');
                            setSimulationStatus('Optimal Path Found');
                            setLivesSaved(data.lives_saved);
                            setMitigatedData(data.mitigated_data);
                            if (data.papers) setPapers(data.papers);
                        }
                    } catch (e) {
                        console.error("Error parsing stream chunk", e);
                    }
                }
            }
        } catch (error: any) {
            console.error('Simulation failed:', error);
            setError(error.message || 'Neural Link Error');
            setSimulationStatus('Neural Link Error');
        } finally {
            setIsLoading(false);
        }
    };

    const resetSimulation = () => {
        setSimulationStatus('Standby');
        setLivesSaved(0);
        setUserInput('');
        setMitigatedData(null);
        setError(null);
    };

    const calculateWindReduction = () => {
        if (!mitigatedData || !mitigatedData.features) return 0;
        const features = mitigatedData.features;
        const totalWind = features.reduce((acc: number, f: any) => acc + (f.properties?.wind || 0), 0);
        return (totalWind / features.length).toFixed(1);
    };

    return (
        <main className="min-h-screen bg-black text-white p-6 font-sans">
            <div className="max-w-[1600px] mx-auto grid grid-cols-12 gap-6 h-[calc(100vh-48px)]">

                {/* Left Sidebar - Controls */}
                <div className="col-span-12 lg:col-span-3 flex flex-col gap-6">
                    <div className="p-8 bg-gradient-to-br from-indigo-900/40 via-purple-900/20 to-black rounded-2xl border border-white/10 shadow-xl">
                        <h1 className="text-4xl font-black mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500 tracking-tighter">
                            ORACLE
                        </h1>
                        <p className="text-zinc-400 text-sm mb-8 font-medium">Predictive Global Intervention Engine</p>

                        <div className="space-y-4">
                            <label className="block text-xs font-bold text-blue-400 uppercase tracking-widest">Intervention Strategy</label>
                            <textarea
                                className="w-full h-32 bg-white/5 border border-white/10 rounded-xl p-4 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all placeholder:text-zinc-600 shadow-inner resize-none"
                                placeholder="Ex: Deploy fleet of autonomous cooling ships to the North Atlantic..."
                                value={userInput}
                                onChange={(e) => setUserInput(e.target.value)}
                            />
                            <button
                                onClick={runSimulation}
                                disabled={isLoading}
                                className={`w-full py-4 px-8 rounded-xl font-bold transition-all duration-300 shadow-lg active:scale-95 border ${isLoading
                                    ? 'bg-zinc-800 text-zinc-500 border-zinc-700 cursor-not-allowed'
                                    : 'bg-blue-600 hover:bg-blue-50 text-white hover:text-blue-900 shadow-blue-500/20 border-blue-400'
                                    }`}
                            >
                                {isLoading ? 'Processing...' : 'Execute Analysis'}
                            </button>
                            {mitigatedData && (
                                <button
                                    onClick={resetSimulation}
                                    className="w-full py-2 text-zinc-500 hover:text-white text-xs font-bold uppercase tracking-widest transition-colors"
                                >
                                    Reset Simulation
                                </button>
                            )}

                            <div className="pt-4 border-t border-white/10">
                                <FundingSlider value={investment} onChange={setInvestment} disabled={isLoading} />
                            </div>
                        </div>
                    </div>

                    {error && (
                        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs font-medium animate-in fade-in slide-in-from-top-2">
                            CRITICAL ERROR: {error}
                        </div>
                    )}

                    <div className="flex-1 p-6 bg-zinc-900/40 rounded-2xl border border-white/5 backdrop-blur-sm overflow-y-auto">
                        <h2 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4">Tactical Readiness</h2>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center text-sm border-b border-white/5 pb-3">
                                <span className="text-zinc-400">Core Network</span>
                                <span className="text-emerald-400 font-mono">ENCRYPTED</span>
                            </div>
                            <div className="flex justify-between items-center text-sm border-b border-white/5 pb-3">
                                <span className="text-zinc-400">Simulation</span>
                                <span className="text-blue-400 font-mono">{simulationStatus}</span>
                            </div>

                            {/* Radial Timeline Visualization */}
                            <div className="flex justify-center py-4">
                                <RadialOrbitalTimeline status={simulationStatus as any} progress={progress} />
                            </div>

                            {/* Detailed Status Message */}
                            {isLoading && (
                                <div className="text-center text-xs text-blue-300 font-mono animate-pulse mb-4">
                                    {simulationMessage}
                                </div>
                            )}

                            <div className="flex flex-col gap-1 border-b border-white/5 pb-3">
                                <div className="flex justify-between items-end">
                                    <span className="text-zinc-400 text-sm">Protected Human Lives</span>
                                    {mitigatedData && (
                                        <span className="text-xs text-zinc-500 font-mono mb-1">Impact: +{(livesSaved || 0).toLocaleString()}</span>
                                    )}
                                </div>
                                <span className="text-5xl font-black text-purple-400 font-mono tracking-tighter">
                                    {(livesSaved || 0).toLocaleString()}
                                </span>
                            </div>
                            {mitigatedData && (
                                <div className="flex flex-col gap-1 pt-2">
                                    <span className="text-zinc-400 text-xs uppercase tracking-widest">Avg. Wind Intensity</span>
                                    <span className="text-xl font-bold text-cyan-400 font-mono">{calculateWindReduction()} kt</span>
                                </div>
                            )}
                        </div>

                        {(simulationStatus === 'Optimal Path Found') && (
                            <div className="mt-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 animate-in fade-in slide-in-from-bottom-2 duration-700">
                                <p className="text-xs text-emerald-400 font-bold uppercase tracking-widest mb-1">Status Report</p>
                                <p className="text-sm text-zinc-300">Strategy confirmed. Hurricane intensity reduced across {mitigatedData?.features?.length || 0} event segments.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Map View */}
                <div className="col-span-12 lg:col-span-6 2xl:col-span-6 h-full relative group">
                    <OracleMap mitigatedData={mitigatedData} />

                    {/* Bottom HUD - Hidden by default, shows on hover */}
                    <div className="absolute bottom-6 left-6 right-6 p-6 bg-black/60 backdrop-blur-xl rounded-2xl border border-white/10 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                        <div className="space-y-1">
                            <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Global Risk Feed</p>
                            <div className="font-mono text-blue-400 text-sm">ACTIVE MONITORING: North Atlantic Basin</div>
                        </div>
                        <div className="flex gap-4">
                            <div className="text-right">
                                <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Data Layer</p>
                                <p className="text-sm font-medium">{mitigatedData ? 'Simulation Model v2.4' : 'Historical Baseline'}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Sidebar - Science Feed (Hidden on mobile/tablet if needed, but we have space) */}
                <div className="hidden 2xl:block col-span-12 xl:col-span-3 lg:col-span-3 h-[calc(100vh-48px)]">
                    <ScienceFeed status={simulationStatus} papers={papers} />
                </div>
            </div>
        </main>
    );
}