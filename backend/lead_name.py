"""Independent personal names for new submissions; never guess legacy surnames."""
import unicodedata
from pydantic import BaseModel, Field, field_validator, model_validator


def clean_person_name(value):
    if not isinstance(value, str) or any(unicodedata.category(char).startswith("C") for char in value):
        raise ValueError("Invalid name")
    return " ".join(value.split())


class LeadNameInput(BaseModel):
    first_name: str = Field(min_length=1, max_length=120)
    last_name: str = Field(min_length=1, max_length=150)
    # Compatibility/display value only. Never authoritative over the two fields.
    full_name: str = ""

    @field_validator("first_name", "last_name", mode="before")
    @classmethod
    def normalize_name(cls, value):
        return clean_person_name(value)

    @model_validator(mode="after")
    def compose_display_name(self):
        self.full_name = f"{self.first_name} {self.last_name}"
        return self


def name_fields(row):
    first = row.get("first_name") or ""
    last = row.get("last_name") or ""
    legacy = row.get("full_name") or row.get("name") or ""
    complete = bool(first and last)
    joined = " ".join(filter(None, (first, last)))
    return {
        "first_name": first or None,
        "last_name": last or None,
        "full_name": joined if complete else legacy or joined,
        "legacy_name": legacy if not complete else None,
    }
