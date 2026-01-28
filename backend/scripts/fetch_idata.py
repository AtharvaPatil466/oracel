import os
import requests
import logging

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# IBTrACS URL (North Atlantic Subset for performance)
# Provides data updated regularly by NOAA
DATA_URL = "https://www.ncei.noaa.gov/data/international-best-track-archive-for-climate-stewardship-ibtracs/v04r00/access/csv/ibtracs.NA.list.v04r00.csv"

OUTPUT_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'data', 'raw')
OUTPUT_FILE = os.path.join(OUTPUT_DIR, 'ibtracs_NA.csv')

def fetch_data():
    """Downloads the IBTrACS CSV file."""
    if not os.path.exists(OUTPUT_DIR):
        os.makedirs(OUTPUT_DIR)
        
    logger.info(f"Downloading data from {DATA_URL}...")
    
    try:
        response = requests.get(DATA_URL, stream=True)
        response.raise_for_status()
        
        with open(OUTPUT_FILE, 'wb') as f:
            for chunk in response.iter_content(chunk_size=8192):
                f.write(chunk)
                
        logger.info(f"Download complete: {OUTPUT_FILE}")
        
    except Exception as e:
        logger.error(f"Failed to download data: {e}")

if __name__ == "__main__":
    fetch_data()
