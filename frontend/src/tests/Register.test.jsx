import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import Register from "../pages/Register";

jest.mock("firebase/auth", () => ({
  createUserWithEmailAndPassword: jest.fn(),
}));

jest.mock("../firebase/Firebase", () => ({
  auth: {},
}));

jest.mock("axios");

describe("Register Component", () => {
  it("renders register form", () => {
    render(
      <BrowserRouter>
        <Register />
      </BrowserRouter>
    );

    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /register/i })
    ).toBeInTheDocument();
  });

  it("registers a new user", async () => {
    const mockUser = { getIdToken: jest.fn().mockResolvedValue("mockToken") };
    createUserWithEmailAndPassword.mockResolvedValue({ user: mockUser });

    const mockPost = jest.fn().mockResolvedValue({});
    const axios = require("axios");
    axios.post = mockPost;

    render(
      <BrowserRouter>
        <Register />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByPlaceholderText(/email/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/password/i), {
      target: { value: "password" },
    });

    fireEvent.click(screen.getByRole("button", { name: /register/i }));

    await waitFor(() =>
      expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(
        {},
        "test@example.com",
        "password"
      )
    );

    expect(mockPost).toHaveBeenCalledWith(
      expect.stringContaining("/api/auth/verify-token"),
      {},
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: "Bearer mockToken",
        }),
      })
    );
  });
});
