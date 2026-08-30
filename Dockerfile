# =========================================================
# Stage 1: Build React Frontend
# =========================================================
FROM node:20-alpine AS frontend-build

WORKDIR /frontend

# Copy frontend package files
COPY frontend/itams/package*.json ./

# Install frontend dependencies
RUN npm install --no-audit --no-fund

# Copy frontend source code
COPY frontend/itams/ .

# Build React application
RUN npm run build


# =========================================================
# Stage 2: Backend + Frontend
# =========================================================
FROM node:20-alpine

WORKDIR /app

# Copy backend package files
COPY backend/itams-backend/package*.json ./

# Install backend dependencies
RUN npm install --omit=dev --no-audit --no-fund

# Copy backend source code
COPY backend/itams-backend/ .

# Copy React production build into backend
COPY --from=frontend-build /frontend/build ./public

# Railway/Render/Docker will provide the PORT
EXPOSE 5000

# Start backend
CMD ["npm", "start"]