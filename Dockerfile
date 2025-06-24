# Use official Node.js runtime as base image
FROM node:18-alpine

# Set working directory in container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy application code
COPY src/ ./src/

# Create uploads directory
RUN mkdir -p uploads

# Create directory for SQLite database
RUN mkdir -p data

# Expose port
EXPOSE 8050

# Set default environment variables
ENV NODE_ENV=production
ENV APP_PORT=8050
ENV DB_PATH=./data/database.sqlite

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

# Change ownership of app directory
RUN chown -R nodejs:nodejs /app
USER nodejs

# Start the application
CMD ["npm", "start"]
