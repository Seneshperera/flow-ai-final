import { NextResponse } from 'next/server';

// Simulated response from Python FastAPI Microservice
export async function GET(req: Request) {
  // Generate 30 days of historical data and 30 days of predicted data
  const data = [];
  const today = new Date();
  
  // Historical data (last 30 days)
  let baseValue = 5000;
  for (let i = 30; i > 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    
    // Add some noise and trend
    baseValue += (Math.random() * 400) - 150;
    
    // Add anomaly spike
    let value = baseValue;
    let isAnomaly = false;
    if (i === 15) {
      value = baseValue * 1.8; // Huge spike
      isAnomaly = true;
    }
    
    data.push({
      date: d.toISOString().split('T')[0],
      actual: Math.max(1000, value),
      predicted: null,
      confidenceLower: null,
      confidenceUpper: null,
      isAnomaly,
      type: 'historical'
    });
  }
  
  // Predictive data (next 30 days) from Prophet
  let predictBase = baseValue;
  for (let i = 0; i <= 30; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() + i);
    
    predictBase += (Math.random() * 200) - 50; // Upward trend
    
    data.push({
      date: d.toISOString().split('T')[0],
      actual: null,
      predicted: Math.max(1000, predictBase),
      confidenceLower: Math.max(800, predictBase * 0.85),
      confidenceUpper: predictBase * 1.15,
      isAnomaly: false,
      type: 'prediction'
    });
  }

  return NextResponse.json({
    success: true,
    data,
    insights: [
      { type: "positive", text: "Demand for Quantum Accel is predicted to surge 25% by month end." },
      { type: "warning", text: "Anomaly detected 15 days ago: Unexpected sales spike caused inventory shortage." },
      { type: "info", text: "Prophet model confidence remains high (>85%) for the next 14 days." }
    ]
  });
}
