# Stage 1: Build the application
FROM node:12 as builder
WORKDIR /app
COPY . /app

# Install dependencies and build the application
RUN npm install
RUN npm build

# Stage 2: Serve the built files
FROM nginx:bookworm
COPY --from=builder /app/dist /usr/share/nginx/html

# Optionally, you can add a custom nginx config if needed
# COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
