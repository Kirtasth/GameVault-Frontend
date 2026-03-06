# Stage 1: Build the Angular application
FROM node:22 AS build

WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the application code
COPY . .

# Build the application for production
ARG CONFIGURATION=pre
RUN npm run build -- --configuration $CONFIGURATION

# Stage 2: Serve the application with Nginx
FROM nginx

# Copy the build output to Nginx's html directory
# The output path is based on the project name in angular.json (GameVault-Frontend)
# and the application builder structure (/browser)
COPY --from=build /app/dist/GameVault-Frontend/browser /usr/share/nginx/html

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
