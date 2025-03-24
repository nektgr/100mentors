#!/bin/bash

echo "Running basic test to verify Jest setup..."

# Ensure mocks directory exists
mkdir -p ./tests/mocks

# Create a very simple test
cat > ./tests/components/basic.test.tsx << 'EOF'
import React from 'react';
import { render, screen } from '@testing-library/react';

describe('Basic Test', () => {
  test('renders without issues', () => {
    render(<div>Hello World</div>);
    expect(screen.getByText('Hello World')).toBeInTheDocument();
  });
});
EOF

# Run just this test to verify
npx jest tests/components/basic.test.tsx

echo "If the test passed, the Jest configuration is working correctly!"
