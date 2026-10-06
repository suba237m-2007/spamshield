from datetime import datetime
from typing import Any

from pydantic import BaseModel, ConfigDict, EmailStr, Field

from app.core.config import settings


class RegisterIn(BaseModel):
    name: str = Field(min_length=1, max_length=120)
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)


class LoginIn(BaseModel):
    email: EmailStr
    password: str = Field(min_length=1, max_length=128)


class UserOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    name: str
    email: str
    created_at: datetime


class TextIn(BaseModel):
    text: str = Field(min_length=1, max_length=settings.max_message_chars)


class DetectIn(BaseModel):
    text: str = Field(min_length=1, max_length=settings.max_message_chars)


class BatchIn(BaseModel):
    messages: list[str] = Field(min_length=1, max_length=50)


def ok(data: Any = None, message: str = "OK") -> dict:
    return {"success": True, "data": data, "message": message}
