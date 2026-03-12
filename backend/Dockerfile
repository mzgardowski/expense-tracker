FROM node:22-alpine

WORKDIR /app

# Install curl for inter-service connectivity tests
RUN apk add --no-cache curl

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "run", "start:dev"]