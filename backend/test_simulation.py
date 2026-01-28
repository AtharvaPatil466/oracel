import os
import sys

# Add the backend directory to sys.path
backend_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.append(backend_dir)

from simulation import run_oracle_simulation

def test_scoring():
    print("Testing scoring logic...")
    
    scenarios = [
        ("Deploy cloud brightening fleet", 0.15),
        ("Stratospheric aerosol injection", 0.30),
        ("Ocean cooling system", 0.20),
        ("Baseline test", 0.05)
    ]
    
    for scenario, expected_min_score in scenarios:
        result = run_oracle_simulation(scenario)
        print(f"Scenario: '{scenario}' -> Score: {result['score']}")
        assert result['score'] >= expected_min_score, f"Expected at least {expected_min_score}, got {result['score']}"

def test_path_resolution():
    print("\nTesting path resolution...")
    # This should not raise an error if path is fixed
    result = run_oracle_simulation("test")
    assert result['mitigated_data'] is not None, "Baseline data should be loaded correctly"
    print("Path resolution successful.")

if __name__ == "__main__":
    try:
        test_scoring()
        test_path_resolution()
        print("\nAll backend tests passed!")
    except Exception as e:
        print(f"\nTest failed: {e}")
        sys.exit(1)
