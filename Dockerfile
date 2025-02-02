# Build stage
FROM node:22-alpine AS build

# Install dependencies
RUN apk add --no-cache \
    chromium \
    nss \
    freetype \
    harfbuzz \
    ca-certificates \
    ttf-freefont

# Create a non-root user
RUN adduser -D appuser

# Set working directory
WORKDIR /app

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy package files and install dependencies
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --prod

# Copy application files
COPY . .

# Production stage
FROM node:22-alpine AS production

# Install only the required runtime dependencies
RUN apk add --no-cache \
    chromium \
    nss \
    freetype \
    harfbuzz \
    ca-certificates \
    ttf-freefont

# Create a non-root user
RUN adduser -D appuser

# Set working directory
WORKDIR /app

# Copy only necessary files from the build stage
COPY --from=build /app /app

# Change ownership
RUN chown -R appuser:appuser /app

# Set Puppeteer to use system Chromium
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

# Switch to non-root user
USER appuser

# Expose the port
EXPOSE 3000

# Run the application
CMD ["node", "server.js"]
