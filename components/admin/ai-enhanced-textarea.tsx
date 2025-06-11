"use client";

import React, { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { RiRobot2Fill } from "react-icons/ri";
import { toast } from "@/components/ui/use-toast";
import { SystemSettings } from "@/services/SystemSettings";
import editorJsConfig from "@/data/editorjs-config";
import dynamic from "next/dynamic";

// Import EditorJS wrapper with no SSR
const EditorJsWrapper = dynamic(
  () => import("@/components/admin/editorjs-wrapper"),
  {
    ssr: false
  }
);

interface AIEnhancedTextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  onValueChange?: (value: string) => void;
  fieldName?: string;
}

export const AIEnhancedTextarea = React.forwardRef<
  HTMLTextAreaElement,
  AIEnhancedTextareaProps
>(({ className, onValueChange, fieldName, value, onChange, ...props }, ref) => {
  const [isLoading, setIsLoading] = useState(false);
  const handleAIClick = async () => {
    if (!value) {
      toast({
        title: "No content to enhance",
        description: "Please add some content to enhance with AI.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    // Set up AbortController with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort();
    }, 30000); // 30-second timeout

    try {
      const response = await fetch("/api/ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          systemInput: `You are a professional content enhancer specializing in CV and resume content. 
Your task is to improve the provided ${fieldName ||
            "text"} to make it more professional, concise, and impactful.
Keep the same meaning but enhance the wording and structure. Format appropriately with bullet points if it's a list of accomplishments.
Respond with ONLY the improved text without any explanations or additional text.`,
          data: String(value),
          creativity: 0.3
        }),
        signal: controller.signal
      });

      // Clear the timeout since the request completed
      clearTimeout(timeoutId);

      // Handle non-OK responses before attempting to parse JSON
      if (!response.ok) {
        const errorText = await response.text().catch(() => "");
        throw new Error(
          errorText ||
            `Server responded with ${response.status}: ${response.statusText}`
        );
      }

      // Parse JSON with error handling
      let data;
      try {
        data = await response.json();
      } catch (parseError) {
        throw new Error("Failed to parse server response");
      }

      // Validate that the response contains the expected data
      if (!data || typeof data.response !== "string") {
        throw new Error("Invalid response format from AI service");
      }

      // Call the parent's onChange handler with a synthetic event
      if (onChange) {
        const syntheticEvent = {
          target: {
            value: data.response,
            name: props.name
          }
        } as React.ChangeEvent<HTMLTextAreaElement>;

        onChange(syntheticEvent);
      }

      // Also call the onValueChange callback if provided
      if (onValueChange) {
        onValueChange(data.response);
      }

      toast({
        title: "Content enhanced",
        description: "AI has enhanced your content."
      });
    } catch (error) {
      console.error("AI Enhancement error:", error);

      // Clear the timeout to prevent memory leaks
      clearTimeout(timeoutId);

      // Handle specific error types
      let errorMessage = "Failed to enhance content with AI";

      if (error instanceof DOMException && error.name === "AbortError") {
        errorMessage = "Request timed out. Please try again later.";
      } else if (error instanceof Error) {
        if (
          error.message.includes("NetworkError") ||
          error.message.includes("network")
        ) {
          errorMessage =
            "Network error. Please check your connection and try again.";
        } else {
          errorMessage = error.message;
        }
      }

      toast({
        title: "Enhancement failed",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="relative">
      {SystemSettings.get("useWysiwyg")
        ? <EditorJsWrapper
            value={value}
            onChange={onChange}
            config={editorJsConfig}
          />
        : <Textarea
            className={`${className} pr-12 pb-10 resize-none`}
            value={value}
            onChange={onChange}
            ref={ref}
            {...props}
          />}
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="absolute top-2 right-2 bg-background hover:bg-gray-100"
        onClick={handleAIClick}
        disabled={isLoading}
        aria-label={
          isLoading
            ? "Enhancing content with AI..."
            : "Enhance content with AI using machine learning"
        }
        title="AI enhance content"
      >
        {isLoading
          ? <Loader2 className="h-4 w-4 animate-spin" />
          : <RiRobot2Fill className="h-4 w-4" />}
      </Button>
    </div>
  );
});

AIEnhancedTextarea.displayName = "AIEnhancedTextarea";
