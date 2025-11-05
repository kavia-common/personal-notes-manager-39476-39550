import { render, screen } from '@testing-library/react';
import App from './App';

test('renders top bar new note button', () => {
  render(<App />);
  const btn = screen.getByText(/New Note/i);
  expect(btn).toBeInTheDocument();
});
