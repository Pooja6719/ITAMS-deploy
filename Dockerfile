# Backend-only Docker image
FROM node:20-alpine

WORKDIR /app

# Copy backend package files
COPY backend/itams-backend/package*.json ./

# Install backend dependencies
RUN npm install --omit=dev --no-audit --no-fund

# Copy backend source code
COPY backend/itams-backend/ .

# Railway/Render/Docker will provide the PORT
EXPOSE 8080

# Start backend
CMD ["npm", "start"]