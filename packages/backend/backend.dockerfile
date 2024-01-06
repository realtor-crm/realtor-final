# Use the official Node.js runtime as the base image
FROM node:latest

# Copy package.json and package-lock.json to the working directory
COPY package.json package-lock.json ./

# Install project dependencies
RUN npm install

# Copy the rest of the project files to the working directory
COPY . .

# Expose port 3000 for the application
EXPOSE 3000

# Start the application in development mode
CMD ["npm", "run", "start:dev"]