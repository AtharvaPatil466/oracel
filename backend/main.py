from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# This is the "app" variable the error says is missing
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

@app.post("/api/simulate")
async def analyze_simulation(data: Intervention):
    return {
        "status": "success",
        "narrative": f"Analyzing '{data.user_input}'...",
        "stats": {"damage_reduction": 120000000, "lives_saved": 450}
    }

@app.get("/api/baseline")
def get_baseline():
    return {"track": []}