import { render, screen } from '@testing-library/react';
import App from './App';

test('renders New Note button', () => {
  render(<App />);
  const button = screen.getByText(/New Note/i);
  expect(button).toBeInTheDocument();
});
