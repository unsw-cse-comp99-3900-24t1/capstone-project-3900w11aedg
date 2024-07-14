# Use the official Node.js image as a base
FROM node:18

# Create and change to the app directory
WORKDIR /usr/src/did

# Copy package.json and package-lock.json
COPY did/package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY did .

# Compile TypeScript to JavaScript
RUN npm run build

# Expose the port the app runs on
EXPOSE 5000

#HEALTHCHECK --interval=30s --timeout=10s --start-period=30s \
#  CMD curl -f http://localhost:5000/ || exit 1

# Start the app
CMD ["npm", "start"]
