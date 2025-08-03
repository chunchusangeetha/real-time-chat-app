
import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { AuthProvider, useAuth } from "../context/AuthContext";
import { act } from "react";

jest.mock("firebase/auth", () => ({
  getAuth: jest.fn(() => ({})),
  onAuthStateChanged: (auth, callback) => {
    const mockUser = {
      email: "testuser@example.com",
      getIdToken: async () => "mock-token",
    };
    callback(mockUser);
    return () => {};
  },
}));

const DummyComponent = () => {
  const { user, token, loading } = useAuth();

  return (
    <div>
      <div data-testid="user">{user?.email || "no-user"}</div>
      <div data-testid="token">{token || "no-token"}</div>
      <div data-testid="loading">{loading ? "loading" : "loaded"}</div>
    </div>
  );
};

describe("AuthContext", () => {
  test("provides user, token, and loading state", async () => {
    await act(async () => {
      render(
        <AuthProvider>
          <DummyComponent />
        </AuthProvider>
      );
    });

    await waitFor(() => {
      expect(screen.getByTestId("user").textContent).toBe(
        "testuser@example.com"
      );
      expect(screen.getByTestId("token").textContent).toBe("mock-token");
      expect(screen.getByTestId("loading").textContent).toBe("loaded");
    });
  });
});
