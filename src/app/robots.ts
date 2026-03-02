import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: "*",
            allow: ["/", "/ai.txt"],
            disallow: "/private/",
        },
        sitemap: "https://buukclub.com/sitemap.xml",
    };
}
