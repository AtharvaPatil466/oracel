import { MonsoonData } from '../types/monsoon.types';

export interface DemoScenario {
    id: string;
    name: string;
    description: string;
    year: number;
}

export const DEMO_SCENARIOS: DemoScenario[] = [
    {
        id: "2019",
        name: "2019 Delayed Monsoon (Drought)",
        description: "Severe deficit in Maharashtra. Ideal for cloud seeding demo.",
        year: 2019
    },
    {
        id: "2022",
        name: "2022 Consistent Rain (Excess)",
        description: "Good year but flood risks in Central India. Flooding mitigation.",
        year: 2022
    },
    {
        id: "2023",
        name: "2023 El Nino (Simulated)",
        description: "Normal to slightly deficit year. Good for prediction enhancement.",
        year: 2023
    }
];
