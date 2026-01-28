'use client';

import React, { useState, useEffect } from 'react';
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

export default function Home() {
    const [simulationStatus, setSimulationStatus] = useState('Standby');
    const [livesSaved, setLivesSaved] = useState(0);
    const [userInput, setUserInput] = useState('');

    const runSimulation = async () => {
        setSimulationStatus('Analyzing...');
        try {
            const response = await fetch('http://localhost:8001/api/simulate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ user_input: userInput }),
            });
            const data = await response.json();
            setSimulationStatus('Optimal Path Found');
            setLivesSaved(data.stats.lives_saved);
        } catch (error) {
            console.error('Simulation failed:', error);
            setSimulationStatus('Error');
        }
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
                            <label className="block text-xs font-bold text-blue-400 uppercase tracking-widest">Target Scenario</label>
                            <textarea
                                className="w-full h-32 bg-white/5 border border-white/10 rounded-xl p-4 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all placeholder:text-zinc-600 shadow-inner"
                                placeholder="Describe current threat or scenario..."
                                value={userInput}
                                onChange={(e) => setUserInput(e.target.value)}
                            />
                            <button
                                onClick={runSimulation}
                                className="w-full py-4 bg-blue-600 hover:bg-blue-50 px-8 rounded-xl font-bold text-white hover:text-blue-900 transition-all duration-300 shadow-lg shadow-blue-500/20 active:scale-95 border border-blue-400"
                            >
                                Execute Analysis
                            </button>
                        </div>
                    </div>

                    <div className="flex-1 p-6 bg-zinc-900/40 rounded-2xl border border-white/5 backdrop-blur-sm overflow-y-auto">
                        <h2 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4">System Status</h2>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center text-sm border-b border-white/5 pb-3">
                                <span className="text-zinc-400">Core Process</span>
                                <span className="text-emerald-400 font-mono">Running</span>
                            </div>
                            <div className="flex justify-between items-center text-sm border-b border-white/5 pb-3">
                                <span className="text-zinc-400">Simulation</span>
                                <span className="text-blue-400 font-mono">{simulationStatus}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm border-b border-white/5 pb-3">
                                <span className="text-zinc-400">Total Impact</span>
                                <span className="text-purple-400 font-mono">{livesSaved} Souls Protected</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Map View */}
                <div className="col-span-12 lg:col-span-9 h-full relative group">
                    <OracleMap />

                    {/* Bottom HUD */}
                    <div className="absolute bottom-6 left-6 right-6 p-6 bg-black/60 backdrop-blur-xl rounded-2xl border border-white/10 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                        <div className="space-y-1">
                            <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Live Coordinate Feed</p>
                            <div className="font-mono text-blue-400 text-sm">LAT: 35.6895° N / LON: 139.6917° E</div>
                        </div>
                        <div className="flex gap-4">
                            <div className="text-right">
                                <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Last Update</p>
                                <p className="text-sm font-medium">Just Now</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}