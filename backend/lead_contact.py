"""Contact contract for new public lead submissions, not historical records."""
import re
from typing import Optional

from pydantic import BaseModel, EmailStr, Field, field_validator, model_validator


def normalize_international_phone(value: Optional[str]) -> Optional[str]:
    if value is None or not str(value).strip():
        return None
    raw = str(value).strip()
    if not raw.startswith("+"):
        raise ValueError("Phone must include an international calling code")
    digits = re.sub(r"\D", "", raw)
    if not 7 <= len(digits) <= 15 or digits.startswith("0"):
        raise ValueError("Invalid international phone number")
    return f"+{digits}"


class LeadContactInput(BaseModel):
    email: EmailStr
    phone: str = Field(min_length=7, max_length=40)
    preferred_contact: list[str] = Field(default_factory=lambda: ["email", "phone"])

    @field_validator("email", mode="before")
    @classmethod
    def trim_email(cls, value):
        return value.strip() if isinstance(value, str) else value

    @field_validator("phone", mode="before")
    @classmethod
    def require_phone(cls, value):
        result = normalize_international_phone(value)
        if not result:
            raise ValueError("Phone is required")
        return result

    @field_validator("preferred_contact", mode="before")
    @classmethod
    def validate_preference(cls, value):
        # Retain the existing array representation in storage and integrations.
        values = [value] if isinstance(value, str) else value
        if values == ["email"]:
            return ["email"]
        if (isinstance(values, list) and len(values) == 2
                and all(isinstance(item, str) for item in values)
                and set(values) == {"email", "phone"}):
            return ["email", "phone"]
        raise ValueError("Choose Email + Phone or Email only")


class NewsletterContactInput(BaseModel):
    """Newsletter email is mandatory; a phone is only needed for phone contact."""
    email: EmailStr
    phone: Optional[str] = None
    preferred_contact: list[str] = Field(default_factory=lambda: ["email"])

    @field_validator("email", mode="before")
    @classmethod
    def trim_email(cls, value):
        return value.strip() if isinstance(value, str) else value

    @field_validator("phone", mode="before")
    @classmethod
    def optional_phone(cls, value):
        return normalize_international_phone(value)

    @field_validator("preferred_contact", mode="before")
    @classmethod
    def validate_preference(cls, value):
        return LeadContactInput.validate_preference(value)

    @model_validator(mode="after")
    def require_phone_when_requested(self):
        if self.phone and "preferred_contact" not in self.model_fields_set:
            self.preferred_contact = ["email", "phone"]
        if "phone" in self.preferred_contact and not self.phone:
            raise ValueError("Phone is required for Email + Phone contact")
        return self


def contact_preference_label(value):
    values = value if isinstance(value, (list, tuple)) else [value]
    if "email" in values:
        return "Email + Teléfono" if "phone" in values else "Solamente Email"
    # Older records remain readable without changing their original preference.
    return "Teléfono / WhatsApp" if "phone" in values else None
