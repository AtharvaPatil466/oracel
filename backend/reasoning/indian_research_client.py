from typing import List, Dict, Any
import logging
import random

logger = logging.getLogger(__name__)

class IndianResearchClient:
    """
    Simulates searching Indian academic repositories.
    Prioritizes IITs, ICAR, and CSIR.
    """
    
    def search(self, query: str, limit: int = 5) -> List[Dict[str, Any]]:
        # Mock results based on query keywords
        results = []
        
        keywords = query.lower().split()
        
        if "cloud seeding" in query.lower():
            results.append({
                "title": "Aerosol-Cloud Interaction in the Indian Monsoon Region",
                "authors": ["Pradeep Kumar", "R. S. Maheskumar"],
                "institution": "IITM Pune - Cloud Physics Lab",
                "year": 2023,
                "summary": "Observational campaign (CAIPEEX) results on hygroscopic seeding efficacy.",
                "url": "https://www.tropmet.res.in/caipeex"
            })
            results.append({
                "title": "Optimization of Flare Hygroscopicity for Rain Shadow Regions",
                "authors": ["S. K. Paul", "A. K. Kamra"],
                "institution": "IIT Bombay",
                "year": 2022,
                "summary": "Study on particle size distribution for seeding over the Western Ghats shadow.",
                "url": "https://iitb.ac.in/research"
            })
            
        if "prediction" in query.lower() or "forecast" in query.lower():
             results.append({
                "title": "Deep Learning for Monsoon Intraseasonal Oscillations",
                "authors": ["V. Mishra", "B. N. Goswami"],
                "institution": "IISc Bangalore",
                "year": 2024,
                "summary": "LSTM-based approach to predict active/break spells 3 weeks in advance.",
                "url": "https://iisc.ac.in"
            })
             
        if "heat" in query.lower() or "roof" in query.lower():
             results.append({
                "title": "Thermal Performance of Low-Cost Cool Roof Coatings",
                "authors": ["R. Garg", "P. Mathur"],
                "institution": "IIIT Hyderabad - Building Science",
                "year": 2023,
                "summary": "Field test of lime-based coatings in Hyderabad low-income settlements.",
                "url": "https://iiit.ac.in"
            })

        # Fill with generic Indian result if empty
        if not results:
             results.append({
                "title": f"Review of {query} applications in Indian Context",
                "authors": ["A. Sharma", "K. Singh"],
                "institution": "DST Centre of Excellence",
                "year": 2023,
                "summary": "Comprehensive review of technologies and policy implications.",
                "url": "https://dst.gov.in"
            })

        return results[:limit]
