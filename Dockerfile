# Use Python 3.7-slim as the base image
FROM python:3.7-slim

# Install Node.js, npm, yarn, and required build tools
RUN apt-get update && apt-get install -y \
    curl \
    gnupg \
    lsb-release \
    build-essential \
    libffi-dev \
    libssl-dev \
    && curl -sL https://deb.nodesource.com/setup_16.x | bash - \
    && apt-get install -y nodejs \
    && npm install -g yarn --unsafe-perm \
    && apt-get clean

# Install Python dependencies (e.g., BeautifulSoup)
RUN pip3 install --no-cache-dir beautifulsoup4

# Set the working directory for your application
WORKDIR /usr/src/app

# Copy package.json and yarn.lock
COPY package.json yarn.lock ./

# Install Node.js dependencies
RUN yarn install --production

# Copy the rest of the application files
COPY . .

# Set environment variables
ENV NODE_ENV=production

# Set the default command to start your application
CMD ["yarn", "start"]
