# Phase 7: Integration Points Mapping (Oracle v2)

## Overview
We are moving from a **Reactive** system (User inputs strategy -> Oracle analyzes) to a **Proactive** system (Streams detect crisis -> Oracle suggests strategy).

## 1. The Proactive Flow
1.  **Alert Trigger**: `AlertEngine` detects "High Hurricane Probability" AND "Low Economic Resilience".
2.  **Auto-Analysis**: System automatically constructs a "Scenario Context".
3.  **Oracle Handshake**:
    - Old: `analyze_strategy(user_input)`
    - New: `analyze_context(context_json)`
4.  **Notification**: User gets a "Strategic Opportunity" alert.

## 2. Integration Architecture

### Shared "Oracle Brain"
The existing `llm_engine.py` and `mechanism_database.py` will remain the core, but their API will expand.

```python
# wrapper/oracle_v2.py
class OracleV2:
    def __init__(self):
        self.legacy_engine = MockLLMEngine() # The one we just built
    
    async def analyze_context(self, world_state):
        """
        New method: uses the same database but different reasoning.
        Instead of 'validating a strategy', it 'suggests a strategy'.
        """
        prompt = f"Given {world_state}, what is the optimal intervention?"
        # ... logic ...
        return suggested_strategy_object
```

### Frontend Integration
The new `SentinelDashboard` will coexist with the `OracleMap`.
- **Sentinel**: Shows the 4 streams.
- **Map**: Shows the visualization.
- **Link**: Clicking an Alert in Sentinel -> Fly camera in Map + Open Oracle Panel.

## 3. Migration Strategy for Existing Code
1.  **Strict Separation**: Keep `simulation.py` (Physics) separate from `streams/` (Data).
2.  **Bridge**: Create `engine/scenario_generator.py` which calls `simulation.py` when a future scenario needs validation.
3.  **Backward Compatibility**: The `/api/simulate/stream` endpoint remains untouched for manual user testing.

## 4. New Oracle Input Schema
```json
{
  "trigger_event": "alert_id_123",
  "context": {
    "climate": {"sst_anomaly": 2.1},
    "economic": {"budget_surplus": 50000000000}
  },
  "requested_output": ["feasibility", "funding_estimation"]
}
```
