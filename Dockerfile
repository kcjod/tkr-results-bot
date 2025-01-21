# Use Python 3.7-slim as the base image
FROM python:3.7-slim

# Install Node.js (and npm) and other required packages
RUN apt-get update && apt-get install -y \
    curl \
    gnupg \
    lsb-release \
    && curl -sL https://deb.nodesource.com/setup_16.x | bash - \
    && apt-get install -y nodejs \
    && apt-get install -y python3-pip

# Install Python dependencies (e.g., BeautifulSoup)
RUN pip3 install beautifulsoup4

# Set the working directory for your application
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (if available) for Node.js dependencies
COPY package.json ./

# Install Node.js dependencies
RUN yarn install

# Copy the rest of the application files
COPY . .

# Set the default command to start your Node.js application
CMD ["yarn", "start"]