# backend/rag.py
import logging
import os
from typing import List
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import cohere
from qdrant_client import QdrantClient
from qdrant_client.http import models
from dotenv import load_dotenv

# ---------------- CONFIG ----------------
load_dotenv()

COHERE_API_KEY = os.getenv("COHERE_API_KEY")
QDRANT_URL = os.getenv("QDRANT_URL")
QDRANT_API_KEY = os.getenv("QDRANT_API_KEY")
COLLECTION_NAME = "book_chunks"

# ----------------------------------------

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

co = cohere.Client(COHERE_API_KEY)

qdrant = QdrantClient(
    url=QDRANT_URL,
    api_key=QDRANT_API_KEY
)

app = FastAPI(title="📘 Book-only RAG Agent")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------- MODELS ----------------

class ChatRequest(BaseModel):
    message: str

class ChatResponse(BaseModel):
    reply: str

# ---------------- HELPERS ----------------

def embed_query(text: str) -> List[float]:
    res = co.embed(
        texts=[text],
        model="embed-english-v3.0",
        input_type="search_query"
    )
    return res.embeddings[0]

def search_book(vector: List[float], limit: int = 5):
    try:
        results = qdrant.search(
            collection_name=COLLECTION_NAME,
            query_vector=vector,
            limit=limit,
            with_payload=True,  # YE ADD KARO - content access ke liye zaroori
            with_vectors=False
        )
        logger.info(f"Qdrant found {len(results)} results")
        return results
    except Exception as e:
        logger.error(f"Qdrant search error: {e}")
        return []

def build_prompt(context: str, question: str) -> str:
    return f"""
You are a book assistant.
Answer ONLY from the given context.
Do NOT use prior knowledge.
If answer is not found, say exactly: "I don't know"

Context:
----------------
{context}
----------------

Question:
{question}
"""


def ask_llm(prompt: str) -> str:
    res = co.chat(
        model="command",
        message=prompt,
        temperature=0.0
    )
    return res.text.strip()

# ---------------- ENDPOINTS ----------------

@app.post("/chat", response_model=ChatResponse)
async def chat(req: ChatRequest):
    if not req.message.strip():
        raise HTTPException(status_code=400, detail="Empty message")

    # 1. embed query
    query_vector = embed_query(req.message)

    # 2. search book
    points = search_book(query_vector)
    logger.info(f"Retrieved points: {points}")

    if not points:
        return {"reply": "I don't know"}

    # 3. build context from book
    context = "\n\n".join([
        p.payload.get("content", "")
        for p in points
        if p.payload
    ])
    logger.info(f"Constructed context: {context}")

    if not context.strip():
        return {"reply": "I don't know"}

    # 4. strict prompt
    prompt = build_prompt(context, req.message)

    # 5. LLM answer
    answer = ask_llm(prompt)

    return {"reply": answer}


@app.get("/")
async def health():
    return {"status": "✅ Book-only RAG agent running"}
