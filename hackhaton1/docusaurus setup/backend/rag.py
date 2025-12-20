import os
import logging
from typing import List, Optional
from dotenv import load_dotenv
import cohere
import qdrant_client
from qdrant_client.http import models
import psycopg2
from psycopg2.extras import RealDictCursor
import uuid
from models import Source

# Load environment variables
load_dotenv()

# Initialize clients
cohere_client = cohere.Client(os.getenv("COHERE_API_KEY"))

qdrant_client = qdrant_client.QdrantClient(
    url=os.getenv("QDRANT_CLUSTER_URL"),
    api_key=os.getenv("QDRANT_API_KEY"),
    prefer_grpc=False  # Using HTTP for better compatibility
)

# Initialize Neon connection
neon_conn = psycopg2.connect(os.getenv("NEON_DATABASE_URL"))

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def get_embedding(text: str) -> List[float]:
    """Generate embedding for text using Cohere."""
    try:
        response = cohere_client.embed(
            texts=[text],
            model="embed-english-v3.0"
        )
        return response.embeddings[0]
    except Exception as e:
        logger.error(f"Error generating embedding: {str(e)}")
        raise

def create_collection_if_not_exists():
    """Create the book_chunks collection in Qdrant if it doesn't exist."""
    try:
        qdrant_client.get_collection("book_chunks")
    except:
        # Collection doesn't exist, create it
        qdrant_client.create_collection(
            collection_name="book_chunks",
            vectors_config=models.VectorParams(size=1024, distance=models.Distance.COSINE)
        )
        logger.info("Created Qdrant collection 'book_chunks'")

def store_chunk_metadata(chunk_id: str, book_id: str, content: str):
    """Store chunk metadata in Neon Postgres."""
    try:
        with neon_conn.cursor() as cur:
            cur.execute("""
                INSERT INTO chunks (id, book_id, chunk_id, content, created_at)
                VALUES (%s, %s, %s, %s, NOW())
                ON CONFLICT (chunk_id) DO UPDATE SET
                    content = EXCLUDED.content,
                    updated_at = NOW()
            """, (str(uuid.uuid4()), book_id, chunk_id, content))
            neon_conn.commit()
    except Exception as e:
        logger.error(f"Error storing chunk metadata: {str(e)}")
        neon_conn.rollback()
        raise

def search_qdrant(query_embedding: List[float], limit: int = 5) -> List[models.ScoredPoint]:
    """Search Qdrant for similar chunks."""
    try:
        results = qdrant_client.search(
            collection_name="book_chunks",
            query_vector=query_embedding,
            limit=limit
        )
        return results
    except Exception as e:
        logger.error(f"Error searching Qdrant: {str(e)}")
        raise

def format_sources(results: List[models.ScoredPoint]) -> List[Source]:
    """Format search results as source citations."""
    sources = []
    for result in results:
        payload = result.payload or {}
        sources.append(Source(
            chunk_id=result.id,
            text=payload.get("content", "")[:200] + "..." if len(payload.get("content", "")) > 200 else payload.get("content", ""),
            page_number=payload.get("page_number", 0),
            section_title=payload.get("section_title", "Section")
        ))
    return sources

def generate_response_with_context(context: str, question: str) -> str:
    """Generate response using Cohere with provided context."""
    try:
        prompt = f"""
        Context information is below.
        --------------------
        {context}
        --------------------
        Given the context information and not prior knowledge, answer the question: {question}
        
        If the context doesn't contain the answer, respond with exactly: "I don't know"
        """
        
        response = cohere_client.chat(
            message=prompt,
            model="command-r-plus",
            temperature=0.3,
            max_tokens=500
        )
        
        return response.text
    except Exception as e:
        logger.error(f"Error generating response: {str(e)}")
        raise

def generate_response_selected_text(selected_text: str, question: str) -> str:
    """Generate response using only the selected text."""
    try:
        prompt = f"""
        Context information is below.
        --------------------
        {selected_text}
        --------------------
        Given the context information and not prior knowledge, answer the question: {question}
        
        If the context doesn't contain the answer, respond with exactly: "I don't know"
        """
        
        response = cohere_client.chat(
            message=prompt,
            model="command-r-plus",
            temperature=0.3,
            max_tokens=500
        )
        
        return response.text
    except Exception as e:
        logger.error(f"Error generating response from selected text: {str(e)}")
        raise

def test_cohere_connection() -> bool:
    """Test if Cohere API is accessible."""
    try:
        cohere_client.chat(
            message="test",
            model="command-r-plus"
        )
        return True
    except Exception as e:
        logger.error(f"Cohere connection test failed: {str(e)}")
        return False

def test_qdrant_connection() -> bool:
    """Test if Qdrant is accessible."""
    try:
        qdrant_client.get_collection("book_chunks")
        return True
    except Exception as e:
        logger.error(f"Qdrant connection test failed: {str(e)}")
        return False

def test_neon_connection() -> bool:
    """Test if Neon Postgres is accessible."""
    try:
        with neon_conn.cursor() as cur:
            cur.execute("SELECT 1")
        return True
    except Exception as e:
        logger.error(f"Neon connection test failed: {str(e)}")
        return False