from fastapi import APIRouter, HTTPException, Query
from typing import Dict, Any, Optional
from streams.climate.mock_monsoon_client import MockMonsoonClient

router = APIRouter(prefix="/streams/climate/monsoon", tags=["Monsoon Stream"])

# Initialize Client (Singleton for now)
monsoon_client = MockMonsoonClient()

@router.get("/current")
async def get_current_status(year: Optional[int] = None) -> Dict[str, Any]:
    """
    Get the current monsoon status. 
    Optionally set the simulation year context (default 2019).
    """
    if year:
        monsoon_client.set_year(year)
    
    data = monsoon_client.get_current_metrics()
    if not data:
        raise HTTPException(status_code=404, detail="Monsoon data not found")
        
    return {
        "status": "healthy",
        "timestamp": 1700000000.0, # Mock timestamp
        "metrics": {
            "deviation_percent": data["deviation_percent"],
            "onset_delay_days": monsoon_client.get_onset_delay(),
            "rainfall_total": data["all_india_rainfall_mm"]
        },
        "metadata": data
    }

@router.get("/historical/{year}")
async def get_historical_data(year: int):
    """Get raw data for a specific year."""
    data = monsoon_client.data_cache.get(str(year))
    if not data:
        raise HTTPException(status_code=404, detail=f"No data for year {year}")
    return data

@router.post("/simulation/set_year")
async def set_simulation_year(year: int):
    """Control endpoint for Demo Mode to switch years."""
    monsoon_client.set_year(year)
    return {"message": f"Simulation context switched to {year}"}
