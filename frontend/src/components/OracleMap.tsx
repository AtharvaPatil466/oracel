'use client';

import React, { useEffect, useRef } from 'react';
import * as Cesium from 'cesium';
import 'cesium/Build/Cesium/Widgets/widgets.css';

interface OracleMapProps {
    mitigatedData?: any;
}

const OracleMap: React.FC<OracleMapProps> = ({ mitigatedData }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const viewerRef = useRef<Cesium.Viewer | null>(null);
    const baselineSourceRef = useRef<Cesium.GeoJsonDataSource | null>(null);
    const mitigatedSourceRef = useRef<Cesium.GeoJsonDataSource | null>(null);

    useEffect(() => {
        if (!containerRef.current) return;
        if (viewerRef.current) return;

        (window as any).CESIUM_BASE_URL = '/cesium';

        const initializeCesium = async () => {
            try {
                const viewer = new Cesium.Viewer(containerRef.current!, {
                    timeline: false,
                    animation: false,
                    baseLayerPicker: false,
                    geocoder: false,
                    homeButton: false,
                    infoBox: false,
                    navigationHelpButton: false,
                    sceneModePicker: false,
                    selectionIndicator: false,
                });

                viewer.scene.backgroundColor = Cesium.Color.BLACK;

                // Load Baseline
                try {
                    const baselineSource = await Cesium.GeoJsonDataSource.load('/data/hurricanes_baseline.json');

                    baselineSource.entities.values.forEach(entity => {
                        if (entity.polyline) {
                            const wind = entity.properties?.wind?.getValue();
                            let color = Cesium.Color.WHITE.withAlpha(0.2); // Faded by default

                            if (wind >= 137) color = Cesium.Color.RED.withAlpha(0.3);
                            else if (wind >= 113) color = Cesium.Color.ORANGERED.withAlpha(0.3);
                            else if (wind >= 96) color = Cesium.Color.ORANGE.withAlpha(0.3);

                            (entity.polyline.material as any) = new Cesium.ColorMaterialProperty(color);
                            entity.polyline.width = (wind / 40) as any;
                        }
                    });

                    viewer.dataSources.add(baselineSource);
                    baselineSourceRef.current = baselineSource;
                } catch (err) {
                    console.warn("Baseline data not ready.");
                }

                viewer.camera.setView({
                    destination: Cesium.Cartesian3.fromDegrees(-40, 30, 15000000)
                });

                viewerRef.current = viewer;
            } catch (error) {
                console.error('Failed to initialize Cesium:', error);
            }
        };

        initializeCesium();

        return () => {
            if (viewerRef.current) {
                viewerRef.current.destroy();
                viewerRef.current = null;
            }
        };
    }, []);

    // Effect to handle mitigated data updates
    useEffect(() => {
        if (!viewerRef.current || !mitigatedData) return;

        const updateMitigatedView = async () => {
            const viewer = viewerRef.current!;

            // Remove old mitigated source if it exists
            if (mitigatedSourceRef.current) {
                viewer.dataSources.remove(mitigatedSourceRef.current);
            }

            // Dim baseline source
            if (baselineSourceRef.current) {
                baselineSourceRef.current.entities.values.forEach(entity => {
                    if (entity.polyline) {
                        const color = (entity.polyline.material as any).color.getValue();
                        (entity.polyline.material as any).color = color.withAlpha(0.05);
                    }
                });
            }

            // Load new mitigated source from raw data
            const mitigatedSource = await Cesium.GeoJsonDataSource.load(mitigatedData);

            mitigatedSource.entities.values.forEach(entity => {
                if (entity.polyline) {
                    const wind = entity.properties?.wind?.getValue();
                    // Blue/Cyan theme for mitigation
                    let color = Cesium.Color.CYAN.withAlpha(0.0); // Start transparent

                    if (wind >= 113) color = Cesium.Color.DEEPSKYBLUE;
                    else if (wind >= 83) color = Cesium.Color.DODGERBLUE;

                    (entity.polyline.material as any) = new Cesium.ColorMaterialProperty(color.withAlpha(0.7));
                    entity.polyline.width = (wind / 30) as any;
                }
            });

            viewer.dataSources.add(mitigatedSource);
            mitigatedSourceRef.current = mitigatedSource;

            // Zoom to the extent of the new data
            if (mitigatedData && mitigatedData.features && mitigatedData.features.length > 0) {
                viewer.flyTo(mitigatedSource, {
                    duration: 2.0,
                    offset: new Cesium.HeadingPitchRange(0, -Cesium.Math.PI_OVER_FOUR, 5000000)
                });
            }
        };

        updateMitigatedView();
    }, [mitigatedData]);

    return (
        <div className="w-full h-full relative overflow-hidden rounded-xl border border-white/10 shadow-2xl bg-black">
            <div ref={containerRef} className="w-full h-full" />
            <div className="absolute top-4 left-4 z-10 flex flex-col gap-2 pointer-events-none">
                <div className="bg-black/80 backdrop-blur-md px-4 py-2 rounded-lg border border-white/20 text-white text-xs font-mono tracking-widest uppercase">
                    Neural Map Protocol: {mitigatedData ? 'MITIGATION ACTIVE' : 'STEADY STATE'}
                </div>
            </div>

            {/* Simulation Legend */}
            <div className="absolute top-4 right-4 z-10 flex flex-col gap-2 pointer-events-none">
                <div className="bg-black/60 backdrop-blur-md p-3 rounded-lg border border-white/10 text-xs text-zinc-400 space-y-2">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-red-500 rounded-sm"></div>
                        <span>Baseline (Cat 4-5)</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-cyan-400 rounded-sm"></div>
                        <span>Mitigated Track</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OracleMap;