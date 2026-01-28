export interface StreamMetrics {
    timestamp: number;
    values: Record<string, number>; // Normalized 0-1
    metadata: Record<string, any>; // Raw data
}

export interface StreamAlert {
    id: string;
    streamId: string;
    severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'INFO';
    message: string;
    timestamp: number;
}

export interface StreamState {
    id: string; // 'climate', 'economic', etc.
    status: 'healthy' | 'degraded' | 'offline';
    lastUpdate: number;
    metrics: StreamMetrics;
    activeAlerts: StreamAlert[];
}
