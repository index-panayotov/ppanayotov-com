"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { RiRobot2Fill } from "react-icons/ri";
import { toast } from "@/components/ui/use-toast";
import { apiClient } from "@/lib/api-client";

interface AIEnhancedInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  onValueChange?: (value: string) => void;
  fieldName?: string;
}

export const AIEnhancedInput = React.forwardRef<
  HTMLInputElement,
  AIEnhancedInputProps
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

    try {
      const data = await apiClient.post<{ response: string }>("/api/ai", {
        systemInput: `You are a professional content enhancer specializing in CV and resume content.
Your task is to improve the provided ${fieldName ||
            "text"} to make it more professional, concise, and impactful.
Keep the same meaning but enhance the wording. Respond with ONLY the improved text without any explanations or additional text.`,
        data: String(value),
        creativity: 0.3
      });

      // Call the parent's onChange handler with a synthetic event
      if (onChange) {
        const syntheticEvent = {
          target: {
            value: data.response,
            name: props.name
          }
        } as React.ChangeEvent<HTMLInputElement>;

        // Use setTimeout to prevent state collision
        setTimeout(() => {
          onChange(syntheticEvent);
        }, 0);
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

      toast({
        title: "Enhancement failed",
        description: error instanceof Error ? error.message : "Failed to enhance content with AI",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="flex w-full items-center gap-0">
      <div className="flex-grow">
        <Input
          className={`${className} pr-2`}
          value={value}
          onChange={onChange}
          ref={ref}
          {...props}
        />
      </div>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="min-w-10 h-10 rounded-l-none border border-l-0 border-input flex-shrink-0"
        onClick={handleAIClick}
        disabled={isLoading}
        aria-label={
          isLoading ? "Enhancing content with AI..." : "Enhance content with AI"
        }
        title="AI enhance"
      >
        {isLoading
          ? <Loader2 className="h-4 w-4 animate-spin" />
          : <RiRobot2Fill className="h-4 w-4" />}
      </Button>
    </div>
  );
});

AIEnhancedInput.displayName = "AIEnhancedInput";
