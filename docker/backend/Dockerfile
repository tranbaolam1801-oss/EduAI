FROM node:20-alpine

WORKDIR /workspace/backend

COPY backend/package*.json ./
RUN npm install

COPY backend/ ./

EXPOSE 3000

CMD ["npm", "run", "start"]
