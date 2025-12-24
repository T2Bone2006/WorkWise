"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Sun, Moon, Sparkles, ChevronRight } from "lucide-react";

interface NavbarProps {
    theme: string | undefined;
    setTheme: (theme: string) => void;
}

export default function NavbarRedesign({ theme, setTheme }: NavbarProps) {
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        if (mobileMenuOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
    }, [mobileMenuOpen]);

    const navLinks = [
        { name: "Why Us", href: "#why" },
        { name: "How It Works", href: "#how-it-works" },
        { name: "Vision", href: "#vision" },
        { name: "FAQ", href: "#faq" },
    ];

    return (
        <>
            {/* Background Accents */}
            <div className="fixed inset-0 -z-50 overflow-hidden pointer-events-none">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[100px]" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[100px]" />
            </div>

            {/* Navigation */}
            <motion.nav
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.5 }}
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${
                    isScrolled
                        ? "bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-slate-200 dark:border-white/5 py-3"
                        : "bg-transparent border-transparent py-5"
                }`}
            >
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between">
                        {/* Logo */}
                        <div className="flex items-center gap-3 cursor-pointer">
                            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 shadow-[0_0_15px_rgba(37,99,235,0.3)]">
                                <span className="text-xl font-bold text-white">W</span>
                                <div className="absolute inset-0 rounded-xl bg-white/20 ring-1 ring-inset ring-white/20" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white leading-tight">
                                    WorkWise
                                </span>
                                <span className="text-[10px] font-medium text-slate-500 dark:text-blue-200/60 uppercase tracking-wider">
                                    For Trades
                                </span>
                            </div>
                        </div>

                        {/* Desktop Links */}
                        <div className="hidden md:flex items-center gap-8">
                            {navLinks.map((link) => (
                                <a
                                    key={link.name}
                                    href={link.href}
                                    className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors relative group"
                                >
                                    {link.name}
                                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-500 transition-all duration-300 group-hover:w-full" />
                                </a>
                            ))}
                        </div>

                        {/* Desktop Actions */}
                        <div className="hidden md:flex items-center gap-4">
                            {/*<button*/}
                            {/*    onClick={() => setTheme(theme === "dark" ? "light" : "dark")}*/}
                            {/*    className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-all"*/}
                            {/*    aria-label="Toggle theme"*/}
                            {/*>*/}
                            {/*    {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}*/}
                            {/*</button>*/}

                            <a
                                href="#signup"
                                className="relative group overflow-hidden rounded-full bg-slate-900 dark:bg-slate-800 px-6 py-2.5 text-sm font-semibold text-white ring-1 ring-slate-900 dark:ring-white/10 transition-all hover:ring-blue-500/50"
                            >
                                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                                <span className="relative flex items-center gap-2">
                                    Join Waitlist
                                    <Sparkles className="w-3 h-3 text-blue-400" />
                                </span>
                            </a>
                        </div>

                        {/* Mobile Toggle */}
                        <div className="flex items-center gap-2 md:hidden">
                            {/*<button*/}
                            {/*    onClick={() => setTheme(theme === "dark" ? "light" : "dark")}*/}
                            {/*    className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-all"*/}
                            {/*    aria-label="Toggle theme"*/}
                            {/*>*/}
                            {/*    {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}*/}
                            {/*</button>*/}
                            <button
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                className="p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
                            >
                                {mobileMenuOpen ? <X /> : <Menu />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {mobileMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "100vh" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="md:hidden fixed inset-0 top-[60px] z-40 bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl border-t border-slate-200 dark:border-white/10"
                        >
                            <div className="p-4 space-y-4 h-full flex flex-col">
                                {navLinks.map((link, i) => (
                                    <motion.a
                                        key={link.name}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.1 }}
                                        href={link.href}
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="flex items-center justify-between p-4 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-white/10 hover:text-slate-900 dark:hover:text-white transition-all"
                                    >
                                        <span className="text-lg font-medium">{link.name}</span>
                                        <ChevronRight className="w-5 h-5 opacity-50" />
                                    </motion.a>
                                ))}

                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                    className="mt-auto pb-20 space-y-4"
                                >
                                    <a
                                        href="#signup"
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="flex items-center justify-center w-full gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 p-4 text-base font-bold text-white shadow-lg shadow-blue-500/20"
                                    >
                                        Join Waitlist Now
                                    </a>
                                </motion.div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.nav>
        </>
    );
}
