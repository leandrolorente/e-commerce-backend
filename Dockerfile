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
RUN echo "Starting NestJS build..." && npm run build && echo "Build finished!"

# CRITICAL: Verify dist exists and show contents
RUN if [ ! -d "dist" ]; then echo "ERROR: dist folder not created!"; exit 1; fi
RUN echo "✅ Build complete! Contents of dist:" && find dist -name "*.js" | head -20

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

# CRITICAL: Verify dist was copied  
RUN echo "Checking for main.js..." && find dist -name "main.js" -o -name "main.*.js"
RUN if [ ! -f "dist/src/main.js" ] && [ ! -f "dist/main.js" ]; then echo "ERROR: main.js not found!"; ls -la dist/; exit 1; fi
RUN echo "✅ Production image - dist structure:" && ls -la dist/

# Copy startup script
COPY start.sh ./
RUN chmod +x start.sh

# Verify dist exists
RUN echo "Production image contents:" && ls -la && ls -la dist/

# Expose port
EXPOSE 3000

# Start application
CMD ["./start.sh"]
