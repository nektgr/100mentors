#!/bin/bash

echo "Preparing for minimal frontend test run..."

# Navigate to the frontend project
cd microblog-front

# Create directories if they don't exist
mkdir -p tests/mocks

# Create the Button symlink to fix case sensitivity issues
echo "Fixing Button component case sensitivity issue..."
if [ ! -f ./components/ui/button.tsx ]; then
  echo "export { Button } from './Button';" > ./components/ui/button.tsx
fi

# Create a very basic test to verify jest setup
cat > ./tests/components/basic.test.tsx << 'EOL'
import React from 'react';
import { render, screen } from '@testing-library/react';

describe('Basic test', () => {
  test('should render without crashing', () => {
    render(<div data-testid="test">Hello World</div>);
    expect(screen.getByTestId('test')).toBeInTheDocument();
    expect(screen.getByText('Hello World')).toBeInTheDocument();
  });
});
EOL

# Run just the basic test to verify setup
echo "Running basic test to verify setup..."
npx jest tests/components/basic.test.tsx

echo "If the test above passed, your Jest setup is working correctly!"
echo "You can now start adding real tests incrementally."
