import { env } from "../../config/env.js";

const requestAiService = async (path, payload) => {
  const response = await fetch(`${env.aiServiceUrl}/api/v1${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  const responseBody = await response.json().catch(() => null);

  if (!response.ok) {
    const error = new Error(responseBody?.error?.message || "AI service request failed.");
    error.status = response.status;
    error.code = responseBody?.error?.code;
    error.details = responseBody?.error?.details || [];
    throw error;
  }

  return responseBody?.data ?? {};
};

export const generateQuizDraft = async (payload) => requestAiService("/quiz/generate", payload);

export const evaluateQuizAttemptFeedback = async (payload) => requestAiService("/quiz/evaluate", payload);

export const generateMentorReply = async (payload) => requestAiService("/mentor/chat", payload);

export const explainJobMatches = async (payload) => requestAiService("/jobs/explain", payload);
