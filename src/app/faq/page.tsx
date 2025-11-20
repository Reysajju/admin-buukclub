"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/sections/Footer";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/Accordion";
import { useState } from "react";
import faqsData from "@/data/faqs.json";

export default function FAQPage() {
    const [searchTerm, setSearchTerm] = useState("");

    const filteredFaqs = faqsData.map(category => ({
        ...category,
        questions: category.questions.filter(q =>
            q.q.toLowerCase().includes(searchTerm.toLowerCase()) ||
            q.a.toLowerCase().includes(searchTerm.toLowerCase())
        )
    })).filter(category => category.questions.length > 0);

    return (
        <main className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-primary-foreground flex flex-col">
            <Navbar />

            <section className="flex-1 pt-32 pb-20 px-4">
                <div className="container max-w-3xl mx-auto">
                    <div className="text-center mb-12">
                        <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4 text-primary">Frequently Asked Questions</h1>
                        <p className="text-lg text-muted-foreground mb-8">
                            Everything you need to know about BuukClub.
                        </p>

                        <input
                            type="text"
                            placeholder="Search questions..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full max-w-md p-3 rounded-full border border-input bg-background shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all px-6"
                        />
                    </div>

                    <div className="space-y-8">
                        {filteredFaqs.map((category, idx) => (
                            <div key={idx} className="bg-card border border-border rounded-lg p-6 shadow-sm">
                                <h2 className="text-2xl font-serif font-bold mb-4 text-secondary">{category.category}</h2>
                                <Accordion type="single" collapsible className="w-full">
                                    {category.questions.map((faq, qIdx) => (
                                        <AccordionItem key={qIdx} value={`${idx}-${qIdx}`}>
                                            <AccordionTrigger className="text-left font-medium hover:text-primary">
                                                {faq.q}
                                            </AccordionTrigger>
                                            <AccordionContent className="text-muted-foreground leading-relaxed">
                                                {faq.a}
                                            </AccordionContent>
                                        </AccordionItem>
                                    ))}
                                </Accordion>
                            </div>
                        ))}

                        {filteredFaqs.length === 0 && (
                            <div className="text-center py-12 text-muted-foreground">
                                No questions found matching "{searchTerm}".
                            </div>
                        )}
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
