# --- source

# --- setup
--- cd proj_1
npm init -y
npm i dotenv
npm install --save-dev @types/cors
npm install --save-dev tsconfig-paths
npm install --save-dev tsx
npm i express nodemon ts-node typescript -D
npm i @types/node @types/express -D

# --- install
npm install @grpc/grpc-js @grpc/protoc-loader
npm install langchain @langchain/core
npm install @langchain/langgraph @langchain/core

--- auth-service
npm install mongoose
npm i bcrypt
npm i --save-dev @types/bcrypt
npm i amqplib
npm i -D @types/amqplib
npm i jsonwebtoken
npm i --save-dev @types/jsonwebtoken

--- notification-service
npm i amqplib
npm i dotenv
npm i -D @types/amqplib
npm i nodemailer

--- gateway
npm install jsonwebtoken
npm install --save-dev @types/jsonwebtoken

--- task-service
npm install mongoose
npm install @langchain/fireworks @langchain/core
npm install @langchain/cerebras

# --- run
--- cd proj_1

# --- docker
cd proj_1
docker-compose up --build

docker-compose down -v

--- auth cai dat mk cho mongodb trong container docker
docker exec -it mongo mongosh -u admin -p password123 --authenticationDatabase admin

# --- link
task-service: 50051
notification-service: 50052
auth-service: 50053
gateway-service: 3000

# --- link lib
- langgraph
https://www.langchain.com/langgraph
- firework
https://fireworks.ai/