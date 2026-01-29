import React from 'react';
import { IndiaMap } from './IndiaMap';

export function Scene() {
    return (
        <div style={{
            width: '100vw',
            height: '100vh',
            position: 'relative',
            overflow: 'hidden',
            background: '#0a0f14'
        }}>
            {/* THE WORLD ENGINE (MAPBOX GLOBE v3.0) */}
            <IndiaMap />

            {/* SCANLINE OVERLAY EFFECT */}
            <div className="scanlines"></div>

            <style jsx>{`
                .scanlines {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(
                        transparent 50%,
                        rgba(0, 255, 255, 0.02) 50%
                    );
                    background-size: 100% 4px;
                    pointer-events: none;
                    z-index: 200;
                    opacity: 0.2;
                }
            `}</style>
        </div>
    );
}
