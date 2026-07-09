import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import {
    FetchPermissionsRequest,
    FetchAttendanceTypesRequest,
} from "@/common/requests";
import Home from "@/app/page";

jest.mock("@/common/requests", () => ({
    FetchPermissionsRequest: jest.fn(),
    FetchAttendanceTypesRequest: jest.fn(),
}));

jest.mock("universal-cookie", () => {
    return jest.fn().mockImplementation(() => ({
        get: jest.fn(() => "fake-session-cookie"),
    }));
});

jest.mock("@/app/login", () => ({
    LoginPopup: ({ setUserData }) => (
        <button
            data-testid="login-button"
            onClick={() =>
                setUserData(
                    1,
                    "John",
                    "Smith",
                    "john@test.com",
                    ["ADMIN"],
                    "2099-01-01"
                )
            }
        >
            Login
        </button>
    ),
}));

jest.mock("@/common/components/navBar", () => ({
    NavBar: ({ onSetPage, onLogout }) => (
        <>
            <button
                data-testid="users-nav"
                onClick={() => onSetPage("users")}
            >
                Users
            </button>

            <button
                data-testid="training-nav"
                onClick={() => onSetPage("training_sessions")}
            >
                Training
            </button>

            <button
                data-testid="logout-nav"
                onClick={onLogout}
            >
                Logout
            </button>
        </>
    ),
}));

jest.mock("@/app/users", () => ({
    UsersPage: () => <div>Users Page</div>,
}));

jest.mock("@/app/training_sessions", () => ({
    TrainingSessionPage: () => <div>Training Sessions Page</div>,
}));

jest.mock("@/common/components/buttons", () => ({
    Button: ({ children, onClick }) => (
        <button onClick={onClick}>{children}</button>
    ),
}));

beforeEach(() => {
    jest.clearAllMocks();

    FetchPermissionsRequest.mockImplementation(async () =>({
        status: 200,
        data: {
            enum_items: [
                {
                    name: "ADMIN",
                    value: 1,
                },
            ],
        },
    }));

    FetchAttendanceTypesRequest.mockImplementation(async () =>({
        status: 200,
        data: {
            enum_items: [
                {
                    name: "PRESENT",
                    value: 1,
                },
            ],
        },
    }));
});

describe("Home", () => {
    test("renders login popup initially", () => {
        render(<Home />);

        expect(screen.getByTestId("login-button")).toBeInTheDocument();
    });

    test("fetches permissions and attendance types on mount", async () => {
        render(<Home />);

        await waitFor(() => {
            expect(FetchPermissionsRequest).toHaveBeenCalledTimes(1);
            expect(FetchAttendanceTypesRequest).toHaveBeenCalledTimes(1);
        });
    });

    test("logs user in and displays welcome message", async () => {
        render(<Home />);

        fireEvent.click(screen.getByTestId("login-button"));

        expect(
            await screen.findByText("Welcome, John Smith")
        ).toBeInTheDocument();

        expect(
            screen.queryByTestId("login-button")
        ).not.toBeInTheDocument();
    });

    test("navigates to Users page", async () => {
        render(<Home />);

        fireEvent.click(screen.getByTestId("login-button"));

        fireEvent.click(await screen.findByTestId("users-nav"));

        expect(screen.getByText("Users Page")).toBeInTheDocument();
    });

    test("navigates to Training Sessions page", async () => {
        render(<Home />);

        fireEvent.click(screen.getByTestId("login-button"));

        fireEvent.click(await screen.findByTestId("training-nav"));

        expect(
            screen.getByText("Training Sessions Page")
        ).toBeInTheDocument();
    });

    test("logout returns user to login screen", async () => {
        render(<Home />);

        fireEvent.click(screen.getByTestId("login-button"));

        expect(
            await screen.findByText("Welcome, John Smith")
        ).toBeInTheDocument();

        fireEvent.click(screen.getByTestId("logout-nav"));

        expect(screen.getByTestId("login-button")).toBeInTheDocument();
    });

    test("shows error message when permissions request fails", async () => {
        FetchPermissionsRequest.mockImplementation(async () =>({
            status: 500,
            message: "Permission error",
        }));

        render(<Home />);

        expect(
            await screen.findByText("Permission error")
        ).toBeInTheDocument();
    });

    test("clears error message when X button is clicked", async () => {
        FetchPermissionsRequest.mockImplementation(async () =>({
            status: 500,
            message: "Permission error",
        }));

        render(<Home />);

        expect(
            await screen.findByText("Permission error")
        ).toBeInTheDocument();

        fireEvent.click(screen.getByText("X"));

        await waitFor(() => {
            expect(
                screen.queryByText("Permission error")
            ).not.toBeInTheDocument();
        });
    });
});