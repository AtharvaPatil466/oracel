"use client";

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine, Cell } from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface RainfallData {
    year: number;
    deviation: number; // Percent deviation from LPA
    rainfall: number; // mm
}

interface RainfallTimeSeriesProps {
    data: RainfallData[];
}

const RainfallTimeSeries: React.FC<RainfallTimeSeriesProps> = ({ data }) => {
    return (
        <Card className="w-full h-[400px] bg-black/40 border-slate-800 backdrop-blur-md">
            <CardHeader>
                <CardTitle className="text-slate-100 font-mono text-sm uppercase tracking-wider">
                    🌧️ Monsoon Performance (Deviation from LPA)
                </CardTitle>
            </CardHeader>
            <CardContent className="h-[320px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                        <XAxis
                            dataKey="year"
                            stroke="#94a3b8"
                            fontFamily="monospace"
                            tick={{ fill: '#94a3b8' }}
                        />
                        <YAxis
                            stroke="#94a3b8"
                            fontFamily="monospace"
                            tick={{ fill: '#94a3b8' }}
                            label={{ value: '% Deviation', angle: -90, position: 'insideLeft', fill: '#94a3b8' }}
                        />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#e2e8f0' }}
                            itemStyle={{ color: '#e2e8f0' }}
                            cursor={{ fill: '#1e293b', opacity: 0.4 }}
                        />
                        <ReferenceLine y={0} stroke="#cbd5e1" strokeWidth={2} />
                        <Bar dataKey="deviation">
                            {data.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={entry.deviation < 0 ? '#ef4444' : '#22c55e'} // Red if deficit, Green if excess
                                />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
};

export default RainfallTimeSeries;
