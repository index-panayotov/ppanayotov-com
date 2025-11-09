"use client";

import React, { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { RiRobot2Fill } from "react-icons/ri";
import { toast } from "@/hooks/use-toast";

import MarkdownEditor from "@/components/admin/markdown-editor";
import { apiClient } from "@/lib/api-client";
import { SystemSettings } from "@/lib/schemas";
import { logger } from "@/lib/logger";


interface AIEnhancedTextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  onValueChange?: (value: string) => void;
  fieldName?: string;
  systemSettings: SystemSettings;
}

export const AIEnhancedTextarea = React.forwardRef<
  HTMLTextAreaElement,
  AIEnhancedTextareaProps
>(({ className, onValueChange, fieldName, value, onChange, systemSettings, ...props }, ref) => {
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
Keep the same meaning but enhance the wording and structure. Format appropriately with bullet points if it's a list of accomplishments.
Respond with ONLY the improved text without any explanations or additional text.`,
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
        } as React.ChangeEvent<HTMLTextAreaElement>;

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
      logger.error('AI Enhancement error', error as Error, {
        component: 'AIEnhancedTextarea'
      });

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
    <div className="relative">
      {systemSettings.useWysiwyg
        ? <div className="pb-10">
            <MarkdownEditor
              value={String(value || '')}
              onChange={(val) => {
                if (onChange) {
                  const syntheticEvent = {
                    target: {
                      value: val,
                      name: props.name
                    }
                  } as React.ChangeEvent<HTMLTextAreaElement>;
                  onChange(syntheticEvent);
                }
                if (onValueChange) {
                  onValueChange(val);
                }
              }}
              placeholder={props.placeholder as string}
              height={300}
              className="markdown-editor-wrapper"
            />
          </div>
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
        className="absolute top-2 right-2 bg-background hover:bg-slate-100 z-10"
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
