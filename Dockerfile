### Use the official Node.js image from the Docker Hub####
FROM node:20

# Create and change to the app directory
WORKDIR  /usr/src/app

# Copy package.json and package-lock.json (if available) to the app directory
COPY users/package*.json ./

# Install the app dependencies
RUN npm install

# Copy the rest of the application code to the app directory
COPY users/. .

# Expose the port on which the app will run
EXPOSE 3000

# Start the Node.js application
CMD ["node", "src/app.js"]


