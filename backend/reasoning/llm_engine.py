import random
import re

class MockLLMEngine:
    """
    A simulated LLM reasoning engine. 
    In the real version, this would call OpenAI/Anthropic/Gemini APIs.
    For this prototype, it uses advanced pattern matching to simulate "understanding".
    """
    
    def __init__(self):
        # Knowledge Base: Maps concepts to categories and keywords
        self.knowledge_base = {
            "solar_radiation_management": {
                "triggers": ["aerosol", "sulfur", "stratosphere", "injection", "so2", "volcano", "dimming", "sun", "reflect"],
                "mechanism": "Solar Radiation Management (SRM)",
                "search_terms": ["stratospheric aerosol injection", "solar geoengineering", "radiative forcing"],
                "base_score": 0.25
            },
            "marine_cloud_brightening": {
                "triggers": ["cloud", "brighten", "salt", "spray", "ocean", "ship", "fleet", "mist", "albedo"],
                "mechanism": "Marine Cloud Brightening (MCB)",
                "search_terms": ["marine cloud brightening", "cloud condensation nuclei", "albedo modification"],
                "base_score": 0.18
            },
            "ocean_cooling": {
                "triggers": ["cool", "pump", "deep", "upturn", "mix", "thermal", "exchange"],
                "mechanism": "Artificial Upwelling",
                "search_terms": ["artificial upwelling", "ocean thermal energy", "hurricane intensity mitigation"],
                "base_score": 0.15
            },
            "carbon_capture": {
                "triggers": ["carbon", "capture", "co2", "remove", "suck", "filter", "direct air"],
                "mechanism": "Direct Air Capture (DAC)",
                "search_terms": ["direct air capture", "carbon sequestration", "negative emissions"],
                "base_score": 0.10
            }
        }

    def analyze_strategy(self, user_input: str):
        """
        Analyzes the user input to extract the intervention mechanism, effectiveness score, and search keywords.
        """
        user_input_lower = user_input.lower()
        
        # Default Logic
        detected_mechanism = "General Climate Intervention"
        search_terms = ["climate engineering", "hurricane mitigation"]
        score = 0.05
        
        # Pattern Matching
        matches = []
        for key, data in self.knowledge_base.items():
            trigger_count = sum(1 for trigger in data["triggers"] if trigger in user_input_lower)
            if trigger_count > 0:
                matches.append({
                    "id": key,
                    "count": trigger_count,
                    "data": data
                })
        
        # Select best match
        if matches:
            # Sort by number of trigger matches
            best_match = sorted(matches, key=lambda x: x["count"], reverse=True)[0]
            data = best_match["data"]
            
            detected_mechanism = data["mechanism"]
            search_terms = data["search_terms"]
            score = data["base_score"]
            
            # Bonus score for specificity
            if best_match["count"] > 2:
                score += 0.05
        
        # Construct the "LLM" response
        return {
            "mechanism": detected_mechanism,
            "score": score,
            "search_query": " AND ".join([f'({term})' for term in search_terms[:2]]), # Simple query construction
            "raw_keywords": search_terms
        }

# Global Instance
llm_engine = MockLLMEngine()
