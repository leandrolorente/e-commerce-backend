# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Install OpenSSL and build tools
RUN apk add --no-cache openssl libc6-compat python3 make g++

# Copy package files first
COPY package*.json ./

# Copy Prisma schema BEFORE npm install (needed for postinstall hook)
COPY prisma ./prisma/

# Verify prisma schema was copied
RUN ls -la prisma/ && cat prisma/schema.prisma | head -n 20

# Install ALL dependencies (dev + prod needed for build)
RUN npm install --ignore-scripts

# Generate Prisma Client manually
RUN npx prisma generate

# Copy everything except what's in dockerignore
COPY . .

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

# Copy Prisma schema BEFORE npm install (needed for postinstall hook)
COPY prisma ./prisma/

# Verify prisma schema exists
RUN ls -la prisma/

# Install ONLY production dependencies (skip postinstall for now)
RUN npm ci --only=production --omit=dev --ignore-scripts

# Generate Prisma Client manually
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
