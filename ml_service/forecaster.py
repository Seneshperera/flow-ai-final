import pandas as pd
import numpy as np
from prophet import Prophet
from sklearn.ensemble import IsolationForest
import logging

logging.basicConfig(level=logging.INFO)

class AIForecaster:
    def __init__(self):
        self.sales_model = Prophet(yearly_seasonality=True, weekly_seasonality=True)
        self.anomaly_detector = IsolationForest(contamination=0.05, random_state=42)
        
    def forecast_sales(self, historical_data: list, days_ahead: int = 30):
        """
        Forecasts future sales using Facebook Prophet.
        historical_data: List of dicts [{'date': 'YYYY-MM-DD', 'value': float}]
        """
        try:
            if len(historical_data) < 10:
                # Fallback for insufficient data
                return self._generate_synthetic_forecast(days_ahead)
                
            df = pd.DataFrame(historical_data)
            df.columns = ['ds', 'y']
            df['ds'] = pd.to_datetime(df['ds'])
            
            # Re-initialize to avoid fitting issues on consecutive calls
            self.sales_model = Prophet(yearly_seasonality=True, weekly_seasonality=True)
            self.sales_model.fit(df)
            
            future = self.sales_model.make_future_dataframe(periods=days_ahead)
            forecast = self.sales_model.predict(future)
            
            # Extract the forecast for the future dates
            future_forecast = forecast.tail(days_ahead)
            
            result = []
            for _, row in future_forecast.iterrows():
                result.append({
                    "date": row['ds'].strftime('%Y-%m-%d'),
                    "predicted_value": max(0, float(row['yhat'])),
                    "confidence_lower": max(0, float(row['yhat_lower'])),
                    "confidence_upper": float(row['yhat_upper'])
                })
                
            return {"success": True, "forecast": result}
            
        except Exception as e:
            logging.error(f"Forecasting error: {e}")
            return {"success": False, "error": str(e)}

    def detect_anomalies(self, data: list):
        """
        Detects anomalies in sales/inventory data using Isolation Forest.
        data: List of numerical values
        """
        try:
            if len(data) < 10:
                return {"success": True, "anomalies": []}
                
            X = np.array(data).reshape(-1, 1)
            self.anomaly_detector.fit(X)
            predictions = self.anomaly_detector.predict(X)
            
            # -1 indicates an anomaly, 1 indicates normal
            anomalies = [i for i, pred in enumerate(predictions) if pred == -1]
            return {"success": True, "anomaly_indices": anomalies}
            
        except Exception as e:
            logging.error(f"Anomaly detection error: {e}")
            return {"success": False, "error": str(e)}
            
    def _generate_synthetic_forecast(self, days: int):
        """Generates synthetic forecast data for demo purposes when data is sparse."""
        base_val = 5000
        result = []
        for i in range(days):
            trend = i * 20
            noise = np.random.normal(0, 200)
            val = base_val + trend + noise
            result.append({
                "date": (pd.Timestamp.now() + pd.Timedelta(days=i)).strftime('%Y-%m-%d'),
                "predicted_value": val,
                "confidence_lower": val * 0.85,
                "confidence_upper": val * 1.15
            })
        return {"success": True, "forecast": result, "synthetic": True}
