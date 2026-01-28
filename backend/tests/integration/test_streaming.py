import pytest
import asyncio
import json
import httpx

@pytest.mark.asyncio
async def test_streaming_endpoint():
    print("\n\n--- 🧪 TEST START: API Streaming ---")
    
    url = "http://localhost:8000/api/simulate/stream"
    payload = {
        "user_input": "Test India Strategy",
        "investment": 50.0
    }
    
    print(f"DEBUG: Connecting to {url}...")
    
    async with httpx.AsyncClient(timeout=30.0) as client:
        async with client.stream("POST", url, json=payload) as response:
            assert response.status_code == 200, f"Failed with {response.status_code}"
            
            print("DEBUG: Connection Established. Reading stream...")
            
            chunk_count = 0
            has_progress = False
            has_final_analysis = False
            
            async for line in response.aiter_lines():
                if not line.strip(): continue
                
                data = json.loads(line)
                chunk_count += 1
                
                if data["status"] == "progress":
                    has_progress = True
                    print(f"  -> Progress: {data['progress']}% ({data['message']})")
                    
                if data["status"] == "oracle_analysis":
                    has_final_analysis = True
                    print(f"  -> FINAL ANALYSIS RECEIVED: {data['data']['mechanism']}")
            
            assert has_progress, "Stream should yield progress events"
            assert has_final_analysis, "Stream should yield final analysis"
            
    print("--- ✅ TEST PASS: Streaming Works ---")
