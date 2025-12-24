"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Loader2, CheckCircle2, AlertCircle, ChevronDown } from "lucide-react";
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

    // Shared input styles for light/dark mode
    const inputStyles = "w-full h-12 px-4 rounded-xl bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all";
    const labelStyles = "block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2";

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name & Email Row */}
            <div className="grid md:grid-cols-2 gap-6">
                <div>
                    <label htmlFor="full_name" className={labelStyles}>
                        Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                        id="full_name"
                        type="text"
                        required
                        value={formData.full_name}
                        onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                        placeholder="John Smith"
                        className={inputStyles}
                    />
                </div>

                <div>
                    <label htmlFor="email" className={labelStyles}>
                        Email <span className="text-red-500">*</span>
                    </label>
                    <input
                        id="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="john@example.com"
                        className={inputStyles}
                    />
                </div>
            </div>

            {/* Phone & Trade Row */}
            <div className="grid md:grid-cols-2 gap-6">
                <div>
                    <label htmlFor="phone" className={labelStyles}>
                        Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                        id="phone"
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="07700 900123"
                        className={inputStyles}
                    />
                </div>

                <div>
                    <label htmlFor="trade_type" className={labelStyles}>
                        Trade <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                        <select
                            id="trade_type"
                            required
                            value={formData.trade_type}
                            onChange={(e) => setFormData({ ...formData, trade_type: e.target.value })}
                            className={`${inputStyles} appearance-none cursor-pointer pr-10`}
                        >
                            <option value="" disabled className="bg-white dark:bg-slate-900 text-slate-400">
                                Select your trade
                            </option>
                            {TRADE_TYPES.map((trade) => (
                                <option
                                    key={trade.value}
                                    value={trade.value}
                                    className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                                >
                                    {trade.label}
                                </option>
                            ))}
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 pointer-events-none" />
                    </div>
                </div>
            </div>

            {/* Postcode & Experience Row */}
            <div className="grid md:grid-cols-2 gap-6">
                <div>
                    <label htmlFor="postcode" className={labelStyles}>
                        Postcode <span className="text-red-500">*</span>
                    </label>
                    <input
                        id="postcode"
                        type="text"
                        required
                        value={formData.postcode}
                        onChange={(e) => setFormData({ ...formData, postcode: e.target.value.toUpperCase() })}
                        placeholder="M1 1AA"
                        className={inputStyles}
                    />
                </div>

                <div>
                    <label htmlFor="years_experience" className={labelStyles}>
                        Years of Experience <span className="text-slate-400 dark:text-slate-500 text-xs">(Optional)</span>
                    </label>
                    <input
                        id="years_experience"
                        type="number"
                        min="0"
                        max="50"
                        value={formData.years_experience}
                        onChange={(e) => setFormData({ ...formData, years_experience: e.target.value })}
                        placeholder="5"
                        className={inputStyles}
                    />
                </div>
            </div>

            {/* Checkboxes */}
            <div className="space-y-4 rounded-2xl border border-slate-200 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-800/30 p-6">
                <label className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700/30 transition-colors cursor-pointer group">
                    <input
                        type="checkbox"
                        checked={formData.has_insurance}
                        onChange={(e) => setFormData({ ...formData, has_insurance: e.target.checked })}
                        className="w-5 h-5 rounded border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-blue-500 focus:ring-blue-500 focus:ring-offset-0 focus:ring-2 cursor-pointer"
                    />
                    <span className="text-sm text-slate-600 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                        I have public liability insurance
                    </span>
                </label>

                <label className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700/30 transition-colors cursor-pointer group">
                    <input
                        type="checkbox"
                        checked={formData.has_vehicle}
                        onChange={(e) => setFormData({ ...formData, has_vehicle: e.target.checked })}
                        className="w-5 h-5 rounded border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-blue-500 focus:ring-blue-500 focus:ring-offset-0 focus:ring-2 cursor-pointer"
                    />
                    <span className="text-sm text-slate-600 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                        I have my own vehicle
                    </span>
                </label>
            </div>

            {/* Error message */}
            {error && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl text-sm text-red-600 dark:text-red-400"
                >
                    <AlertCircle className="h-5 w-5 shrink-0" />
                    <span>{error}</span>
                </motion.div>
            )}

            {/* Submit button */}
            <motion.button
                type="submit"
                disabled={isSubmitting}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full h-14 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold text-base shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
                {isSubmitting ? (
                    <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Joining Waitlist...
                    </>
                ) : (
                    <>
                        <CheckCircle2 className="h-5 w-5" />
                        Join the Waitlist
                    </>
                )}
            </motion.button>

            <p className="text-xs text-center text-slate-500">
                By joining, you agree to be contacted about WorkWise when we launch. We respect your privacy.
            </p>
        </form>
    );
}
