export type Cluster = "model" | "retrieval" | "agent" | "platform" | "data" | "craft";

export type Concept = {
  id: string;
  label: string;
  cluster: Cluster;
  /** one line, embedded to build the latent map; also shown in the hover card */
  def: string;
};

export const clusters: Record<Cluster, { label: string; color: string }> = {
  model: { label: "Models", color: "#c6ff3d" },
  retrieval: { label: "Retrieval", color: "#3de0ff" },
  agent: { label: "Agents", color: "#ff9d4d" },
  platform: { label: "Platform", color: "#b78bff" },
  data: { label: "Data", color: "#ff6fa5" },
  craft: { label: "Craft", color: "#8b93a7" },
};

export const concepts: Concept[] = [
  { id: "llm", label: "LLMs", cluster: "model", def: "large language models generate text token by token, follow prompts, call tools and power RAG pipelines and AI agents" },
  { id: "transformer", label: "Transformers", cluster: "model", def: "attention based neural network architecture behind large language models, embeddings and modern deep learning" },
  { id: "deep-learning", label: "Deep Learning", cluster: "model", def: "training multi layer neural networks with gradient descent, the foundation of language models, embeddings and transformers" },
  { id: "ml", label: "Machine Learning", cluster: "model", def: "machine learning learns patterns from data to make predictions, including supervised, deep and reinforcement learning" },
  { id: "nlp", label: "NLP", cluster: "model", def: "natural language processing turns text into tokens and embeddings for search, classification and language model generation" },
  { id: "rl", label: "Reinforcement Learning", cluster: "model", def: "reinforcement learning trains an agent through actions, rewards and penalties so its policy improves, as in a custom environment with reward shaping" },
  { id: "reward-shaping", label: "Reward shaping", cluster: "model", def: "designing reward functions and penalties so a reinforcement learning agent is guided toward the goal and avoids loops" },
  { id: "llama", label: "Llama 3", cluster: "model", def: "Llama 3 open weights large language model that can act as an agent inside a reinforcement learning environment" },
  { id: "gemini", label: "Gemini", cluster: "model", def: "Gemini large language model from Google used through an API to power agents, tool calling and structured output" },
  { id: "tokens", label: "Tokens", cluster: "model", def: "tokens are the sub word units a large language model reads and predicts one at a time, shown with probabilities" },
  { id: "embeddings", label: "Embeddings", cluster: "retrieval", def: "embeddings are dense vectors that place similar meanings close together, used for semantic search, vector databases and RAG retrieval" },
  { id: "rag", label: "RAG", cluster: "retrieval", def: "retrieval augmented generation embeds the question, retrieves relevant chunks from a vector database, then grounds the LLM answer with citations" },
  { id: "vector-db", label: "Vector databases", cluster: "retrieval", def: "vector databases store embeddings and run nearest neighbour search for semantic search and RAG retrieval" },
  { id: "qdrant", label: "Qdrant", cluster: "retrieval", def: "Qdrant vector database stores embeddings with metadata and powers semantic retrieval for RAG pipelines" },
  { id: "semantic-search", label: "Semantic search", cluster: "retrieval", def: "semantic search finds documents by meaning using embeddings and vector similarity instead of keyword matching, the retrieval step of RAG" },
  { id: "knowledge-graph", label: "Knowledge graphs", cluster: "retrieval", def: "knowledge graphs store entities and relations so retrieval and agents can reason across connected facts, complementing vector search and RAG" },
  { id: "chunking", label: "Chunking", cluster: "retrieval", def: "chunking splits documents into passages that are embedded and indexed for retrieval in a RAG pipeline" },
  { id: "citations", label: "Citations", cluster: "retrieval", def: "citations link each generated claim to the retrieved source so a RAG or fact verification answer can be checked" },
  { id: "agents", label: "AI agents", cluster: "agent", def: "AI agents are language model loops that plan, call tools, read observations, keep memory and act toward a goal" },
  { id: "multi-agent", label: "Multi-agent systems", cluster: "agent", def: "multi agent systems split a task across specialised AI agents such as researcher and verifier that hand work to each other" },
  { id: "langgraph", label: "LangGraph", cluster: "agent", def: "LangGraph builds stateful agent workflows as graphs with tool calling, memory and branching" },
  { id: "crewai", label: "CrewAI", cluster: "agent", def: "CrewAI organises role based AI agents into a crew for multi agent research, claim extraction and verification" },
  { id: "tool-use", label: "Tool calling", cluster: "agent", def: "tool calling lets an AI agent choose a function, pass structured arguments and read the result through MCP or an API" },
  { id: "mcp", label: "MCP", cluster: "agent", def: "model context protocol exposes tools and data to AI agents and language models in a standard way, a tool gateway" },
  { id: "memory", label: "AI memory", cluster: "agent", def: "AI memory layer stores short term and long term context for agents across steps and sessions, often in a vector database" },
  { id: "prompting", label: "Prompt engineering", cluster: "agent", def: "prompt engineering writes instructions, examples and structure so a language model returns reliable output" },
  { id: "structured-output", label: "Structured output", cluster: "agent", def: "structured output forces a language model to return validated JSON with Pydantic schemas and fallbacks for malformed replies" },
  { id: "workflow", label: "Workflow orchestration", cluster: "agent", def: "workflow orchestration coordinates multi step AI pipelines, tool calls, retries and agent handoffs" },
  { id: "llm-gateway", label: "LLM gateway", cluster: "platform", def: "an LLM gateway is a provider agnostic layer that routes language model calls, handles retries and fallbacks, and tracks cost and latency" },
  { id: "clean-arch", label: "Clean Architecture", cluster: "platform", def: "Clean Architecture separates core ports from infrastructure adapters so an AI platform stays modular, testable and provider agnostic" },
  { id: "solid", label: "SOLID", cluster: "platform", def: "SOLID object oriented design principles and dependency injection keep services modular and testable" },
  { id: "observability", label: "Observability", cluster: "platform", def: "observability uses structured logs, traces and metrics to explain what a production AI system and its agents did" },
  { id: "evaluation", label: "Evaluation", cluster: "platform", def: "evaluation measures language model and agent quality with tests, benchmarks, metrics and confidence scores" },
  { id: "docker", label: "Docker", cluster: "platform", def: "Docker containers package a service for the same deployment everywhere, including multi stage builds and CI pipelines" },
  { id: "ci", label: "CI/CD", cluster: "platform", def: "CI/CD runs automated tests and containerised deployment on every change to keep production AI reliable" },
  { id: "aws-bedrock", label: "AWS Bedrock", cluster: "platform", def: "AWS Bedrock is a managed cloud service for foundation models and embeddings used to build RAG on AWS" },
  { id: "oci", label: "Oracle Cloud", cluster: "platform", def: "Oracle Cloud Infrastructure foundations covering cloud compute, storage, networking and security" },
  { id: "huggingface", label: "HuggingFace Spaces", cluster: "platform", def: "HuggingFace Spaces hosts model demos and APIs deployed from Docker containers" },
  { id: "fastapi", label: "FastAPI", cluster: "platform", def: "FastAPI is a Python framework for typed REST and WebSocket APIs that serve AI models and agents" },
  { id: "websockets", label: "WebSockets", cluster: "platform", def: "WebSockets keep a persistent connection that streams agent state and model output to clients in real time" },
  { id: "pydantic", label: "Pydantic", cluster: "platform", def: "Pydantic validates typed schemas for agent actions, observations and structured language model output in Python" },
  { id: "kafka", label: "Kafka", cluster: "data", def: "Kafka is a distributed event stream for ingestion pipelines that feed Spark, databases and vector stores" },
  { id: "spark", label: "Spark", cluster: "data", def: "Spark processes large batch and streaming data in distributed pipelines fed by Kafka" },
  { id: "postgres", label: "PostgreSQL", cluster: "data", def: "PostgreSQL is a relational database for durable storage of metadata and application state" },
  { id: "encryption", label: "Encrypted storage", cluster: "data", def: "encrypted storage keeps private data such as email content secure at rest in a data pipeline" },
  { id: "geodata", label: "Geospatial AI", cluster: "data", def: "geospatial machine learning analyses satellite and geographic data, studied at ISRO IIRS" },
  { id: "python", label: "Python", cluster: "craft", def: "primary language for machine learning and backend services" },
  { id: "typescript", label: "TypeScript", cluster: "craft", def: "typed JavaScript for the web applications and admin tooling" },
  { id: "nextjs", label: "Next.js", cluster: "craft", def: "React framework for server rendered full stack web apps" },
  { id: "dsa", label: "DSA", cluster: "craft", def: "data structures and algorithms practised daily on LeetCode" },
  { id: "hackathons", label: "Hackathons", cluster: "craft", def: "shipping working prototypes under time pressure with a team" },
  { id: "production", label: "Production AI", cluster: "craft", def: "systems that hold up outside a notebook with tests, monitoring and deployment" },
  { id: "fact-check", label: "Fact verification", cluster: "agent", def: "fact verification extracts claims, researches the web with agents, and returns a verdict with confidence and citations" },
  { id: "email-agent", label: "Email agent", cluster: "agent", def: "an autonomous email agent uses LangGraph, tool calling and RAG over an inbox to search, draft and organise messages" },
];
