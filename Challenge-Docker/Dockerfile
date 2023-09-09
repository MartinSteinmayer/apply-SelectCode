# Use the official Deno image as the base image
FROM denoland/deno:latest

# Set the working directory in the Docker container
WORKDIR /app

# Copy the server.ts file from your host to your current location (in the Docker container)
COPY src/server.ts .

# Expose the port on which the server runs
EXPOSE 8000

# Command to run the Deno server
CMD ["deno", "run", "--allow-net", "--allow-write", "server.ts"]
