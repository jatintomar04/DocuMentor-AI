
import axios from "axios";

const API_URL = "http://localhost:8080/api";

export interface AskQuestionPayload {
  documentId: string;
  question: string;
}

export interface AskQuestionResponse {
  answer: string;
}

export const askQuestionApi = async (
  payload: AskQuestionPayload,
  token?: string
): Promise<AskQuestionResponse> => {
  // Get token from localStorage if not passed explicitly
  const authToken =
    token ??
    (typeof window !== "undefined"
      ? localStorage.getItem("token")
      : null);

  if (!authToken) {
    throw new Error("Authentication token is missing. Please log in again.");
  }

  try {
    const response = await axios.post<AskQuestionResponse>(
      `${API_URL}/question/chat`,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      }
    );

    if (typeof response.data.answer !== "string") {
      throw new Error("Invalid response from server");
    }

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message ||
          error.message ||
          "Failed to get answer"
      );
    }

    throw error;
  }
};
