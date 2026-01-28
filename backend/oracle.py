from simulation import run_oracle_simulation

class OracleCore:
    def __init__(self):
        self.active_simulations = []
    
    def process_intervention(self, user_input: str):
        result = run_oracle_simulation(user_input)
        self.active_simulations.append({
            "input": user_input,
            "result": result
        })
        return result

# Global instance
oracle_engine = OracleCore()
