from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import models
from database import engine, SessionLocal
from pydantic import BaseModel
from datetime import datetime

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="FlowPilot POS Sync Service")

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Pydantic Schemas
class SaleItemBase(BaseModel):
    product_id: int
    quantity: int
    price: float
    cost: float

class SaleCreate(BaseModel):
    total: float
    tax: float
    discount: float
    payment_method: str
    items: List[SaleItemBase]

@app.get("/")
def root():
    return {"status": "FlowPilot Sync API is running"}

@app.post("/sync/sales")
def sync_sales(sales: List[SaleCreate], db: Session = Depends(get_db)):
    for sale_data in sales:
        db_sale = models.Sale(
            total=sale_data.total,
            tax=sale_data.tax,
            discount=sale_data.discount,
            payment_method=sale_data.payment_method
        )
        db.add(db_sale)
        db.flush() # Get the ID
        
        for item in sale_data.items:
            db_item = models.SaleItem(
                sale_id=db_sale.id,
                product_id=item.product_id,
                quantity=item.quantity,
                price=item.price,
                cost=item.cost
            )
            db.add(db_item)
            
    db.commit()
    return {"message": f"Successfully synced {len(sales)} sales"}

@app.get("/cloud/dashboard")
def get_cloud_stats(db: Session = Depends(get_db)):
    total_revenue = db.query(models.Sale).with_entities(models.Sale.total).all()
    revenue = sum([s[0] for s in total_revenue])
    return {
        "total_revenue": revenue,
        "total_orders": len(total_revenue)
    }
