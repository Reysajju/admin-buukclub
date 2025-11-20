'use client';

import { useUserRole } from '@/contexts/UserRoleContext';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Users } from 'lucide-react';

export function RoleSelectionModal() {
    const { showModal, setRole, closeModal } = useUserRole();

    const handleRoleSelect = (role: 'author' | 'reader') => {
        setRole(role);
        closeModal();
    };

    return (
        <AnimatePresence>
            {showModal && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        className="bg-background border border-border rounded-lg shadow-2xl max-w-2xl w-full p-8 paper-texture"
                    >
                        <div className="text-center mb-8">
                            <h2 className="text-3xl md:text-4xl font-bold mb-4 serif-heading text-primary">
                                Welcome to BuukClub! 📚
                            </h2>
                            <p className="text-xl text-muted-foreground">
                                Are you ready to host millions of readers who're excited about your book?
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            {/* Author Option */}
                            <motion.button
                                whileHover={{ scale: 1.05, y: -5 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handleRoleSelect('author')}
                                className="group relative bg-card border-2 border-primary/20 hover:border-primary rounded-lg p-8 text-center transition-all duration-300 hover:shadow-lg"
                            >
                                <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg" />
                                <div className="relative">
                                    <BookOpen className="w-16 h-16 mx-auto mb-4 text-primary" />
                                    <h3 className="text-2xl font-bold mb-2">Yes, I'm an Author</h3>
                                    <p className="text-muted-foreground group-hover:text-foreground transition-colors">
                                        Let's do it! 🚀
                                    </p>
                                </div>
                            </motion.button>

                            {/* Reader Option */}
                            <motion.button
                                whileHover={{ scale: 1.05, y: -5 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handleRoleSelect('reader')}
                                className="group relative bg-card border-2 border-secondary/20 hover:border-secondary rounded-lg p-8 text-center transition-all duration-300 hover:shadow-lg"
                            >
                                <div className="absolute inset-0 bg-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg" />
                                <div className="relative">
                                    <Users className="w-16 h-16 mx-auto mb-4 text-secondary" />
                                    <h3 className="text-2xl font-bold mb-2">No, I'm a Reader</h3>
                                    <p className="text-muted-foreground group-hover:text-foreground transition-colors">
                                        Let's surf around! 📖
                                    </p>
                                </div>
                            </motion.button>
                        </div>

                        <p className="text-xs text-center text-muted-foreground mt-6">
                            Don't worry, you can switch anytime from the navigation menu
                        </p>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
