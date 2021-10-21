import React from 'react';
import { render, screen } from '@testing-library/react';
import CanvasBase from './Canvas';

// ##TODO need a custom render that adds all providers for ease of testing

test('renders required parts', () => {
    render(<CanvasBase />);
    screen.getByRole('application');
});
