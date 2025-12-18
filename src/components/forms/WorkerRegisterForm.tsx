"use client";

import { useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { workerSignup, checkWaitlistEmail } from "@/lib/supabase/worker-auth-actions";

const registerSchema = z.object({
    fullName: z.string().min(2, "Full name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email address"),
    phone: z.string().min(10, "Please enter a valid phone number"),
    tradeType: z.string().min(1, "Please select your trade"),
    password: z
        .string()
        .min(8, "Password must be at least 8 characters")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        .regex(/[a-z]/, "Password must contain at least one lowercase letter")
        .regex(/[0-9]/, "Password must contain at least one number")
        .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export function WorkerRegisterForm() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isPending, startTransition] = useTransition();
    const [isCheckingWaitlist, setIsCheckingWaitlist] = useState(false);
    const [waitlistFound, setWaitlistFound] = useState(false);

    const form = useForm<RegisterFormValues>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            fullName: "",
            email: "",
            phone: "",
            tradeType: "",
            password: "",
            confirmPassword: "",
        },
    });

    const handleEmailBlur = async () => {
        const email = form.getValues("email");
        if (!email || !email.includes("@")) return;

        setIsCheckingWaitlist(true);
        try {
            const result = await checkWaitlistEmail(email);
            if (result.found && result.data) {
                form.setValue("fullName", result.data.fullName);
                form.setValue("phone", result.data.phone);
                form.setValue("tradeType", result.data.tradeType);
                setWaitlistFound(true);
                toast.success("Welcome back!", {
                    description: "We found your waitlist registration. Your details have been pre-filled.",
                });
            }
        } catch {
            // Ignore errors silently
        } finally {
            setIsCheckingWaitlist(false);
        }
    };

    async function onSubmit(data: RegisterFormValues) {
        startTransition(async () => {
            const result = await workerSignup(
                data.email,
                data.password,
                data.fullName,
                data.phone,
                data.tradeType
            );

            if (result?.error) {
                toast.error("Registration failed", {
                    description: result.error,
                });
            }
            // If no error, the server action will redirect to onboarding
        });
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Full name</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="John Smith"
                                    autoComplete="name"
                                    disabled={isPending}
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <div className="relative">
                                    <Input
                                        placeholder="john@example.com"
                                        type="email"
                                        autoComplete="email"
                                        disabled={isPending}
                                        {...field}
                                        onBlur={(e) => {
                                            field.onBlur();
                                            handleEmailBlur();
                                        }}
                                    />
                                    {isCheckingWaitlist && (
                                        <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
                                    )}
                                </div>
                            </FormControl>
                            {waitlistFound && (
                                <FormDescription className="text-emerald-600">
                                    Waitlist registration found - details pre-filled
                                </FormDescription>
                            )}
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Phone number</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="07700 900123"
                                    type="tel"
                                    autoComplete="tel"
                                    disabled={isPending}
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="tradeType"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Trade</FormLabel>
                            <Select
                                disabled={isPending}
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                            >
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select your trade" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="electrician">Electrician</SelectItem>
                                    <SelectItem value="plumber">Plumber</SelectItem>
                                    <SelectItem value="carpenter">Carpenter</SelectItem>
                                    <SelectItem value="painter">Painter & Decorator</SelectItem>
                                    <SelectItem value="builder">Builder</SelectItem>
                                    <SelectItem value="gas_engineer">Gas Engineer</SelectItem>
                                    <SelectItem value="roofer">Roofer</SelectItem>
                                    <SelectItem value="plasterer">Plasterer</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                                <div className="relative">
                                    <Input
                                        placeholder="Create a strong password"
                                        type={showPassword ? "text" : "password"}
                                        autoComplete="new-password"
                                        disabled={isPending}
                                        {...field}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        disabled={isPending}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-4 w-4" />
                                        ) : (
                                            <Eye className="h-4 w-4" />
                                        )}
                                    </button>
                                </div>
                            </FormControl>
                            <FormDescription className="text-xs">
                                Must be 8+ characters with uppercase, lowercase, number, and special character
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Confirm password</FormLabel>
                            <FormControl>
                                <div className="relative">
                                    <Input
                                        placeholder="Confirm your password"
                                        type={showConfirmPassword ? "text" : "password"}
                                        autoComplete="new-password"
                                        disabled={isPending}
                                        {...field}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        disabled={isPending}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        {showConfirmPassword ? (
                                            <EyeOff className="h-4 w-4" />
                                        ) : (
                                            <Eye className="h-4 w-4" />
                                        )}
                                    </button>
                                </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit" className="w-full" disabled={isPending}>
                    {isPending ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Creating account...
                        </>
                    ) : (
                        "Create account"
                    )}
                </Button>

                <p className="text-xs text-center text-muted-foreground">
                    By creating an account, you agree to our{" "}
                    <button type="button" className="underline hover:text-foreground" onClick={() => toast.info("Terms coming soon")}>
                        Terms of Service
                    </button>{" "}
                    and{" "}
                    <button type="button" className="underline hover:text-foreground" onClick={() => toast.info("Privacy policy coming soon")}>
                        Privacy Policy
                    </button>
                </p>
            </form>
        </Form>
    );
}