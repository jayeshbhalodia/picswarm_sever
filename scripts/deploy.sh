#!/bin/bash

set -e  # Exit on error
set -x  # Debug mode for detailed logs

# Set the working directory
PROJECT_DIR="/var/www/picswarm_sever"
cd "$PROJECT_DIR" || { echo "Directory $PROJECT_DIR not found!"; exit 1; }

# Install dependencies if package.json exists
if [ -f "package.json" ]; then
    npm install
else
    echo "No package.json found, skipping npm install."
fi