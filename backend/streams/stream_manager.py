import asyncio
import logging
from typing import Dict, List, Any
from streams.climate.mock_monsoon_client import MockMonsoonClient
from models.stream_models import Alert, AlertSeverity

logger = logging.getLogger(__name__)

class StreamManager:
    """
    Orchestrates the data gathering for all streams.
    Manages the 'World State' and triggers the Alert Engine.
    """
    
    def __init__(self):
        self.monsoon_client = MockMonsoonClient()
        self.active_alerts: List[Alert] = []
        self.is_running = False

    async def scan_monsoon(self) -> Dict[str, Any]:
        """
        Performs a scan of the Monsoon Stream.
        Triggers alerts if thresholds are crossed.
        """
        logger.info("Scanning Monsoon Stream...")
        metrics = self.monsoon_client.get_current_metrics()
        
        if not metrics:
            logger.error("Monsoon scan failed: No data returned")
            return {"status": "error"}

        deviation = metrics["deviation_percent"]
        onset_delay = self.monsoon_client.get_onset_delay()
        
        # Alert Logic
        new_alerts = []
        
        # 1. Rainfall Deficit Alert
        if deviation < -10:
            alert = Alert(
                id=f"alert_monsoon_deficit_{metrics['year']}",
                stream_ids=["climate"],
                severity=AlertSeverity.CRITICAL if deviation < -15 else AlertSeverity.HIGH,
                message=f"Critical Monsoon Deficit: {deviation}% below LPA. Agricultural impact imminent.",
                created_at=1700000000.0, # Mock ts
                context={"deviation": deviation, "impact_est": "High"}
            )
            new_alerts.append(alert)
        
        # 2. Delayed Onset Alert
        if onset_delay > 7:
             alert = Alert(
                id=f"alert_onset_delay_{metrics['year']}",
                stream_ids=["climate"],
                severity=AlertSeverity.MEDIUM,
                message=f"Monsoon Onset Delayed by {onset_delay} days. Sowing windows at risk.",
                created_at=1700000000.0,
                context={"delay_days": onset_delay}
            )
             new_alerts.append(alert)

        self.active_alerts = new_alerts
        logger.info(f"Monsoon scan complete. {len(new_alerts)} active alerts.")
        
        return {
            "status": "healthy",
            "metrics": metrics,
            "alerts": new_alerts
        }

    async def start_background_loop(self):
        """
        Starts the background orchestration loop.
        (For demo, we might just call scan on demand, but this structure allows polling)
        """
        self.is_running = True
        while self.is_running:
            await self.scan_monsoon()
            await asyncio.sleep(60) # Scan every minute for demo purposes

# Global Instance
stream_manager = StreamManager()
