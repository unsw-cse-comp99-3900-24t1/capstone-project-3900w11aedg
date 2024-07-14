# Use the official Node.js image as a base
FROM node:18

# Set the working directory inside the container
WORKDIR /usr/src/cli

# Copy package.json and package-lock.json from the issuer directory
COPY cli/package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the issuer application code
COPY cli .

# Copy the lib directory to the container
COPY lib /usr/src/lib

# Set NODE_PATH to include the lib directory
# ENV NODE_PATH=/usr/src/lib

# Compile TypeScript to JavaScript
RUN npm run build
