# API Contracts: 2-Mode RAG Book Search

**Feature**: 2-Mode RAG Book Search
**Date**: 2025-01-08

## Overview

This document defines the API contracts for the 2-mode RAG system, including endpoints, request/response schemas, and error handling.

## API Endpoints

### Health Check

**Endpoint**: `GET /health`

**Purpose**: Check the health and connectivity of all required services

**Request**:
- Method: GET
- Path: `/health`
- Headers: None required
- Query Parameters: None
- Request Body: None

**Response**:
- Status Code: 200 (OK)
- Content-Type: application/json

Response Schema:
```json
{
  "status": "ok",
  "qdrant_connected": true,
  "neon_connected": true,
  "cohere_connected": true
}
```

**Error Responses**:
- 503 (Service Unavailable): If any of the required services (Qdrant, Neon, Cohere) is not reachable

### Global Book Search

**Endpoint**: `POST /chat/global`

**Purpose**: Accept user questions and return answers based on the full book content with source citations

**Request**:
- Method: POST
- Path: `/chat/global`
- Headers: 
  - `Content-Type: application/json`
- Request Body:
```json
{
  "question": "What is the main theme of this book?",
  "selected_text": null
}
```

Request Schema:
```json
{
  "type": "object",
  "properties": {
    "question": {
      "type": "string",
      "description": "The user's question about the book content",
      "minLength": 1,
      "maxLength": 1000
    },
    "selected_text": {
      "type": "string",
      "description": "Always null for this endpoint",
      "nullable": true
    }
  },
  "required": ["question"]
}
```

**Response**:
- Status Code: 200 (OK) or 400 (Bad Request) for invalid input
- Content-Type: application/json

Response Schema:
```json
{
  "answer": "The main theme is the exploration of human nature through various situations.",
  "sources": [
    {
      "chunk_id": "abc123",
      "text": "The author repeatedly explores themes of identity and human nature...",
      "page_number": 45,
      "section_title": "Character Analysis"
    }
  ],
  "confidence": 0.85
}
```

Response Schema Definition:
```json
{
  "type": "object",
  "properties": {
    "answer": {
      "type": "string",
      "description": "The generated answer to the user's question"
    },
    "sources": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "chunk_id": {
            "type": "string",
            "description": "ID of the source chunk"
          },
          "text": {
            "type": "string",
            "description": "Snippet of the source text"
          },
          "page_number": {
            "type": "integer",
            "description": "Page number in the book where the text appears"
          },
          "section_title": {
            "type": "string",
            "description": "Section or chapter where the text appears"
          }
        },
        "required": ["chunk_id", "text", "page_number", "section_title"]
      }
    },
    "confidence": {
      "type": "number",
      "description": "Confidence score between 0.0 and 1.0"
    }
  },
  "required": ["answer", "sources", "confidence"]
}
```

**Error Responses**:
- 400 (Bad Request): If the question field is missing or invalid
- 503 (Service Unavailable): If any of the required services (Qdrant, Cohere) is not reachable

### Selected Text Search

**Endpoint**: `POST /chat/selected`

**Purpose**: Accept user-provided text and question, returning answers based only on that provided text

**Request**:
- Method: POST
- Path: `/chat/selected`
- Headers: 
  - `Content-Type: application/json`
- Request Body:
```json
{
  "question": "What does this text say about character development?",
  "selected_text": "The character evolves throughout the book, showing growth and change..."
}
```

Request Schema:
```json
{
  "type": "object",
  "properties": {
    "question": {
      "type": "string",
      "description": "The user's question about the provided text",
      "minLength": 1,
      "maxLength": 1000
    },
    "selected_text": {
      "type": "string",
      "description": "The text provided by the user for context",
      "minLength": 1,
      "maxLength": 10000
    }
  },
  "required": ["question", "selected_text"]
}
```

**Response**:
- Status Code: 200 (OK) or 400 (Bad Request) for invalid input
- Content-Type: application/json

Response Schema:
```json
{
  "answer": "The text indicates that the character evolves throughout the book, showing growth and change.",
  "sources": [],
  "confidence": 0.75
}
```

Response Schema Definition:
```json
{
  "type": "object",
  "properties": {
    "answer": {
      "type": "string",
      "description": "The generated answer based on the provided text"
    },
    "sources": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "chunk_id": {
            "type": "string",
            "description": "ID of the source chunk"
          },
          "text": {
            "type": "string",
            "description": "Snippet of the source text"
          },
          "page_number": {
            "type": "integer",
            "description": "Page number in the book where the text appears"
          },
          "section_title": {
            "type": "string",
            "description": "Section or chapter where the text appears"
          }
        },
        "required": ["chunk_id", "text", "page_number", "section_title"]
      }
    },
    "confidence": {
      "type": "number",
      "description": "Confidence score between 0.0 and 1.0"
    }
  },
  "required": ["answer", "sources", "confidence"]
}
```

**Error Responses**:
- 400 (Bad Request): If the question or selected_text fields are missing or invalid
- 503 (Service Unavailable): If any of the required services (Cohere) is not reachable

### Ingest Book Content

**Endpoint**: `POST /ingest`

**Purpose**: Process and ingest book content into the vector store and metadata database

**Request**:
- Method: POST
- Path: `/ingest`
- Headers: 
  - `Content-Type: multipart/form-data`
- Request Body: File upload

**Response**:
- Status Code: 200 (OK) or 400 (Bad Request) for invalid input
- Content-Type: application/json

Response Schema:
```json
{
  "status": "completed",
  "chunks_created": 150,
  "book_id": "def456"
}
```

Response Schema Definition:
```json
{
  "type": "object",
  "properties": {
    "status": {
      "type": "string",
      "description": "Status of the ingestion process"
    },
    "chunks_created": {
      "type": "integer",
      "description": "Number of chunks created during ingestion"
    },
    "book_id": {
      "type": "string",
      "description": "ID of the ingested book"
    }
  },
  "required": ["status", "chunks_created", "book_id"]
}
```

**Error Responses**:
- 400 (Bad Request): If the uploaded file is invalid or not a text format
- 503 (Service Unavailable): If any of the required services (Qdrant, Neon) is not reachable

## Error Handling

### Standard Error Format

All error responses will follow this format:

```json
{
  "error": {
    "type": "error_type",
    "message": "Human-readable error message",
    "details": "Additional details about the error"
  }
}
```

### Error Types

- `VALIDATION_ERROR`: Input does not meet required schema
- `SERVICE_UNAVAILABLE`: Required external service is not reachable
- `INTERNAL_ERROR`: Unexpected internal server error
- `RATE_LIMITED`: Rate limit exceeded for external API