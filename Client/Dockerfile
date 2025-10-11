# Stage 1 - Build stage
FROM node:24-alpine as stage1
LABEL name="client"
EXPOSE 3000

# Define build arguments for Vite environment variables
ARG VITE_APP_BASE_URL
ARG VITE_WEBSOCKET_URL

# Set them as environment variables for Vite to recognize
ENV VITE_APP_BASE_URL=${VITE_APP_BASE_URL}
ENV VITE_WEBSOCKET_URL=${VITE_WEBSOCKET_URL}

# Set working directory and install dependencies
WORKDIR /app
COPY package.json . 

RUN npm install && npm install vite && npm cache clean -f

# Copy the rest of the project files and run build
COPY . .
RUN npm run build

# Stage 2 - Serve the built application
FROM node:24-alpine as stage2
WORKDIR /app

# Install serve globally for serving the app
RUN npm install -g serve

# Copy the build output from stage1
COPY --from=stage1 /app/dist .

# Use serve to host the app on port 3000
ENTRYPOINT ["serve", "-s", "-n", "-d", ".", "-p", "3000"]