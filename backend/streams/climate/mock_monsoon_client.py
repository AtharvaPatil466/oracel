import json
import os
from typing import Dict, Any, Optional
from datetime import datetime

class MockMonsoonClient:
    """
    A simulated client for Indian Meteorological Department (IMD) data.
    Loads pre-canned scenarios for 2019, 2022, 2023 to ensure consistent demos.
    """
    
    def __init__(self, mock_file_path: str = "backend/data/mock_monsoon_data.json"):
        # Resolve absolute path relative to project root if needed
        # Assuming current working dir is project root or backend
        if not os.path.exists(mock_file_path):
             # Try adjusting path if running from backend dir
             mock_file_path = os.path.join(os.path.dirname(__file__), "../../data/mock_monsoon_data.json")
        
        self.mock_file_path = mock_file_path
        self.data_cache = self._load_data()
        self.current_year_focus = 2019 # Default demo year

    def _load_data(self) -> Dict[str, Any]:
        try:
            with open(self.mock_file_path, 'r') as f:
                return json.load(f)
        except Exception as e:
            print(f"Error loading mock monsoon data: {e}")
            return {}

    def set_year(self, year: int):
        """Switches the simulated 'current' year."""
        self.current_year_focus = year

    def get_current_metrics(self) -> Dict[str, Any]:
        """Returns the full data packet for the focused year."""
        year_str = str(self.current_year_focus)
        return self.data_cache.get(year_str, self.data_cache.get("2019"))

    def get_historical_rainfall(self, year: int, region: str = "All India") -> float:
        """Returns specific rainfall mm for a year/region."""
        data = self.data_cache.get(str(year))
        if not data:
            return 0.0
            
        if region == "All India":
            return data["all_india_rainfall_mm"]
            
        # Linear search for region
        for r_data in data.get("regional_data", []):
            if r_data["region"] == region:
                return r_data["rainfall_mm"]
        return 0.0

    def get_onset_delay(self) -> int:
        """Returns days delayed (Positive = Late, Negative = Early)"""
        data = self.get_current_metrics()
        onset = datetime.strptime(data["onset_date"], "%Y-%m-%d")
        normal = datetime.strptime(data["normal_onset_date"], "%Y-%m-%d")
        delta = onset - normal
        return delta.days
