"""
Ground Truth Database for the Oracle of Delphi Engine.
Contains hardcoded scientific bottlenecks, gap ratios, and funding needs to ensure consistency.
"""

MECHANISMS = {
    # 1. Marine Cloud Brightening (MCB)
    "marine_cloud_brightening": {
        "name": "Marine Cloud Brightening",
        "feasibility_score": 0.35,
        "bottleneck": {
            "description": "Aerosol generation rate per vessel is insufficient for storm-scale coverage",
            "current_capability": "~40 km²/day per vessel (Prototype A)",
            "required_capability": "180 km²/day per vessel for Cat 5",
            "gap_ratio": 4.5
        },
        "research_vectors": [
            {
                "search_query": "electrostatic seawater spray nozzle efficiency 2024",
                "focus": "Nozzle aerosol generation rate"
            },
            {
                "search_query": "autonomous surface vessel swarm coordination 2023",
                "focus": "Deployment logistics at scale"
            },
            {
                "search_query": "marine cloud albedo perturbation thermodynamics 2024",
                "focus": "Verification of radiative forcing impact"
            }
        ],
        "funding_estimate": {
            "amount_usd": 45000000,
            "timeframe_years": 4
        }
    },

    # 2. Stratospheric Aerosol Injection (SAI)
    "solar_radiation_management": {
        "name": "Stratospheric Aerosol Injection",
        "feasibility_score": 0.42,
        "bottleneck": {
            "description": "Aircraft payload capacity at 20km altitude is the limiting factor",
            "current_capability": "5 tonnes per sortie (Modified Learjet)",
            "required_capability": "25 tonnes per sortie (Purpose-built)",
            "gap_ratio": 5.0
        },
        "research_vectors": [
            {
                "search_query": "stratospheric aerosol injection payload delivery 2024",
                "focus": "High-altitude delivery platform"
            },
            {
                "search_query": "sulfate aerosol precursor dispersion dynamics",
                "focus": "Chemical dispersion efficiency"
            },
            {
                "search_query": "solar geoengineering ozone layer impact",
                "focus": "Risk mitigation (Ozone)"
            }
        ],
        "funding_estimate": {
            "amount_usd": 1200000000,
            "timeframe_years": 7
        }
    },

    # 3. Artificial Upwelling (Ocean Cooling)
    "ocean_cooling": {
        "name": "Artificial Upwelling",
        "feasibility_score": 0.15,
        "bottleneck": {
            "description": "Wave pump vertical transport volume is orders of magnitude too low",
            "current_capability": "0.5 m³/s per unit",
            "required_capability": "25 m³/s per unit for regional cooling",
            "gap_ratio": 50.0 
        },
        "research_vectors": [
            {
                "search_query": "artificial upwelling pump efficiency wave energy",
                "focus": "Hydraulic output scaling"
            },
            {
                "search_query": "ocean thermal energy conversion upwelling",
                "focus": "Thermal transport efficiency"
            }
        ],
        "funding_estimate": {
            "amount_usd": 85000000,
            "timeframe_years": 10
        }
    },
    
    # 4. Fallback / Carbon Capture
    "carbon_capture": {
        "name": "Direct Air Capture (DAC)",
        "feasibility_score": 0.65,
        "bottleneck": {
            "description": "Energy cost per ton of CO2 removed is economically unviable for short-term impact",
            "current_capability": "$600 per ton CO2",
            "required_capability": "$100 per ton CO2",
            "gap_ratio": 6.0
        },
        "research_vectors": [
            {
                "search_query": "direct air capture amine sorbent efficiency",
                "focus": "Material Science"
            },
            {
                "search_query": "dac energy consumption optimization",
                "focus": "Thermodynamics"
            }
        ],
        "funding_estimate": {
            "amount_usd": 200000000,
            "timeframe_years": 5
        }
    }
}
