#!/bin/bash

echo "Fixing Button component case sensitivity issues for tests..."

# Create a symlink to ensure Button.tsx is accessible via button.tsx
cd ./microblog-front/components/ui/
ln -sfn Button.tsx button.tsx

echo "Creating mock file to handle imports consistently"
cat > ./microblog-front/tests/mocks/button-mock.tsx << 'EOL'
// This file handles the case sensitivity issue in imports
import { Button } from '../../components/ui/Button';

export { Button };
EOL

echo "✅ Button component case sensitivity issues fixed for tests!"
