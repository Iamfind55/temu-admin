# Use official Node.js image as base
FROM node:18-alpine

# Set the working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy only required files
COPY public public
COPY package.json package.json
COPY . .

# Build the production bundle
RUN npm run build

# Expose the correct port
EXPOSE 7000

# Start Next.js in production mode
CMD ["npm", "start"]
