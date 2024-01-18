FROM node:latest

WORKDIR /app

EXPOSE 3000

CMD if [ -d "node_modules" ]; then \
        npm run start:dev; \
    else \
        npm ci; \
        chown -R node:node /app/node_modules/prisma-kysely; \
        npm run start:dev; \
    fi