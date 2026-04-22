import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Navbar from '../components/Navbar';
import '@testing-library/jest-dom';

describe('Navbar Component Unit Tests', () => {
  test('UT-19 | Navbar: Logo Rendering (Unit test of UI)', () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );
    
    expect(screen.getByText(/Printify/i)).toBeInTheDocument();
  });

  test('UT-20 | Navbar: Auth UI Toggle (Verifies Login button when logged out)', () => {
    localStorage.clear();
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );
    
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });
});
