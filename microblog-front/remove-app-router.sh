#!/bin/bash
echo "Checking for app directory..."
if [ -d "./app" ]; then
  echo "App directory found, removing conflicting app/page.tsx file"
  rm -f ./app/page.tsx
  
  # If the app directory is empty after removing page.tsx, remove it as well
  if [ -z "$(ls -A ./app)" ]; then
    echo "App directory is empty, removing it"
    rm -rf ./app
  fi
else
  echo "No app directory found, no action needed"
fi

echo "Done!"
