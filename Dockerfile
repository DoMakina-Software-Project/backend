# Use the official Node.js image as a base
FROM node:22-alpine

# Set environment variables for secure defaults
ENV NODE_ENV=production

# Create and switch to a non-root user for security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json first to install dependencies
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy the rest of the application code
COPY . .

# Ensure ownership by non-root user
RUN chown -R appuser:appgroup /usr/src/app

# Switch to the non-root user
USER appuser

# Expose the port that your Node.js app listens on
EXPOSE 4000

# Use a healthcheck to ensure container health
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:4000/ping || exit 1

# Start the Node.js application
CMD ["node", "src/index.js"]