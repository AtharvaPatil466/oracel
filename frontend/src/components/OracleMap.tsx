'use client';

import React, { useEffect, useRef } from 'react';
import * as Cesium from 'cesium';
import 'cesium/Build/Cesium/Widgets/widgets.css';

const OracleMap: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const viewerRef = useRef<Cesium.Viewer | null>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        // Ensure we only initialize once
        if (viewerRef.current) return;

        // Explicitly set the base URL for Cesium assets
        (window as any).CESIUM_BASE_URL = '/cesium';

        try {
            const viewer = new Cesium.Viewer(containerRef.current, {
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

            // Set scene background to black
            viewer.scene.backgroundColor = Cesium.Color.BLACK;

            // Add a sample point to verify it's working
            viewer.entities.add({
                position: Cesium.Cartesian3.fromDegrees(139.6917, 35.6895),
                point: {
                    pixelSize: 10,
                    color: Cesium.Color.RED,
                    outlineColor: Cesium.Color.WHITE,
                    outlineWidth: 2,
                },
                label: {
                    text: 'Neo-Tokyo Command Center',
                    font: '14pt monospace',
                    style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                    outlineWidth: 2,
                    verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                    pixelOffset: new Cesium.Cartesian2(0, -9),
                }
            });

            // Fly to Tokyo
            viewer.camera.flyTo({
                destination: Cesium.Cartesian3.fromDegrees(139.6917, 35.6895, 1000000),
                duration: 2
            });

            viewerRef.current = viewer;
        } catch (error) {
            console.error('Failed to initialize Cesium:', error);
        }

        return () => {
            if (viewerRef.current) {
                viewerRef.current.destroy();
                viewerRef.current = null;
            }
        };
    }, []);

    return (
        <div className="w-full h-full relative overflow-hidden rounded-xl border border-white/10 shadow-2xl bg-black">
            <div ref={containerRef} className="w-full h-full" />

            {/* Overlay for map controls or breadcrumbs */}
            <div className="absolute top-4 left-4 z-10 flex flex-col gap-2 pointer-events-none">
                <div className="bg-black/80 backdrop-blur-md px-4 py-2 rounded-lg border border-white/20 text-white text-xs font-mono tracking-widest uppercase">
                    Neural Map Protocol: ACTIVE
                </div>
            </div>
        </div>
    );
};

export default OracleMap;