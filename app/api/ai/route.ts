import { NextRequest, NextResponse } from "next/server";
import { getOpenRouterAnswer } from "@/services/openrouter";
import { createOptimizedResponse } from "@/lib/api-compression";

// In-memory storage for rate limiting
// Note: This will reset when the serverless function cold starts
type RequestRecord = {
  timestamps: number[]; // Array of timestamps for each request
  lastCleanup: number; // Last time we cleaned up old timestamps
};

const ipRequestMap = new Map<string, RequestRecord>();
const REQUESTS_PER_MINUTE = 10;
const WINDOW_MS = 60 * 1000; // 1 minute
const CLEANUP_INTERVAL_MS = 5 * 60 * 1000; // Clean up every 5 minutes

/**
 * Checks if the client IP has exceeded the rate limit.
 * @param clientIp The client's IP address
 * @returns Whether the client has been rate limited
 */
async function isRateLimited(clientIp: string): Promise<boolean> {
  const now = Date.now();

  // Skip rate limiting for development
  if (process.env.NODE_ENV === "development") {
    return false;
  }

  // Create or get the record for this IP
  if (!ipRequestMap.has(clientIp)) {
    ipRequestMap.set(clientIp, { timestamps: [], lastCleanup: now });
  }

  const record = ipRequestMap.get(clientIp)!;

  // Clean up old timestamps if needed
  if (now - record.lastCleanup > CLEANUP_INTERVAL_MS) {
    record.timestamps = record.timestamps.filter(
      (timestamp) => now - timestamp < WINDOW_MS
    );
    record.lastCleanup = now;
  }

  // Filter to only include timestamps within the current window
  const recentTimestamps = record.timestamps.filter(
    (timestamp) => now - timestamp < WINDOW_MS
  );

  // Check if rate limit is exceeded
  if (recentTimestamps.length >= REQUESTS_PER_MINUTE) {
    return true;
  }

  // Record this request
  record.timestamps.push(now);
  return false;
}

// Define the comprehensive system prompt for the CV Writing Assistant
const CV_WRITING_ASSISTANT_PROMPT = `
AI System Prompt: Professional CV Writing Assistant

Role: You are a professional CV Writing Assistant. Your expertise lies in transforming raw information and existing text into concise, impactful, and professional language suitable for a modern CV. You understand common CV structures, best practices for different fields (e.g., achievements, skills, summaries), and how to tailor language for maximum effect.

Objective: To assist the user in updating their CV *one specific field or section at a time* by providing suggested professional text based on their input for that particular field.

Mode of Operation:
1.  You will wait for the user to explicitly state *which specific CV field or section* they want to work on next (e.g., "Summary," "Skills," "Work Experience - Job Title X," "Education," "Achievements," etc.).
2.  The user will provide you with their current text for that field, key points they want to include, or a description of what they need help writing for that specific part of the CV.
3.  Based *only* on the input for that single, requested field, you will provide polished, professional text options or suggestions.
4.  You will ask clarifying questions *only* if necessary to improve the suggestions for the *current field*.
5.  You will maintain a focused conversation on the *currently requested field* until the user indicates they are ready to move to another.

Capabilities:
*   Suggest professional wording and phrasing for any CV section.
*   Help condense lengthy descriptions into concise bullet points or summaries.
*   Identify opportunities to use stronger action verbs.
*   Suggest ways to quantify achievements where applicable (if the user provides data).
*   Tailor language to sound more impactful and relevant.
*   Format suggestions clearly (e.g., bullet points for experience/skills, paragraph for summary).
*   Maintain a professional, encouraging, and patient tone.

Constraints & Rules:
*   **CRITICAL:** DO NOT jump ahead or anticipate which field the user will want to work on next.
*   **CRITICAL:** DO NOT list all possible CV sections or create a step-by-step plan *unless specifically asked by the user*. Wait for the user to guide the flow by requesting the next field.
*   Focus *only* on the specific field the user has currently requested help with.
*   Do not ask for information about other CV fields unless it's directly relevant to improving the *current* field (e.g., asking about the industry to tailor skill descriptions).
*   Keep responses helpful, professional, and directly related to the user's input for the current field.

Starting Instruction:
(This instruction helps reinforce the starting behavior for the AI. When the user sends their first message to this endpoint after it receives this prompt, the AI should respond according to this instruction.)
Hello! I'm your Professional CV Writing Assistant, ready to help you refine your CV field by field. Just tell me which specific section you'd like to work on, share your current text or ideas for it, and I'll provide some professional suggestions. Which part would you like to start with?
`;
/**
 * Handles POST requests to the Professional CV Writing Assistant API endpoint.
 *
 * Accepts user input for a specific CV section and returns AI-generated professional text suggestions tailored to that section. The AI operates under a detailed system prompt designed to guide the writing process, with optional customization of creativity and prompt.
 *
 * @returns A JSON response containing the AI-generated suggestion for the provided CV section, or an error message if the request is invalid or processing fails.
 *
 * @throws {Error} If the request body is missing the required `data` field, responds with a 400 status and an error message. If an unexpected error occurs during processing, responds with a 500 status and an error message.
 */

export async function POST(req: NextRequest) {
  try {
    // Authentication check: Verify user identity
    const isDev = process.env.NODE_ENV === "development";

    // Check authentication by verifying the admin_authenticated cookie
    const isAuthenticated = req.cookies.has("admin_authenticated");

    // Get the API key from the request header if provided
    const apiKey = req.headers.get("x-api-key");
    const validApiKey = process.env.AI_API_KEY;
    const hasValidApiKey = apiKey && validApiKey && apiKey === validApiKey;

    // If not in development mode and neither authenticated via cookie nor valid API key, reject the request
    if (!isDev && !isAuthenticated && !hasValidApiKey) {
      return NextResponse.json(
        { error: "Unauthorized: Authentication required" },
        { status: 401 }
      );
    }

    // Implement basic rate limiting
    const clientIp =
      req.headers.get("x-forwarded-for")?.split(",")[0] ||
      req.headers.get("x-real-ip") ||
      "unknown-ip";

    // Apply rate limiting check
    if (await isRateLimited(clientIp)) {
      return NextResponse.json(
        { error: "Rate limit exceeded: Please try again later" },
        { status: 429 }
      );
    }

    // Parse the request body with error handling
    let body;
    try {
      body = await req.json();
    } catch (error) {
      return NextResponse.json(
        { error: "Invalid JSON: Could not parse request body" },
        { status: 400 }
      );
    }

    // Comprehensive validation of the request body
    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { error: "Invalid request: Request body must be a valid JSON object" },
        { status: 400 }
      );
    } // Extract and validate required fields
    const { data, creativity, systemInput: userSystemInput, model } = body;

    // Validate data field (required)
    if (data === undefined) {
      return NextResponse.json(
        { error: "Missing required field: data is required" },
        { status: 400 }
      );
    }

    // Validate data type and content
    if (typeof data !== "string") {
      return NextResponse.json(
        { error: "Invalid data format: data must be a string" },
        { status: 400 }
      );
    }

    // Check data length to prevent abuse
    if (data.length > 10000) {
      return NextResponse.json(
        {
          error:
            "Invalid data: content exceeds maximum length (10000 characters)"
        },
        { status: 400 }
      );
    }

    // Check for empty content after trimming
    if (data.trim().length === 0) {
      return NextResponse.json(
        { error: "Invalid data: content cannot be empty" },
        { status: 400 }
      );
    }

    // Validate creativity if provided
    if (creativity !== undefined) {
      if (typeof creativity !== "number") {
        return NextResponse.json(
          { error: "Invalid creativity format: must be a number" },
          { status: 400 }
        );
      }

      if (creativity < 0 || creativity > 1) {
        return NextResponse.json(
          { error: "Invalid creativity value: must be between 0 and 1" },
          { status: 400 }
        );
      }
    }

    // Validate systemInput if provided
    if (userSystemInput !== undefined) {
      if (typeof userSystemInput !== "string") {
        return NextResponse.json(
          { error: "Invalid systemInput format: must be a string" },
          { status: 400 }
        );
      }

      // Check for potential prompt injection or malicious input
      if (userSystemInput.length > 20000) {
        return NextResponse.json(
          {
            error:
              "Invalid systemInput: exceeds maximum length (20000 characters)"
          },
          { status: 400 }
        );
      }
    }

    // Validate model if provided (optional enhancement)
    if (model !== undefined) {
      if (typeof model !== "string") {
        return NextResponse.json(
          { error: "Invalid model format: must be a string" },
          { status: 400 }
        );
      }

      // Validate against allowed models if needed
      const allowedModels = ["gpt-4", "gpt-3.5-turbo", "claude-3"]; // Example
      if (!allowedModels.includes(model)) {
        return NextResponse.json(
          {
            error: `Invalid model: must be one of ${allowedModels.join(", ")}`
          },
          { status: 400 }
        );
      }
    } // Use the specific CV writing assistant prompt as the system input if no custom systemInput provided
    const systemInput = userSystemInput || CV_WRITING_ASSISTANT_PROMPT;

    // Set up request timeout with AbortController
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000); // 60-second timeout

    let aiResponse: string;

    try {
      // Call OpenRouter service with validated inputs
      // 'data' from the request body will serve as the user's input for the current field
      aiResponse = await getOpenRouterAnswer({
        systemInput,
        data, // This contains the user's specific input for the current field
        creativity: creativity !== undefined ? creativity : 0.2, // Allow user to override, default to 0.2
        customModel: model, // Pass the model if provided, using the correct property name
        signal: controller.signal // Pass the abort signal for timeout handling
      });

      // Clear the timeout
      clearTimeout(timeoutId);

      // Validate AI response more thoroughly
      if (!aiResponse) {
        throw new Error("Failed to get response from AI service");
      }

      if (typeof aiResponse !== "string") {
        throw new Error("Invalid response format from AI service");
      }



      // Return the AI response with compression
      return createOptimizedResponse({ response: aiResponse }, { maxAge: 0 });
    } catch (error) {
      // Make sure to clear the timeout if there was an error
      clearTimeout(timeoutId);
      throw error;
    }
  } catch (error: any) {
    console.error("AI endpoint error:", error);

    // Provide more specific error messages based on error types
    if (error.message?.includes("OPENROUTER_KEY")) {
      return NextResponse.json(
        { error: "AI service configuration error: Missing API key" },
        { status: 500 }
      );
    } else if (error.message?.includes("OpenRouter API error")) {
      return NextResponse.json(
        { error: "AI service error: Failed to connect to AI provider" },
        { status: 503 }
      );
    } else if (
      error.message?.includes("timeout") ||
      error.name === "AbortError"
    ) {
      return NextResponse.json(
        { error: "Request timeout: The AI service took too long to respond" },
        { status: 504 }
      );
    } else if (error.name === "SyntaxError") {
      return NextResponse.json(
        { error: "Invalid response from AI service" },
        { status: 502 }
      );
    } else if (
      error.message?.includes("429") ||
      error.message?.includes("too many requests")
    ) {
      return NextResponse.json(
        { error: "Rate limit exceeded: Please try again later" },
        { status: 429 }
      );
    } else if (
      error.message?.includes("403") ||
      error.message?.includes("forbidden")
    ) {
      return NextResponse.json(
        { error: "API access forbidden: Permission denied" },
        { status: 403 }
      );
    } else {
      // Generic error handler
      return NextResponse.json(
        { error: error.message || "Failed to process AI request" },
        { status: 500 }
      );
    }
  }
}
