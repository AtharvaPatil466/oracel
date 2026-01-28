"use client";

import React from 'react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { PlayCircle, CheckCircle } from 'lucide-react';
import { DEMO_SCENARIOS, DemoScenario } from '@/demo/scenarios';
import { useStreamStore } from '@/store/stream-store';

const DemoModeToggle: React.FC = () => {
    // In a real app, this would call the API to switch context
    // For now, we just visually show the switcher and log it
    // The actual data fetch handles the context switching via the API call

    const [activeScenario, setActiveScenario] = React.useState<string>("2019");

    const handleSwitch = async (scenario: DemoScenario) => {
        console.log(`Switching to Scenario: ${scenario.name}`);
        setActiveScenario(scenario.id);

        try {
            // Call Backend to switch simulation context
            const res = await fetch(`/api/streams/climate/monsoon/simulation/set_year?year=${scenario.year}`, {
                method: 'POST'
            });

            if (res.ok) {
                // Trigger a refresh of the page or re-fetch data
                window.location.reload();
            }
        } catch (e) {
            console.error("Failed to switch scenario", e);
        }
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" className="bg-amber-500/10 border-amber-500/50 text-amber-500 hover:bg-amber-500/20">
                    <PlayCircle className="w-4 h-4 mr-2" />
                    Demo Mode: {activeScenario}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 bg-slate-900 border-slate-700 text-slate-200">
                <DropdownMenuLabel>Select Scenario</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-slate-700" />
                {DEMO_SCENARIOS.map((s) => (
                    <DropdownMenuItem
                        key={s.id}
                        onClick={() => handleSwitch(s)}
                        className="cursor-pointer focus:bg-slate-800"
                    >
                        {activeScenario === s.id && <CheckCircle className="w-4 h-4 mr-2 text-green-500" />}
                        <span className={activeScenario === s.id ? "font-bold text-white" : ""}>
                            {s.year} ({s.name.split(' ')[1]})
                        </span>
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default DemoModeToggle;
