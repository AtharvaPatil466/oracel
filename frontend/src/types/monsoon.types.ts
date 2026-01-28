export interface RegionalData {
    region: string;
    rainfall_mm: number;
    deviation: number;
    status: 'Normal' | 'Excess' | 'Deficit' | 'Large Excess';
}

export interface StateData {
    rainfall_mm: number;
    deviation: number;
    status: 'Normal' | 'Excess' | 'Deficit' | 'Large Excess';
    risk_level?: 'Low' | 'Medium' | 'High';
}

export interface MonsoonData {
    year: number;
    scenario_name: string;
    all_india_rainfall_mm: number;
    lpa_mm: number;
    deviation_percent: number;
    onset_date: string;
    normal_onset_date: string;
    withdrawal_date: string;
    status: string;
    regional_data: RegionalData[];
    states: Record<string, StateData>;
}
