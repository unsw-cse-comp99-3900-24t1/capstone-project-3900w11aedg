# Use the official Node.js image as a base
FROM node:18

# Set the working directory inside the container
WORKDIR /usr/src/backend

# Copy package.json and package-lock.json from the issuer directory
COPY backend/package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the issuer application code
COPY backend .

# Copy the lib directory to the container
COPY lib /usr/src/lib

# Set NODE_PATH to include the lib directory
# ENV NODE_PATH=/usr/src/lib

# Compile TypeScript to JavaScript
RUN npm run build

# Expose the port the app runs on
EXPOSE 3000

# Health check (optional)
#HEALTHCHECK --interval=30s --timeout=10s --start-period=30s \
#  CMD curl -f http://localhost:3000/ || exit 1

# Start the app
CMD ["npm", "start"]
