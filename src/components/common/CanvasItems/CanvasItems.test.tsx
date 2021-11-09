import React from 'react';
import { render, screen } from '@testing-library/react';
import CanvasItems from './CanvasItems';

// ##TODO need a custom render that adds all providers for ease of testing

test('renders required parts', () => {
    render(<CanvasItems />);
    screen.getByRole('application');
});
