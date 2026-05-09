from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import sys
import os
sys.path.append(os.path.dirname(__file__))
from forecaster import AIForecaster

app = FastAPI(title="FlowPilot AI Prediction Engine")

# Configure CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

forecaster = AIForecaster()

class HistoricalDataPoint(BaseModel):
    date: str
    value: float

class ForecastRequest(BaseModel):
    historical_data: List[HistoricalDataPoint]
    days_ahead: Optional[int] = 30

class AnomalyRequest(BaseModel):
    values: List[float]

@app.post("/api/v1/forecast/sales")
async def predict_sales(request: ForecastRequest):
    data = [{"date": d.date, "value": d.value} for d in request.historical_data]
    result = forecaster.forecast_sales(data, request.days_ahead)
    
    if not result.get("success"):
        raise HTTPException(status_code=500, detail=result.get("error"))
        
    return result

@app.post("/api/v1/detect-anomalies")
async def detect_anomalies(request: AnomalyRequest):
    result = forecaster.detect_anomalies(request.values)
    
    if not result.get("success"):
        raise HTTPException(status_code=500, detail=result.get("error"))
        
    return result

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "ML Engine"}
