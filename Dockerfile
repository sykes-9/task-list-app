# Start with Node.js 20 already installed
FROM node:20-alpine

# Create a folder for our app inside the container
WORKDIR /app

# Copy package.json first
COPY package.json .

# Install dependencies
RUN npm install

# Copy the rest of our code
COPY . .

# Tell Docker our app runs on port 3000
EXPOSE 3000

# Start the app
CMD ["npm", "start"]