import React from 'react';

interface FundingSliderProps {
    value: number; // In Billions
    onChange: (value: number) => void;
    disabled?: boolean;
}

const FundingSlider: React.FC<FundingSliderProps> = ({ value, onChange, disabled }) => {
    // Logarithmic scale for better control over small and large values
    // Using a simple linear slider for now mapped to 0-100B

    return (
        <div className="space-y-2">
            <div className="flex justify-between items-end">
                <label className="text-xs font-bold text-blue-400 uppercase tracking-widest">
                    Global Funding Alloc.
                </label>
                <div className="font-mono text-emerald-400 font-bold text-lg">
                    ${value.toFixed(1)}B
                </div>
            </div>

            <input
                type="range"
                min="0.1"
                max="100"
                step="0.1"
                value={value}
                onChange={(e) => onChange(parseFloat(e.target.value))}
                disabled={disabled}
                className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-emerald-500 hover:accent-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
            />

            <div className="flex justify-between text-[10px] text-zinc-600 font-mono uppercase">
                <span>$0.1B (Pilot)</span>
                <span>$100B (Total War)</span>
            </div>
        </div>
    );
};

export default FundingSlider;
