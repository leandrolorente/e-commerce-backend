# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Install OpenSSL and build tools
RUN apk add --no-cache openssl libc6-compat python3 make g++

# Copy package files first
COPY package*.json ./

# Install ALL dependencies (dev + prod needed for build)
RUN npm install

# Copy everything except what's in dockerignore
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Build NestJS application
RUN npm run build

# List dist to verify build
RUN echo "Build complete! Contents of dist:" && ls -la dist/

# Production stage
FROM node:20-alpine

WORKDIR /app

# Install OpenSSL for Prisma runtime
RUN apk add --no-cache openssl libc6-compat

# Copy package files
COPY package*.json ./

# Install ONLY production dependencies
RUN npm ci --only=production --omit=dev

# Copy Prisma schema
COPY prisma ./prisma/

# Generate Prisma Client for production
RUN npx prisma generate

# Copy built application from builder stage
COPY --from=builder /app/dist ./dist

# Copy startup script
COPY start.sh ./
RUN chmod +x start.sh

# Verify dist exists
RUN echo "Production image contents:" && ls -la && ls -la dist/

# Expose port
EXPOSE 3000

# Start application
CMD ["./start.sh"]
