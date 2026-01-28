# Oracle of Delphi: India Edition - Feature Catalogue 🇮🇳

## 🧠 Core Intelligence (The Oracle)
1.  **Natural Language Strategy Processing**: Parses unstructured user inputs (e.g., "Seed clouds in Pune") into structured tactical interventions.
2.  **Mechanism Matching Engine**: Maps user intent to a database of known climate interventions (e.g., `Monsoon_Cloud_Seeding`, `Millet_Adaptation`).
3.  **Feasibility Scoring System**: Calculates a 0-1.0 probability/feasibility score based on physics, cost, and scale.
4.  **Generative Analysis**: Produces detailed explanations of *why* a strategy would pass or fail, including bottlenecks.

## 🌧️ Data & Simulation
5.  **Mock IMD Data Stream**: Simulates real-time monsoon rainfall data (All-India Weighted Average).
6.  **Historical Scenarios (Demo Mode)**:
    -   **2019 (Delayed/Deficit)**: Simulates a severe drought scenario (~ -14% deviation).
    -   **2022 (Excess)**: Simulates a flood/excess rainfall scenario (~ +6% deviation).
    -   **2023 (Normal)**: Baseline scenario for comparison.
7.  **Streaming Architecture**: Uses NDJSON to stream simulated "thoughts" and analysis progress to the frontend in real-time.

## 🗺️ Visualization & UI
8.  **Interactive India Choropleth Map**:
    -   Visualizes rainfall deviation by state.
    -   Color-coded indicators: Red (Deficit), Green (Normal), Blue (Excess).
    -   Hover tooltips with precise state-level statistics.
9.  **Rainfall Time Series**: Line chart tracking historical rainfall deviation against the Long Period Average (LPA).
10. **StreamStatus Card**: Real-time ticker showing current Monsoon status (Active/Withdrawal) and gross deviation.
11. **Tactical Input Console**: Text interface for commanders to input strategies, coupled with a Budget Slider (₹ Crores).

## 📜 Policy & Context (India Specific)
12. **Policy Alignment Engine**: Checks proposed strategies against major Indian government missions:
    -   *National Water Mission*
    -   *National Action Plan on Climate Change (NAPCC)*
    -   *Mission Mausam (MoES)*
13. **Research Vectoring**: Identifies relevant Indian research institutions (IITM Pune, IISc, CAIPEEX) for verify scientific backing.
14. **Economic Feasibility Check**: Compares user budget (in ₹ Crores) against estimated implementation costs.

## ⚙️ Technical Features
15. **Hot-Swappable Scenarios**: Toggle between years instantly without server restart.
16. **Resilient Error Handling**: "Standby" modes when data streams are interrupted.
17. **Responsive Dashboard**: 3-Column layout optimized for commanding view (Control - Map - Analysis).
