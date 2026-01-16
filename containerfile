# Containerfile
FROM node:18-alpine

WORKDIR /usr/src/app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy application source
COPY . .

# Expose port 3001
EXPOSE 3001

# Create a non-root user and switch to it
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001
USER nodejs

# Health check (optional but good practice)
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "import('http').then(http => http.get('http://localhost:3001/health', (r) => {if(r.statusCode!==200)throw new Error()}))"

# Start the application
CMD ["node", "app.js"]