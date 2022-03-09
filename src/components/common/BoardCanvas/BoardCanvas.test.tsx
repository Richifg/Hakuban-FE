import React from 'react';
import { render, screen } from '@testing-library/react';
import BoardCanvas from './BoardCanvas';

// ##TODO need a custom render that adds all providers for ease of testing

test('renders required parts', () => {
    render(<BoardCanvas />);
    screen.getByRole('application');
});
