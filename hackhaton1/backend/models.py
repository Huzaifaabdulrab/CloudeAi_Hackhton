from pydantic import BaseModel
from typing import List, Optional

class ChatRequest(BaseModel):
    question: str
    selected_text: Optional[str] = None

class Source(BaseModel):
    chunk_id: str
    text: str
    page_number: Optional[int] = 0
    section_title: Optional[str] = "Section"

class ChatResponse(BaseModel):
    answer: str
    sources: List[Source]
    confidence: float

class HealthResponse(BaseModel):
    status: str
    qdrant_connected: bool
    neon_connected: bool
    cohere_connected: bool

class IngestResponse(BaseModel):
    status: str
    chunks_created: int
    book_id: str