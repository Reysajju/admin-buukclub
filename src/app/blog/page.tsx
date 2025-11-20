"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/sections/Footer";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import blogsData from "@/data/blogs.json";

export default function BlogPage() {
    return (
        <main className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-primary-foreground flex flex-col">
            <Navbar />

            <section className="flex-1 pt-32 pb-20 px-4">
                <div className="container max-w-5xl mx-auto">
                    <div className="text-center mb-16">
                        <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4 text-primary">The Literary Journal</h1>
                        <p className="text-lg text-muted-foreground">
                            Musings, reviews, and news from the world of BuukClub.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {blogsData.map((blog) => (
                            <article key={blog.id} className="group flex flex-col bg-card border border-border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
                                <div className="h-48 relative overflow-hidden bg-muted">
                                    <img
                                        src={blog.image}
                                        alt={blog.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                </div>
                                <div className="p-6 flex-1 flex flex-col">
                                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3 font-medium uppercase tracking-wider">
                                        <span>{blog.date}</span>
                                        <span>•</span>
                                        <span>{blog.author}</span>
                                    </div>
                                    <h2 className="text-xl font-serif font-bold mb-3 group-hover:text-primary transition-colors leading-tight">
                                        {blog.title}
                                    </h2>
                                    <p className="text-muted-foreground text-sm line-clamp-3 mb-6 flex-1">
                                        {blog.excerpt}
                                    </p>
                                    <Link href={`/blog/${blog.id}`}>
                                        <Button variant="outline" className="w-full font-serif">Read Article</Button>
                                    </Link>
                                </div>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
