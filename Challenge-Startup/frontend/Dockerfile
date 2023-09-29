# Build stage
FROM node:18 AS build

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

# Run stage
FROM nginx:alpine

# Copy the Vite build from the build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Custom nginx configuration for SPA routing:
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
