import axios from "axios";
import { getCurrentUserMongoId } from "../services/user";

jest.mock("axios");

describe("getCurrentUserMongoId", () => {
  const mockUid = "firebase-uid-123";
  const mockMongoId = "mongo-id-456";

  beforeAll(() => {
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("should return mongoId on success", async () => {
    axios.get.mockResolvedValue({
      data: { mongoId: mockMongoId },
    });

    const result = await getCurrentUserMongoId(mockUid);

    expect(axios.get).toHaveBeenCalledWith(
      `${import.meta.env.VITE_API_BASE_URL}/api/users/by-uid/${mockUid}`
    );
    expect(result).toBe(mockMongoId);
  });

  test("should throw an error on failure", async () => {
    const mockError = new Error("Request failed");
    axios.get.mockRejectedValue(mockError);

    await expect(getCurrentUserMongoId(mockUid)).rejects.toThrow(
      "Request failed"
    );

    expect(console.error).toHaveBeenCalled(); 
  });
});
