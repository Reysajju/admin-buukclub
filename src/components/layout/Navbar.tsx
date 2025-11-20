"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useUserRole } from "@/contexts/UserRoleContext";
import { BookOpen, Users, ChevronDown, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const { role, setRole } = useUserRole();
    const [showRoleMenu, setShowRoleMenu] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const toggleRole = () => {
        const newRole = role === 'author' ? 'reader' : 'author';
        setRole(newRole);
        setShowRoleMenu(false);
    };

    return (
        <header
            className={cn(
                "fixed top-0 w-full z-50 transition-all duration-300 border-b border-transparent",
                scrolled ? "bg-background/80 backdrop-blur-md border-border/50 shadow-sm" : "bg-transparent"
            )}
        >
            <div className="container px-4 h-16 flex items-center justify-between">
                <Link href="/" className="font-serif font-bold text-2xl tracking-tight flex items-center gap-2 text-primary z-50 relative">
                    BuukClub
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center gap-6">
                    <Link href="/" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors">
                        Home
                    </Link>

                    {role === 'author' ? (
                        <>
                            <Link href="/revenue-simulator" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors">
                                Revenue Calculator
                            </Link>
                            <Link href="/apply" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors">
                                Apply Now
                            </Link>
                            <Link href="/faq" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors">
                                FAQ
                            </Link>
                        </>
                    ) : (
                        <>
                            <Link href="/benefits-calculator" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors">
                                Benefits Calculator
                            </Link>
                            <Link href="/calculator" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors">
                                Reading Goals
                            </Link>
                            <Link href="/blog" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors">
                                Blog
                            </Link>
                            <Link href="/faq" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors">
                                FAQ
                            </Link>
                        </>
                    )}

                    <Link href="/pricing" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors">
                        Pricing
                    </Link>
                </nav>

                <div className="hidden md:flex items-center gap-4">
                    {/* Role Switcher */}
                    {role && (
                        <div className="relative">
                            <button
                                onClick={() => setShowRoleMenu(!showRoleMenu)}
                                className="flex items-center gap-2 px-3 py-1.5 border border-border rounded-md hover:bg-muted transition-colors text-sm"
                            >
                                {role === 'author' ? (
                                    <>
                                        <BookOpen className="w-4 h-4" />
                                        <span>Author</span>
                                    </>
                                ) : (
                                    <>
                                        <Users className="w-4 h-4" />
                                        <span>Reader</span>
                                    </>
                                )}
                                <ChevronDown className="w-3 h-3" />
                            </button>

                            <AnimatePresence>
                                {showRoleMenu && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 10 }}
                                        className="absolute top-full right-0 mt-2 bg-background border border-border rounded-md shadow-lg p-2 min-w-[150px]"
                                    >
                                        <button
                                            onClick={toggleRole}
                                            className="w-full text-left px-3 py-2 hover:bg-muted rounded-sm transition-colors text-sm flex items-center gap-2"
                                        >
                                            {role === 'author' ? (
                                                <>
                                                    <Users className="w-4 h-4" />
                                                    <span>Switch to Reader</span>
                                                </>
                                            ) : (
                                                <>
                                                    <BookOpen className="w-4 h-4" />
                                                    <span>Switch to Author</span>
                                                </>
                                            )}
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    )}

                    <Link href="/join">
                        <Button variant="default" size="sm" className="font-serif">
                            Join the Club
                        </Button>
                    </Link>
                </div>

                {/* Mobile Menu Toggle */}
                <button
                    className="md:hidden z-50 relative p-2"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                    {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>

                {/* Mobile Menu Overlay */}
                <AnimatePresence>
                    {mobileMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, x: "100%" }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: "100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed inset-0 bg-background z-40 flex flex-col pt-24 px-6 md:hidden"
                        >
                            <nav className="flex flex-col gap-6 text-lg">
                                <Link href="/" onClick={() => setMobileMenuOpen(false)}>Home</Link>
                                {role === 'author' ? (
                                    <>
                                        <Link href="/revenue-simulator" onClick={() => setMobileMenuOpen(false)}>Revenue Calculator</Link>
                                        <Link href="/apply" onClick={() => setMobileMenuOpen(false)}>Apply Now</Link>
                                    </>
                                ) : (
                                    <>
                                        <Link href="/benefits-calculator" onClick={() => setMobileMenuOpen(false)}>Benefits Calculator</Link>
                                        <Link href="/blog" onClick={() => setMobileMenuOpen(false)}>Blog</Link>
                                    </>
                                )}
                                <Link href="/pricing" onClick={() => setMobileMenuOpen(false)}>Pricing</Link>
                                <Link href="/faq" onClick={() => setMobileMenuOpen(false)}>FAQ</Link>

                                <div className="h-px bg-border my-2" />

                                <button onClick={toggleRole} className="flex items-center gap-2 text-left">
                                    {role === 'author' ? <Users className="w-5 h-5" /> : <BookOpen className="w-5 h-5" />}
                                    Switch to {role === 'author' ? 'Reader' : 'Author'} View
                                </button>

                                <Link href="/join" onClick={() => setMobileMenuOpen(false)}>
                                    <Button className="w-full mt-4">Join the Club</Button>
                                </Link>
                            </nav>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </header>
    );
}
