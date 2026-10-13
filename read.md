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

# --- run
--- cd proj_1

# --- docker
cd proj_1
docker-compose up --build

# --- link
task-service: 5051
notification-service: 5052
auth-service: 5053
gateway-service: 3000