# Executive Summary: Oracle of Delphi (India Edition) 🇮🇳

## 📌 Project Overview
The **Oracle of Delphi: India Edition** is a specialized AI-driven decision support system designed to aid Indian policymakers and climate scientists in managing Monsoon volatility. Pivoted from an Atlantic Hurricane model, this system now focuses exclusively on the Indian subcontinent, specifically addressing **Monsoon Deficits (Droughts)** and **Excesses (Floods)**.

It serves as a "War Room" interface where users can propose tactical interventions (e.g., *Cloud Seeding*, *Crop Switching*) and receive instant, scientifically grounded feasibility analyses aligned with Indian government policies.

## 🚀 Key Features

### 1. The Oracle Engine (AI Core)
*   **Natural Language Understanding**: Decodes complex user intent (e.g., "Deploy aerosol injection over Kerala").
*   **Mechanism Matching**: Automatically links user strategies to a curated database of 30+ capabilities (e.g., `Monsoon_Cloud_Seeding`, `Millet_Adaptation`).
*   **Feasibility Scoring**: Computes a detailed confidence score (0-100%) based on:
    *   **Physics**: Is it scientifically viable?
    *   **Economics**: Does it fit the budget?
    *   **Scale**: Can it cover the target region?

### 2. Real-Time Geospatial War Room
*   **Interactive India Map**: A high-fidelity choropleth map showing real-time rainfall deviation by state.
    *   🔴 **Red**: Deficit (< -10%)
    *   🟢 **Green**: Normal
    *   🔵 **Blue**: Excess (> +10%)
*   **Streaming Intelligence**: The AI reasoning process is streamed live to the dashboard (NDJSON), mimicking a "thinking" supercomputer.

### 3. Historical "Time Machine"
*   **Demo Mode Scenarios**: Instantly simulate past climate criticalities to test strategies:
    *   **2019 Delayed Monsoon**: Tests drought response in Maharashtra/Vidarbha.
    *   **2022 Excess Rainfall**: Tests flood mitigation strategies in Central India.

### 4. Policy & Research Integration
*   **Government Alignment**: Every strategy is cross-referenced with active missions:
    *   *National Water Mission*
    *   *Mission Mausam (MoES)*
*   **Research Vectoring**: Cites authentic Indian research bodies (IITM Pune, IISc, CSIR-NGRI) to validate scientific claims.

## 🛠️ Technology Stack
*   **Frontend**: Next.js 14, React, Tailwind CSS, Shadcn UI, Zustand State Management, D3/Recharts.
*   **Backend**: Python 3.14, FastAPI, Asyncio (Streaming), Custom LLM Logic Engine.
*   **Data**: Mock IMD Gridded Rainfall Data, GeoJSON Topography.

## 🎯 Value Proposition
This system bridges the gap between **Climate Science** and **Policy Execution**. By allowing users to "chat" with the climate model and see visual impacts on a map, it democratizes access to complex meteorological strategies, ensuring that funding is directed towards the most viable, policy-compliant solutions.
