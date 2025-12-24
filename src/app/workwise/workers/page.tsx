"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
    Check,
    ArrowRight,
    XCircle,
    ClipboardList,
    Bot,
    Handshake,
    Wallet,
    Rocket,
    Target,
    Smartphone,
    Globe,
    Star,
    Zap,
    Sparkles,
    ChevronDown,
    Mail,
    MapPin,
    Wrench,
    Clock,
    CheckCircle2,
    ArrowDownRight,
    TrendingDown,
    ShieldAlert,
    ShieldCheck,
    TrendingUp,
} from "lucide-react";
import { useTheme } from "next-themes";
import { WorkerSignupForm } from "@/components/workwise/worker-signup-form";
import NavbarRedesign from "@/components/workwise/worker-navbar";

const floatAnimation = {
    initial: { y: 0 },
    animate: {
        y: [-10, 10, -10],
        transition: {
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut" as const,
        },
    },
};

// Mobile detection hook
function useIsMobile() {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    return isMobile;
}

const competitors = [
    { name: "Checkatrade", cost: "£70", monthlyCost: "300", details: "High monthly membership + vetting fees.", gradient: "from-red-400 to-red-600" },
    { name: "MyBuilder", cost: "£50", monthlyCost: "250", details: "Pay for every shortlist, even if you lose the job.", gradient: "from-orange-400 to-orange-600" },
    { name: "Rated People", cost: "£25", monthlyCost: "200", details: "Lead fees add up quickly for poor quality leads.", gradient: "from-amber-400 to-amber-600" },
    { name: "WorkWise", cost: "£0", isWorkWise: true, details: "No fees, no commissions, no BS. Just work.", gradient: "from-green-400 to-emerald-500" },
];

const howItWorksSteps = [
    {
        icon: ClipboardList,
        title: "Sign Up",
        description: "Quick 30-second registration. No payment details needed.",
        gradient: "from-blue-500 to-cyan-500",
    },
    {
        icon: Bot,
        title: "AI Interview",
        description: "Our AI learns about your skills, experience, and pricing.",
        gradient: "from-purple-500 to-pink-500",
    },
    {
        icon: Handshake,
        title: "Get Matched",
        description: "AI matches you with property managers who need your trade.",
        gradient: "from-orange-500 to-red-500",
    },
    {
        icon: Wallet,
        title: "Get Paid",
        description: "Complete jobs. Keep 100% of your earnings. Simple.",
        gradient: "from-green-500 to-emerald-500",
    },
];

const valueProps = [
    {
        title: "Instant Job Alerts",
        description: "No more refreshing directories. Get a notification the second a property manager posts a job in your area.",
        icon: Zap,
        gradient: "from-blue-400 to-cyan-400",
    },
    {
        title: "Verified Income",
        description: "Property managers pre-fund jobs. You know the money is there before you even pick up your tools.",
        icon: ShieldCheck,
        gradient: "from-purple-400 to-indigo-500",
    },
    {
        title: "Fast-Track Payments",
        description: "Payment is released the moment the job is signed off. No more chasing invoices for 30 days.",
        icon: Clock,
        gradient: "from-orange-400 to-pink-500",
    },
    {
        title: "Build Your Reputation",
        description: "A single, portable pro-profile that carries your reviews across the entire WorkWise network.",
        icon: TrendingUp,
        gradient: "from-emerald-400 to-teal-500",
    },
];

const timelinePhases = [
    {
        phase: "Phase 1",
        title: "Early Access",
        subtitle: "NOW",
        description: "Join the waitlist and be first in line",
        icon: Rocket,
        gradient: "from-blue-500 to-cyan-500",
        active: true,
    },
    {
        phase: "Phase 2",
        title: "Platform Launch",
        subtitle: "Feb 2026",
        description: "Start working with property managers",
        icon: Target,
        gradient: "from-purple-500 to-pink-500",
        active: false,
    },
    {
        phase: "Phase 3",
        title: "Consumer App",
        subtitle: "2026",
        description: "Homeowners join the platform",
        icon: Smartphone,
        gradient: "from-orange-500 to-red-500",
        active: false,
    },
    {
        phase: "Phase 4",
        title: "Full Marketplace",
        subtitle: "The Vision",
        description: "True Uber for Tradespeople",
        icon: Globe,
        gradient: "from-green-500 to-emerald-500",
        active: false,
    },
];

const faqItems = [
    {
        question: "Is it really free? What's the catch?",
        answer: "Yes, it's genuinely 100% free for tradespeople. We charge property managers a small platform fee for access to our network of vetted trades. You keep every penny you earn.",
    },
    {
        question: "How do you make money then?",
        answer: "We charge property managers (B2B clients) a subscription fee to access our platform. They pay, you don't. It's that simple.",
    },
    {
        question: "When is the platform launching?",
        answer: "We're planning to launch in February 2026, starting in Manchester and expanding across the UK. Join the waitlist to be notified when we go live in your area.",
    },
    {
        question: "What trades do you support?",
        answer: "We support all property maintenance trades: electricians, plumbers, carpenters, painters, builders, gas engineers, roofers, plasterers, and more.",
    },
    {
        question: "Do I need to pay for leads?",
        answer: "Absolutely not. Unlike platforms like Bark or MyBuilder where you pay £25-50 per lead, WorkWise matches are completely free. You only work, you never pay.",
    },
    {
        question: "How does the AI matching work?",
        answer: "When you sign up, our AI conducts a brief interview to understand your skills, experience, service area, and pricing. When jobs come in, we match you with the most suitable opportunities automatically.",
    },
    {
        question: "What kind of clients will I work with?",
        answer: "You'll work with professional property managers who manage 10-50+ properties each. These are repeat clients who need regular maintenance work - not one-off homeowners.",
    },
    {
        question: "Can I set my own prices?",
        answer: "Absolutely. You set your hourly rate, day rate, and any other pricing. We never dictate what you charge. Your business, your prices.",
    },
];

export default function WorkersLandingPage() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const isMobile = useIsMobile();

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 overflow-x-hidden transition-colors duration-300">
            <NavbarRedesign theme={theme} setTheme={setTheme} />

            {/* HERO SECTION */}
            <section className="relative overflow-hidden pt-32 pb-24 lg:pt-48 lg:pb-40 bg-gradient-to-b from-white to-slate-100 dark:from-slate-950 dark:to-slate-950">
                {/* Grid Pattern */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />

                {/* Ambient Glows */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-blue-600/10 dark:bg-blue-600/20 rounded-[100%] blur-[100px] -z-10" />
                <div className="absolute bottom-0 right-0 w-[800px] h-[600px] bg-purple-600/5 dark:bg-purple-600/10 rounded-[100%] blur-[120px] -z-10" />

                <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {/* Floating UI Demos */}
                    <motion.div
                        variants={floatAnimation}
                        initial="initial"
                        animate="animate"
                        className="hidden lg:block absolute left-4 top-1/3 -rotate-6 z-10"
                    >
                        <div className="w-72 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200 dark:border-slate-700 p-4 rounded-2xl shadow-2xl shadow-blue-500/10">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2">
                                    <div className="p-2 bg-blue-500/20 rounded-lg">
                                        <Wrench className="w-4 h-4 text-blue-500 dark:text-blue-400" />
                                    </div>
                                    <span className="font-semibold text-slate-900 dark:text-white text-sm">New Job Match</span>
                                </div>
                                <span className="text-xs text-slate-500 dark:text-slate-400">Just now</span>
                            </div>
                            <div className="space-y-2">
                                <div className="h-2 w-2/3 bg-slate-200 dark:bg-slate-700 rounded-full" />
                                <div className="h-2 w-1/2 bg-slate-200 dark:bg-slate-700 rounded-full" />
                            </div>
                            <div className="mt-4 flex items-center justify-between text-xs font-medium">
                                <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1">
                                    <MapPin className="w-3 h-3" /> 2.1 miles
                                </span>
                                <span className="text-green-600 dark:text-green-400">£120 est.</span>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        variants={floatAnimation}
                        initial="initial"
                        animate="animate"
                        className="hidden lg:block absolute right-4 top-40 rotate-3 z-10"
                    >
                        <div className="w-64 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200 dark:border-slate-700 p-4 rounded-2xl shadow-2xl shadow-purple-500/10">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-green-500/20 rounded-full">
                                    <Wallet className="w-5 h-5 text-green-600 dark:text-green-400" />
                                </div>
                                <div>
                                    <div className="text-xs text-slate-500 dark:text-slate-400">Total Earnings</div>
                                    <div className="text-lg font-bold text-slate-900 dark:text-white">£1,450.00</div>
                                </div>
                            </div>
                            <div className="mt-2 text-xs flex items-center gap-1 text-green-600 dark:text-green-400 bg-green-500/10 py-1 px-2 rounded-lg w-fit">
                                <Clock className="w-3 h-3" />
                                <span>Paid Instantly</span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Main Content */}
                    <div className="text-center max-w-4xl mx-auto relative z-20">
                        {/* Badge */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="inline-flex items-center justify-center"
                        >
                            <span className="relative inline-block overflow-hidden rounded-full p-[1px]">
                                <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
                                <div className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-white dark:bg-slate-950 px-4 py-1.5 text-sm font-medium text-slate-900 dark:text-white backdrop-blur-3xl">
                                    <Sparkles className="mr-2 h-3 w-3 text-purple-500 dark:text-purple-400" />
                                    Launching February 2026
                                </div>
                            </span>
                        </motion.div>

                        {/* Heading */}
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            className="mt-8 text-5xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-7xl lg:text-8xl"
                        >
                            The Uber for <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
                                Tradespeople
                            </span>
                        </motion.h1>

                        {/* Subtext */}
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="mt-6 text-lg leading-8 text-slate-600 dark:text-slate-400 max-w-2xl mx-auto"
                        >
                            Stop chasing leads. We match you with property managers instantly.
                            <span className="text-slate-900 dark:text-white font-medium block sm:inline sm:ml-1">
                                Zero fees. Zero hassle. Forever.
                            </span>
                        </motion.p>

                        {/* Buttons */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
                        >
                            <a
                                href="#signup"
                                className="relative inline-flex h-12 w-full sm:w-auto overflow-hidden rounded-lg p-[1px] focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 group"
                            >
                                <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#3B82F6_0%,#8B5CF6_50%,#3B82F6_100%)]" />
                                <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-lg bg-white dark:bg-slate-950 px-8 py-1 text-sm font-medium text-slate-900 dark:text-white backdrop-blur-3xl transition-colors group-hover:bg-slate-50 dark:group-hover:bg-slate-900">
                                    Join the Waitlist
                                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                </span>
                            </a>

                            <a
                                href="#why"
                                className="text-sm font-semibold leading-6 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors px-6 py-3"
                            >
                                How it works <span aria-hidden="true">→</span>
                            </a>
                        </motion.div>

                        {/* Trust Badges */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 1, delay: 0.5 }}
                            className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800/50 flex flex-wrap justify-center gap-x-8 gap-y-4 text-sm text-slate-500"
                        >
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="h-4 w-4 text-green-500" />
                                <span>100% Free for Trades</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="h-4 w-4 text-green-500" />
                                <span>No Credit Card Required</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="h-4 w-4 text-green-500" />
                                <span>UK-Based Platform</span>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* WHY SECTION */}
            <section id="why" className="relative py-24 lg:py-32 bg-white dark:bg-slate-950 overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />

                <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
                    {/* Header */}
                    <div className="text-center mb-20">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="inline-flex items-center gap-2 rounded-full border border-red-500/20 bg-red-500/10 px-4 py-1.5 mb-6"
                        >
                            <ShieldAlert className="h-4 w-4 text-red-500" />
                            <span className="text-sm font-medium text-red-600 dark:text-red-200">The Industry is Broken</span>
                        </motion.div>

                        <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-slate-900 dark:text-white mb-6">
                            Stop paying to <span className="text-red-500">work.</span>
                        </h2>
                        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                            Traditional platforms charge you for leads you don&apos;t win and memberships you don&apos;t need.
                            WorkWise flips the script.
                        </p>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-8 mb-32">
                        {/* Pain Card */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="group relative rounded-3xl border border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-slate-900/50 p-8 hover:border-red-500/30 transition-colors"
                        >
                            <div className="flex items-center gap-4 mb-8">
                                <div className="p-3 rounded-2xl bg-red-500/10 border border-red-500/20">
                                    <XCircle className="h-8 w-8 text-red-500" />
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">The Old Way</h3>
                            </div>

                            <ul className="space-y-6">
                                {["Paying £300+/mo just to be 'listed'", "Lead fees for jobs you never get", "Competing with 10 others for one tap", "Losing 20% of your hard-earned cash"].map((text, i) => (
                                    <li key={i} className="flex items-center gap-3 text-slate-600 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-300 transition-colors">
                                        <ArrowDownRight className="h-5 w-5 text-red-500 shrink-0" />
                                        <span>{text}</span>
                                    </li>
                                ))}
                            </ul>
                        </motion.div>

                        {/* WorkWise Card */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="relative rounded-3xl border border-blue-500/30 bg-blue-50 dark:bg-blue-600/5 p-8 shadow-[0_0_40px_rgba(37,99,235,0.1)] overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-4">
                                <Sparkles className="h-24 w-24 text-blue-500/10 rotate-12" />
                            </div>

                            <div className="flex items-center gap-4 mb-8">
                                <div className="p-3 rounded-2xl bg-blue-500 border border-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.5)]">
                                    <CheckCircle2 className="h-8 w-8 text-white" />
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">The WorkWise Way</h3>
                            </div>

                            <ul className="space-y-6">
                                {["Zero monthly fees. Forever.", "Zero lead fees. Every match is free.", "Keep 100% of your earnings.", "Direct matches with Property Managers."].map((text, i) => (
                                    <li key={i} className="flex items-center gap-3 text-slate-900 dark:text-white font-medium">
                                        <div className="h-2 w-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(96,165,250,0.8)]" />
                                        <span>{text}</span>
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    </div>

                    {/* Cost Savings */}
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 rounded-full border border-green-500/20 bg-green-500/10 px-4 py-1.5 mb-6">
                            <TrendingDown className="h-4 w-4 text-green-500" />
                            <span className="text-sm font-medium text-green-600 dark:text-green-200">Financial Impact</span>
                        </div>
                        <h2 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
                            What you&apos;re currently wasting
                        </h2>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                        {competitors.map((comp, i) => (
                            <motion.div
                                key={comp.name}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className={`relative p-8 rounded-[2rem] border transition-all duration-500 ${
                                    comp.isWorkWise
                                        ? "bg-white dark:bg-slate-900/80 border-blue-500/50 shadow-[0_0_30px_rgba(59,130,246,0.15)] ring-1 ring-blue-400/20 scale-105 z-10"
                                        : "bg-slate-100 dark:bg-slate-950/40 border-slate-200 dark:border-white/5 opacity-70 grayscale-[0.3]"
                                }`}
                            >
                                {comp.isWorkWise && (
                                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[10px] font-black tracking-widest px-4 py-1 rounded-full shadow-[0_0_15px_rgba(37,99,235,0.5)] uppercase">
                                        The Better Way
                                    </div>
                                )}

                                <h4 className={`text-xs font-black uppercase tracking-widest mb-4 ${comp.isWorkWise ? "text-blue-500" : "text-slate-400 dark:text-slate-600"}`}>
                                    {comp.name}
                                </h4>

                                <div className="flex items-baseline gap-1 mb-2">
                                    <span className={`text-4xl font-black tracking-tight ${comp.isWorkWise ? "text-slate-900 dark:text-white" : "text-slate-400 dark:text-slate-700 line-through"}`}>
                                        {comp.cost}
                                    </span>
                                    {comp.isWorkWise && <span className="text-blue-500 font-bold ml-1">Total</span>}
                                </div>

                                {!comp.isWorkWise ? (
                                    <div className="text-red-500/70 text-xs font-bold mb-6">~£{comp.monthlyCost}/mo wasted</div>
                                ) : (
                                    <div className="text-green-600 dark:text-green-400 text-xs font-bold mb-6 flex items-center gap-1.5">
                                        <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                                        Keep 100% of your earnings
                                    </div>
                                )}

                                <p className={`text-sm leading-relaxed ${comp.isWorkWise ? "text-slate-600 dark:text-slate-300" : "text-slate-500 dark:text-slate-600"}`}>
                                    {comp.details}
                                </p>

                                {comp.isWorkWise && (
                                    <div className="absolute inset-0 bg-blue-500/5 rounded-[2rem] pointer-events-none overflow-hidden">
                                        <motion.div
                                            animate={{ x: ["-100%", "100%"] }}
                                            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                                            className="absolute top-0 bottom-0 w-1/2 bg-gradient-to-r from-transparent via-blue-500/10 to-transparent skew-x-12"
                                        />
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </div>

                    {/* Big Savings Number */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="relative rounded-[2.5rem] bg-gradient-to-br from-blue-600 to-indigo-700 p-12 text-center overflow-hidden shadow-2xl"
                    >
                        <div className="absolute -top-24 -left-24 w-64 h-64 bg-white/10 rounded-full blur-3xl" />

                        <div className="relative z-10">
                            <h3 className="text-white/80 font-semibold mb-2">Potential Yearly Savings</h3>
                            <div className="text-6xl md:text-8xl font-black text-white mb-6 tracking-tighter">
                                £3,600<span className="text-blue-200">+</span>
                            </div>
                            <p className="text-blue-100 max-w-lg mx-auto mb-8">
                                Based on the average UK tradesperson spending £300/month on leads and directories.
                            </p>
                            <a
                                href="#signup"
                                className="inline-flex items-center gap-2 bg-white text-blue-600 px-8 py-4 rounded-xl font-bold hover:bg-blue-50 transition-all shadow-xl hover:scale-105 active:scale-95"
                            >
                                Stop Paying Fees
                                <ArrowDownRight className="w-5 h-5 rotate-[225deg]" />
                            </a>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* HOW IT WORKS */}
            <section id="how-it-works" className="relative py-24 lg:py-32 overflow-hidden bg-slate-50 dark:bg-slate-950">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
                    <div className="absolute top-[20%] left-[10%] w-72 h-72 bg-blue-500/10 rounded-full blur-[100px]" />
                    <div className="absolute bottom-[20%] right-[10%] w-72 h-72 bg-purple-500/10 rounded-full blur-[100px]" />
                </div>

                <div className="relative mx-auto max-w-5xl px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-20"
                    >
                        <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 dark:bg-blue-900/20 px-4 py-1.5 mb-6 backdrop-blur-sm">
                            <Zap className="h-4 w-4 text-blue-500 dark:text-blue-400 fill-blue-400/20" />
                            <span className="text-sm font-medium text-blue-600 dark:text-blue-200">Streamlined Process</span>
                        </div>

                        <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 dark:text-white mb-6">
                            From setup to success in{" "}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
                                four steps
                            </span>
                        </h2>

                        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
                            We&apos;ve stripped away the complexity. Follow our simple roadmap to automate your workflow and scale your output instantly.
                        </p>
                    </motion.div>

                    <div className="relative">
                        <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-slate-300 dark:via-slate-700 to-transparent -translate-x-1/2" />

                        <div className="space-y-12 md:space-y-24">
                            {howItWorksSteps.map((step, index) => {
                                const isEven = index % 2 === 0;

                                return (
                                    <motion.div
                                        key={step.title}
                                        initial={{ opacity: 0, y: 50 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true, margin: "-100px" }}
                                        transition={{ duration: 0.5, delay: index * 0.1 }}
                                        className={`relative flex flex-col md:flex-row items-center gap-8 ${isEven ? "md:flex-row-reverse" : ""}`}
                                    >
                                        <div className={`flex-1 text-center ${isEven ? "md:text-left" : "md:text-right"}`}>
                                            <div className="relative z-10 p-6 md:p-8 rounded-2xl border border-slate-200 dark:border-white/5 bg-white dark:bg-white/[0.02] backdrop-blur-sm hover:bg-slate-50 dark:hover:bg-white/[0.04] transition-colors duration-300 group">
                                                <div className="md:hidden mx-auto mb-4 w-12 h-12 rounded-lg bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 border border-slate-200 dark:border-slate-700 flex items-center justify-center">
                                                    <step.icon className="w-6 h-6 text-slate-700 dark:text-white" />
                                                </div>

                                                <h3 className="text-xl md:text-2xl font-semibold text-slate-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-300 transition-colors">
                                                    {step.title}
                                                </h3>
                                                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{step.description}</p>
                                            </div>
                                        </div>

                                        <div className="relative flex items-center justify-center w-12 h-12 shrink-0 z-20">
                                            <div className="absolute inset-0 bg-white dark:bg-slate-950 rounded-full border-4 border-slate-100 dark:border-slate-900" />
                                            <div className={`relative w-4 h-4 rounded-full bg-gradient-to-r ${step.gradient} shadow-[0_0_15px_rgba(59,130,246,0.5)]`} />
                                        </div>

                                        <div className={`flex-1 flex ${isEven ? "justify-end" : "justify-start"}`}>
                                            <div className="hidden md:flex items-center justify-center w-24 h-24 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 border border-slate-200 dark:border-slate-700 shadow-2xl shadow-black/10 dark:shadow-black/50 relative overflow-hidden group">
                                                <div className={`absolute inset-0 opacity-20 bg-gradient-to-br ${step.gradient} group-hover:opacity-30 transition-opacity duration-500`} />
                                                <step.icon className="w-10 h-10 text-slate-700 dark:text-white relative z-10" />
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="mt-20 text-center"
                    >
                        <a
                            href="#signup"
                            className="px-8 py-4 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-950 font-bold hover:bg-slate-800 dark:hover:bg-blue-50 transition-colors shadow-[0_0_20px_rgba(0,0,0,0.1)] dark:shadow-[0_0_20px_rgba(255,255,255,0.3)]"
                        >
                            Get Started Now
                        </a>
                    </motion.div>
                </div>
            </section>

            {/* VALUE PROPOSITION CARDS */}
            <section className="relative py-24 lg:py-32 bg-white dark:bg-slate-950 overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.05),transparent_70%)] pointer-events-none" />

                <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-20"
                    >
                        <div className="inline-flex items-center gap-2 rounded-full border border-orange-500/20 bg-orange-500/10 px-4 py-1.5 mb-6">
                            <Star className="h-4 w-4 text-orange-500 fill-orange-400/20" />
                            <span className="text-sm font-medium text-orange-600 dark:text-orange-200">The Tradesman&apos;s Advantage</span>
                        </div>
                        <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-slate-900 dark:text-white mb-6">
                            Why Trades{" "}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-pink-500">Love Us</span>
                        </h2>
                        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                            We didn&apos;t just build another directory. We built a tool that helps you run a more profitable business with less stress.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
                        {valueProps.map((prop, i) => (
                            <motion.div
                                key={prop.title}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                whileHover={{ y: -5 }}
                                className={`relative group overflow-hidden rounded-[2.5rem] border border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-slate-900/40 p-8 md:p-10 ${
                                    i === 0 || i === 3 ? "md:col-span-3" : "md:col-span-3 lg:col-span-3"
                                }`}
                            >
                                <div className={`absolute inset-0 bg-gradient-to-br ${prop.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />

                                <div className="relative z-10 flex flex-col h-full">
                                    <div className={`mb-8 w-14 h-14 rounded-2xl bg-gradient-to-br ${prop.gradient} p-0.5 shadow-lg shadow-black/20`}>
                                        <div className="w-full h-full bg-white dark:bg-slate-900 rounded-[calc(1rem-2px)] flex items-center justify-center">
                                            <prop.icon className="w-7 h-7 text-slate-700 dark:text-white" />
                                        </div>
                                    </div>

                                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 group-hover:text-blue-600 dark:group-hover:text-blue-300 transition-colors">
                                        {prop.title}
                                    </h3>

                                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-lg">{prop.description}</p>

                                    <div className="mt-8 pt-8 border-t border-slate-200 dark:border-white/5 flex items-center gap-2 text-xs font-bold tracking-widest text-slate-400 dark:text-slate-500 uppercase">
                                        <div className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse" />
                                        Live Feature
                                    </div>
                                </div>

                                <prop.icon className="absolute -bottom-8 -right-8 w-32 h-32 text-slate-200 dark:text-white/[0.02] group-hover:text-slate-300 dark:group-hover:text-white/[0.05] transition-all duration-500 rotate-12" />
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* THE VISION - TIMELINE */}
            <section id="vision" className="relative py-24 lg:py-32 bg-slate-50 dark:bg-slate-950 overflow-hidden">
                <div className="mx-auto max-w-5xl px-6 relative">
                    <div className="text-center mb-20">
                        <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/20 bg-purple-500/10 px-4 py-1.5 mb-4">
                            <Rocket className="h-4 w-4 text-purple-500" />
                            <span className="text-sm font-medium text-purple-600 dark:text-purple-200">Our Roadmap</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white tracking-tight">
                            Building the{" "}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500">Future of Trade</span>
                        </h2>
                    </div>

                    <div className="relative">
                        <div className="absolute left-8 lg:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-blue-500 via-purple-500 to-transparent lg:-translate-x-1/2 opacity-30" />

                        <div className="space-y-12">
                            {timelinePhases.map((phase, i) => (
                                <motion.div
                                    key={phase.title}
                                    initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    className={`relative flex items-center justify-between flex-row-reverse lg:flex-row ${i % 2 === 0 ? "lg:flex-row-reverse" : ""}`}
                                >
                                    <div className="w-[calc(100%-4rem)] lg:w-[45%] p-6 rounded-2xl border border-slate-200 dark:border-white/5 bg-white dark:bg-slate-900/50 backdrop-blur-sm">
                                        <span className={`text-xs font-bold uppercase tracking-widest ${phase.active ? "text-blue-500" : "text-slate-400 dark:text-slate-500"}`}>
                                            {phase.subtitle}
                                        </span>
                                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-1 mb-2">{phase.title}</h3>
                                        <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{phase.description}</p>
                                    </div>

                                    <div className="absolute left-8 lg:left-1/2 -translate-x-1/2 flex items-center justify-center">
                                        <div className={`h-10 w-10 rounded-xl flex items-center justify-center bg-white dark:bg-slate-900 border ${phase.active ? "border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)]" : "border-slate-200 dark:border-slate-700"}`}>
                                            <phase.icon className={`h-5 w-5 ${phase.active ? "text-blue-500" : "text-slate-400 dark:text-slate-500"}`} />
                                        </div>
                                    </div>

                                    <div className="hidden lg:block w-[45%]" />
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ SECTION */}
            <section id="faq" className="py-24 bg-white dark:bg-slate-950 px-6">
                <div className="mx-auto max-w-3xl">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">Common Questions</h2>
                        <p className="text-slate-600 dark:text-slate-400">Everything you need to know about the platform.</p>
                    </div>

                    <div className="space-y-4">
                        {faqItems.map((item, i) => (
                            <motion.div
                                key={i}
                                className="group rounded-2xl border border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-slate-900/40 overflow-hidden transition-all hover:border-blue-500/30"
                            >
                                <details className="group">
                                    <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
                                        <span className="text-lg font-semibold text-slate-700 dark:text-slate-200 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                                            {item.question}
                                        </span>
                                        <span className="text-blue-500 transition-transform group-open:rotate-180">
                                            <ChevronDown size={20} />
                                        </span>
                                    </summary>
                                    <div className="px-6 pb-6 text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-200 dark:border-white/5 pt-4">
                                        {item.answer}
                                    </div>
                                </details>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* SIGNUP SECTION */}
            <section id="signup" className="py-24 px-6 bg-slate-50 dark:bg-slate-950">
                <div className="mx-auto max-w-4xl relative">
                    <div className="absolute inset-0 bg-blue-600/10 dark:bg-blue-600/20 blur-[120px] rounded-full" />

                    <div className="relative rounded-[3rem] border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/80 backdrop-blur-2xl p-8 md:p-16 overflow-hidden shadow-xl">
                        <div className="text-center relative z-10">
                            <div className="inline-flex items-center gap-2 rounded-full bg-green-500/10 border border-green-500/20 px-4 py-1.5 mb-8">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                </span>
                                <span className="text-xs font-bold text-green-600 dark:text-green-400 uppercase tracking-widest">Early Access Open</span>
                            </div>

                            <h2 className="text-4xl md:text-6xl font-bold text-slate-900 dark:text-white mb-6">
                                Join the{" "}
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500">Waitlist</span>
                            </h2>
                            <p className="text-slate-600 dark:text-slate-400 text-lg mb-10 max-w-xl mx-auto">
                                We&apos;re launching soon in the UK. Join 500+ tradespeople already on the list.
                            </p>

                            <div className="max-w-md mx-auto">
                                <WorkerSignupForm />
                            </div>

                            <div className="mt-12 flex flex-wrap justify-center gap-8 text-xs font-medium text-slate-500 border-t border-slate-200 dark:border-white/5 pt-8">
                                <div className="flex items-center gap-2">
                                    <Check className="text-green-500" size={14} /> 30-Second Signup
                                </div>
                                <div className="flex items-center gap-2">
                                    <Check className="text-green-500" size={14} /> No Credit Card
                                </div>
                                <div className="flex items-center gap-2">
                                    <Check className="text-green-500" size={14} /> UK Based
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* FOOTER */}
            <footer className="bg-white dark:bg-slate-950 pt-20 pb-10 border-t border-slate-200 dark:border-white/5 px-6">
                <div className="mx-auto max-w-7xl">
                    <div className="grid md:grid-cols-4 gap-12 mb-16">
                        <div className="col-span-2">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="h-10 w-10 rounded-xl bg-blue-600 flex items-center justify-center font-bold text-white">W</div>
                                <span className="text-xl font-bold text-slate-900 dark:text-white">WorkWise</span>
                            </div>
                            <p className="text-slate-600 dark:text-slate-400 max-w-xs leading-relaxed">
                                The Uber for tradespeople. No lead fees, no commissions. Just honest work for honest trades.
                            </p>
                        </div>
                        <div>
                            <h4 className="text-slate-900 dark:text-white font-bold mb-6">Navigation</h4>
                            <ul className="space-y-4 text-slate-600 dark:text-slate-400 text-sm">
                                <li>
                                    <a href="#why" className="hover:text-blue-500 transition-colors">
                                        Why WorkWise
                                    </a>
                                </li>
                                <li>
                                    <a href="#how-it-works" className="hover:text-blue-500 transition-colors">
                                        How it Works
                                    </a>
                                </li>
                                <li>
                                    <a href="#faq" className="hover:text-blue-500 transition-colors">
                                        Support
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-slate-900 dark:text-white font-bold mb-6">Contact</h4>
                            <ul className="space-y-4 text-slate-600 dark:text-slate-400 text-sm">
                                <li className="flex items-center gap-2">
                                    <Mail size={16} /> hello@edentechnologies.co.uk
                                </li>
                                <li className="flex items-center gap-2">
                                    <MapPin size={16} /> Wigan, UK
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="pt-8 border-t border-slate-200 dark:border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
                        <p>© 2025 Eden Technologies Ltd. All rights reserved.</p>
                        <div className="flex gap-6">
                            <a href="/workwise/privacy" className="hover:text-slate-900 dark:hover:text-white transition-colors">
                                Privacy Policy
                            </a>
                            <a href="/workwise/terms" className="hover:text-slate-900 dark:hover:text-white transition-colors">
                                Terms of Service
                            </a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
