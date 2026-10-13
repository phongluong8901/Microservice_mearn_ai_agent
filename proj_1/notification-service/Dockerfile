FROM node:22

WORKDIR /app

COPY package*.json ./
RUN npm install --legacy-peer-deps

COPY . .
EXPOSE 50052

CMD ["npm", "run", "dev"]