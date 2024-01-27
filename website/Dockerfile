# Use an official Node.js runtime as a base image
FROM node:18

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY . .

RUN apt-get update && apt install -y protobuf-compiler 

# Install the application dependencies
RUN npm install && npm install --global http-server protoc-gen-grpc-web protoc-gen-js && ls -a && npm run generate:protoc && npm run build

# Copy the application files to the working directory
COPY . .

EXPOSE 8081

# Define the command to run your application
CMD ["npx", "http-server", "-p 8081"]
