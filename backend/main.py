import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from fastapi.responses import StreamingResponse
import os
import json

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Intervention(BaseModel):
    user_input: str
    investment: float = 1.0

from oracle import oracle_engine

@app.post("/api/simulate")
async def analyze_simulation(data: Intervention):
    try:
        logger.info(f"Received simulation request: {data.user_input}")
        result = oracle_engine.process_intervention(data.user_input)
        
        if result["mitigated_data"] is None:
            logger.error("Simulation failed unexpectedly.")
            return {"status": "error", "message": "Simulation failed to process data."}

        return {
            "status": "success",
            "narrative": f"Analyzing '{data.user_input}'...",
            "lives_saved": result["lives_saved"],
            "mitigated_data": result["mitigated_data"]
        }
    except Exception as e:
        logger.exception(f"Error during simulation: {str(e)}")
        return {"status": "error", "message": "Internal server error during simulation."}

@app.post("/api/simulate/stream")
async def analyze_simulation_stream(data: Intervention):
    try:
        logger.info(f"Received streaming simulation request: {data.user_input} with ${data.investment}B")
        return StreamingResponse(
            oracle_engine.process_intervention_stream(data.user_input, data.investment),
            media_type="application/x-ndjson"
        )
    except Exception as e:
        logger.exception(f"Error during streaming simulation: {str(e)}")
        return {"status": "error", "message": "Internal server error during simulation."}

@app.get("/api/baseline")
def get_baseline():
    try:
        # Serve the dynamically processed data
        data_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'data', 'processed', 'hurricanes.json')
        if not os.path.exists(data_path):
             # Fallback to empty if pipeline hasn't run
            return {"type": "FeatureCollection", "features": []}
            
        with open(data_path, 'r') as f:
            return json.load(f)
    except Exception as e:
        logger.error(f"Failed to serve baseline: {e}")
        return {"error": "Data unavailable"}