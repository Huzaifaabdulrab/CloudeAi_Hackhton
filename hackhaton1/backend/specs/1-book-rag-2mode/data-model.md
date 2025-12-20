# Data Model: 2-Mode RAG Book Search

**Feature**: 2-Mode RAG Book Search
**Date**: 2025-01-08

## Overview

This document defines the data models for the 2-mode RAG system, including entities stored in Qdrant vector database and Neon Postgres metadata store.

## Entity Models

### Book Content Chunk

**Storage Location**: Qdrant collection "book_chunks"

**Fields**:
- `id` (UUID): Unique identifier for the chunk
- `content` (string): The actual text content (500 characters max)
- `book_id` (string): Identifier for the source book
- `page_number` (integer): Page number in the original book (if applicable)
- `section_title` (string): Section or chapter title containing this chunk
- `character_offset` (integer): Starting position of the chunk in the full book text
- `embedding` (vector): Vector embedding of the content for similarity search
- `metadata` (JSON): Additional metadata like headings, formatting, etc.

**Relationships**:
- One book can have many chunks
- Chunks are linked to a specific book via `book_id`

### Chunk Metadata

**Storage Location**: Neon Postgres table "chunks"

**Fields**:
- `id` (UUID): Primary key, matches the Qdrant chunk ID
- `book_id` (string): Foreign key to identify the book
- `chunk_id` (string): Same as Qdrant ID for reference
- `created_at` (timestamp): When the chunk was created
- `updated_at` (timestamp): When the chunk was last modified
- `checksum` (string): SHA-256 hash of the content for integrity validation
- `status` (enum): Processing status (pending, processed, failed)
- `metadata` (JSONB): Additional information about the chunk

**Relationships**:
- Links to the Qdrant chunk for vector operations
- Belongs to a specific book

### Book Information

**Storage Location**: Neon Postgres table "books"

**Fields**:
- `id` (UUID): Primary key
- `title` (string): Book title
- `author` (string): Book author
- `isbn` (string): ISBN identifier (if available)
- `total_chunks` (integer): Number of chunks created for this book
- `created_at` (timestamp): When the book was ingested
- `updated_at` (timestamp): When the book was last updated
- `source_path` (string): Path or URL where the original book content came from

**Relationships**:
- One book can have many chunks
- Chunks reference their book via `book_id`

## API Request/Response Models

### ChatRequest

**Purpose**: Request model for chat endpoints

**Fields**:
- `question` (string, required): The user's question
- `selected_text` (string, optional): Text provided for selected mode search

### ChatResponse

**Purpose**: Response model for chat endpoints

**Fields**:
- `answer` (string): The generated answer
- `sources` (array of objects): List of source citations
  - `chunk_id` (string): ID of the source chunk
  - `text` (string): Snippet of the source text
  - `page_number` (integer): Page number where found
  - `section_title` (string): Section where found
- `confidence` (float): Confidence score (0.0 to 1.0)

### HealthResponse

**Purpose**: Response model for health check endpoint

**Fields**:
- `status` (string): Overall system status ("ok", "degraded", "error")
- `qdrant_connected` (boolean): Connection status to Qdrant
- `neon_connected` (boolean): Connection status to Neon Postgres
- `cohere_connected` (boolean): Connection status to Cohere API

## Validation Rules

### Book Content Chunk
- Content must be between 10 and 500 characters
- Character offset must be non-negative
- Embedding vector must have consistent dimensions

### Chunk Metadata
- ID must match corresponding Qdrant chunk
- Checksum must be valid SHA-256 format
- Status must be one of: "pending", "processed", "failed"

### Book Information
- Title and author are required
- Total chunks must be non-negative
- ISBN, if provided, must be valid

## Indexing Strategy

### Qdrant
- Vector index on the embedding field for similarity search
- Payload index on book_id for filtering

### Neon Postgres
- Primary index on id for both "chunks" and "books" tables
- Foreign key index on book_id in chunks table
- Index on status field for processing queries
- Composite index on (book_id, status) for efficient filtering