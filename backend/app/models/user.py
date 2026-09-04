from sqlalchemy import Column, String
from app.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    employeeId = Column(String, unique=True, index=True)
    password = Column(String, nullable=False)
    role = Column(String, nullable=False)
    campus = Column(String)
    college = Column(String)
    group = Column(String, nullable=True)
    department = Column(String, nullable=True)
    scope = Column(String)
