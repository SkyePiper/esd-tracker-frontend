import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";

import { EntryType } from "@/common/constants/entry_types";
import {CheckboxEntry, DateEntry, EmailEntry, PasswordEntry, TextEntry} from "@/common/components/entries";

jest.mock("@fortawesome/react-fontawesome", () => ({
    FontAwesomeIcon: ({ icon, onClick }) => (
        <svg
            data-testid={`icon-${icon.iconName}`}
            onClick={onClick}
        />
    ),
}));

describe("TextEntry", () => {
    const onChange = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("renders correctly", () => {
        render(
            <TextEntry
                name="username"
                className="input"
                placeholder="Username"
                text="John"
                labelText="Username"
                onChange={onChange}
            />
        );

        expect(screen.getByText("Username")).toBeInTheDocument();

        const input = screen.getByDisplayValue("John");

        expect(input).toHaveAttribute("type", EntryType.TEXT);
        expect(input).toHaveAttribute("placeholder", "Username");
        expect(input).toHaveAttribute("name", "username");
    });

    test("calls onChange", () => {
        render(
            <TextEntry
                name="username"
                className="input"
                placeholder="Username"
                labelText="Username"
                onChange={onChange}
            />
        );

        fireEvent.change(screen.getByRole("textbox"), {
            target: { value: "New Value" },
        });

        expect(onChange).toHaveBeenCalledTimes(1);
    });

    test("supports readonly and disabled", () => {
        render(
            <TextEntry
                name="username"
                className="input"
                placeholder="Username"
                labelText="Username"
                readOnly
                disabled
                onChange={onChange}
            />
        );

        const input = screen.getByRole("textbox");

        expect(input).toBeDisabled();
        expect(input).toHaveAttribute("readonly");
    });

    test("shows required icon", () => {
        render(
            <TextEntry
                name="username"
                className="input"
                placeholder="Username"
                labelText="Username"
                required
                onChange={onChange}
            />
        );

        expect(screen.getByTestId("icon-star-of-life")).toBeInTheDocument();
    });
});

describe("EmailEntry", () => {
    test("renders email input", () => {
        render(
            <EmailEntry
                name="email"
                className="input"
                placeholder="Email"
                text="test@test.com"
                labelText="Email"
                onChange={jest.fn()}
            />
        );

        const input = screen.getByDisplayValue("test@test.com");

        expect(input).toHaveAttribute("type", EntryType.EMAIL);
    });
});

describe("PasswordEntry", () => {
    test("defaults to hidden password after effect", () => {
        render(
            <PasswordEntry
                name="password"
                className="input"
                placeholder="Password"
                labelText="Password"
                onChange={jest.fn()}
            />
        );

        const input = screen.getByDisplayValue("");

        expect(input).toHaveAttribute("type", EntryType.PASSWORD);
    });

    test("toggles password visibility", () => {
        render(
            <PasswordEntry
                name="password"
                className="input"
                placeholder="Password"
                labelText="Password"
                onChange={jest.fn()}
            />
        );

        const input = screen.getByDisplayValue("");

        expect(input).toHaveAttribute("type", EntryType.PASSWORD);

        fireEvent.click(screen.getByTestId("icon-eye"));

        expect(input).toHaveAttribute("type", EntryType.TEXT);

        fireEvent.click(screen.getByTestId("icon-eye-slash"));

        expect(input).toHaveAttribute("type", EntryType.PASSWORD);
    });
});

describe("CheckboxEntry", () => {
    test("renders checked checkbox", () => {
        render(
            <CheckboxEntry
                name="terms"
                className="checkbox"
                labelText="Accept Terms"
                checked
                onChange={jest.fn()}
            />
        );

        const checkbox = screen.getByRole("checkbox");

        expect(checkbox).toBeChecked();
    });

    test("calls onChange", () => {
        const onChange = jest.fn();

        render(
            <CheckboxEntry
                name="terms"
                className="checkbox"
                labelText="Accept Terms"
                onChange={onChange}
            />
        );

        fireEvent.click(screen.getByRole("checkbox"));

        expect(onChange).toHaveBeenCalled();
    });

    test("supports disabled", () => {
        render(
            <CheckboxEntry
                name="terms"
                className="checkbox"
                labelText="Accept Terms"
                disabled
                onChange={jest.fn()}
            />
        );

        expect(screen.getByRole("checkbox")).toBeDisabled();
    });
});

describe("DateEntry", () => {
    test("renders datetime-local input", () => {
        render(
            <DateEntry
                name="date"
                className="date"
                labelText="Appointment"
                defaultValue="2025-01-01T12:00"
                onChange={jest.fn()}
            />
        );

        const input = screen.getByDisplayValue("2025-01-01T12:00");

        expect(input).toHaveAttribute(
            "type",
            EntryType.DATETIME_LOCAL
        );
    });

    test("supports required", () => {
        render(
            <DateEntry
                name="date"
                className="date"
                labelText="Appointment"
                defaultValue=""
                required
                onChange={jest.fn()}
            />
        );

        expect(screen.getByTestId("icon-star-of-life")).toBeInTheDocument();
    });
});