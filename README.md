# 🌪️ ORACLE: Predictive Global Intervention Engine

**"Rewriting History to Save the Future"**

The Oracle is a futuristic command center designed to simulate and visualize the impact of theoretical geoengineering interventions on natural disasters. By fusing historical data, physics-based simulations, and AI reasoning, it answers the question: *"What if we had the technology to stop the storm?"*

## 🚀 Features

The system operates on a 4-Phase architecture:

### 1. The Data Engine (Reality)
*   **Real-World Ground Truth**: Powered by the **NOAA IBTrACS** database.
*   **Automated Pipeline**: Ingests and processes decadal records of North Atlantic storm tracks into optimized GeoJSON.

### 2. Probabilistic Simulation (Physics)
*   **Decay Models**: Algorithms calculate how specific interventions (e.g., "Mega-scale Cooling") thermodynamically weaken a storm.
*   **Investment Scaling**: Models the economic reality—a **$100B** investment yields significantly different results than **$1B**.

### 3. The Oracle Brain (Intelligence)
*   **Semantic Reasoning**: An **AI Reasoning Engine** parses natural language strategies to identify core mechanisms (e.g., Marine Cloud Brightening vs. Stratospheric Injection).
*   **Live Research**: Queries the **Arxiv API** in real-time to fetch and display actual scientific literature relevant to the user's strategy.

### 4. Command Center HUD (Visualization)
*   **3D Digital Twin**: A high-fidelity CesiumJS globe showing "Original" vs. "Mitigated" hurricane tracks.
*   **Radial Orbital Timeline**: A sci-fi visualization of the system's analysis phases.
*   **Interactive Controls**: Funding valuation sliders and natural language tactical input.

---

## 🛠️ Technical Stack

- **Frontend**: Next.js 14, React, Tailwind CSS, CesiumJS (Resium/Vanilla), Framer Motion.
- **Backend**: FastAPI, Python 3.11+, Uvicorn.
- **Data**: NOAA IBTrACS (CSV), Arxiv API (XML).
- **Communication**: Server-Sent Events (SSE) for real-time streaming feedback.

---

## ⚡ Getting Started

### Prerequisites
- Node.js 18+
- Python 3.11+

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/yourusername/oracle.git
    cd oracle
    ```

2.  **Setup Backend**
    ```bash
    cd backend
    python -m venv venv
    source venv/bin/activate  # On Windows: venv\Scripts\activate
    pip install -r requirements.txt
    ```

3.  **Hydrate Data (First Run Only)**
    Fetch the latest hurricane data from NOAA:
    ```bash
    python scripts/fetch_idata.py
    python scripts/process_data.py
    ```

4.  **Setup Frontend**
    ```bash
    cd ../frontend
    npm install
    ```

### Running the Application

1.  **Start Backend API**
    ```bash
    cd backend
    uvicorn main:app --reload --port 8001
    ```

2.  **Start Frontend Interface**
    ```bash
    cd frontend
    npm run dev
    ```

3.  **Access the Oracle**
    Open `http://localhost:3000` in your browser.

---

## 🎮 Usage Guide

1.  **Initialize**: Wait for the Neural Interface to load the 3D Globe.
2.  **Strategize**: Enter a command like *"Deploy autonomous sulfur injection drones"* in the input field.
3.  **Fund**: Adjust the **Investment Slider**. Try increasing it to $50B+ to see the efficiency capabilities scaling.
4.  **Execute**: Click "Execute Analysis".
    - Watch the **Radial Timeline** track the simulation.
    - Observe the **Science Feed** populating with real research.
    - See the map render the **Blue (Mitigated)** tracks diverging from the **Red (Original)** tracks.
5.  **Analyze**: Review the "Lives Saved" and "Wind Reduction" metrics.

---

## 📜 License

MIT License. Data courtesy of NOAA/NCEI.
