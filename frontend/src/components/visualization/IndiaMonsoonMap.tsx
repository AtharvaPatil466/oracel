"use client";

import React, { useState } from 'react';
import { ComposableMap, Geographies, Geography, ZoomableGroup } from 'react-simple-maps';
import { scaleQuantile } from 'd3-scale';
import { formatIndianNumber } from '@/utils/indian_number_format';

// TopoJSON for India States
const INDIA_TOPO_JSON = "https://raw.githubusercontent.com/deldersveld/topojson/master/countries/india/india-states.json";

interface StateData {
    rainfall_mm: number;
    deviation: number;
    status: 'Normal' | 'Excess' | 'Deficit' | 'Large Excess';
}

interface IndiaMonsoonMapProps {
    data: Record<string, StateData>; // e.g. { "Maharashtra": { ... } }
}

const IndiaMonsoonMap: React.FC<IndiaMonsoonMapProps> = ({ data }) => {
    const [tooltipContent, setTooltipContent] = useState("");
    const [hoverPosition, setHoverPosition] = useState({ x: 0, y: 0 });

    // Color Scale Logic
    const getColor = (stateName: string) => {
        const state = data[stateName];
        if (!state) return "#EEE"; // No data

        // Red = Deficit, Green = Normal/Excess
        if (state.deviation < -19) return "#ef4444"; // Large Deficit (Red)
        if (state.deviation < -10) return "#f87171"; // Deficit (Light Red)
        if (state.deviation >= -10 && state.deviation <= 10) return "#22c55e"; // Normal (Green)
        if (state.deviation > 10) return "#3b82f6"; // Excess (Blue)

        return "#EEE";
    };

    return (
        <div className="relative w-full h-[500px] bg-slate-900/50 rounded-xl overflow-hidden border border-slate-700">

            {/* Map Control Header */}
            <div className="absolute top-4 left-4 z-10">
                <h3 className="text-white font-bold text-lg">🇮🇳 Monsoon Performance</h3>
                <div className="flex gap-2 text-xs mt-1">
                    <span className="flex items-center"><div className="w-3 h-3 bg-red-500 rounded-full mr-1"></div> Deficit</span>
                    <span className="flex items-center"><div className="w-3 h-3 bg-green-500 rounded-full mr-1"></div> Normal</span>
                    <span className="flex items-center"><div className="w-3 h-3 bg-blue-500 rounded-full mr-1"></div> Excess</span>
                </div>
            </div>

            <ComposableMap
                projection="geoMercator"
                projectionConfig={{
                    scale: 1000,
                    center: [78.9629, 22.5937] // Center of India
                }}
                className="w-full h-full"
            >
                <ZoomableGroup>
                    <Geographies geography={INDIA_TOPO_JSON}>
                        {({ geographies }) =>
                            geographies.map((geo) => {
                                const stateName = geo.properties.NAME_1 || geo.properties.st_nm;
                                return (
                                    <Geography
                                        key={geo.rsmKey}
                                        geography={geo}
                                        onMouseEnter={(evt) => {
                                            const state = data[stateName];
                                            if (state) {
                                                setTooltipContent(`${stateName}: ${state.deviation}% (${state.status})`);
                                                setHoverPosition({ x: evt.clientX, y: evt.clientY }); // Simple fallback position
                                            } else {
                                                setTooltipContent(stateName);
                                            }
                                        }}
                                        onMouseLeave={() => {
                                            setTooltipContent("");
                                        }}
                                        style={{
                                            default: {
                                                fill: getColor(stateName),
                                                outline: "none",
                                                stroke: "#1e293b",
                                                strokeWidth: 0.5
                                            },
                                            hover: {
                                                fill: "#F53",
                                                outline: "none"
                                            },
                                            pressed: {
                                                fill: "#E42",
                                                outline: "none"
                                            }
                                        }}
                                    />
                                );
                            })
                        }
                    </Geographies>
                </ZoomableGroup>
            </ComposableMap>

            {/* Custom Tooltip */}
            {tooltipContent && (
                <div className="absolute bottom-4 right-4 bg-black/80 text-white p-2 rounded text-sm border border-slate-600 pointer-events-none">
                    {tooltipContent}
                </div>
            )}
        </div>
    );
};

export default IndiaMonsoonMap;
