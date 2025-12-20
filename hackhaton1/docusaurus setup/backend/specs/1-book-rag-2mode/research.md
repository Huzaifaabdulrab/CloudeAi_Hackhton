# Research: 2-Mode RAG Book Search Implementation

**Feature**: 2-Mode RAG Book Search
**Date**: 2025-01-08

## Overview

This document captures research findings for the 2-mode RAG system implementation, addressing technical decisions and best practices for the integration of Qdrant, Neon Postgres, and Cohere API.

## Technology Decisions

### FastAPI Framework

**Decision**: Use FastAPI for the web framework

**Rationale**: FastAPI provides:
- Built-in async support for handling concurrent requests
- Automatic API documentation via Swagger UI and ReDoc
- Pydantic integration for request/response validation
- High performance comparable to Node.js and Go frameworks
- Excellent support for data serialization/deserialization

**Alternatives considered**:
- Flask: More popular but lacks built-in async support and automatic documentation
- Django: Heavy framework with ORM that doesn't align with our external service integration needs

### Cohere API for LLM Processing

**Decision**: Use Cohere API exclusively for LLM capabilities

**Rationale**: 
- Cohere's Command-R model is specifically designed for RAG applications
- Strong embedding capabilities with English and multilingual models
- Good performance on question-answering tasks
- Complies with project constitution requirement of Cohere exclusivity
- Provides both embeddings and chat completions in one API

**Alternatives considered**:
- OpenAI: Explicitly prohibited by project constraints
- Hugging Face Transformers: Self-hosted models require more infrastructure and maintenance
- Anthropic Claude: Additional API integration needed when Cohere already meets requirements

### Qdrant for Vector Storage

**Decision**: Use Qdrant Cloud for vector storage

**Rationale**:
- High-performance vector search capabilities
- Cloud-hosted option reduces infrastructure management
- Good Python client library with async support
- Supports metadata storage alongside vectors
- Efficient similarity search algorithms

**Alternatives considered**:
- Pinecone: Competitor in vector databases but Qdrant has better open-source ecosystem
- Weaviate: Alternative vector database but Qdrant has simpler setup for this use case
- Custom solution with FAISS: Requires more infrastructure setup and maintenance

### Neon Postgres for Metadata

**Decision**: Use Neon Serverless Postgres for metadata storage

**Rationale**:
- Serverless Postgres with autoscaling capabilities
- Familiar SQL interface for structured metadata
- Git-like branching for database development
- Integrates well with Python via psycopg2
- Supports JSON fields for flexible metadata

**Alternatives considered**:
- MongoDB: NoSQL option but we need structured metadata with relationships
- Redis: Good for caching but not ideal for structured metadata
- SQLite: Simple but doesn't scale well for shared access

## RAG Implementation Patterns

### Chunking Strategy

**Decision**: 500-character chunks with 50-character overlap

**Rationale**:
- 500 characters provides sufficient context for LLM understanding
- 50-character overlap helps maintain context across chunk boundaries
- Balances retrieval precision with computational efficiency
- Compliant with project constraints

**Alternatives considered**:
- Fixed sentence count: Could vary significantly in character length
- Token-based chunks: More complex implementation than character-based
- Different sizes: Tested various sizes but 500/50 showed best balance of performance and quality

### Retrieval-Augmented Generation (RAG) Architecture

**Decision**: Implement two distinct search modes - global and selected text, with source citations

**Rationale**:
- Global mode: Search entire book content for comprehensive answers
- Selected text mode: Restrict answers to provided text only (no book context)
- Source citations provide transparency and trust in responses
- "I don't know" responses when context is insufficient

**Pattern**: 
1. Accept user query via API endpoint
2. For global mode: Generate embedding and search Qdrant collection
3. For selected text mode: Use provided text directly
4. Format context with retrieved content
5. Generate response using Cohere with context constraint
6. Return answer with source citations

## Security Considerations

**Decision**: Environment variables for credential storage

**Rationale**:
- Credentials never stored in codebase
- Easy configuration across different environments
- Standard practice for credential management
- Required by project constitution

**Implementation**:
- Use python-dotenv for local development
- System environment variables in production
- No credential hardcoding anywhere in the codebase

## Performance Considerations

**Decision**: 5-second response time target

**Rationale**:
- Provides good user experience for interactive queries
- Reasonable expectation for vector search + LLM processing
- Compliant with project requirements

**Optimization strategies**:
- Caching of frequent queries
- Efficient vector search with Qdrant
- Async processing where possible
- Proper indexing in Neon Postgres