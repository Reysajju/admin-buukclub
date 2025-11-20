import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/sections/Footer";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

const genreData: Record<string, { title: string; desc: string; hook: string }> = {
    romance: {
        title: "Romance Authors",
        desc: "Your readers are the most loyal in the world. Stop renting them from Amazon.",
        hook: "Tropes & Tiers: How to monetize 'Spiciness'.",
    },
    "sci-fi": {
        title: "Sci-Fi Authors",
        desc: "World-building is valuable. Let your fans pay to live in your universe.",
        hook: "From 'Hard Sci-Fi' to Hard Cash.",
    },
    "non-fiction": {
        title: "Non-Fiction Experts",
        desc: "You aren't just selling a book. You are selling a transformation.",
        hook: "Turn readers into high-ticket coaching clients.",
    },
};

export default async function GenrePage({ params }: { params: Promise<{ genre: string }> }) {
    const { genre } = await params;
    const data = genreData[genre] || {
        title: "Authors",
        desc: "Take back control of your career.",
        hook: "The platform for serious writers.",
    };

    return (
        <main className="min-h-screen bg-background">
            <Navbar />
            <div className="pt-32 pb-20 container px-4 md:px-6">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-6xl font-bold mb-6">For {data.title}</h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        {data.desc}
                    </p>
                </div>

                <div className="max-w-4xl mx-auto bg-muted/20 p-12 rounded-lg border border-primary/20 text-center">
                    <h2 className="text-3xl font-bold mb-4 text-primary text-glow">{data.hook}</h2>
                    <p className="text-lg mb-8">
                        We have specific tools designed for your genre.
                        {genre === "romance" && " Like 'Spoiler' channels and 'ARC' management."}
                        {genre === "sci-fi" && " Like 'Wiki' integration and 'Lore' voting."}
                        {genre === "non-fiction" && " Like 'Webinar' hosting and 'Course' selling."}
                    </p>
                    <Link href="/apply">
                        <Button variant="default" size="lg">
                            Apply for {data.title} Access
                        </Button>
                    </Link>
                </div>
            </div>
            <Footer />
        </main>
    );
}
