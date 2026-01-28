"""
Maps interventions to Indian Government Policies and Ministries.
"""

POLICY_MAPPING = {
    "Monsoon_Cloud_Seeding": {
        "relevant_ministries": ["Ministry of Earth Sciences (MOES)", "Ministry of Agriculture", "State Governments (Maharashtra/Karnataka)"],
        "existing_programs": [
            "Monsoon Mission Phase II (₹650 Cr)",
            "National Water Mission"
        ],
        "political_feasibility_score": 0.72,
        "alignment_notes": "Maharashtra and Karnataka state governments have actively funded seeding ops (Varsadhare). Strong alignment with drought relief."
    },
    "Monsoon_Prediction_Enhancement": {
        "relevant_ministries": ["Ministry of Earth Sciences (MOES)", "IMD"],
        "existing_programs": [
            "National Monsoon Mission",
            "High Performance Computing (HPC) upgrade"
        ],
        "political_feasibility_score": 0.95,
        "alignment_notes": "Core mandate of IMD. High unconditional support for forecast improvement."
    },
    "Agricultural_Adaptation_Systems": {
        "relevant_ministries": ["Ministry of Agriculture & Farmers Welfare", "ICAR"],
        "existing_programs": [
            "Pradhan Mantri Fasal Bima Yojana (PMFBY)",
            "Paramparagat Krishi Vikas Yojana"
        ],
        "political_feasibility_score": 0.85,
        "alignment_notes": "Aligns with goal of doubling farmers' income."
    },
    "Urban_Heat_Mitigation": {
        "relevant_ministries": ["Ministry of Housing and Urban Affairs (MoHUA)", "NDMA"],
        "existing_programs": [
            "Smart Cities Mission",
            "India Cooling Action Plan (ICAP)"
        ],
        "political_feasibility_score": 0.65,
        "alignment_notes": "Growing priority due to recent heat waves, but implementation is fragmented across municipalities."
    }
}

class PolicyContextAnalyzer:
    def get_analysis(self, mechanism_key: str):
        return POLICY_MAPPING.get(mechanism_key, {
            "relevant_ministries": ["NITI Aayog"],
            "existing_programs": ["Unknown"],
            "political_feasibility_score": 0.5,
            "alignment_notes": "Requires further policy analysis."
        })
