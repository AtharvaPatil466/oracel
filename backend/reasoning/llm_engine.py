from typing import Dict, Any, List, AsyncGenerator
import json
import asyncio
from reasoning.mechanism_database import MECHANISMS
from reasoning.policy_context import PolicyContextAnalyzer
from reasoning.indian_research_client import IndianResearchClient

class OracleEngine:
    """
    The Oracle of Delphi - India Edition.
    Connects Strategy -> Mechanism -> Policy + Research + Economics.
    """
    
    def __init__(self):
        self.policy_analyzer = PolicyContextAnalyzer()
        self.research_client = IndianResearchClient()
        
        # Keyword triggers for India-specific mechanisms
        self.triggers = {
            "Monsoon_Cloud_Seeding": ["cloud", "seed", "rain", "enhancement", "maharashtra", "drought", "karnataka", "silver iodide"],
            "Monsoon_Prediction_Enhancement": ["predict", "forecast", "model", "accuracy", "imd", "warning", "early"],
            "Agricultural_Adaptation_Systems": ["crop", "seed", "drought", "resistant", "insurance", "farmer", "yield"],
            "Urban_Heat_Mitigation": ["heat", "cool", "roof", "coating", "urban", "city", "temperature", "delhi"]
        }

    def analyze_strategy(self, user_input: str, investment_inr: float = 0) -> Dict[str, Any]:
        """
        Deconstructs the user's strategy and enriches it with:
        1. Mechanism Details (Ground Truth)
        2. Policy Alignment (Ministries)
        3. Active Research (Indian Inst)
        """
        user_input_lower = user_input.lower()
        
        # 1. Mechanism Detection
        detected_key = "Monsoon_Cloud_Seeding" # Fallback
        max_matches = 0
        
        for key, keywords in self.triggers.items():
            matches = sum(1 for k in keywords if k in user_input_lower)
            if matches > max_matches:
                max_matches = matches
                detected_key = key
                
        # 2. Fetch Data
        mechanism_data = MECHANISMS.get(detected_key, MECHANISMS["Monsoon_Cloud_Seeding"])
        policy_data = self.policy_analyzer.get_analysis(detected_key)
        
        # 3. Dynamic Research Query
        # We construct a query based on the mechanism name + "India"
        search_query = f"{mechanism_data['name']} research India"
        research_papers = self.research_client.search(search_query)

        # 4. Construct Response
        return {
            "mechanism": mechanism_data["name"],
            "description": mechanism_data["description"],
            "feasibility_score": self._calculate_feasibility(mechanism_data, policy_data, investment_inr),
            
            "bottleneck": {
                "current_capability": mechanism_data["current_capability"],
                "required_capability": mechanism_data["required_capability_base"],
                "gap_ratio": mechanism_data["gap_ratio"],
                "description": f"Gap of {mechanism_data['gap_ratio']}x between current pilots and required scale."
            },
            
            "research_vectors": [
                {
                    "focus": focus,
                    "institutions": mechanism_data["indian_institutions"]
                } for focus in mechanism_data["research_focus"]
            ],
            "active_papers": research_papers,
            
            "economic_context": mechanism_data["economic_context"],
            "policy_context": policy_data
        }

    def _calculate_feasibility(self, mech_data, policy_data, investment):
        # Simple heuristic: 
        # Base (Gap) + Policy Support + Investment Factor
        base = 1.0 / mech_data["gap_ratio"] # Lower gap = Higher feasibility
        policy = policy_data["political_feasibility_score"]
        
        # Investment saturation (diminishing returns)
        # Assuming typical project cost ~50 Cr
        funding_adequacy = min(1.0, investment / (mech_data["economic_context"]["cost_per_unit_inr"] or 1))
        
        score = (base * 0.4) + (policy * 0.4) + (funding_adequacy * 0.2)
        return round(min(0.99, max(0.1, score)), 2)

    async def stream_analysis(self, user_input: str, investment_inr: float = 0) -> AsyncGenerator[str, None]:
        """
        Streaming wrapper for the analysis.
        Yields progress updates -> Final Oracle Analysis.
        """
        # 1. Parsing User Input
        yield json.dumps({"status": "progress", "progress": 10, "message": "Parsing tactical input..."}) + "\n"
        await asyncio.sleep(0.5)
        
        # 2. Scanning Database
        yield json.dumps({"status": "progress", "progress": 30, "message": "Querying Mechanism Database..."}) + "\n"
        await asyncio.sleep(0.5)
        
        # 3. Policy Check
        yield json.dumps({"status": "progress", "progress": 60, "message": "Aligning with MoES Policy..."}) + "\n"
        await asyncio.sleep(0.5)
        
        # 4. Perform Logic
        analysis_result = self.analyze_strategy(user_input, investment_inr)
        
        yield json.dumps({"status": "progress", "progress": 85, "message": "Fetching Research Vectors..."}) + "\n"
        await asyncio.sleep(0.5)
        
        # 5. Final Result
        yield json.dumps({
            "status": "oracle_analysis",
            "progress": 100,
            "message": "Analysis Complete",
            "data": analysis_result
        }) + "\n"

# Global Instance
llm_engine = OracleEngine()
