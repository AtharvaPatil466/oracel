"""
Database of India-specific Climate Intervention Mechanisms.
Source: Indian Institute of Tropical Meteorology (IITM), ICAR, and Ministry of Earth Sciences reports.
"""

MECHANISMS = {
    "Monsoon_Cloud_Seeding": {
        "name": "Monsoon Cloud Seeding (Coughlin-style)",
        "description": "Aerial dispersion of silver iodide/hygroscopic flares into monsoon clouds to enhance precipitation in rain-shadow regions.",
        "current_capability": "500 sq km coverage per operation (Karnataka 2017)",
        "required_capability_base": 2000,
        "gap_ratio": 4.0,
        "research_focus": [
            "AgI seeding efficiency in tropical stratocumulus",
            "Drone-based delivery for precise targeting",
            "Real-time monsoon trough identification"
        ],
        "indian_institutions": [
            "IIT Bombay - Weather Modification Unit",
            "IITM Pune - Cloud Physics Division",
            "Karnataka State Natural Disaster Monitoring Centre"
        ],
        "economic_context": {
            "cost_per_unit_inr": 500000000, # ₹50 Cr per season
            "roi_years": 2,
            "benefit_description": "Agricultural yield protection for Kharif crops"
        }
    },
    
    "Monsoon_Prediction_Enhancement": {
        "name": "AI-Enhanced Monsoon Prediction",
        "description": "Integrating Machine Learning with dynamical models (CFS v2) to improve 2-week forecast accuracy for district-level sowing decisions.",
        "current_capability": "70% accuracy at 2-week lead time (IITM)",
        "required_capability_base": 85,
        "gap_ratio": 1.2,
        "research_focus": [
            "Ocean-atmosphere coupling ML models",
            "High-resolution ensemble forecasting",
            "Data assimilation from INSAT-3D"
        ],
        "indian_institutions": [
            "IITM Pune - Monsoon Mission",
            "NCMRWF (National Centre for Medium Range Weather Forecasting)",
            "IIT Delhi - Centre for Atmospheric Sciences"
        ],
        "economic_context": {
            "cost_per_unit_inr": 120000000, # ₹12 Cr research grant
            "roi_years": 1,
            "benefit_description": "Prevented sowing loss for 10M+ farmers"
        }
    },
    
    "Agricultural_Adaptation_Systems": {
        "name": "Drought-Resilient Crop Systems",
        "description": "Deployment of genetically heat-stress tolerant seed varieties (millets, pulses) optimized for delayed monsoon onset.",
        "current_capability": "15% adoption in rain-fed Vidarbha/Marathwada",
        "required_capability_base": 70,
        "gap_ratio": 4.7,
        "research_focus": [
            "Genetic modification for water-use efficiency",
            "Precision irrigation sensors for smallholders",
            "Monsoon-indexed insurance derivatives"
        ],
        "indian_institutions": [
            "ICAR - Indian Institute of Millets Research",
            "ICRISAT - International Crops Research Institute",
            "IIT Kharagpur - Agricultural & Food Engineering"
        ],
        "economic_context": {
            "cost_per_unit_inr": 50000000, # ₹5 Cr per district rollout
            "roi_years": 3,
            "benefit_description": "Long-term food security stabilization"
        }
    },

    "Urban_Heat_Mitigation": {
        "name": "Urban Cool Roof Deployment",
        "description": "High-albedo reflective coatings for slum and low-income housing in high-density metros to reduce heat island effect.",
        "current_capability": "Cost ₹500/sq m (too high for mass adoption)",
        "required_capability_base": 200, # Target cost ₹200/sq m
        "gap_ratio": 2.5,
        "research_focus": [
            "Low-cost lime-based reflective composites",
            "Passive radiative cooling materials",
            "Urban planning integration policy"
        ],
        "indian_institutions": [
            "IIT Delhi - Dept of Energy Science",
            "TERI - The Energy and Resources Institute",
            "IIIT Hyderabad - Building Science"
        ],
        "economic_context": {
             "cost_per_unit_inr": 200000000, # ₹20 Cr per ward
             "roi_years": 5,
             "benefit_description": "Reduction in heat-stroke mortality and cooling energy load"
        }
    }
}
