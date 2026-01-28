from simulation import run_oracle_simulation

class OracleCore:
    def __init__(self):
        self.active_simulations = []
    
    def process_intervention(self, user_input: str):
        # Trigger the logic in simulation.py which now returns GeoJSON
        result = run_oracle_simulation(user_input)
        
        simulation_entry = {
            "input": user_input,
            "status": "success",
            "score": result["score"],
            "lives_saved": result["lives_saved"],
            "mitigated_data": result["mitigated_data"]
        }
        
        self.active_simulations.append(simulation_entry)
        return simulation_entry

    async def process_intervention_stream(self, user_input: str, investment: float):
        # Calls the async generator from simulation.py
        from simulation import run_oracle_simulation_stream
        async for chunk in run_oracle_simulation_stream(user_input, investment):
            yield chunk

# Global instance
oracle_engine = OracleCore()
