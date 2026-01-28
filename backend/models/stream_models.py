from pydantic import BaseModel, Field
from typing import Dict, Any, List, Optional
from enum import Enum

class StreamStatus(str, Enum):
    HEALTHY = "healthy"
    DEGRADED = "degraded"
    OFFLINE = "offline"

class AlertSeverity(str, Enum):
    CRITICAL = "CRITICAL"
    HIGH = "HIGH"
    MEDIUM = "MEDIUM"
    INFO = "INFO"

class StreamData(BaseModel):
    stream_id: str
    timestamp: float
    status: StreamStatus
    metrics: Dict[str, float]
    metadata: Dict[str, Any] = {}

class Alert(BaseModel):
    id: str
    stream_ids: List[str]
    severity: AlertSeverity
    message: str
    created_at: float
    context: Dict[str, Any] = {}
