"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";

const TRADE_TYPES = [
    { value: "electrician", label: "Electrician" },
    { value: "plumber", label: "Plumber" },
    { value: "carpenter", label: "Carpenter" },
    { value: "painter", label: "Painter/Decorator" },
    { value: "builder", label: "Builder/General Contractor" },
    { value: "gas_engineer", label: "Gas Engineer" },
    { value: "roofer", label: "Roofer" },
    { value: "plasterer", label: "Plasterer" },
    { value: "landscaper", label: "Landscaper" },
    { value: "handyman", label: "Handyman" },
    { value: "other", label: "Other" },
];

export function WorkerSignupForm() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        full_name: "",
        email: "",
        phone: "",
        trade_type: "",
        postcode: "",
        years_experience: "",
        has_insurance: false,
        has_vehicle: false,
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        try {
            const response = await fetch("/api/worker-waitlist", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Failed to join waitlist");
            }

            router.push("/workwise/workers/thank-you");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Something went wrong");
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name & Email Row */}
            <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label htmlFor="full_name" className="text-sm font-medium flex items-center gap-2">
                        Full Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                        id="full_name"
                        type="text"
                        required
                        value={formData.full_name}
                        onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                        placeholder="John Smith"
                        className="h-12 bg-background border-border/50 focus:border-blue-500 transition-colors"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium flex items-center gap-2">
                        Email <span className="text-red-500">*</span>
                    </Label>
                    <Input
                        id="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="john@example.com"
                        className="h-12 bg-background border-border/50 focus:border-blue-500 transition-colors"
                    />
                </div>
            </div>

            {/* Phone & Trade Row */}
            <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label htmlFor="phone" className="text-sm font-medium flex items-center gap-2">
                        Phone Number <span className="text-red-500">*</span>
                    </Label>
                    <Input
                        id="phone"
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="07700 900123"
                        className="h-12 bg-background border-border/50 focus:border-blue-500 transition-colors"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="trade_type" className="text-sm font-medium flex items-center gap-2">
                        Trade <span className="text-red-500">*</span>
                    </Label>
                    <Select
                        required
                        value={formData.trade_type}
                        onValueChange={(value) => setFormData({...formData, trade_type: value})}
                    >
                        <SelectTrigger className="h-12 bg-background border-border/50 focus:border-blue-500">
                            <SelectValue placeholder="Select your trade"/>
                        </SelectTrigger>
                        <SelectContent className="bg-card dark:bg-card border-border shadow-xl backdrop-blur-none">
                            {TRADE_TYPES.map((trade) => (
                                <SelectItem
                                    key={trade.value}
                                    value={trade.value}
                                    className="hover:bg-accent focus:bg-accent cursor-pointer"
                                >
                                    {trade.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Postcode & Experience Row */}
            <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label htmlFor="postcode" className="text-sm font-medium flex items-center gap-2">
                        Postcode <span className="text-red-500">*</span>
                    </Label>
                    <Input
                        id="postcode"
                        type="text"
                        required
                        value={formData.postcode}
                        onChange={(e) => setFormData({...formData, postcode: e.target.value.toUpperCase()})}
                        placeholder="M1 1AA"
                        className="h-12 bg-background border-border/50 focus:border-blue-500 transition-colors"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="years_experience" className="text-sm font-medium">
                        Years of Experience <span className="text-muted-foreground text-xs">(Optional)</span>
                    </Label>
                    <Input
                        id="years_experience"
                        type="number"
                        min="0"
                        max="50"
                        value={formData.years_experience}
                        onChange={(e) => setFormData({ ...formData, years_experience: e.target.value })}
                        placeholder="5"
                        className="h-12 bg-background border-border/50 focus:border-blue-500 transition-colors"
                    />
                </div>
            </div>

            {/* Improved Checkboxes */}
            <div className="space-y-4 rounded-xl border border-border/50 bg-accent/30 p-6">
                <motion.div
                    className="flex items-center space-x-3 p-3 rounded-lg hover:bg-accent/50 transition-colors cursor-pointer"
                    whileHover={{ x: 5 }}
                >
                    <Checkbox
                        id="has_insurance"
                        checked={formData.has_insurance}
                        onCheckedChange={(checked: boolean) =>
                            setFormData({ ...formData, has_insurance: checked })
                        }
                        className="border-2 data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
                    />
                    <Label htmlFor="has_insurance" className="font-normal cursor-pointer text-sm leading-relaxed flex-1">
                        I have public liability insurance
                    </Label>
                </motion.div>

                <motion.div
                    className="flex items-center space-x-3 p-3 rounded-lg hover:bg-accent/50 transition-colors cursor-pointer"
                    whileHover={{ x: 5 }}
                >
                    <Checkbox
                        id="has_vehicle"
                        checked={formData.has_vehicle}
                        onCheckedChange={(checked: boolean) =>
                            setFormData({ ...formData, has_vehicle: checked })
                        }
                        className="border-2 data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
                    />
                    <Label htmlFor="has_vehicle" className="font-normal cursor-pointer text-sm leading-relaxed flex-1">
                        I have my own vehicle
                    </Label>
                </motion.div>
            </div>

            {/* Error message */}
            {error && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-sm text-red-600 dark:text-red-400"
                >
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    <span>{error}</span>
                </motion.div>
            )}

            {/* Submit button */}
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                    type="submit"
                    className="w-full h-14 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold text-base shadow-xl shadow-blue-500/30"
                    size="lg"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? (
                        <>
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            Joining Waitlist...
                        </>
                    ) : (
                        <>
                            <CheckCircle2 className="mr-2 h-5 w-5" />
                            Join the Waitlist
                        </>
                    )}
                </Button>
            </motion.div>

            <p className="text-xs text-center text-muted-foreground">
                By joining, you agree to be contacted about WorkWise when we launch. We respect your privacy.
            </p>
        </form>
    );
}