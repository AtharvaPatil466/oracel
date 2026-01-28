import pytest
import asyncio
import sys
import os

# Ensure backend modules are found
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../..')))

from streams.climate.mock_monsoon_client import MockMonsoonClient
from streams.stream_manager import StreamManager
from reasoning.llm_engine import OracleEngine

@pytest.mark.asyncio
async def test_2019_drought_flow():
    """
    Integration Test: 2019 Drought Scenario
    Flow: Data -> Stream Alert -> User Strategy -> Oracle Analysis
    """
    print("\n\n--- 🧪 TEST START: 2019 Drought Scenario ---")
    
    # 1. SETUP: Switch to 2019 (Deficit Year)
    client = MockMonsoonClient()
    client.set_year(2019)
    current_data = client.get_current_metrics()
    
    print(f"DEBUG: Loaded Data for {current_data['year']}")
    print(f"DEBUG: Deviation: {current_data['deviation_percent']}%")
    
    # VERIFY DATA
    assert current_data["year"] == 2019
    assert current_data["deviation_percent"] < -10, "2019 should be a severe deficit year"
    
    # 2. ORCHESTRATION: Stream Manager Scan
    manager = StreamManager()
    manager.monsoon_client.set_year(2019) # Sync manager's client
    
    scan_result = await manager.scan_monsoon()
    alerts = scan_result["alerts"]
    
    print(f"DEBUG: Alerts Generated: {len(alerts)}")
    for a in alerts:
        print(f"  - [{a.severity}] {a.message}")
        
    # VERIFY ALERTS
    assert len(alerts) > 0, "Drought should trigger alerts"
    deficit_alert = next((a for a in alerts if "Deficit" in a.message), None)
    assert deficit_alert is not None
    assert deficit_alert.severity in ["CRITICAL", "HIGH"]
    
    # 3. ORACLE: Analyze Intervention
    # User sees alert, proposes Cloud Seeding
    oracle = OracleEngine()
    strategy = "Use Cloud Seeding to help Maharashtra farmers"
    investment = 500000000 # 50 Cr
    
    print(f"\nDEBUG: Analyzing Strategy: '{strategy}'")
    analysis = oracle.analyze_strategy(strategy, investment_inr=investment)
    
    print(f"DEBUG: Identified Mechanism: {analysis['mechanism']}")
    print(f"DEBUG: Feasibility: {analysis['feasibility_score']}")
    print(f"DEBUG: Policy Matches: {analysis['policy_context']['existing_programs']}")
    
    # VERIFY ORACLE RESPONSE
    assert analysis["mechanism"] == "Monsoon Cloud Seeding (Coughlin-style)"
    assert analysis["feasibility_score"] > 0.5
    assert "Ministry of Earth Sciences" in str(analysis["policy_context"])
    assert "IIT Bombay" in str(analysis["research_vectors"])
    
    print("--- ✅ TEST PASS: 2019 Flow Verified ---")
