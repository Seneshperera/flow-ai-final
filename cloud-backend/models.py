from sqlalchemy import create_engine, Column, Integer, String, Float, DateTime, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
import datetime

Base = declarative_base()

class Product(Base):
    __tablename__ = "products"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    sku = Column(String, unique=True, index=True)
    price = Column(Float)
    cost = Column(Float)
    stock = Column(Integer)
    unit = Column(String)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class Sale(Base):
    __tablename__ = "sales"
    id = Column(Integer, primary_key=True, index=True)
    total = Column(Float)
    tax = Column(Float)
    discount = Column(Float)
    payment_method = Column(String)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    items = relationship("SaleItem", back_populates="sale")

class SaleItem(Base):
    __tablename__ = "sale_items"
    id = Column(Integer, primary_key=True, index=True)
    sale_id = Column(Integer, ForeignKey("sales.id"))
    product_id = Column(Integer)
    quantity = Column(Integer)
    price = Column(Float)
    cost = Column(Float)
    sale = relationship("Sale", back_populates="items")
