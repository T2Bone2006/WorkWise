"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Loader2, Send } from "lucide-react";
import { sendInterviewMessage, saveInterviewData, extractInterviewData } from "@/lib/supabase/interview-actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface Message {
    role: "user" | "assistant";
    content: string;
}

interface InterviewChatProps {
    worker: {
        id: string;
        full_name: string;
        trade_type: string;
    };
}

export function InterviewChat({ worker }: InterviewChatProps) {
    const router = useRouter();
    const [messages, setMessages] = useState<Message[]>([
        {
            role: "assistant",
            content: `Hi ${worker.full_name}! I'm here to help set up your ${worker.trade_type} profile so we can match you with the right jobs and generate accurate quotes.

I'll need to ask you about:
• Your hourly and day rates
• Your qualifications and certifications
• Common jobs you do and typical prices
• Your service area and travel preferences

Should only take 5-10 minutes. Let's start - what's your standard hourly rate?`,
        },
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isComplete, setIsComplete] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage: Message = { role: "user", content: input };
        const newMessages = [...messages, userMessage];
        setMessages(newMessages);
        setInput("");
        setIsLoading(true);

        try {
            const result = await sendInterviewMessage(
                newMessages.map((m) => ({ role: m.role, content: m.content })),
                worker.id
            );

            if (result.error) {
                toast.error("Failed to send message", { description: result.error });
                setIsLoading(false);
                return;
            }

            if (result.message) {
                setMessages([...newMessages, { role: "assistant", content: result.message }]);
            }

            setIsLoading(false);
        } catch (error) {
            toast.error("Something went wrong");
            setIsLoading(false);
        }
    };

    const handleComplete = async () => {
        setIsComplete(true);
        toast.success("Analyzing your interview...");

        const transcript = messages.map((m) => ({ role: m.role, content: m.content }));

        // Extract structured data from the conversation using AI
        toast.loading("Extracting your pricing and preferences...", { id: "extract" });
        const extractedData = await extractInterviewData(transcript, worker.trade_type);
        toast.dismiss("extract");

        if (!extractedData) {
            toast.error("Failed to extract interview data. Please try again.");
            setIsComplete(false);
            return;
        }

        console.log("Extracted interview data:", extractedData);
        toast.success("Saving your profile...");

        const result = await saveInterviewData(
            worker.id,
            transcript,
            extractedData
        );

        if (result.error) {
            toast.error("Failed to save profile", { description: result.error });
            setIsComplete(false);
            return;
        }

        toast.success("Profile complete! Redirecting...");
        setTimeout(() => {
            router.push("/worker/dashboard");
        }, 1000);
    };

    return (
        <Card className="flex flex-col h-[600px]">
            {/* Header */}
            <div className="border-b p-4">
                <h2 className="text-xl font-bold">Profile Setup Interview</h2>
                <p className="text-sm text-muted-foreground">
                    Tell us about your pricing and preferences
                </p>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message, index) => (
                    <div
                        key={index}
                        className={`flex ${
                            message.role === "user" ? "justify-end" : "justify-start"
                        }`}
                    >
                        <div
                            className={`max-w-[80%] rounded-lg px-4 py-2 ${
                                message.role === "user"
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-muted"
                            }`}
                        >
                            <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="flex justify-start">
                        <div className="bg-muted rounded-lg px-4 py-2">
                            <Loader2 className="h-4 w-4 animate-spin" />
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="border-t p-4">
                <div className="flex gap-2">
                    <Input
                        placeholder="Type your response..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault();
                                handleSend();
                            }
                        }}
                        disabled={isLoading || isComplete}
                    />
                    <Button onClick={handleSend} disabled={isLoading || isComplete}>
                        {isLoading ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <Send className="h-4 w-4" />
                        )}
                    </Button>
                </div>
                <div className="mt-4">
                    <Button
                        variant="outline"
                        onClick={handleComplete}
                        disabled={messages.filter(m => m.role === "user").length < 5 || isComplete}
                        className="w-full"
                    >
                        {isComplete ? "Saving..." : "Complete Interview"}
                    </Button>
                    {messages.filter(m => m.role === "user").length < 5 && (
                        <p className="text-xs text-muted-foreground text-center mt-2">
                            Please answer more questions before completing ({messages.filter(m => m.role === "user").length}/5 minimum responses)
                        </p>
                    )}
                </div>
            </div>
        </Card>
    );
}