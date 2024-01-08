# Use the official Node.js runtime as the base image
FROM node:latest

WORKDIR /app

EXPOSE 3000

CMD [ -d "node_modules" ] && npm run dev || npm ci && npm run dev