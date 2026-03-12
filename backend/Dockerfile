FROM node:22-alpine

WORKDIR /app

# Install curl for inter-service connectivity tests
RUN apk add --no-cache curl

COPY package.json yarn.lock* ./
RUN yarn install --frozen-lockfile

COPY . .

EXPOSE 3000

CMD ["yarn", "start:dev"]