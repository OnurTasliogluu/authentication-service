# Development stage
FROM node:20-alpine AS development

WORKDIR /app

# Install dependencies
RUN apk add --no-cache openssl

# Set the environment variable to use the correct OpenSSL library
ENV PRISMA_CLI_BINARY_TARGETS=linux-musl-openssl-3.0.x

# Copy package files
COPY package.json pnpm-lock.yaml* ./

# Install pnpm
RUN npm install -g pnpm

# Install dependencies (including dev dependencies)
RUN pnpm install

# Copy source code
COPY . .

RUN npm rebuild bcrypt

RUN npx prisma generate