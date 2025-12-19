"use client";

import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
    Moon,
    Sun,
    Check,
    ArrowRight,
    Clock,
    Users,
    TrendingUp,
    Shield,
    Zap,
    DollarSign,
    Phone,
    Mail,
    MapPin,
    TrendingDown,
    Sparkles,
    Menu,
    X,
    BadgeCheck,
    Lock,
    House,
    AlertTriangle,
    XCircle,
    Wrench,
    Paintbrush,
    Plug,
    Droplets,
    Hammer,
    Scissors,
    TreeDeciduous,
    HelpCircle,
    ChevronDown
} from "lucide-react";
import { useTheme } from "next-themes";
import { WorkerSignupForm } from "@/components/workwise/worker-signup-form";

const stats = [
    { label: "Trades onboarded", value: "Launching", icon: Users, color: "from-blue-500 to-cyan-500" },
    { label: "Property jobs", value: "Launching", icon: House, color: "from-green-500 to-emerald-500" },
    { label: "AI match speed", value: "Seconds", icon: Clock, color: "from-purple-500 to-pink-500" },
    { label: "Platform status", value: "Early access", icon: Lock, color: "from-orange-500 to-red-500" },
];

const features = [
    {
        icon: DollarSign,
        title: "Zero Commission",
        description: "Keep 100% of your earnings. Unlike Bark (£3-15/lead) or Checkatrade (£100-300/mo), we charge property managers, not you.",
        highlight: "Save £500+/month",
        color: "from-green-400 to-emerald-500"
    },
    {
        icon: Zap,
        title: "Instant Matching",
        description: "AI matches you with jobs in seconds based on your trade, location, and availability. No more waiting days for leads.",
        highlight: "5x faster",
        color: "from-yellow-400 to-orange-500"
    },
    {
        icon: TrendingUp,
        title: "Recurring Work",
        description: "Property managers with 10-50+ properties each mean steady, recurring work. Build long-term relationships, not one-off jobs.",
        highlight: "Steady income",
        color: "from-blue-400 to-purple-500"
    },
    {
        icon: Shield,
        title: "Quality Clients",
        description: "Verified property managers only. Professional clients who pay on time and respect your work. No tire-kickers.",
        highlight: "Professional",
        color: "from-purple-400 to-pink-500"
    },
];

const trustBadges = [
    { label: "UK-Based Platform", icon: MapPin },
    { label: "No Fees for Trades", icon: BadgeCheck },
    { label: "Direct Client Contact", icon: Users },
    { label: "Built With Property Managers", icon: House },
];

// Mobile detection hook
function useIsMobile() {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        // Check on mount
        checkMobile();

        // Listen for resize
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    return isMobile;
}

export default function WorkersLandingPage() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const isMobile = useIsMobile();

    useEffect(() => {
        setMounted(true);
    }, []);

    // Close mobile menu when clicking anchor links
    const handleMobileNavClick = () => {
        setMobileMenuOpen(false);
    };

    // Memoized animation variants - disabled on mobile for performance
    const fadeInUp = useMemo(() =>
        isMobile ? {} : { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } },
        [isMobile]
    );

    const fadeInRight = useMemo(() =>
        isMobile ? {} : { initial: { opacity: 0, x: 20 }, animate: { opacity: 1, x: 0 } },
        [isMobile]
    );

    const scaleIn = useMemo(() =>
        isMobile ? {} : { initial: { scale: 0.8, opacity: 0 }, animate: { scale: 1, opacity: 1 } },
        [isMobile]
    );

    // whileInView props - disabled on mobile
    const whileInViewProps = useMemo(() =>
        isMobile ? {} : {
            initial: { opacity: 0, y: 20 },
            whileInView: { opacity: 1, y: 0 },
            viewport: { once: true }
        },
        [isMobile]
    );

    if (!mounted) {
        return null;
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Background Elements - Static on mobile, animated on desktop */}
            <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
                {isMobile ? (
                    // Static backgrounds for mobile - reduced blur
                    <>
                        <div className="absolute top-0 -right-1/4 h-96 w-96 rounded-full bg-gradient-to-br from-blue-500/10 to-purple-600/10 dark:from-blue-500/20 dark:to-purple-600/20 blur-2xl" />
                        <div className="absolute bottom-0 -left-1/4 h-96 w-96 rounded-full bg-gradient-to-br from-purple-500/10 to-pink-600/10 dark:from-purple-500/20 dark:to-pink-600/20 blur-2xl" />
                    </>
                ) : (
                    // Animated backgrounds for desktop
                    <>
                        <motion.div
                            animate={{
                                scale: [1, 1.2, 1],
                                rotate: [0, 90, 0],
                            }}
                            transition={{
                                duration: 20,
                                repeat: Infinity,
                                ease: "linear"
                            }}
                            className="absolute top-0 -right-1/4 h-96 w-96 rounded-full bg-gradient-to-br from-blue-500/10 to-purple-600/10 dark:from-blue-500/20 dark:to-purple-600/20 blur-3xl will-change-transform"
                        />
                        <motion.div
                            animate={{
                                scale: [1, 1.3, 1],
                                rotate: [0, -90, 0],
                            }}
                            transition={{
                                duration: 25,
                                repeat: Infinity,
                                ease: "linear"
                            }}
                            className="absolute bottom-0 -left-1/4 h-96 w-96 rounded-full bg-gradient-to-br from-purple-500/10 to-pink-600/10 dark:from-purple-500/20 dark:to-purple-600/20 blur-3xl will-change-transform"
                        />
                    </>
                )}
            </div>

            {/* Navigation */}
            <nav className="fixed top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 items-center justify-between">
                        {/* Logo */}
                        <div className="flex items-center gap-3">
                            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg shadow-blue-500/30">
                                <span className="text-lg font-bold text-white">W</span>
                            </div>
                            <div>
                                <div className="text-lg font-bold tracking-tight">WorkWise</div>
                                <div className="text-xs text-muted-foreground">For Tradespeople</div>
                            </div>
                        </div>

                        {/* Desktop Nav */}
                        <div className="hidden items-center gap-6 md:flex">
                            <a href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                                Benefits
                            </a>
                            <a href="#how-it-works" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                                How It Works
                            </a>
                            <a
                                href="#signup"
                                className="group relative overflow-hidden rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/30 hover:shadow-xl transition-shadow"
                            >
                                <span className="relative z-10">Join Waitlist</span>
                            </a>
                        </div>

                        {/* Right side buttons */}
                        <div className="flex items-center gap-2">
                            {/* Theme Toggle */}
                            <button
                                aria-label="Light Mode or Dark Mode"
                                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                                className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-card hover:bg-accent transition-colors active:scale-95"
                            >
                                {theme === "dark" ? (
                                    <Sun className="h-5 w-5 text-yellow-500" />
                                ) : (
                                    <Moon className="h-5 w-5 text-blue-500" />
                                )}
                            </button>

                            {/* Mobile Menu Toggle */}
                            <button
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-card hover:bg-accent transition-colors md:hidden active:scale-95"
                                aria-label="Toggle menu"
                            >
                                {mobileMenuOpen ? (
                                    <X className="h-5 w-5" />
                                ) : (
                                    <Menu className="h-5 w-5" />
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Mobile Menu */}
                    {mobileMenuOpen && (
                        <div className="md:hidden border-t border-border/40 py-4">
                            <div className="flex flex-col gap-4">
                                <a
                                    href="#features"
                                    onClick={handleMobileNavClick}
                                    className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-2 py-2"
                                >
                                    Benefits
                                </a>
                                <a
                                    href="#how-it-works"
                                    onClick={handleMobileNavClick}
                                    className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-2 py-2"
                                >
                                    How It Works
                                </a>
                                <a
                                    href="#signup"
                                    onClick={handleMobileNavClick}
                                    className="inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-3 text-sm font-semibold text-white shadow-lg"
                                >
                                    Join Waitlist
                                </a>
                            </div>
                        </div>
                    )}
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative overflow-hidden px-4 pt-24 pb-16 sm:px-6 sm:pt-28 lg:px-8 lg:pt-32 lg:pb-24">
                <div className="mx-auto max-w-7xl">
                    <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
                        {/* Left Column */}
                        <motion.div
                            {...fadeInUp}
                            transition={{ duration: 0.5 }}
                            className="text-center lg:text-left"
                        >
                            {/* Badge */}
                            <div className="inline-flex items-center gap-2 rounded-full border border-green-500/20 bg-green-500/10 px-4 py-2 mb-6 mx-auto lg:mx-0">
                                <div className="flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-green-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                </div>
                                <span className="text-sm font-medium">Platform launching with B2B partners</span>
                            </div>

                            {/* Headline */}
                            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl mb-6">
                                Get More Work.
                                <br />
                                <span className="relative inline-block">
                                    <span className="bg-gradient-to-r from-blue-500 via-purple-600 to-pink-500 bg-clip-text text-transparent">
                                        Keep More Money.
                                    </span>
                                    <div
                                        className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-600 to-pink-500"
                                        style={{
                                            animation: isMobile ? 'none' : 'scaleX 0.8s ease-out 0.5s forwards',
                                            transform: isMobile ? 'scaleX(1)' : 'scaleX(0)',
                                            transformOrigin: 'left'
                                        }}
                                    />
                                </span>
                            </h1>

                            {/* Subheadline */}
                            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                                Join WorkWise and get matched with property managers who need your services.
                                <strong className="text-foreground font-semibold"> Zero commission. Zero fees. Forever.</strong>
                            </p>

                            {/* Value Props */}
                            <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-8 max-w-md mx-auto lg:mx-0">
                                {[
                                    { icon: TrendingDown, text: "No monthly fees", color: "text-green-500" },
                                    { icon: Zap, text: "Fast job matching", color: "text-blue-500" },
                                    { icon: Shield, text: "Professional B2B clients", color: "text-purple-500" },
                                    { icon: TrendingUp, text: "Consistent property work", color: "text-orange-500" },
                                ].map((item, i) => (
                                    <div
                                        key={i}
                                        className="flex items-center justify-center lg:justify-start gap-2"
                                    >
                                        <item.icon className={`h-5 w-5 flex-shrink-0 ${item.color}`} />
                                        <span className="text-sm font-medium">{item.text}</span>
                                    </div>
                                ))}
                            </div>

                            {/* CTA Buttons */}
                            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center lg:justify-start mb-8">
                                <a
                                    href="#signup"
                                    className="group relative overflow-hidden inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 px-8 py-4 text-base font-semibold text-white shadow-xl shadow-blue-500/30 hover:shadow-2xl transition-shadow active:scale-[0.98]"
                                >
                                    <span className="relative z-10">Join the Waitlist</span>
                                    <ArrowRight className="h-5 w-5 relative z-10 group-hover:translate-x-1 transition-transform" />
                                </a>
                                <a
                                    href="#features"
                                    className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-border px-8 py-4 text-base font-semibold hover:bg-accent transition-colors active:scale-[0.98]"
                                >
                                    Learn More
                                </a>
                            </div>
                        </motion.div>

                        {/* Right Column - Platform Preview */}
                        <motion.div
                            {...fadeInRight}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="relative hidden sm:block"
                        >
                            <div className={`relative rounded-3xl border border-border/50 bg-card/50 backdrop-blur-xl p-6 sm:p-8 shadow-2xl`}>
                                {/* Glow effect - reduced on mobile */}
                                <div className={`absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl opacity-10 ${isMobile ? 'blur-lg' : 'blur-xl'}`} />

                                <div className="relative">
                                    <div className="flex items-center justify-between mb-6">
                                        <div>
                                            <h3 className="text-lg font-semibold mb-1">Platform Preview</h3>
                                            <p className="text-sm text-muted-foreground flex items-center gap-2">
                                                <span className="flex h-2 w-2">
                                                    <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-green-400 opacity-75"></span>
                                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                                </span>
                                                Metrics WorkWise will track at launch
                                            </p>
                                        </div>
                                        <Sparkles className="h-6 w-6 text-yellow-400" />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 mb-8">
                                        {stats.map((stat, i) => (
                                            <motion.div
                                                key={stat.label}
                                                {...scaleIn}
                                                transition={{ delay: isMobile ? 0 : 0.5 + i * 0.1 }}
                                                whileHover={isMobile ? undefined : { scale: 1.05, y: -5 }}
                                                className="relative overflow-hidden rounded-2xl border border-border/50 bg-accent/30 p-4"
                                            >
                                                <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-5`} />
                                                <div className="relative">
                                                    <div className="flex items-center gap-2 mb-3">
                                                        <div className={`flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br ${stat.color}`}>
                                                            <stat.icon className="h-4 w-4 text-white" />
                                                        </div>
                                                    </div>
                                                    <div className="text-2xl font-bold mb-1">{stat.value}</div>
                                                    <div className="text-xs text-muted-foreground">{stat.label}</div>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>

                                    {/* Chart */}
                                    <div className="rounded-2xl border border-border/50 bg-accent/30 p-6">
                                        <div className="flex items-center justify-between mb-4">
                                            <span className="text-sm font-medium">Job Growth (illustrative)</span>
                                            <span className="text-xs text-green-500 flex items-center gap-1">
                                                <TrendingUp className="h-3 w-3" />
                                                +23% this week
                                            </span>
                                        </div>
                                        <div className="flex items-end justify-between gap-1 h-32">
                                            {[40, 60, 45, 75, 55, 85, 70, 90, 75, 95, 85, 100].map((height, i) => (
                                                <div
                                                    key={i}
                                                    className="flex-1 rounded-t-md bg-gradient-to-t from-blue-500 to-purple-600 transition-all duration-500"
                                                    style={{
                                                        height: `${height}%`,
                                                        transitionDelay: isMobile ? '0ms' : `${i * 50}ms`
                                                    }}
                                                />
                                            ))}
                                        </div>
                                        <div className="flex justify-between mt-3 text-xs text-muted-foreground">
                                            <span>Mon</span>
                                            <span>Today</span>
                                        </div>
                                    </div>
                                </div>
                                <p className="mt-4 text-xs text-muted-foreground">
                                    Metrics shown are illustrative and represent how activity will be displayed once the platform is live.
                                </p>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Trust Badges */}
            <section className="border-y border-border/40 bg-accent/20 py-8 relative overflow-hidden">
                {/* Background decoration - reduced blur on mobile */}
                <div className={`absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-500/5 to-purple-600/5 dark:from-blue-500/10 dark:to-purple-600/10 rounded-full ${isMobile ? 'blur-2xl' : 'blur-3xl'}`} />
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
                    <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 md:gap-16">
                        {trustBadges.map((badge, i) => (
                            <div
                                key={badge.label}
                                className="flex items-center gap-2"
                            >
                                <badge.icon className="h-5 w-5 text-green-500" />
                                <span className="text-sm font-medium">{badge.label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="px-4 py-16 sm:px-6 lg:px-8 lg:py-24 relative overflow-hidden">
                {/* Background decorations - reduced blur on mobile */}
                <div className={`absolute top-20 left-0 w-96 h-96 bg-gradient-to-br from-purple-500/5 to-pink-600/5 dark:from-purple-500/10 dark:to-pink-600/10 rounded-full ${isMobile ? 'blur-2xl' : 'blur-3xl'}`} />
                <div className={`absolute bottom-20 right-0 w-96 h-96 bg-gradient-to-br from-blue-500/5 to-cyan-600/5 dark:from-blue-500/10 dark:to-cyan-600/10 rounded-full ${isMobile ? 'blur-2xl' : 'blur-3xl'}`} />

                <div className="mx-auto max-w-7xl relative">
                    {/* Section Header */}
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-1.5 mb-4">
                            <Zap className="h-4 w-4 text-blue-500" />
                            <span className="text-sm font-medium">Why WorkWise?</span>
                        </div>
                        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl mb-4">
                            Built For <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">Tradespeople</span>
                        </h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            No commission fees. No lead charges. Just honest work and honest pay.
                        </p>
                    </div>

                    {/* Features Grid */}
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        {features.map((feature, index) => (
                            <motion.div
                                key={feature.title}
                                {...whileInViewProps}
                                transition={{ delay: isMobile ? 0 : index * 0.1 }}
                                whileHover={isMobile ? undefined : { y: -8, scale: 1.02 }}
                                className="group relative overflow-hidden rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm p-6 transition-all"
                            >
                                {/* Gradient Background on Hover */}
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity" />

                                <div className="relative">
                                    {/* Icon */}
                                    <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${feature.color} shadow-lg`}>
                                        <feature.icon className="h-6 w-6 text-white" />
                                    </div>

                                    {/* Content */}
                                    <h3 className="text-lg font-semibold mb-2 group-hover:text-blue-500 transition-colors">
                                        {feature.title}
                                    </h3>
                                    <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                                        {feature.description}
                                    </p>

                                    {/* Highlight Badge */}
                                    <div className="inline-flex items-center gap-1.5 rounded-full bg-green-500/10 border border-green-500/20 px-3 py-1 text-xs font-medium text-green-600 dark:text-green-400">
                                        <Check className="h-3 w-3" />
                                        {feature.highlight}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section id="how-it-works" className="px-4 py-16 sm:px-6 lg:px-8 lg:py-24 relative overflow-hidden bg-gradient-to-br from-blue-500/5 to-purple-600/5 dark:from-blue-500/10 dark:to-purple-600/10">
                {/* Background decorations - reduced blur on mobile */}
                <div className={`absolute top-1/2 -translate-y-1/2 left-0 w-96 h-96 bg-gradient-to-br from-green-500/5 to-emerald-600/5 dark:from-green-500/10 dark:to-emerald-600/10 rounded-full ${isMobile ? 'blur-2xl' : 'blur-3xl'}`} />
                <div className={`absolute top-1/2 -translate-y-1/2 right-0 w-96 h-96 bg-gradient-to-br from-pink-500/5 to-purple-600/5 dark:from-pink-500/10 dark:to-purple-600/10 rounded-full ${isMobile ? 'blur-2xl' : 'blur-3xl'}`} />

                <div className="mx-auto max-w-7xl relative">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
                            Getting Started Is Easy
                        </h2>
                        <p className="text-lg text-muted-foreground">
                            Three simple steps to start getting more work
                        </p>
                    </div>

                    <div className="grid gap-8 md:grid-cols-3">
                        {[
                            {
                                step: "01",
                                title: "Join Waitlist",
                                description: "Fill out the quick form below. Takes 30 seconds, no payment required.",
                                icon: Users,
                                color: "from-blue-500 to-cyan-500"
                            },
                            {
                                step: "02",
                                title: "Wait For Launch",
                                description: "Get updates as WorkWise is built and prepared for launch in your area.",
                                icon: Phone,
                                color: "from-purple-500 to-pink-500"
                            },
                            {
                                step: "03",
                                title: "Start Getting Jobs",
                                description: "Get matched with property managers who need your services. Simple.",
                                icon: TrendingUp,
                                color: "from-green-500 to-emerald-500"
                            },
                        ].map((step, index) => (
                            <motion.div
                                key={step.step}
                                {...whileInViewProps}
                                transition={{ delay: isMobile ? 0 : index * 0.1 }}
                                className="relative"
                            >
                                <div className="flex flex-col items-center text-center">
                                    <div className={`mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${step.color} text-2xl font-bold text-white shadow-xl`}>
                                        {step.step}
                                    </div>
                                    <step.icon className={`h-8 w-8 mb-4 text-muted-foreground`} />
                                    <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                                    <p className="text-muted-foreground text-sm leading-relaxed">{step.description}</p>
                                </div>
                                {index < 2 && (
                                    <div className="hidden md:block absolute top-8 left-[60%] w-full h-0.5 bg-gradient-to-r from-blue-500 to-purple-600 opacity-20" />
                                )}
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Signup Section */}
            <section id="signup" className="px-4 py-16 sm:px-6 lg:px-8 lg:py-24 relative overflow-hidden">
                {/* Background decoration - reduced blur on mobile */}
                <div className={`absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 w-96 h-96 bg-gradient-to-br from-blue-500/10 to-purple-600/10 dark:from-blue-500/20 dark:to-purple-600/20 rounded-full ${isMobile ? 'blur-2xl' : 'blur-3xl'}`} />

                <div className="mx-auto max-w-3xl relative">
                    <motion.div
                        {...whileInViewProps}
                        className={`relative rounded-3xl border border-border/50 bg-card/80 backdrop-blur-xl p-8 md:p-12 shadow-2xl`}
                    >
                        {/* Glow - reduced on mobile */}
                        <div className={`absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl opacity-10 ${isMobile ? 'blur-xl' : 'blur-2xl'}`} />

                        <div className="relative">
                            <div className="text-center mb-8">
                                <h2 className="text-3xl font-bold tracking-tight mb-3">
                                    Join the Waitlist
                                </h2>
                                <p className="text-muted-foreground">
                                    Be one of the first to get access when we launch in your area
                                </p>
                            </div>

                            <WorkerSignupForm />

                            <div className="mt-8 pt-6 border-t border-border text-center">
                                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                                    <Check className="h-4 w-4 text-green-500" />
                                    <span>Be among the first trades to join</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-border/40 px-4 py-12 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-7xl">
                    <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4">
                        <div className="sm:col-span-2">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-purple-600">
                                    <span className="text-lg font-bold text-white">W</span>
                                </div>
                                <div>
                                    <div className="text-lg font-bold">WorkWise</div>
                                    <div className="text-xs text-muted-foreground">For Tradespeople</div>
                                </div>
                            </div>
                            <p className="text-sm text-muted-foreground max-w-sm mb-4">
                                Get matched with property managers who need your services. Zero commission. Zero fees.
                            </p>
                        </div>

                        <div>
                            <h3 className="font-semibold mb-4">Product</h3>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                <li><a href="#features" className="hover:text-foreground transition-colors">Features</a></li>
                                <li><a href="#how-it-works" className="hover:text-foreground transition-colors">How It Works</a></li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="font-semibold mb-4">Contact</h3>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                <li className="flex items-center gap-2">
                                    <Mail className="h-4 w-4" />
                                    <span>workwise@edentechnologies.co.uk</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <MapPin className="h-4 w-4" />
                                    <span>Manchester, UK</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-4">
                        <p className="text-sm text-muted-foreground">
                            © 2025 Eden Technologies Ltd. All rights reserved.
                        </p>
                        <div className="flex gap-6 text-sm text-muted-foreground">
                            <a href="/workwise/privacy" className="hover:text-foreground transition-colors">Privacy</a>
                            <a href="/workwise/terms" className="hover:text-foreground transition-colors">Terms</a>
                        </div>
                    </div>
                </div>
            </footer>

            {/* CSS animation for underline */}
            <style jsx>{`
                @keyframes scaleX {
                    from { transform: scaleX(0); }
                    to { transform: scaleX(1); }
                }
            `}</style>
        </div>
    );
}
