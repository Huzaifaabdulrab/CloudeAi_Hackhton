Stop working on installation, agents, versions, and automation tools.

The backend server is already running.
The real issue is NOT setup.

The chatbot always replies "I don't know" because:
- Qdrant retrieval is returning empty or irrelevant context
- The prompt is too strict and forces "I don't know"
- Retrieved payload fields do not match what the model expects

Focus ONLY on backend logic:
1. Verify vectors exist in Qdrant
2. Log search results before sending to the LLM
3. Confirm correct payload key (text/content)
4. Fix RAG prompt so answers come ONLY from book chunks

Do NOT:
- install agents
- install tensorflow
- change Python versions
- run specify / sp tools

This is a RAG logic problem, not an installation problem.
Fix retrieval + prompt, the chatbot will work.
