import Link from "next/link";

export function Footer() {
    return (
        <footer className="bg-muted/20 border-t border-border/50 py-12 md:py-16">
            <div className="container px-4 md:px-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 mb-8">
                    <div className="space-y-4">
                        <h3 className="font-bold font-serif text-lg">Platform</h3>
                        <ul className="space-y-3 text-sm text-muted-foreground">
                            <li><Link href="/features" className="hover:text-primary transition-colors">Features</Link></li>
                            <li><Link href="/pricing" className="hover:text-primary transition-colors">Pricing</Link></li>
                            <li><Link href="/revenue-simulator" className="hover:text-primary transition-colors">Calculator</Link></li>
                            <li><Link href="/success-stories" className="hover:text-primary transition-colors">Success Stories</Link></li>
                        </ul>
                    </div>
                    <div className="space-y-4">
                        <h3 className="font-bold font-serif text-lg">Resources</h3>
                        <ul className="space-y-3 text-sm text-muted-foreground">
                            <li><Link href="/blog" className="hover:text-primary transition-colors">Blog</Link></li>
                            <li><Link href="/academy" className="hover:text-primary transition-colors">Academy</Link></li>
                            <li><Link href="/manifesto" className="hover:text-primary transition-colors">Manifesto</Link></li>
                            <li><Link href="/faq" className="hover:text-primary transition-colors">FAQ</Link></li>
                        </ul>
                    </div>
                    <div className="space-y-4">
                        <h3 className="font-bold font-serif text-lg">Company</h3>
                        <ul className="space-y-3 text-sm text-muted-foreground">
                            <li><Link href="/about" className="hover:text-primary transition-colors">About Us</Link></li>
                            <li><Link href="/scout" className="hover:text-primary transition-colors">Scout Program</Link></li>
                            <li><Link href="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
                        </ul>
                    </div>
                    <div className="space-y-4">
                        <h3 className="font-bold font-serif text-lg">Legal</h3>
                        <ul className="space-y-3 text-sm text-muted-foreground">
                            <li><Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
                            <li><Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link></li>
                            <li><Link href="/trust" className="hover:text-primary transition-colors">Trust & Safety</Link></li>
                        </ul>
                    </div>
                </div>
                <div className="text-center text-sm text-muted-foreground pt-8 border-t border-border/20">
                    <p className="font-serif">&copy; {new Date().getFullYear()} BuukClub. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
