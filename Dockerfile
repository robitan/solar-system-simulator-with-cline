# Use Node.js LTS version
FROM node:20-slim

# Create app directory
WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Create directories for Three.js files
RUN mkdir -p public/js/lib/three

# Copy necessary Three.js files
RUN cp node_modules/three/build/three.module.js public/js/lib/three/ && \
    mkdir -p public/js/lib/three/examples/jsm/controls && \
    cp node_modules/three/examples/jsm/controls/OrbitControls.js public/js/lib/three/examples/jsm/controls/

# Expose port
EXPOSE 3000

# Start the application
CMD [ "npm", "start" ]
