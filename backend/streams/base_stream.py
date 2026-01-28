from abc import ABC, abstractmethod
from typing import Dict, Any
from models.stream_models import StreamData

class BaseStream(ABC):
    """
    Abstract Base Class for all Sentinel Data Streams.
    Enforces a consistent interface for the Orchestrator.
    """
    
    def __init__(self, stream_id: str):
        self.stream_id = stream_id

    @abstractmethod
    async def scan(self) -> StreamData:
        """
        Performs a data gathering pass from external sources.
        Must return a standardized StreamData object.
        """
        pass

    @abstractmethod
    async def health_check(self) -> bool:
        """
        Lightweight connectivity check.
        """
        pass
