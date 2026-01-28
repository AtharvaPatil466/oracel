# Oracle of Delphi: India Edition 🇮🇳
**Advanced AI-Powered Research Prioritization Engine for India's Climate Resilience**

## 📢 Overview
This project is a complete pivot of the original 'Oracle' system, now tailored specifically for the Indian context. It replaces the generic Atlantic Hurricane model with a high-fidelity **Monsoon Management Engine**. The system ingests mock IMD data, consults a database of India-specific interventions (e.g., Cloud Seeding, Cool Roofs), and uses an LLM 'Oracle' to prioritize research funding based on **Policy Alignment (MOES/ICAR)** and **Scalar Feasibility**.

## ✨ Key Features
-   **Monsoon Strategy Engine**: Input strategies like *"Deploy cloud seeding in Maharashtra"* and get instant feasibility analysis.
-   **Localized Data Core**:
    -   **Mock IMD Data**: 2019 (Drought), 2022 (Excess), 2023 (Normal) scenarios.
    -   **Indian Institutions**: Integrated database of IITs, IISc, and CSIR labs.
    -   **INR Currency**: All financials in Crores (₹)/Lakhs.
-   **Mechanism Database**:
    -   `Monsoon_Cloud_Seeding` (CAIPEEX alignment)
    -   `Agricultural_Adaptation_Systems` (Millet focus)
    -   `Urban_Heat_Mitigation` (Cool Roofs)
-   **Visual Intelligence**:
    -   **Interactive India Map**: State-level deviation coloring (Red = Deficit).
    -   **Policy Cards**: Shows alignment with *National Water Mission* or *Smart Cities*.

## 🛠️ Architecture
### Backend (`/backend`)
-   **Engine**: `OracleEngine` (Reasoning Core)
-   **Streams**: `MockMonsoonClient` (Data Provider)
-   **API**: Streaming endpoints at `/api/simulate/stream` (NDJSON format).

### Frontend (`/frontend`)
-   **Dashboard**: `page.tsx` (Main Control Center)
-   **Components**: `IndiaMonsoonMap`, `ScienceFeed`, `StreamCard`, `DemoModeToggle`.
-   **State**: `zustand` store for managing Monsoon Data.

## 🚀 How to Run
### 1. Backend
```bash
cd backend
source venv/bin/activate
uvicorn main:app --port 8001 --reload
```
*Verify: http://localhost:8001/api/streams/climate/monsoon/current*

### 2. Frontend
```bash
cd frontend
# If you face 'module not found' errors, clean cache:
rm -rf .next
npm run dev
```
*Access: http://localhost:3000*

## 🧪 Scenarios
1.  **Metric**: Set Demo Mode to **"2019 Delayed Monsoon"**.
    -   *Observation*: Maharashtra turns RED (Deficit).
    -   *Action*: Type "Deploy Cloud Seeding".
    -   *Result*: Oracle recommends IITM Pune research vectors + Policy alignment with Karnataka's Varsadhare project.

2.  **Metric**: Set Demo Mode to **"2022 Excess"**.
    -   *Observation*: Central India turns BLUE (Excess).
    -   *Action*: Type "Flood resistant crops".
    -   *Result*: Oracle identifies ICAR-IIMR millet varieties.

## 📜 Credits
Developed by **Team Antigravity** using the *Oracle of Delphi* architecture.
Data sources (Mock): IMD, IITM, Ministry of Earth Sciences.
