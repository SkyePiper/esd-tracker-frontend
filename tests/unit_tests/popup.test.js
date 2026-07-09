// Popup.test.jsx

import { render, screen, fireEvent } from '@testing-library/react';
import Popup from "@/common/components/popup";

// Mock next/form to behave like a normal form
jest.mock('next/form', () => {
    return ({ children, ...props }) => (
        <form {...props}>{children}</form>
    );
});

// Mock constants
jest.mock('@/common/constants/css', () => ({
    Css: {
        Popup: {
            POPUP_DIV: 'popup-div',
            POPUP_BACKGROUND: 'popup-background',
            CLOSE_POPUP: 'close-popup',
            POPUP_TITLE: 'popup-title',
            POPUP_DESCRIPTION: 'popup-description',
        },
    },
}));

jest.mock('@/common/constants/button_types', () => ({
    ButtonTypes: {
        BUTTON: 'button',
    },
}));

// Mock Button component
jest.mock('@/common/components/buttons', () => ({
    Button: ({ children, ...props }) => (
        <button {...props}>
            {children}
        </button>
    ),
}));

describe('Popup', () => {
    const defaultProps = {
        title: 'Test Title',
        description: 'Test Description',
        onSubmit: jest.fn((e) => e.preventDefault()),
        onClose: jest.fn(),
        children: <div>Popup Content</div>,
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders the title', () => {
        render(<Popup {...defaultProps} />);

        expect(screen.getByText('Test Title')).toBeInTheDocument();
    });

    it('renders the description', () => {
        render(<Popup {...defaultProps} />);

        expect(screen.getByText('Test Description')).toBeInTheDocument();
    });

    it('renders its children', () => {
        render(<Popup {...defaultProps} />);

        expect(screen.getByText('Popup Content')).toBeInTheDocument();
    });

    it('renders the close button by default', () => {
        render(<Popup {...defaultProps} />);

        expect(screen.getByRole('button', { name: 'X' })).toBeInTheDocument();
    });

    it('does not render the close button when disableClose is true', () => {
        render(
            <Popup
                {...defaultProps}
                disableClose={true}
            />
        );

        expect(
            screen.queryByRole('button', { name: 'X' })
        ).not.toBeInTheDocument();
    });

    it('calls onClose when the close button is clicked', () => {
        render(<Popup {...defaultProps} />);

        fireEvent.click(screen.getByRole('button', { name: 'X' }));

        expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
    });

    it('calls onSubmit when the form is submitted', () => {
        const { container } = render(<Popup {...defaultProps} />);

        fireEvent.submit(container.querySelector('form'));

        expect(defaultProps.onSubmit).toHaveBeenCalledTimes(1);
    });

    it('renders without a description', () => {
        render(
            <Popup
                {...defaultProps}
                description={undefined}
            />
        );

        expect(screen.getByText('Test Title')).toBeInTheDocument();
        expect(screen.getByText('Popup Content')).toBeInTheDocument();
    });
});