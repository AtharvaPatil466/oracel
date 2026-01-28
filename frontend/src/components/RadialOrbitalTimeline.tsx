import React, { useEffect, useState } from 'react';

interface RadialOrbitalTimelineProps {
    status: 'Standby' | 'Analyzing Interventions...' | 'Optimal Path Found' | 'Neural Link Error';
    progress?: number; // 0 to 100
}

const RadialOrbitalTimeline: React.FC<RadialOrbitalTimelineProps> = ({ status, progress = 0 }) => {
    const [rotation, setRotation] = useState(0);

    // Continuous rotation effect
    useEffect(() => {
        const interval = setInterval(() => {
            setRotation(r => (r + 0.5) % 360);
        }, 50);
        return () => clearInterval(interval);
    }, []);

    // Determine color based on status
    const getStatusColor = () => {
        switch (status) {
            case 'Analyzing Interventions...': return 'text-blue-400 border-blue-400/30';
            case 'Optimal Path Found': return 'text-emerald-400 border-emerald-400/30';
            case 'Neural Link Error': return 'text-red-400 border-red-400/30';
            default: return 'text-zinc-500 border-zinc-500/30';
        }
    };

    const isActive = status === 'Analyzing Interventions...';

    return (
        <div className="relative w-64 h-64 flex items-center justify-center">
            {/* Progress Ring Background */}
            {isActive && (
                <div
                    className="absolute inset-2 rounded-full opacity-20 transition-all duration-300"
                    style={{
                        background: `conic-gradient(from 0deg, #3b82f6 ${progress}%, transparent ${progress}%)`,
                        maskImage: 'radial-gradient(transparent 65%, black 66%)',
                        WebkitMaskImage: 'radial-gradient(transparent 65%, black 66%)'
                    }}
                />
            )}

            {/* Outer Orbit Ring */}
            <div
                className={`absolute inset-0 rounded-full border-2 border-dashed transition-all duration-1000 ${getStatusColor()}`}
                style={{ transform: `rotate(${rotation}deg)` }}
            />

            {/* Middle Orbit Ring (Counter-rotating) */}
            <div
                className={`absolute inset-4 rounded-full border border-dotted opacity-50 transition-all duration-1000 ${getStatusColor()}`}
                style={{ transform: `rotate(-${rotation * 1.5}deg)` }}
            />

            {/* Inner Static Circle */}
            <div className={`absolute inset-16 rounded-full border border-white/10 bg-black/50 backdrop-blur-md flex flex-col items-center justify-center z-10 shadow-2xl ${isActive ? 'animate-pulse' : ''}`}>
                <div className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-1">Status</div>
                <div className={`text-center font-mono text-sm px-4 ${getStatusColor().split(' ')[0]}`}>
                    {status === 'Analyzing Interventions...' ? 'ANALYZING' :
                        status === 'Optimal Path Found' ? 'RESOLVED' :
                            status === 'Neural Link Error' ? 'ERROR' : 'STANDBY'}
                </div>

                {/* Progress Indicator if active */}
                {isActive && (
                    <div className="mt-2 w-16 h-1 bg-zinc-800 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 animate-progress-indeterminate"></div>
                    </div>
                )}
            </div>

            {/* Decorative Satellites */}
            <div
                className="absolute top-0 w-2 h-2 bg-white rounded-full shadow-[0_0_10px_white]"
                style={{
                    transform: `rotate(${rotation * 2}deg) translateY(-8rem)`,
                    opacity: isActive ? 1 : 0.2
                }}
            />
            <div
                className="absolute bottom-0 w-1.5 h-1.5 bg-current rounded-full"
                style={{
                    transform: `rotate(${rotation * -1}deg) translateY(6rem)`,
                    color: status === 'Optimal Path Found' ? '#34d399' : '#60a5fa',
                    opacity: isActive || status === 'Optimal Path Found' ? 1 : 0
                }}
            />
        </div>
    );
};

export default RadialOrbitalTimeline;
