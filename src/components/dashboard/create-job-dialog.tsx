"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const jobSchema = z.object({
    title: z.string().min(5, "Title must be at least 5 characters"),
    description: z.string().min(20, "Description must be at least 20 characters"),
    propertyAddress: z.string().min(5, "Property address is required"),
    urgency: z.enum(["low", "medium", "high", "emergency"]),
    preferredDate: z.string().optional(),
});

type JobFormValues = z.infer<typeof jobSchema>;

interface CreateJobDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function CreateJobDialog({ open, onOpenChange }: CreateJobDialogProps) {
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<JobFormValues>({
        resolver: zodResolver(jobSchema),
        defaultValues: {
            title: "",
            description: "",
            propertyAddress: "",
            urgency: "medium",
            preferredDate: "",
        },
    });

    async function onSubmit(data: JobFormValues) {
        setIsLoading(true);

        try {
            // TODO: Replace with actual API call to create job
            await new Promise((resolve) => setTimeout(resolve, 1500));

            console.log("Job data:", data);

            toast.success("Job created successfully!", {
                description: "We're matching you with qualified tradespeople now.",
            });

            // Reset form and close dialog
            form.reset();
            onOpenChange(false);
        } catch (error) {
            toast.error("Failed to create job", {
                description: "Please try again or contact support.",
            });
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Create maintenance job</DialogTitle>
                    <DialogDescription>
                        Describe the work needed and we'll match you with qualified tradespeople
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Job title</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="e.g. Fix leaking kitchen tap"
                                            disabled={isLoading}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Describe the issue in detail. Include any relevant information like location, symptoms, or previous attempts to fix."
                                            className="min-h-[100px] resize-none"
                                            disabled={isLoading}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription className="text-xs">
                                        More detail helps us match you with the right tradesperson
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="propertyAddress"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Property address</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="123 High Street, Manchester, M1 1AA"
                                            disabled={isLoading}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="urgency"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Urgency</FormLabel>
                                        <Select
                                            disabled={isLoading}
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select urgency" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="low">Low - Within 2 weeks</SelectItem>
                                                <SelectItem value="medium">Medium - Within 1 week</SelectItem>
                                                <SelectItem value="high">High - Within 2 days</SelectItem>
                                                <SelectItem value="emergency">Emergency - Today</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="preferredDate"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Preferred date (optional)</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="date"
                                                disabled={isLoading}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="flex justify-end gap-3 pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => onOpenChange(false)}
                                disabled={isLoading}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isLoading}>
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Creating job...
                                    </>
                                ) : (
                                    "Create job"
                                )}
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}