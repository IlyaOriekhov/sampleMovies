# Використовуємо стабільну версію Node.js
FROM node:20-alpine

WORKDIR /app

# Install security updates
RUN apk update && apk upgrade && apk add --no-cache dumb-init

# Create non-root user
RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001

# Copy package files
COPY package*.json ./

# Install dependencies (використовуємо npm install замість npm ci)
RUN npm install --production && npm cache clean --force

# Copy source code
COPY src/ ./src/

# Create uploads directory
RUN mkdir -p uploads

# Change ownership
RUN chown -R nodejs:nodejs /app

# Switch to non-root user
USER nodejs

# Expose port
EXPOSE 8050

# Use dumb-init for proper signal handling
ENTRYPOINT ["dumb-init", "--"]
CMD ["npm", "start"]
