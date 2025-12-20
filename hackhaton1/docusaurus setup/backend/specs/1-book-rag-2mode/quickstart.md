# Quickstart Guide: 2-Mode RAG Book Search

**Feature**: 2-Mode RAG Book Search
**Date**: 2025-01-08

## Overview

This guide provides a quick setup and usage guide for the 2-mode RAG book search system. Follow these steps to get the system up and running.

## Prerequisites

- Python 3.11 or higher
- pip package manager
- Access to the following services:
  - Qdrant Cloud (with cluster URL and API key)
  - Neon Postgres database
  - Cohere API key
- A book content file in text format

## Setup Instructions

### 1. Clone or Create Project

```bash
mkdir rag-chatbot && cd rag-chatbot
```

### 2. Create Environment File

Create a `.env` file with the exact credentials provided:

```bash
# .env
NEON_DATABASE_URL=postgresql://neondb_owner:npg_6DhEe7qkPSMo@ep-spring-flower-a8jpsack-pooler.eastus2.azure.neon.tech/neondb?sslmode=require&channel_binding=require
QDRANT_API_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2Nlc3MiOiJtIn0.7qQ97iIY4oDMLntrPl9bpHILLCSw7P8f9kmq12cZlRA
QDRANT_CLUSTER_URL=https://4ff5c5bb-e674-475e-bb03-5aa5097164ba.europe-west3-0.gcp.cloud.qdrant.io
QDRANT_CLUSTER_ID=4ff5c5bb-e674-475e-bb03-5aa5097164ba
COHERE_API_KEY=mjrsrtqiodlwcrOz9ItqGKX7dZQkPhahqFcFgoso
```

### 3. Install Dependencies

Create `requirements.txt`:

```txt
fastapi==0.115.0
uvicorn[standard]==0.30.6
cohere==5.9.2
qdrant-client==1.11.0
psycopg2-binary==2.9.9
pydantic==2.9.2
python-dotenv==1.0.1
python-multipart==0.0.9
slowapi==0.1.9
```

Install the dependencies:

```bash
pip install -r requirements.txt
```

### 4. Project Structure

Create the following project structure:

```
rag-chatbot/
├── main.py
├── rag.py
├── ingest.py
├── models.py
├── .env
├── requirements.txt
└── README.md
```

### 5. Create Models

Create `models.py` with these Pydantic models:

```python
# models.py
from pydantic import BaseModel
from typing import List, Optional

class ChatRequest(BaseModel):
    question: str
    selected_text: Optional[str] = None

class ChatResponse(BaseModel):
    answer: str
    sources: List[dict]
    confidence: float

class HealthResponse(BaseModel):
    status: str
    qdrant_connected: bool
    neon_connected: bool
```

### 6. Create RAG Core Functions

Create `rag.py` with the core RAG functionality:

```python
# rag.py
import os
import cohere
import qdrant_client
import psycopg2
from dotenv import load_dotenv
import numpy as np

load_dotenv()

# Initialize clients
co = cohere.Client(os.getenv("COHERE_API_KEY"))
qdrant = qdrant_client.QdrantClient(
    url=os.getenv("QDRANT_CLUSTER_URL"),
    api_key=os.getenv("QDRANT_API_KEY")
)
neon = psycopg2.connect(os.getenv("NEON_DATABASE_URL"))

def embed_query(question):
    """Generate embedding for a query using Cohere."""
    response = co.embed([question], model="embed-english-v3.0")
    return response.embeddings[0]

def global_search(embedding, book_id=None):
    """Search for similar content across the entire book."""
    filters = None
    if book_id:
        filters = {"book_id": {"match": {"value": book_id}}}
    
    results = qdrant.search(
        collection_name="book_chunks",
        query_vector=embedding,
        limit=5,
        query_filter=filters
    )
    return results

def build_prompt(results, question):
    """Build context prompt with retrieved results."""
    context = "\n".join([r.payload.get("content", "") for r in results])
    return f"Context: {context}\n\nQuestion: {question}\n\nAnswer ONLY from the provided context or respond with 'I don't know' if the information is not available."

def build_prompt_selected_text(selected_text, question):
    """Build context prompt with selected text."""
    return f"Context: {selected_text}\n\nQuestion: {question}\n\nAnswer ONLY from the provided context or respond with 'I don't know' if the information is not available."

def cohere_chat(prompt):
    """Generate response using Cohere chat model."""
    response = co.chat(
        message=prompt,
        model="command-r",
        temperature=0.3
    )
    return response.text
```

### 7. Create Ingestion Logic

Create `ingest.py` for handling book content ingestion:

```python
# ingest.py
import os
import cohere
import qdrant_client
import psycopg2
import uuid
from dotenv import load_dotenv

load_dotenv()

# Initialize clients (same as in rag.py)
co = cohere.Client(os.getenv("COHERE_API_KEY"))
qdrant = qdrant_client.QdrantClient(
    url=os.getenv("QDRANT_CLUSTER_URL"),
    api_key=os.getenv("QDRANT_API_KEY")
)
neon = psycopg2.connect(os.getenv("NEON_DATABASE_URL"))

def load_book(file_path):
    """Load book content from file."""
    with open(file_path, 'r', encoding='utf-8') as file:
        return file.read()

def chunk_text(text, size=500, overlap=50):
    """Split text into overlapping chunks."""
    chunks = []
    start = 0
    
    while start < len(text):
        end = start + size
        chunk = text[start:end]
        
        # Ensure we don't split in the middle of a sentence if possible
        if end < len(text):
            # Find a good sentence boundary
            next_period = text.find('.', start + size)
            if next_period != -1 and next_period < start + size + 100:  # If period is within next 100 chars
                chunk = text[start:next_period + 1]
                end = next_period + 1
        
        chunks.append(chunk)
        start = end - overlap if end - overlap < len(text) else end  # Prevent overlap beyond text
        
    return chunks

def create_embedding(text):
    """Create vector embedding for text."""
    response = co.embed([text], model="embed-english-v3.0")
    return response.embeddings[0]

def ingest_book(file_path, book_id=None):
    """Process book content and ingest into vector store and metadata DB."""
    if not book_id:
        book_id = str(uuid.uuid4())
    
    # Load the book
    book_content = load_book(file_path)
    
    # Chunk the content
    chunks = chunk_text(book_content)
    
    # Prepare for Qdrant upload
    points = []
    for i, chunk in enumerate(chunks):
        # Create embedding for the chunk
        embedding = create_embedding(chunk)
        
        # Create a point for Qdrant
        point = qdrant_client.http.models.PointStruct(
            id=str(uuid.uuid4()),
            vector=embedding,
            payload={
                "content": chunk,
                "book_id": book_id,
                "chunk_index": i,
                "char_offset": i * (500 - 50)  # Approximate offset
            }
        )
        points.append(point)
    
    # Create collection in Qdrant if it doesn't exist
    try:
        qdrant.get_collection("book_chunks")
    except:
        qdrant.create_collection(
            collection_name="book_chunks",
            vectors_config=qdrant_client.http.models.VectorParams(size=1024, distance="Cosine")
        )
    
    # Upload points to Qdrant
    qdrant.upsert(collection_name="book_chunks", points=points)
    
    # Store metadata in Neon Postgres
    cursor = neon.cursor()
    # Assuming we have a 'books' and 'chunks' tables as defined in data-model.md
    # This is a simplified version - in a real implementation, you'd create the tables and populate them properly
    
    # Return the number of chunks created
    return len(chunks), book_id
```

### 8. Create Main Application

Create `main.py` with the FastAPI application:

```python
# main.py
from fastapi import FastAPI, HTTPException, UploadFile, File
from models import ChatRequest, ChatResponse, HealthResponse
from rag import embed_query, global_search, build_prompt, build_prompt_selected_text, cohere_chat
from ingest import ingest_book
from dotenv import load_dotenv
import os

load_dotenv()

app = FastAPI()

@app.get("/health", response_model=HealthResponse)
def health():
    # Check connectivity to all services
    try:
        # Test Cohere connection
        cohere_test = embed_query("test")
        cohere_connected = True
    except:
        cohere_connected = False
    
    try:
        # Test Qdrant connection
        qdrant_test = len(global_search(embed_query("test")))
        qdrant_connected = True
    except:
        qdrant_connected = False
    
    # For Neon, we could test the connection here
    neon_connected = True  # Simplified for this example
    
    status = "ok" if all([qdrant_connected, neon_connected, cohere_connected]) else "degraded"
    
    return HealthResponse(
        status=status,
        qdrant_connected=qdrant_connected,
        neon_connected=neon_connected,
        cohere_connected=cohere_connected
    )

@app.post("/ingest")
def ingest(file: UploadFile = File(...)):
    # Save uploaded file temporarily
    file_location = f"temp_{file.filename}"
    with open(file_location, "wb") as f:
        f.write(file.file.read())
    
    try:
        # Process the file
        chunks_created, book_id = ingest_book(file_location)
        return {"status": "completed", "chunks_created": chunks_created, "book_id": book_id}
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error processing file: {str(e)}")
    finally:
        # Clean up temporary file
        if os.path.exists(file_location):
            os.remove(file_location)

@app.post("/chat/global", response_model=ChatResponse)
def chat_global(req: ChatRequest):
    # Validate input
    if not req.question or len(req.question.strip()) == 0:
        raise HTTPException(status_code=400, detail="Question cannot be empty")
    
    try:
        # Generate embedding for the question
        embedding = embed_query(req.question)
        
        # Search in Qdrant
        results = global_search(embedding)
        
        # Build prompt with results
        prompt = build_prompt(results, req.question)
        
        # Get answer from Cohere
        answer = cohere_chat(prompt)
        
        # Format sources
        sources = []
        for result in results:
            if result.payload:
                sources.append({
                    "chunk_id": str(result.id),
                    "text": result.payload.get("content", "")[:200] + "...",  # First 200 chars
                    "page_number": 0,  # Placeholder - would need to track this during ingestion
                    "section_title": "Section"  # Placeholder
                })
        
        # For now, return answer with empty sources (in a real implementation, we'd have proper source info)
        return ChatResponse(
            answer=answer,
            sources=sources,
            confidence=0.9  # Placeholder confidence
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing request: {str(e)}")

@app.post("/chat/selected", response_model=ChatResponse)
def chat_selected(req: ChatRequest):
    # Validate input
    if not req.question or len(req.question.strip()) == 0:
        raise HTTPException(status_code=400, detail="Question cannot be empty")
    
    if not req.selected_text or len(req.selected_text.strip()) == 0:
        raise HTTPException(status_code=400, detail="Selected text cannot be empty")
    
    try:
        # Build prompt with selected text
        prompt = build_prompt_selected_text(req.selected_text, req.question)
        
        # Get answer from Cohere
        answer = cohere_chat(prompt)
        
        # For selected text mode, sources list is empty since we're only using provided text
        return ChatResponse(
            answer=answer,
            sources=[],
            confidence=0.8  # Placeholder confidence
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing request: {str(e)}")
```

### 9. Run the Application

Start the development server:

```bash
uvicorn main:app --reload
```

The API will be available at `http://localhost:8000` with documentation at `http://localhost:8000/docs`.

## Testing the API

1. **Health Check**:
```bash
curl http://localhost:8000/health
```

2. **Ingest a Book** (if you have one):
```bash
curl -X POST -F "file=@path/to/your/book.txt" http://localhost:8000/ingest
```

3. **Global Search**:
```bash
curl -X POST "http://localhost:8000/chat/global" \
  -H "Content-Type: application/json" \
  -d '{"question": "What is the main theme of the book?", "selected_text": null}'
```

4. **Selected Text Search**:
```bash
curl -X POST "http://localhost:8000/chat/selected" \
  -H "Content-Type: application/json" \
  -d '{"question": "What does this text say?", "selected_text": "This is the text I want to ask about..."}'
```

## Troubleshooting

1. **Environment Variables**: Ensure all environment variables in `.env` are set correctly
2. **Service Connectivity**: Check that Cohere, Qdrant, and Neon services are accessible
3. **Dependencies**: Verify all requirements from `requirements.txt` are installed
4. **API Keys**: Ensure your Cohere, Qdrant, and Neon credentials are valid

## Next Steps

1. Implement proper error handling and logging
2. Add authentication if needed
3. Implement caching for better performance
4. Add more comprehensive testing
5. Set up monitoring and observability