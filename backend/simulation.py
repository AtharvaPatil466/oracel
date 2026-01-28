import json
import os
import logging

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

def apply_decay_to_tracks(innovation_score: float, baseline_path: str = None):
    """
    Applies a decay function to baseline hurricane tracks based on an innovation score.
    Logic: New_Wind_Speed = Old_Wind_Speed * (1 - (Innovation_Score * Sensitivity_Factor))
    """
    if baseline_path is None:
        # Default path relative to this script
        # Default path relative to this script
        base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        baseline_path = os.path.join(base_dir, 'data', 'processed', 'hurricanes.json')

    if not os.path.exists(baseline_path):
        logger.error(f"Baseline file not found at {baseline_path}")
        return None, 0
    
    with open(baseline_path, 'r') as f:
        baseline_geojson = json.load(f)
    
    logger.info(f"Applying decay with score {innovation_score} to {len(baseline_geojson['features'])} features")
    
    # Sensitivity factor: How much impact does the score actually have? 
    # Scaled so that 1.0 innovation score reduces wind speed significantly but doesn't delete the storm.
    SENSITIVITY_FACTOR = 0.5 
    
    mitigated_features = []
    total_wind_reduction = 0
    
    for feature in baseline_geojson['features']:
        old_wind = feature['properties'].get('wind', 0)
        
        # Apply the decay formula
        # New_Wind_Speed = Old_Wind_Speed * (1 - (Innovation_Score * Sensitivity_Factor))
        reduction_ratio = innovation_score * SENSITIVITY_FACTOR
        new_wind = old_wind * (1 - reduction_ratio)
        
        total_wind_reduction += (old_wind - new_wind)
        
        # Create a new feature for the mitigated track
        mitigated_feature = {
            "type": "Feature",
            "geometry": feature['geometry'],
            "properties": {
                **feature['properties'],
                "wind": round(new_wind, 2),
                "is_mitigated": True
            }
        }
        mitigated_features.append(mitigated_feature)
    
    mitigated_geojson = {
        "type": "FeatureCollection",
        "features": mitigated_features
    }
    
    # Calculate "Lives Saved" based on cumulative wind speed reduction
    # Heuristic: 1 kt reduction across all tracked segments translates to ~5 protected individuals in high-risk zones
    lives_saved = int(total_wind_reduction * 5)
    
    return mitigated_geojson, lives_saved

# Legacy function for backward compatibility if needed temporarily
def run_oracle_simulation(scenario: str):
    """
    Simulates the impact of an intervention based on a scenario description.
    (This is now bridged by OracleCore in oracle.py)
    """
    # Expanded score mapping for Phase 2
    score = 0.05
    keywords = {
        "cloud brightening": 0.15,
        "aerosol": 0.15,
        "cooling": 0.20,
        "ocean": 0.18,
        "deep": 0.15,
        "autonomous": 0.22,
        "fleet": 0.20,
        "ships": 0.20,
        "stratospheric": 0.30,
        "injection": 0.25,
        "sulfat": 0.25,
        "co2 capture": 0.28,
        "carbon": 0.20,
        "seeding": 0.18,
        "drone": 0.15,
        "satellite": 0.12
    }
    
    scenario_lower = scenario.lower()
    for key, val in keywords.items():
        if key in scenario_lower:
            score = max(score, val)
    
    logger.info(f"Scenario: '{scenario}' evaluated with score: {score}")
    
    # Apply to data
    mitigated_data, lives_saved = apply_decay_to_tracks(score)
    
    return {
        "score": score,
        "lives_saved": lives_saved,
        "mitigated_data": mitigated_data
    }

import asyncio
import random
import math

async def run_oracle_simulation_stream(scenario: str, investment: float = 1.0):
    """
    async generator that simulates the intervention process with delays and progress updates.
    """
    # Import the new engines
    from reasoning.llm_engine import llm_engine
    from reasoning.arxiv_wrapper import arxiv_client
    
    yield json.dumps({"status": "progress", "message": "Initializing Neural Interface...", "progress": 10}) + "\n"
    await asyncio.sleep(0.5)

    yield json.dumps({"status": "progress", "message": "Parsing Intervention Semantics...", "progress": 20}) + "\n"
    
    # 1. Analyze Semantics (The Oracle of Delphi)
    # Convert investment from Billions to raw USD for the check (approx)
    investment_usd = investment * 1_000_000_000 
    analysis = llm_engine.analyze_strategy(scenario, investment_usd)
    
    # Extract Scoring for Physics
    score = analysis["feasibility_score"] # Use the database score
    mechanism = analysis["mechanism"]
    
    # Stream the FULL Oracle Analysis immediately
    yield json.dumps({
        "status": "oracle_analysis",
        "data": analysis,
        "progress": 40,
        "message": f"Identified Mechanism: {mechanism}"
    }) + "\n"
    
    await asyncio.sleep(0.8)

    # 2. Fetch Research
    # Use the first vector for the simulation stream log, but frontend will use the full list
    primary_vector = analysis["research_vectors"][0]["search_query"]
    yield json.dumps({"status": "progress", "message": f"Querying Research: [{primary_vector}]", "progress": 55}) + "\n"
    
    # We still fetch papers for backend completeness, but frontend might fetch them or use what we send
    # For now, let's just let the frontend handle the display based on the vectors
    # But to keep existing logic working, we'll fetch a few
    papers = arxiv_client.search_papers(primary_vector, max_results=2)
    await asyncio.sleep(0.5) 
            
    # Apply Investment Multiplier
    # Formula: Multiplier = 1 + log10(investment) * 0.5
    # $1B -> 1.0x
    # $10B -> 1.5x
    # $100B -> 2.0x
    investment_multiplier = 1 + (math.log10(max(1, investment)) * 0.5)
    final_score = min(0.95, score * investment_multiplier) # Cap at 95% effectiveness
    
    yield json.dumps({"status": "progress", "message": f"Strategy Base Score: {int(score*100)}% | Fin. Multiplier: {investment_multiplier:.2f}x", "progress": 75}) + "\n"
    await asyncio.sleep(0.6)

    yield json.dumps({"status": "progress", "message": "Applying Atmospheric Models...", "progress": 90}) + "\n"
    await asyncio.sleep(0.8)

    # Apply to data
    mitigated_data, lives_saved = apply_decay_to_tracks(final_score)
    
    final_result = {
        "status": "complete",
        "score": final_score,
        "lives_saved": lives_saved,
        "mitigated_data": mitigated_data,
        "papers": papers,
        "progress": 100
    }
    yield json.dumps(final_result) + "\n"
