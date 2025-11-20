import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/sections/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { BookOpen, Video, Mic } from "lucide-react";

const resources = [
    {
        title: "How to host a Discord Stage",
        type: "Guide",
        icon: <Mic className="h-6 w-6 text-primary" />,
        desc: "Step-by-step setup for high-quality audio events.",
    },
    {
        title: "Script for your first book meet",
        type: "Template",
        icon: <BookOpen className="h-6 w-6 text-primary" />,
        desc: "Don't know what to say? Use our proven run-of-show.",
    },
    {
        title: "Equipment guide for streaming",
        type: "Gear",
        icon: <Video className="h-6 w-6 text-primary" />,
        desc: "The best mics and cameras for every budget.",
    },
];

export default function AcademyPage() {
    return (
        <main className="min-h-screen bg-background">
            <Navbar />
            <div className="pt-32 pb-20 container px-4 md:px-6">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-6xl font-bold mb-6">The Academy</h1>
                    <p className="text-xl text-muted-foreground">
                        Free resources to help you build your empire.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {resources.map((res, i) => (
                        <Card key={i} className="hover:bg-muted/10 transition-colors cursor-pointer">
                            <CardHeader>
                                <div className="flex items-center justify-between mb-2">
                                    {res.icon}
                                    <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{res.type}</span>
                                </div>
                                <CardTitle>{res.title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">{res.desc}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
            <Footer />
        </main>
    );
}
