#!/bin/bash
echo "Stopping existing application..."

# Find the process running on port 80 (or the relevant port)
# APP_PID=$(sudo lsof -t -i:80)
APP_PID=$(lsof -t -i:5002)

echo "Application PID: $APP_PID"

# Stop the process if it exists
if [ -n "$APP_PID" ]; then
    echo "Stopping process $APP_PID"
    sudo kill -9 "$APP_PID"
else
    echo "No process found running on port 5002"
fi

echo "Application stopped."