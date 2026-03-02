import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/sections/Footer";

export default function AboutPage() {
    return (
        <main className="min-h-screen bg-background">
            <Navbar />
            <div className="pt-32 pb-20 container px-4 md:px-6 max-w-4xl mx-auto">
                <h1 className="text-4xl md:text-6xl font-bold mb-8 text-center">The Mission</h1>

                <div className="prose prose-invert prose-lg mx-auto">
                    <p className="lead text-xl text-muted-foreground text-center mb-12">
                        We are a collective of developers and publishers tired of watching talented authors starve.
                    </p>

                    <p>
                        The publishing industry is broken. It relies on a model built in the 1990s.
                        Gatekeepers decide what gets read. Middlemen take the majority of the profit.
                        And the author? The author is left with scraps.
                    </p>

                    <p>
                        We built this infrastructure so you can focus on the art. We handle the tech, the payments,
                        and the community management tools. You bring the stories.
                    </p>

                    <h3 className="text-2xl font-bold mt-8 mb-4">Our Core Beliefs</h3>
                    <ul className="list-disc pl-6 space-y-2">
                        <li><strong>Ownership:</strong> You should own your audience, not rent it.</li>
                        <li><strong>Transparency:</strong> No hidden fees. No "creative accounting."</li>
                        <li><strong>Community:</strong> Books are better when discussed live.</li>
                    </ul>
                </div>
            </div>
            <Footer />
        </main>
    );
}
