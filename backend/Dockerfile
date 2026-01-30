# Build Stage
FROM node:20-slim

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies --production for smaller image
RUN npm install --production

# Copy local code to the container image.
COPY . .

# Expose port (Cloud Run will set PORT env)
EXPOSE 8080

# Run the web service on container startup.
CMD [ "node", "server.js" ]
