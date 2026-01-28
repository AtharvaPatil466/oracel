import csv
import json
import os
import logging

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
INPUT_FILE = os.path.join(BASE_DIR, 'data', 'raw', 'ibtracs_NA.csv')
OUTPUT_FILE = os.path.join(BASE_DIR, 'data', 'processed', 'hurricanes.json')

# Configuration
MIN_YEAR = 2021  # Focus on recent history for performance
MIN_WIND = 35    # Tropical Storm strength or higher (knots)

def process_data():
    """Processes the IBTrACS CSV into a GeoJSON suitable for Cesium."""
    
    if not os.path.exists(INPUT_FILE):
        logger.error(f"Input file not found: {INPUT_FILE}. Run fetch_idata.py first.")
        return

    logger.info(f"Processing {INPUT_FILE}...")
    
    storms = {}
    
    try:
        with open(INPUT_FILE, 'r', encoding='utf-8', errors='replace') as f:
            # Skip the second line (units) which IBTrACS includes
            lines = f.readlines()
            # Header is line 0, Units is line 1, Data starts line 2
            reader = csv.DictReader(lines[0:1] + lines[2:])
            
            for row in reader:
                try:
                    sid = row['SID']
                    year = int(row['SEASON'])
                    name = row['NAME']
                    lat = float(row['LAT'])
                    lon = float(row['LON'])
                    wind = row['USA_WIND']
                    
                    if year < MIN_YEAR:
                        continue
                        
                    # Handle missing wind data
                    if not wind or wind.strip() == '':
                        wind = 0
                    else:
                        wind = int(wind)
                        
                    if wind < MIN_WIND:
                       continue

                    if sid not in storms:
                        storms[sid] = {
                            "name": name,
                            "year": year,
                            "coords": [],
                            "max_wind": 0
                        }
                    
                    # Cesium format: [lon, lat, alt, lon, lat, alt...] 
                    # But for now let's store standard [[lon, lat], [lon, lat]] for easier manipulation
                    # Actually for Cesium LineString we often want a flat array, but let's stick to standard GeoJSON
                    storms[sid]["coords"].append([lon, lat])
                    storms[sid]["max_wind"] = max(storms[sid]["max_wind"], wind)
                    
                except ValueError:
                    continue
                    
        # Convert to GeoJSON FeatureCollection
        features = []
        for sid, data in storms.items():
            if len(data["coords"]) < 2:
                continue # Need at least 2 points for a line
                
            features.append({
                "type": "Feature",
                "properties": {
                    "sid": sid,
                    "name": data["name"],
                    "year": data["year"],
                    "wind": data["max_wind"]
                },
                "geometry": {
                    "type": "LineString",
                    "coordinates": data["coords"]
                }
            })
            
        geojson = {
            "type": "FeatureCollection",
            "features": features
        }
        
        # Ensure output dict exists
        os.makedirs(os.path.dirname(OUTPUT_FILE), exist_ok=True)
        
        with open(OUTPUT_FILE, 'w') as f:
            json.dump(geojson, f)
            
        logger.info(f"Processed {len(features)} storms into {OUTPUT_FILE}")
        
    except Exception as e:
        logger.error(f"Processing failed: {e}")

if __name__ == "__main__":
    process_data()
