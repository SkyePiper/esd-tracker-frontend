import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import {NavBar} from "@/common/components/navBar";

// Mock constants
jest.mock("@/common/constants/css", () => ({
    Css: {
        NAV_BAR: {
            NAV_BAR_DIV: "navBarDiv",
            NAV_BAR_ITEM: "navBarItem",
            NAV_BAR_ITEM_SEPARATOR: "separator",
            USER_ACCOUNT: "userAccount",
            LOGOUT_BUTTON: "logoutButton",
        },
    },
}));

jest.mock("@/common/constants/button_types", () => ({
    ButtonTypes: {
        BUTTON: "button",
        Button: "button",
    },
}));

// Mock Button component
jest.mock("@/common/components/buttons", () => ({
    Button: ({ children, onClick, name, className }) => (
        <button
            data-testid={name}
            className={className}
            onClick={onClick}
        >
            {children}
        </button>
    ),
}));

// next/navigation isn't used, but imported by component
jest.mock("next/navigation", () => ({
    useRouter: jest.fn(),
}));

describe("NavBar", () => {
    const validPermissions = {
        Administer: 1,
        "Get Training Session": 2,
        "Get User": 4,
    };

    let onSetPage;
    let onLogout;

    beforeEach(() => {
        onSetPage = jest.fn();
        onLogout = jest.fn();
    });

    test("renders nothing if user is null", () => {
        const { container } = render(
            <NavBar
                user={null}
                validPermissions={validPermissions}
                onSetPage={onSetPage}
                onLogout={onLogout}
            />
        );

        expect(container.firstChild).toBeNull();
    });

    test("renders nothing if user.permissions is missing", () => {
        const { container } = render(
            <NavBar
                user={{ name: "John" }}
                validPermissions={validPermissions}
                onSetPage={onSetPage}
                onLogout={onLogout}
            />
        );

        expect(container.firstChild).toBeNull();
    });

    test("shows Training Sessions when user has Get Training Session permission", () => {
        render(
            <NavBar
                user={{
                    name: "John",
                    permissions: validPermissions["Get Training Session"],
                }}
                validPermissions={validPermissions}
                onSetPage={onSetPage}
                onLogout={onLogout}
            />
        );

        expect(screen.getByText("Training Sessions")).toBeInTheDocument();
    });

    test("does not show Training Sessions without permission", () => {
        render(
            <NavBar
                user={{
                    name: "John",
                    permissions: validPermissions["Get User"],
                }}
                validPermissions={validPermissions}
                onSetPage={onSetPage}
                onLogout={onLogout}
            />
        );

        expect(
            screen.queryByText("Training Sessions")
        ).not.toBeInTheDocument();
    });

    test("shows Users when user has Get User permission", () => {
        render(
            <NavBar
                user={{
                    name: "John",
                    permissions: validPermissions["Get User"],
                }}
                validPermissions={validPermissions}
                onSetPage={onSetPage}
                onLogout={onLogout}
            />
        );

        expect(screen.getByText("Users")).toBeInTheDocument();
    });

    test("does not show Users without permission", () => {
        render(
            <NavBar
                user={{
                    name: "John",
                    permissions: validPermissions["Get Training Session"],
                }}
                validPermissions={validPermissions}
                onSetPage={onSetPage}
                onLogout={onLogout}
            />
        );

        expect(screen.queryByText("Users")).not.toBeInTheDocument();
    });

    test("admin permission shows all navigation items", () => {
        render(
            <NavBar
                user={{
                    name: "Admin",
                    permissions: validPermissions.Administer,
                }}
                validPermissions={validPermissions}
                onSetPage={onSetPage}
                onLogout={onLogout}
            />
        );

        expect(screen.getByText("Home")).toBeInTheDocument();
        expect(screen.getByText("Training Sessions")).toBeInTheDocument();
        expect(screen.getByText("Users")).toBeInTheDocument();
    });

    test("clicking Home calls onSetPage", () => {
        render(
            <NavBar
                user={{ name: "John", permissions: 1 }}
                validPermissions={validPermissions}
                onSetPage={onSetPage}
                onLogout={onLogout}
            />
        );

        fireEvent.click(screen.getByTestId("navBarItemHome"));

        expect(onSetPage).toHaveBeenCalledWith("home");
    });

    test("clicking Training Sessions calls onSetPage", () => {
        render(
            <NavBar
                user={{
                    name: "John",
                    permissions: validPermissions["Get Training Session"],
                }}
                validPermissions={validPermissions}
                onSetPage={onSetPage}
                onLogout={onLogout}
            />
        );

        fireEvent.click(screen.getByTestId("navBarItemTraining Sessions"));

        expect(onSetPage).toHaveBeenCalledWith("training_sessions");
    });

    test("clicking Users calls onSetPage", () => {
        render(
            <NavBar
                user={{
                    name: "John",
                    permissions: validPermissions["Get User"],
                }}
                validPermissions={validPermissions}
                onSetPage={onSetPage}
                onLogout={onLogout}
            />
        );

        fireEvent.click(screen.getByTestId("navBarItemUsers"));

        expect(onSetPage).toHaveBeenCalledWith("users");
    });

    test("clicking Logout calls onLogout", () => {
        render(
            <NavBar
                user={{ name: "John", permissions: 1 }}
                validPermissions={validPermissions}
                onSetPage={onSetPage}
                onLogout={onLogout}
            />
        );

        fireEvent.click(screen.getByTestId("logoutButton"));

        expect(onLogout).toHaveBeenCalledTimes(1);
    });

    test("renders user name", () => {
        render(
            <NavBar
                user={{ name: "Jane Doe", permissions: 1 }}
                validPermissions={validPermissions}
                onSetPage={onSetPage}
                onLogout={onLogout}
            />
        );

        expect(screen.getByText("Jane Doe")).toBeInTheDocument();
    });

    test('renders "Unknown User" when name is missing', () => {
        render(
            <NavBar
                user={{ permissions: 1 }}
                validPermissions={validPermissions}
                onSetPage={onSetPage}
                onLogout={onLogout}
            />
        );

        expect(screen.getByText("Unknown User")).toBeInTheDocument();
    });
});