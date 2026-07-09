import React, { useState } from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { LoginRequest } from "@/common/requests";

jest.mock("universal-cookie", () => {
    const set = jest.fn();

    return jest.fn(() => ({
        set,
    }));
});

import Cookies from "universal-cookie";

const mockSet = new Cookies().set;

import { LoginPopup } from "@/app/login";

jest.mock("@/common/requests", () => ({
    LoginRequest: jest.fn(),
}));

jest.mock("@/common/components/popup", () => ({
    __esModule: true,
    default: ({ title, description, onSubmit, children }) => (
        <form aria-label="login-form" onSubmit={onSubmit}>
            <h1>{title}</h1>
            <p>{description}</p>
            {children}
        </form>
    ),
}));

jest.mock("@/common/components/entries", () => {
    const React = require("react");

    return {
        EmailEntry: ({ onChange }) => {
            const [value, setValue] = React.useState("");

            return (
                <input
                    data-testid="email"
                    type="email"
                    value={value}
                    onChange={(e) => {
                        setValue(e.target.value);
                        onChange(e);
                    }}
                />
            );
        },

        PasswordEntry: ({ onChange }) => {
            const [value, setValue] = React.useState("");

            return (
                <input
                    data-testid="password"
                    type="password"
                    value={value}
                    onChange={(e) => {
                        setValue(e.target.value);
                        onChange(e);
                    }}
                />
            );
        },
    };
});

jest.mock("@/common/components/buttons", () => ({
    LoadingButton: ({ loading }) => (
        <button type="submit">
            {loading ? "Loading..." : "Login!"}
        </button>
    ),
}));

describe("LoginPopup", () => {
    const setUserData = jest.fn();
    const setErrorMessage = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    function renderComponent() {
        render(
            <LoginPopup
                setUserData={setUserData}
                setErrorMessage={setErrorMessage}
            />
        );
    }

    it("renders correctly", () => {
        renderComponent();

        expect(screen.getByText("Login")).toBeInTheDocument();
        expect(
            screen.getByText("Please login to continue")
        ).toBeInTheDocument();

        expect(screen.getByTestId("email")).toBeInTheDocument();
        expect(screen.getByTestId("password")).toBeInTheDocument();
        expect(screen.getByRole("button")).toHaveTextContent("Login!");
    });

    it("updates email and password", () => {
        renderComponent();

        fireEvent.change(screen.getByTestId("email"), {
            target: { value: "test@test.com" },
        });

        fireEvent.change(screen.getByTestId("password"), {
            target: { value: "secret" },
        });

        expect(screen.getByTestId("email")).toHaveValue("test@test.com");
        expect(screen.getByTestId("password")).toHaveValue("secret");
    });

    it("logs in successfully", async () => {
        LoginRequest.mockResolvedValue({
            access_token: "token123",
            data: {
                user_id: 1,
                user_forename: "John",
                user_surname: "Smith",
                user_email: "john@test.com",
                permissions: ["Admin"],
                expires: 1000,
            },
        });

        renderComponent();

        fireEvent.change(screen.getByTestId("email"), {
            target: { value: "john@test.com" },
        });

        fireEvent.change(screen.getByTestId("password"), {
            target: { value: "password" },
        });

        fireEvent.submit(screen.getByLabelText("login-form"));

        await waitFor(() =>
            expect(LoginRequest).toHaveBeenCalledWith(
                "john@test.com",
                "password"
            )
        );

        expect(mockSet).toHaveBeenCalledWith(
            "session_x",
            "token123",
            {
                path: "/",
                maxAge: 3600,
                sameSite: "lax",
            }
        );

        expect(setUserData).toHaveBeenCalledWith(
            1,
            "John",
            "Smith",
            "john@test.com",
            ["Admin"],
            1000
        );

        expect(setErrorMessage).toHaveBeenCalledWith("");
    });

    it("shows backend error message", async () => {
        LoginRequest.mockResolvedValue({
            message: "Invalid credentials",
        });

        renderComponent();

        fireEvent.submit(screen.getByLabelText("login-form"));

        await waitFor(() =>
            expect(setErrorMessage).toHaveBeenCalledWith(
                "Invalid credentials"
            )
        );

        expect(setUserData).not.toHaveBeenCalled();
        expect(mockSet).not.toHaveBeenCalled();
    });

    it("shows generic error for unexpected response", async () => {
        LoginRequest.mockResolvedValue({});

        renderComponent();

        fireEvent.submit(screen.getByLabelText("login-form"));

        await waitFor(() =>
            expect(setErrorMessage).toHaveBeenCalledWith(
                "Unable to log in"
            )
        );
    });

    it("shows generic error when LoginRequest returns null", async () => {
        LoginRequest.mockResolvedValue(null);

        renderComponent();

        fireEvent.submit(screen.getByLabelText("login-form"));

        await waitFor(() =>
            expect(setErrorMessage).toHaveBeenCalledWith(
                "Unable to log in"
            )
        );
    });

    it("shows loading state while request is pending", async () => {
        let resolveRequest;

        LoginRequest.mockImplementation(
            () =>
                new Promise((resolve) => {
                    resolveRequest = resolve;
                })
        );

        renderComponent();

        fireEvent.submit(screen.getByLabelText("login-form"));

        expect(
            screen.getByRole("button")
        ).toHaveTextContent("Loading...");

        resolveRequest({ message: "done" });

        await waitFor(() =>
            expect(
                screen.getByRole("button")
            ).toHaveTextContent("Login!")
        );
    });

    it("clears previous error before attempting login", async () => {
        LoginRequest.mockResolvedValue({
            message: "Invalid credentials",
        });

        renderComponent();

        fireEvent.submit(screen.getByLabelText("login-form"));

        await waitFor(() =>
            expect(setErrorMessage).toHaveBeenCalledWith("")
        );

        expect(setErrorMessage).toHaveBeenCalledWith(
            "Invalid credentials"
        );
    });
});