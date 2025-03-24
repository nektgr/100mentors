import React from 'react';
import { render, screen } from '@testing-library/react';

describe('Basic Test', () => {
  test('renders without issues', () => {
    render(<div>Hello World</div>);
    expect(screen.getByText('Hello World')).toBeInTheDocument();
  });
});
