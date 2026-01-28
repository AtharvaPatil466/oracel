# Phase 4: Alert Engine Specification

## Alert Taxonomy

### 1. Single-Stream Alert
*   **Definition**: A simple threshold breach within one domain.
*   **Example**: `ClimateStream` reports SST (Sea Surface Temp) > 2.5σ above mean.
*   **Response**: Visual flag on the stream card.

### 2. Cross-Stream Correlation
*   **Definition**: A recognized pattern where Stream A predicts Stream B.
*   **Example**: "Oil Price Spike" (Economic) + "High Hurricane Probability" (Climate).
*   **Response**: "Risk Multiplier" notification.

### 3. Compound Crisis
*   **Definition**: Simultaneous critical failures in non-correlated streams (The "Perfect Storm").
*   **Example**: "Market Crash" + "Civil Unrest" + "Cat 5 Landfall".
*   **Response**: Full-screen "DEFCON" style takeover.

## Priority Scoring Algorithm

The system avoids "alert fatigue" by scoring every potential alert before notifying.

```python
def calculate_priority(alert_data):
    # 1. Base Impact 
    # Normalized 0-1 score of potential damage (Lives + Dollars)
    impact = alert_data.projected_impact 
    
    # 2. Probability
    # Confidence that this isn't a sensor glitch
    prob = alert_data.confidence 
    
    # 3. Urgency Decay
    # 1.0 = Action needed today
    # 0.1 = Action needed next year
    urgency = 1.0 / max(1, alert_data.days_to_impact)
    
    # 4. Friction
    # How hard is it to fix? High cost/difficulty Lowers priority (triage logic)
    # We prioritize "Easy Wins" slightly higher in equal-impact scenarios
    friction = (alert_data.cost + alert_data.political_difficulty) / 2
    
    # Formula
    score = (prob * impact * urgency) / (0.5 + friction)
    
    return score
```

## Alert Lifecycle
1.  **Ingest**: `AlertEngine` receives raw metrics from `StreamManager`.
2.  **Evaluate**: Checks against `Thresholds` and `CorrelationLibrary`.
3.  **Score**: Calculates Priority Score.
4.  **Filter**: Drops signals below `MIN_PRIORITY_THRESHOLD` (noise filter).
5.  **Broadcast**: Pushes to SSE and writes to DB `alerts` table.
