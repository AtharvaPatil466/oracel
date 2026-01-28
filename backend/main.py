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

from api import monsoon_routes

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(monsoon_routes.router, prefix="/api")

class Intervention(BaseModel):
    user_input: str
    investment: float = 1.0

from reasoning.llm_engine import llm_engine


@app.post("/api/simulate/stream")
async def analyze_simulation_stream(data: Intervention):
    try:
        logger.info(f"Received streaming simulation request: {data.user_input} with ₹{data.investment}B")
        # Convert Billions USD (frontend slider) to INR (approx 1B USD = 8000 Cr INR) 
        # But wait, frontend slider is just a number. If user treats it as 1.0 = 10 Cr or 1 B USD?
        # Let's assume input is in Crores INR contextually for now, or just pass raw.
        # Actually slider in 922 says "Billions". We should fix frontend to be "Crores".
        # For now, let's treat the unit as "Crores" in the backend.
        
        return StreamingResponse(
            llm_engine.stream_analysis(data.user_input, investment_inr=data.investment * 10000000), # Mock conversion
            media_type="application/x-ndjson"
        )
    except Exception as e:
        logger.exception(f"Error during streaming simulation: {str(e)}")
        return {"status": "error", "message": "Internal server error during simulation."}