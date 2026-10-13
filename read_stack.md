# --- lib

# --- stack

# --- more
🛠️ TECH STACK:
• TypeScript & Express.js
• MongoDB
• Redis for caching
• RabbitMQ for message queues
• Docker & Docker Compose
• LangChain & LangGraph for AI Ochestration



✅ API Gateway - Single entry point for all client requests
✅ Auth Service - User registration, login & JWT tokens (MongoDB)
✅ Notification  Service - For sending email
✅ Task Service - For Handling AI logic

---
client - api gateway (jwt gateway) - acount/users/customers (auth-service, rabbitmq, notification-service, mailtrap) - apigateway - task service

agent: sale/lead qualification/lead nurting/customer support

knowledge base: upload document, add quesion

---
Ai Agent system: memoryAgent, workerAgnet

self-host(pg-vector): vetoc database (longterm memory, knowledge base)

mongodb: user data, chat history, working memory, short-term memory, human in loop

redis: cache (working memory, short-term memory)

---
nodejs
grpc
docker
docker compose
mongoDB
redis
rabbitmq
ai ocherstation(langchain, langgraph)
vetor databases
RAG (embbeding, retievers, propmpt)
design memory agent
human in the loop (HITL)
React/tailwind
