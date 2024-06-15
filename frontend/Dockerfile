# Use the official Node.js image as a base
FROM node:14

# Create and change to the app directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Compile TypeScript to JavaScript
RUN npm run build

# Expose the port for the Metro Bundler
EXPOSE 8081

# Start the Metro Bundler
CMD ["npm", "start"]
