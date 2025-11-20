'use client';

import { use } from 'react';
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/sections/Footer";
import blogsData from "@/data/blogs.json";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calendar, User, Share2 } from "lucide-react";

export default function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = use(params);
    const blog = blogsData.find((b) => b.id === slug);

    if (!blog) {
        notFound();
    }

    // JSON-LD structured data for SEO/AEO
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": blog.title,
        "image": blog.image,
        "datePublished": blog.date,
        "dateModified": blog.date,
        "author": {
            "@type": "Person",
            "name": blog.author
        },
        "publisher": {
            "@type": "Organization",
            "name": "BuukClub",
            "logo": {
                "@type": "ImageObject",
                "url": "https://buukclub.com/logo.png"
            }
        },
        "description": blog.excerpt,
        "articleBody": blog.content,
        "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": `https://buukclub.com/blog/${blog.id}`
        }
    };

    // FAQ schema for enhanced AEO
    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [{
            "@type": "Question",
            "name": `What is ${blog.title} about?`,
            "acceptedAnswer": {
                "@type": "Answer",
                "text": blog.excerpt
            }
        }]
    };

    return (
        <>
            <head>
                <title>{blog.title} | BuukClub Blog</title>
                <meta name="description" content={blog.excerpt} />
                <meta name="author" content={blog.author} />
                <meta name="keywords" content={`book club, reading, ${blog.title.toLowerCase()}, literature, books`} />

                {/* OpenGraph for social sharing */}
                <meta property="og:type" content="article" />
                <meta property="og:title" content={blog.title} />
                <meta property="og:description" content={blog.excerpt} />
                <meta property="og:image" content={blog.image} />
                <meta property="og:url" content={`https://buukclub.com/blog/${blog.id}`} />
                <meta property="article:published_time" content={blog.date} />
                <meta property="article:author" content={blog.author} />

                {/* Twitter Card */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={blog.title} />
                <meta name="twitter:description" content={blog.excerpt} />
                <meta name="twitter:image" content={blog.image} />

                {/* Canonical URL */}
                <link rel="canonical" href={`https://buukclub.com/blog/${blog.id}`} />
            </head>

            <main className="min-h-screen bg-background">
                {/* JSON-LD Structured Data */}
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
                />
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
                />

                <Navbar />

                <article className="pt-32 pb-20 px-4">
                    <div className="container max-w-4xl mx-auto">
                        {/* Back Button */}
                        <Link
                            href="/blog"
                            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-8"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back to Blog
                        </Link>

                        {/* Header */}
                        <header className="mb-8">
                            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6 text-primary leading-tight">
                                {blog.title}
                            </h1>

                            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4" />
                                    <time dateTime={blog.date}>{blog.date}</time>
                                </div>
                                <div className="flex items-center gap-2">
                                    <User className="w-4 h-4" />
                                    <span>{blog.author}</span>
                                </div>
                            </div>

                            <p className="text-xl text-muted-foreground leading-relaxed">
                                {blog.excerpt}
                            </p>
                        </header>

                        {/* Featured Image */}
                        <div className="mb-10 rounded-lg overflow-hidden shadow-lg">
                            <img
                                src={blog.image}
                                alt={blog.title}
                                className="w-full h-auto object-cover"
                            />
                        </div>

                        {/* Content */}
                        <div className="prose prose-lg max-w-none">
                            {blog.content.split('\n\n').map((paragraph, index) => {
                                // Check if it's a header
                                if (paragraph.startsWith('## ')) {
                                    const headerText = paragraph.replace('## ', '');
                                    return (
                                        <h2 key={index} className="text-3xl font-serif font-bold mt-12 mb-6 text-primary first:mt-0">
                                            {headerText}
                                        </h2>
                                    );
                                }

                                // Check for bold text with **
                                const hasBold = paragraph.includes('**');
                                if (hasBold) {
                                    // Split by ** and render alternating normal and bold
                                    const parts = paragraph.split('**');
                                    return (
                                        <p key={index} className="mb-6 leading-relaxed text-foreground text-lg">
                                            {parts.map((part, i) =>
                                                i % 2 === 0 ? part : <strong key={i} className="font-bold text-foreground">{part}</strong>
                                            )}
                                        </p>
                                    );
                                }

                                // Regular paragraph
                                return (
                                    <p key={index} className="mb-6 leading-relaxed text-foreground text-lg">
                                        {paragraph}
                                    </p>
                                );
                            })}
                        </div>

                        {/* Share Section */}
                        <div className="mt-12 pt-8 border-t border-border">
                            <div className="flex items-center justify-between">
                                <p className="text-sm text-muted-foreground">
                                    Written by <span className="font-semibold text-foreground">{blog.author}</span>
                                </p>
                                <button className="flex items-center gap-2 text-sm text-primary hover:underline">
                                    <Share2 className="w-4 h-4" />
                                    Share Article
                                </button>
                            </div>
                        </div>

                        {/* Related Posts */}
                        <div className="mt-16">
                            <h2 className="text-2xl font-serif font-bold mb-6">More from The Literary Journal</h2>
                            <div className="grid md:grid-cols-2 gap-6">
                                {blogsData
                                    .filter(b => b.id !== blog.id)
                                    .slice(0, 2)
                                    .map((relatedBlog) => (
                                        <Link
                                            key={relatedBlog.id}
                                            href={`/blog/${relatedBlog.id}`}
                                            className="group block bg-card border border-border rounded-lg overflow-hidden hover:shadow-md transition-all"
                                        >
                                            <div className="h-40 overflow-hidden">
                                                <img
                                                    src={relatedBlog.image}
                                                    alt={relatedBlog.title}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                />
                                            </div>
                                            <div className="p-4">
                                                <h3 className="font-serif font-bold mb-2 group-hover:text-primary transition-colors">
                                                    {relatedBlog.title}
                                                </h3>
                                                <p className="text-sm text-muted-foreground line-clamp-2">
                                                    {relatedBlog.excerpt}
                                                </p>
                                            </div>
                                        </Link>
                                    ))}
                            </div>
                        </div>
                    </div>
                </article>

                <Footer />
            </main>
        </>
    );
}
