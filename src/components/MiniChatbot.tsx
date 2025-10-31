"use client";

import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import {
  PromptInput,
  PromptInputBody,
  type PromptInputMessage,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputFooter,
} from "@/components/ai-elements/prompt-input";
import { Message, MessageContent } from "@/components/ai-elements/message";
import { Response } from "@/components/ai-elements/response";
import { Suggestion, Suggestions } from "@/components/ai-elements/suggestion";
import { MessageCircleIcon, XIcon } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useChat } from "@ai-sdk/react";
import { Button } from "./ui/button";
import CachedImage from "./CachedImage";

const suggestions = [
  "When is TechnoVIT 2025?",
  "How can I register?",
  "What is the theme?",
];

interface MiniChatbotProps {
  onClose?: () => void;
}

const MiniChatbot = ({ onClose }: MiniChatbotProps) => {
  const { messages, status, sendMessage, error } = useChat({
    onError: (error) => {
      console.error("Chat error:", error);
      toast.error("Failed to get response. Please try again.");
    },
  });

  const [input, setInput] = useState("");
  const [isWaitingForResponse, setIsWaitingForResponse] = useState(false);

  // Load messages from localStorage on component mount
  useEffect(() => {
    const savedMessages = localStorage.getItem("technovit-messages");
    if (savedMessages) {
      try {
        JSON.parse(savedMessages);
        // Note: useChat doesn't have a direct way to set initial messages
      } catch (error) {
        console.error("Error loading messages from localStorage:", error);
      }
    }
  }, []);

  // Save messages to localStorage whenever messages change
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem("technovit-messages", JSON.stringify(messages));
    }
  }, [messages]);

  // Reset waiting state when streaming starts or when there's an error
  useEffect(() => {
    if (status === "streaming" || error) {
      setIsWaitingForResponse(false);
    }
  }, [status, error]);

  const handleSuggestionClick = (suggestion: string) => {
    setIsWaitingForResponse(true);
    sendMessage({
      role: "user",
      parts: [{ type: "text", text: suggestion }],
    });
  };

  const handleFormSubmit = (
    message: PromptInputMessage,
    e: React.FormEvent
  ) => {
    e.preventDefault();
    if (message.text?.trim()) {
      setIsWaitingForResponse(true);
      sendMessage({
        role: "user",
        parts: [{ type: "text", text: message.text }],
      });
      setInput("");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 w-96 h-[32rem] bg-background border rounded-lg shadow-xl flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b">
        <div className="flex-1 flex items-center gap-3">
          <CachedImage
            src="https://cdn.a2ys.dev/images/chatbot-logo.png"
            alt="TechnoVIT"
            width={32}
            height={32}
            className="rounded-full"
          />
          <div>
            <h3 className="font-semibold text-sm">TechnoVIT 2025</h3>
            <p className="text-xs text-muted-foreground">
              Healing with Intelligence
            </p>
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <XIcon className="h-4 w-4" color="white" />
        </Button>
      </div>

      {/* Chat Content */}
      <div className="flex-1 flex flex-col min-h-0">
        <Conversation className="flex-1">
          <ConversationContent
            className="p-2 scrollbar-hide conversation-scroll overflow-y-auto"
            style={{
              msOverflowStyle: "none",
              scrollbarWidth: "none",
            }}
          >
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <MessageCircleIcon className="mb-2 h-8 w-8 text-muted-foreground" />
                <h4 className="mb-1 text-sm font-medium">Welcome!</h4>
                <p className="text-xs text-muted-foreground">
                  Ask me about TechnoVIT 2025
                </p>
              </div>
            )}

            {messages.map((message) => (
              <Message key={message.id} from={message.role}>
                <MessageContent>
                  <Response className="text-sm text-muted-foreground">
                    {message.parts
                      ?.map((part) => (part.type === "text" ? part.text : ""))
                      .join("")}
                  </Response>
                </MessageContent>
              </Message>
            ))}

            {(status === "streaming" || isWaitingForResponse) && (
              <Message from="assistant">
                <MessageContent>
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1">
                      <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.3s]"></div>
                      <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.15s]"></div>
                      <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground"></div>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      Thinking...
                    </span>
                  </div>
                </MessageContent>
              </Message>
            )}

            {error && (
              <Message from="assistant">
                <MessageContent>
                  <div className="rounded border border-destructive bg-destructive/10 p-2">
                    <p className="text-xs font-medium text-destructive">
                      Error
                    </p>
                    <p className="text-xs text-destructive">{error.message}</p>
                  </div>
                </MessageContent>
              </Message>
            )}
          </ConversationContent>
          <ConversationScrollButton />
        </Conversation>

        {/* Suggestions */}
        <div className="border-t px-2 py-1">
          <Suggestions>
            {suggestions.map((suggestion) => (
              <Suggestion
                key={suggestion}
                onClick={() => handleSuggestionClick(suggestion)}
                suggestion={suggestion}
                className="text-xs"
              />
            ))}
          </Suggestions>
        </div>

        {/* Input */}
        <div className="border-t p-2">
          <PromptInput onSubmit={handleFormSubmit}>
            <PromptInputBody>
              <PromptInputTextarea
                value={input}
                onChange={handleInputChange}
                placeholder="Ask about TechnoVIT..."
                className="text-sm resize-none"
                rows={1}
              />
            </PromptInputBody>
            <PromptInputFooter className="flex justify-end">
              <PromptInputSubmit
                disabled={!input.trim() || status === "streaming"}
                className="h-6 w-6"
              />
            </PromptInputFooter>
          </PromptInput>
        </div>
      </div>
    </div>
  );
};

export default MiniChatbot;
