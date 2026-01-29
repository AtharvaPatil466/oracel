import csv
import json
import os
from datetime import datetime

# Configuration
INPUT_CSV = 'data/raw/ibtracs_NA.csv'
OUTPUT_GEOJSON = '../frontend/public/data/hurricanes_baseline.json'
START_YEAR = 2004

def process_hurricanes():
    print(f"Processing hurricane data from {INPUT_CSV}...")
    
    if not os.path.exists(INPUT_CSV):
        print(f"Error: {INPUT_CSV} not found.")
        return

    # Ensure output directory exists
    os.makedirs(os.path.dirname(OUTPUT_GEOJSON), exist_ok=True)

    tracks = {}
    
    with open(INPUT_CSV, 'r', encoding='utf-8') as f:
        reader = csv.reader(f)
        header = next(reader)  # Column names
        units = next(reader)   # Units (skip)
        
        # Identify column indices
        col_sid = header.index('SID')
        col_season = header.index('SEASON')
        col_name = header.index('NAME')
        col_time = header.index('ISO_TIME')
        col_lat = header.index('LAT')
        col_lon = header.index('LON')
        col_wind = header.index('USA_WIND') # US agency wind speed in kts

        for row in reader:
            try:
                season = int(row[col_season])
                if season < START_YEAR:
                    continue
                
                sid = row[col_sid]
                name = row[col_name].strip()
                time = row[col_time]
                lat = float(row[col_lat])
                lon = float(row[col_lon])
                
                # Handle missing wind values
                wind_val = row[col_wind].strip()
                wind = float(wind_val) if wind_val and wind_val != ' ' else 0
                
                if sid not in tracks:
                    tracks[sid] = {
                        "name": name,
                        "points": []
                    }
                
                tracks[sid]["points"].append({
                    "time": time,
                    "lat": lat,
                    "lon": lon,
                    "wind": wind
                })
            except (ValueError, IndexError):
                continue

    # Convert to segmented GeoJSON for individual segment coloring
    features = []
    for sid, data in tracks.items():
        points = data["points"]
        # Skip storms with fewer than 2 points
        if len(points) < 2:
            continue
            
        # Create a LineString segment for each pair of points
        for i in range(len(points) - 1):
            p1 = points[i]
            p2 = points[i+1]
            
            # Simple GeoJSON Feature for a segment
            feature = {
                "type": "Feature",
                "geometry": {
                    "type": "LineString",
                    "coordinates": [
                        [p1["lon"], p1["lat"]],
                        [p2["lon"], p2["lat"]]
                    ]
                },
                "properties": {
                    "sid": sid,
                    "name": data["name"],
                    "wind": p1["wind"], # Color based on start point wind
                    "time": p1["time"]
                }
            }
            features.append(feature)

    geojson = {
        "type": "FeatureCollection",
        "features": features
    }

    with open(OUTPUT_GEOJSON, 'w') as f:
        json.dump(geojson, f)

    print(f"Successfully generated {OUTPUT_GEOJSON} with {len(features)} segments.")

if __name__ == "__main__":
    process_hurricanes()
