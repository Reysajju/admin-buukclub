'use client';

import { Geist, Geist_Mono, Merriweather } from "next/font/google";
import "./globals.css";
import { UserRoleProvider } from "@/contexts/UserRoleContext";
import { RoleSelectionModal } from "@/components/modals/RoleSelectionModal";
import DevToolsProtection from "@/components/DevToolsProtection";
import { Metadata, Viewport } from "next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const merriweather = Merriweather({
  variable: "--font-merriweather",
  subsets: ["latin"],
  weight: ["300", "400", "700", "900"],
});

// Note: Metadata export is not supported in client components. 
// We will use the head tag for critical SEO elements and a separate metadata config if needed,
// but for this 'use client' layout, we'll inject via standard HTML tags or move metadata to a server layout if possible.
// However, since this is the root layout and marked 'use client' (likely due to context providers),
// we will keep the structure but ensure all meta tags are present.

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLdOrganization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "BuukClub",
    url: "https://buukclub.com",
    logo: "https://buukclub.com/logo.png",
    sameAs: [
      "https://twitter.com/buukclub",
      "https://instagram.com/buukclub",
      "https://linkedin.com/company/buukclub"
    ],
    description: "The premium platform for authors to build communities and readers to discover exclusive book clubs.",
    founder: {
      "@type": "Person",
      name: "BuukClub Team"
    }
  };

  const jsonLdWebSite = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "BuukClub",
    url: "https://buukclub.com",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://buukclub.com/search?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>BuukClub | The Premium Book Club Platform for Authors & Readers</title>
        <meta name="description" content="Join BuukClub, the exclusive community where authors keep 85% of revenue and readers connect directly with their favorite writers. Escape the Amazon monopoly." />
        <meta name="keywords" content="book club, author platform, self-publishing, reader community, book marketing, author revenue, literary community" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <meta name="theme-color" content="#4A0404" />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://buukclub.com/" />
        <meta property="og:title" content="BuukClub | The Premium Book Club Platform" />
        <meta property="og:description" content="Empowering authors with 85% revenue share and connecting readers with exclusive communities." />
        <meta property="og:image" content="https://buukclub.com/og-image.jpg" />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://buukclub.com/" />
        <meta property="twitter:title" content="BuukClub | The Premium Book Club Platform" />
        <meta property="twitter:description" content="Empowering authors with 85% revenue share and connecting readers with exclusive communities." />
        <meta property="twitter:image" content="https://buukclub.com/og-image.jpg" />

        {/* Apple Web App */}
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="BuukClub" />

        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${merriweather.variable} antialiased bg-background text-foreground paper-texture overflow-x-hidden`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdOrganization) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdWebSite) }}
        />
        <UserRoleProvider>
          <DevToolsProtection />
          <RoleSelectionModal />
          {children}
        </UserRoleProvider>
      </body>
    </html>
  );
}
