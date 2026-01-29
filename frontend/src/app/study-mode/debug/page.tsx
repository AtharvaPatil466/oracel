"use client";

import { Scene } from "@/components/Indra/Scene";

export default function DebugPage() {
    return (
        <div className="relative w-full h-screen bg-black">
            <div className="absolute top-4 left-4 z-50 pointer-events-none">
                <h1 className="text-xs font-mono text-cyan-500 tracking-widest">
                    :: SYSTEM_DIAGNOSTIC // MODE_DEBUG ::
                </h1>
            </div>
            <Scene />
        </div>
    );
}
