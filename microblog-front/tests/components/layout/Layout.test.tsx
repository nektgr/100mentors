import { render, screen } from '@testing-library/react';
import { Layout } from '../../../components/layout/Layout';

// Mock the Header component
jest.mock('../../../components/layout/Header', () => ({
  Header: () => <header data-testid="mock-header">Mock Header</header>
}));

describe('Layout Component', () => {
  test('renders children content', () => {
    render(
      <Layout>
        <div data-testid="test-content">Test Content</div>
      </Layout>
    );
    
    expect(screen.getByTestId('test-content')).toBeInTheDocument();
  });
});
