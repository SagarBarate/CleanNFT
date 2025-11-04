/**
 * Chat API client
 * Supports webhook mode (POST to API) and local mode (localStorage)
 */

import { env, isWebhookMode, isLocalMode } from "@/lib/utils/env";

export interface ChatMessage {
  name?: string;
  email: string;
  message: string;
}

export interface ChatResponse {
  success: boolean;
  message?: string;
  error?: string;
}

export async function sendChatMessage(
  data: ChatMessage
): Promise<ChatResponse> {
  if (isLocalMode()) {
    // Save to localStorage
    try {
      const existing = JSON.parse(
        localStorage.getItem("cleannft_chat_messages") || "[]"
      );
      existing.push({
        ...data,
        timestamp: new Date().toISOString(),
      });
      localStorage.setItem(
        "cleannft_chat_messages",
        JSON.stringify(existing)
      );
      return { success: true, message: "Message saved locally" };
    } catch (error) {
      console.error("Error saving to localStorage:", error);
      return {
        success: false,
        error: "Failed to save message locally",
      };
    }
  }

  if (isWebhookMode()) {
    // POST to webhook endpoint
    try {
      const res = await fetch(
        `${env.customerBaseUrl}/api/webhooks/site-chat`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const result = await res.json();
      return { success: true, ...result };
    } catch (error) {
      console.error("Error sending chat message:", error);
      return {
        success: false,
        error: "Failed to send message. Please try again later.",
      };
    }
  }

  return {
    success: false,
    error: "Invalid chat mode configuration",
  };
}

