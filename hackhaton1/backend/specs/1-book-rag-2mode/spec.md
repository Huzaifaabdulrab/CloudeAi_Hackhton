# Feature Specification: 2-Mode RAG Book Search

**Feature Branch**: `1-book-rag-2mode`
**Created**: 2025-01-08
**Status**: Draft
**Input**: User description: "**Exact Credentials (USE THESE DIRECTLY):** NEON_DATABASE_URL=postgresql://neondb_owner:npg_6DhEe7qkPSMo@ep-spring-flower-a8jpsack-pooler.eastus2.azure.neon.tech/neondb?sslmode=require&channel_binding=require QDRANT_API_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2Nlc3MiOiJtIn0.7qQ97iIY4oDMLntrPl9bpHILLCSw7P8f9kmq12cZlRA QDRANT_CLUSTER_URL=https://4ff5c5bb-e674-475e-bb03-5aa5097164ba.europe-west3-0.gcp.cloud.qdrant.io QDRANT_CLUSTER_ID=4ff5c5bb-e674-475e-bb03-5aa5097164ba COHERE_API_KEY=mjrsrtqiodlwcrOz9ItqGKX7dZQkPhahqFcFgoso **Target audience:** Book readers wanting instant answers from book content **Focus:** 2-mode RAG - Global book search + Selected text only search **Success criteria:** - /chat/global endpoint returns book-grounded answers with sources - /chat/selected answers ONLY from provided text (no book context) - All 3 services connect successfully with given credentials - "I don't know" response when no relevant context found - FastAPI runs on uvicorn main:app --reload **Constraints:** - FastAPI + Cohere SDK + Qdrant-client + psycopg2-binary - Environment variables MUST use exact credential values above - Collection name: "book_chunks" in Qdrant - Table name: "chunks" in Neon Postgres - No OpenAI APIs anywhere - Chunk size: 500 chars, 50 char overlap **Not building:** - Frontend/UI (just FastAPI backend) - Book ingestion automation (manual trigger endpoint) - User authentication - Advanced analytics/dashboard **Deliverables:** - Complete main.py with all 4 endpoints working - .env file with exact credentials populated - requirements.txt - Test curl commands that work end-to-end, ignore all git and all types of this errors about this, now we will only focus on creation and development not git or others, right lets start please"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Global Book Search (Priority: P1)

Book readers want to ask questions about the book content and receive answers grounded in the full book with source references. The system should return accurate information from anywhere in the book while citing the specific sources.

**Why this priority**: This is the core functionality that enables users to get instant answers from the entire book, which is the primary value proposition.

**Independent Test**: The system can accept a question via the /chat/global endpoint and return an answer with source citations, even when the relevant content is spread across different parts of the book.

**Acceptance Scenarios**:

1. **Given** a user has a question about book content, **When** they submit a query to the /chat/global endpoint, **Then** the system returns an accurate answer with cited sources from the book
2. **Given** a user submits a query to the /chat/global endpoint, **When** no relevant content exists in the book, **Then** the system returns an "I don't know" response
3. **Given** a user submits a query to the /chat/global endpoint, **When** the system processes the request, **Then** the response time is under 5 seconds

---

### User Story 2 - Selected Text Search (Priority: P2)

Book readers want to ask questions about specific text they have selected and receive answers only from that provided text, with no reference to the broader book context. The system should limit its response strictly to the provided selection.

**Why this priority**: This provides an alternative search mode that gives users more control over the context, which is important for focused inquiries.

**Independent Test**: The system can accept user-provided text and a question via the /chat/selected endpoint and return an answer based only on that text.

**Acceptance Scenarios**:

1. **Given** a user has selected text and a related question, **When** they submit both to the /chat/selected endpoint, **Then** the system returns an answer based only on the provided text
2. **Given** a user submits text and a question to the /chat/selected endpoint, **When** the question cannot be answered from the provided text, **Then** the system returns an "I don't know" response
3. **Given** a user submits data to the /chat/selected endpoint, **When** the system processes the request, **Then** the response time is under 5 seconds

---

### User Story 3 - Service Integration (Priority: P3)

System administrators need to ensure that the three services (Qdrant vector database, Neon Postgres, and Cohere API) connect successfully with the provided credentials to enable the RAG functionality.

**Why this priority**: This is essential infrastructure that must be in place for the other user stories to work, but it's behind the scenes from the book reader's perspective.

**Independent Test**: All three services connect successfully using the provided credentials and the system can perform basic operations with each.

**Acceptance Scenarios**:

1. **Given** the system is configured with the provided credentials, **When** it attempts to connect to Qdrant, Neon Postgres, and Cohere, **Then** all connections succeed
2. **Given** the system has connected to all three services, **When** it processes a user query, **Then** all services are utilized as needed for the RAG process
3. **Given** the system is running, **When** a health check is performed, **Then** all services report as operational

---

### Edge Cases

- What happens when the selected text is empty or very short?
- How does the system handle extremely long book queries that might result in a very large context?
- What happens when the vector database is temporarily unavailable?
- How does the system handle malformed or non-English text inputs?
- What is the behavior when the Cohere API returns an error or is rate-limited?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST provide a /chat/global endpoint that accepts user questions and returns answers based on the full book content
- **FR-002**: System MUST provide a /chat/selected endpoint that accepts user-provided text and questions, returning answers based only on that text
- **FR-003**: System MUST return book-grounded answers with source references/citations when using the /chat/global endpoint
- **FR-004**: System MUST return answers based only on the provided text when using the /chat/selected endpoint with no reference to book context
- **FR-005**: System MUST return an "I don't know" response when no relevant context is found for either endpoint
- **FR-006**: System MUST connect to Qdrant vector database using the provided cluster URL and API key
- **FR-007**: System MUST connect to Neon Postgres database using the provided connection string
- **FR-008**: System MUST connect to Cohere API using the provided API key
- **FR-009**: System MUST store book content as chunks of 500 characters with 50 character overlap in Qdrant collection named "book_chunks"
- **FR-100**: System MUST store chunk metadata in Neon Postgres table named "chunks"
- **FR-101**: System MUST process user queries in less than 5 seconds under normal conditions
- **FR-102**: System MUST use Cohere API exclusively for all LLM interactions (no OpenAI APIs)
- **FR-103**: System MUST expose a health check endpoint that verifies connectivity to all required services

### Key Entities

- **Book Content**: The main text content from books that will be processed and stored in chunks
- **Text Chunks**: Segments of book content (500 characters with 50-character overlap) stored in the system
- **User Query**: Questions or prompts submitted by book readers through either the global or selected text endpoints
- **Retrieved Answer**: The system's response to user queries, including source citations when answering from full book content
- **Source Citations**: References to specific locations in the book content that support the provided answers

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Book readers can receive accurate answers to their questions with source citations from the full book in less than 5 seconds
- **SC-002**: Book readers can receive answers based only on provided text selections without reference to the broader book context
- **SC-003**: All three services (Qdrant, Neon Postgres, Cohere API) connect successfully using the provided credentials
- **SC-004**: System responds with "I don't know" when no relevant context is found in either search mode
- **SC-005**: FastAPI backend runs stably with the main application accessible via uvicorn
- **SC-006**: All endpoints demonstrate reliable performance under normal usage conditions