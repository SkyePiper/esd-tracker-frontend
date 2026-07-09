import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";

import { ButtonTypes } from "@/common/constants/button_types";
import { Css } from "@/common/constants/css";
import {Button, LoadingButton} from "@/common/components/buttons";

// Mock FontAwesome so we don't depend on SVG implementation
jest.mock("@fortawesome/react-fontawesome", () => ({
    FontAwesomeIcon: ({ className }) => (
        <svg data-testid="spinner-icon" className={className} />
    ),
}));

describe("Button", () => {
    const defaultProps = {
        name: "test-button",
        type: "button",
        className: "btn-primary",
    };

    it("renders children", () => {
        render(
            <Button {...defaultProps}>
                Click Me
            </Button>
        );

        expect(
            screen.getByRole("button", { name: "Click Me" })
        ).toBeInTheDocument();
    });

    it("sets button attributes correctly", () => {
        render(
            <Button {...defaultProps}>
                Button
            </Button>
        );

        const button = screen.getByRole("button");

        expect(button).toHaveAttribute("name", "test-button");
        expect(button).toHaveAttribute("type", "button");
        expect(button).toHaveClass("btn-primary");
        expect(button).not.toBeDisabled();
    });

    it("calls onClick when clicked", () => {
        const handleClick = jest.fn();

        render(
            <Button {...defaultProps} onClick={handleClick}>
                Click
            </Button>
        );

        fireEvent.click(screen.getByRole("button"));

        expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it("is disabled when disabled prop is true", () => {
        render(
            <Button {...defaultProps} disabled>
                Disabled
            </Button>
        );

        expect(screen.getByRole("button")).toBeDisabled();
    });
});

describe("LoadingButton", () => {
    const defaultProps = {
        name: "submit",
        text: "Submit",
        loading: false,
    };

    it("renders button text when not loading", () => {
        render(<LoadingButton {...defaultProps} />);

        expect(screen.getByRole("button")).toHaveTextContent("Submit");
        expect(screen.queryByTestId("spinner-icon")).not.toBeInTheDocument();
    });

    it("renders spinner when loading", () => {
        render(
            <LoadingButton
                {...defaultProps}
                loading={true}
            />
        );

        expect(screen.getByTestId("spinner-icon")).toBeInTheDocument();
        expect(screen.getByRole("button")).not.toHaveTextContent("Submit");
    });

    it("uses loading CSS class when loading", () => {
        render(
            <LoadingButton
                {...defaultProps}
                loading={true}
            />
        );

        expect(screen.getByRole("button")).toHaveClass(
            Css.Buttons.SUBMIT_BUTTON_LOADING
        );
    });

    it("uses normal CSS class when not loading", () => {
        render(<LoadingButton {...defaultProps} />);

        expect(screen.getByRole("button")).toHaveClass(
            Css.Buttons.SUBMIT_BUTTON
        );
    });

    it("uses submit type", () => {
        render(<LoadingButton {...defaultProps} />);

        expect(screen.getByRole("button")).toHaveAttribute(
            "type",
            ButtonTypes.SUBMIT
        );
    });

    it("is disabled when loading", () => {
        render(
            <LoadingButton
                {...defaultProps}
                loading={true}
            />
        );

        expect(screen.getByRole("button")).toBeDisabled();
    });

    it("is disabled when disabled prop is true", () => {
        render(
            <LoadingButton
                {...defaultProps}
                disabled={true}
            />
        );

        expect(screen.getByRole("button")).toBeDisabled();
    });

    it("is enabled when not loading and not disabled", () => {
        render(<LoadingButton {...defaultProps} />);

        expect(screen.getByRole("button")).toBeEnabled();
    });

    it("applies spinner CSS class", () => {
        render(
            <LoadingButton
                {...defaultProps}
                loading={true}
            />
        );

        expect(screen.getByTestId("spinner-icon")).toHaveClass(
            Css.Buttons.SUBMIT_BUTTON_LOADING_ICON
        );
    });
});