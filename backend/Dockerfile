# Build Stage
FROM node:20-slim

# Set working directory to the root of the repo
WORKDIR /app

# Copy the entire repo
COPY . .

# Set working directory to the backend folder where server.js lives
WORKDIR /app/backend

# Install dependencies (since we are in /app/backend)
RUN npm install --production

# Expose port
EXPOSE 8080

# Run the web service
CMD [ "node", "server.js" ]
