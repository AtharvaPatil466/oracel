from reasoning.mechanism_database import MECHANISMS

class MockLLMEngine:
    """
    A simulated LLM reasoning engine.
    Now acts as "The Oracle of Delphi", returning structured bottleneck analysis.
    """
    
    def __init__(self):
        # Maps keywords to the MECHANISMS keys
        self.triggers = {
            "marine_cloud_brightening": ["cloud", "brighten", "salt", "spray", "ocean", "ship", "fleet", "mist", "albedo"],
            "solar_radiation_management": ["aerosol", "sulfur", "stratosphere", "injection", "so2", "volcano", "dimming", "sun", "reflect", "mirror"],
            "ocean_cooling": ["cool", "pump", "deep", "upturn", "mix", "thermal", "exchange"],
            "carbon_capture": ["carbon", "capture", "co2", "remove", "suck", "filter", "direct air"],
        }

    def analyze_strategy(self, user_input: str, investment_usd: float = 0):
        """
        Analyzes the strategy to identify the mechanism and return its full bottleneck profile.
        """
        user_input_lower = user_input.lower()
        
        # 1. Identify Mechanism
        detected_key = "marine_cloud_brightening" # Default fallback
        best_count = 0
        
        for key, keywords in self.triggers.items():
            count = sum(1 for k in keywords if k in user_input_lower)
            if count > best_count:
                best_count = count
                detected_key = key
        
        # 2. Retrieve Ground Truth Data
        data = MECHANISMS.get(detected_key, MECHANISMS["marine_cloud_brightening"])
        
        # 3. Construct "Oracle" Response
        # We clone the data to avoid mutating the global dict
        response = {
            "mechanism": data["name"],
            "feasibility_score": data["feasibility_score"],
            "bottleneck": data["bottleneck"],
            "research_vectors": data["research_vectors"],
            "funding_estimate": data["funding_estimate"],
            
            # Helper for UI to show "Unscientific" if needed (not active yet)
            "is_scientific": True 
        }
        
        return response

# Global Instance
llm_engine = MockLLMEngine()
