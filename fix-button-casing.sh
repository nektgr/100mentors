#!/bin/bash

echo "Fixing Button component case sensitivity issues..."

# 1. First, make sure we don't have a lowercase button.tsx in the Docker container
docker-compose exec frontend sh -c "if [ -f /app/components/ui/button.tsx ]; then rm /app/components/ui/button.tsx; fi"

# 2. Update all imports to use the correct capitalization 
echo "Updating imports in files..."

# Header.tsx
docker-compose exec frontend sh -c "sed -i 's/from '\''..\/ui\/button'\''/from '\''..\/ui\/Button'\''/g' /app/components/layout/Header.tsx"

# CreatePostForm.tsx
docker-compose exec frontend sh -c "sed -i 's/from '\''..\/ui\/button'\''/from '\''..\/ui\/Button'\''/g' /app/components/posts/CreatePostForm.tsx"

# PostItem.tsx
docker-compose exec frontend sh -c "sed -i 's/from '\''..\/ui\/button'\''/from '\''..\/ui\/Button'\''/g' /app/components/posts/PostItem.tsx"

# PostsList.tsx
docker-compose exec frontend sh -c "sed -i 's/from '\''..\/ui\/button'\''/from '\''..\/ui\/Button'\''/g' /app/components/posts/PostsList.tsx"

# Login page
docker-compose exec frontend sh -c "sed -i 's/from '\''..\/components\/ui\/button'\''/from '\''..\/components\/ui\/Button'\''/g' /app/pages/login.tsx"

# 3. Restart the frontend service to apply the changes
echo "Restarting frontend container..."
docker-compose restart frontend

echo "✅ Button component case sensitivity issues fixed!"
echo "The frontend is restarting and should work correctly now."
