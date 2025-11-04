/**
 * Environment variable utilities for CleanNFT
 * All variables must start with NEXT_PUBLIC_ for client-side access
 */

export const env = {
  appName: process.env.NEXT_PUBLIC_APP_NAME || "CleanNFT",
  customerBaseUrl: process.env.NEXT_PUBLIC_CUSTOMER_BASE_URL || "",
  adminBaseUrl: process.env.NEXT_PUBLIC_ADMIN_BASE_URL || "",
  chatMode: process.env.NEXT_PUBLIC_CHAT_MODE || "local",
} as const;

export function isWebhookMode(): boolean {
  return env.chatMode === "webhook";
}

export function isLocalMode(): boolean {
  return env.chatMode === "local";
}

