import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/sections/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

const stories = [
    {
        name: "Sarah Jenkins",
        genre: "Paranormal Romance",
        income: "$4,200/mo",
        story: "I was burnt out writing 4 books a year for Amazon. Now I write 1 book a year and host a weekly wine night on Discord. My fans pay $15/mo just to hang out.",
    },
    {
        name: "David Chen",
        genre: "Hard Sci-Fi",
        income: "$3,100/mo",
        story: "My readers love the technical details. We have a 'World Building' channel where they vote on what technology I should invent next. It's collaborative storytelling.",
    },
    {
        name: "Elena Rodriguez",
        genre: "Self-Help / Business",
        income: "$8,500/mo",
        story: "I used to sell a $20 ebook. Now I run a 'Mastermind Book Club' for $99/mo. The value isn't just the book, it's the network.",
    },
];

export default function SuccessStoriesPage() {
    return (
        <main className="min-h-screen bg-background">
            <Navbar />
            <div className="pt-32 pb-20 container px-4 md:px-6">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-6xl font-bold mb-6">Success Stories</h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Real authors. Real revenue. No algorithm required.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {stories.map((story, i) => (
                        <Card key={i} className="border-primary/20 hover:border-primary/50 transition-colors">
                            <CardHeader>
                                <CardTitle>{story.name}</CardTitle>
                                <p className="text-sm text-primary">{story.genre}</p>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="text-2xl font-bold text-foreground">{story.income}</div>
                                <p className="text-muted-foreground">"{story.story}"</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className="mt-20 text-center bg-muted/20 p-12 rounded-lg border border-border/50">
                    <h2 className="text-3xl font-bold mb-4">You Could Be Next</h2>
                    <p className="text-muted-foreground mb-8">
                        We are looking for our next case study. Is it you?
                    </p>
                    <Link href="/apply">
                        <Button variant="default" size="lg">
                            Apply to be a Case Study
                        </Button>
                    </Link>
                </div>
            </div>
            <Footer />
        </main>
    );
}
