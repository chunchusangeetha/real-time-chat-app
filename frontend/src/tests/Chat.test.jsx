import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Chat from "../pages/Chat";
import { useAuth } from "../context/AuthContext";
import * as userService from "../services/user";
import axios from "axios";
import socket from "../services/socket";

jest.mock("../context/AuthContext");
jest.mock("../services/user");
jest.mock("axios");
jest.mock("../services/socket", () => ({
  emit: jest.fn(),
  on: jest.fn(),
  off: jest.fn(),
}));

describe("Chat Component", () => {
  const mockUser = {
    uid: "test-uid",
    getIdToken: jest.fn().mockResolvedValue("fake-token"),
  };

  beforeEach(() => {
    useAuth.mockReturnValue({ user: mockUser, loading: false });
    userService.getCurrentUserMongoId.mockResolvedValue("mongo123");

    axios.get.mockImplementation((url) => {
      if (url.includes("/api/chat")) {
        return Promise.resolve({ data: { messages: [] } }); // mock messages
      }
      return Promise.resolve({
        data: [
          { _id: "user1", name: "Alice", uid: "uid1" },
          { _id: "user2", name: "Bob", uid: "uid2" },
        ],
      });
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("renders loading screen if loading is true", () => {
    useAuth.mockReturnValue({ user: mockUser, loading: true });
    render(<Chat />);
    expect(screen.getByText(/Loading chat/i)).toBeInTheDocument();
  });

  test("renders users list and selects user", async () => {
    render(<Chat />);
    await waitFor(() => {
      expect(screen.getByText("Alice")).toBeInTheDocument();
      expect(screen.getByText("Bob")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("Alice"));
    await waitFor(() => {
      expect(screen.getByPlaceholderText(/Type a message/i)).toBeInTheDocument();
    });
  });

  test("sends message when Send button is clicked", async () => {
    render(<Chat />);

    await waitFor(() => {
      expect(screen.getByText("Alice")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("Alice"));

    await waitFor(() => {
      expect(
        screen.getByPlaceholderText(/Type a message/i)
      ).toBeInTheDocument();
    });

    const input = screen.getByPlaceholderText(/Type a message/i);
    fireEvent.change(input, { target: { value: "Hello Alice" } });

    const sendButton = screen.getByText(/Send/i);
    fireEvent.click(sendButton);

    await waitFor(() =>
      expect(socket.emit).toHaveBeenCalledWith(
        "send-message",
        expect.objectContaining({
          content: "Hello Alice",
        })
      )
    );
  });
});
