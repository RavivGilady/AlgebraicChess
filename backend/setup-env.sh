#!/bin/bash

ENV_FILE="./.env"

# Check if .env already exists
if [ -f "$ENV_FILE" ]; then
  echo ".env already exists. Aborting to prevent overwriting."
  exit 1
fi

# Create .env with default values
cat <<EOL > $ENV_FILE
# API base URL for backend connection
REACT_APP_API_BASE_URL=http://localhost:5000
EOL

echo ".env created with default values."
