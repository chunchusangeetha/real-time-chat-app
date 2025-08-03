import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Login from "../pages/Login";
import { signInWithEmailAndPassword } from "firebase/auth";

jest.mock("firebase/auth", () => ({
  signInWithEmailAndPassword: jest.fn(),
}));

jest.mock("../firebase/Firebase", () => ({
  auth: {},
}));

jest.mock("axios");


describe("Login Component", () => {
  it("renders form fields", () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
  });

  it("submits the form and logs in user", async () => {
    const mockUser = { getIdToken: jest.fn().mockResolvedValue("mockToken") };
    signInWithEmailAndPassword.mockResolvedValue({ user: mockUser });

    const mockPost = jest.fn().mockResolvedValue({});
    const axios = require("axios");
    axios.post = mockPost;

    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByPlaceholderText(/email/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/password/i), {
      target: { value: "password" },
    });

    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() =>
      expect(signInWithEmailAndPassword).toHaveBeenCalledWith(
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
