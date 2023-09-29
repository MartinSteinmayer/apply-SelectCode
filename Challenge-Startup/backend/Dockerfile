# Use an official Node.js runtime as the base image
FROM node:18

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json .

# Install dependencies in the container
RUN npm install

# Copy the rest of the application to the container
COPY . .

# Specify the command to run the application
CMD ["npm", "run", "start:prod"]
