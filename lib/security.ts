import { NextRequest, NextResponse } from "next/server";

/**
 * Sanitizes input text to prevent XSS.
 */
export function sanitizeInput(input: string): string {
  if (typeof input !== "string") return "";
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;");
}

/**
 * Validates whether the origin/referer of the request matches allowed origins (CSRF protection).
 */
export function validateCsrfOrigin(req: NextRequest): boolean {
  const origin = req.headers.get("origin") || req.headers.get("referer");
  const host = req.headers.get("host");

  if (!origin || !host) {
    return true; // Allow internal/same-origin requests if headers aren't present
  }

  try {
    const originUrl = new URL(origin);
    return originUrl.host === host || originUrl.host.endsWith(host);
  } catch {
    return false;
  }
}
