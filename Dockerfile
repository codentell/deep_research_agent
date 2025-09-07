# Multi-stage build for production deployment
FROM node:18-alpine AS frontend-build

# Build frontend
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci --only=production
COPY frontend/ ./
RUN npm run build

# Production backend image
FROM python:3.11-slim

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy and install Python dependencies
COPY backend/pyproject.toml ./
RUN pip install --no-cache-dir -e .

# Copy backend source code
COPY backend/src/ ./src/
COPY backend/run_server.py ./run_server.py

# Copy frontend build
COPY --from=frontend-build /app/frontend/dist ./frontend/dist

# Expose port
EXPOSE 8123

# Set environment variables
ENV PYTHONPATH=/app/src
ENV PORT=8123

# Start the application
WORKDIR /app
CMD ["python", "run_server.py"]