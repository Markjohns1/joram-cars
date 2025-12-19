import { Helmet } from 'react-helmet-async';

/**
 * SEO Component
 * 
 * Handles all meta tags, social sharing (OG), and structured data (JSON-LD).
 */
export default function SEO({
    title,
    description,
    type = 'website',
    image,
    canonical,
    jsonLd
}) {
    const siteName = 'Joram Cars';
    const fullTitle = title ? `${title} | ${siteName}` : siteName;
    const siteUrl = window.location.origin;
    const defaultImage = `${siteUrl}/brand/og-image.png`;
    const metaDescription = description || "Kenya's Premier Used Car Marketplace. Quality vehicles at the best prices.";

    return (
        <Helmet>
            {/* Standard Meta Tags */}
            <title>{fullTitle}</title>
            <meta name="description" content={metaDescription} />
            {canonical && <link rel="canonical" href={canonical.startsWith('http') ? canonical : `${siteUrl}${canonical}`} />}

            {/* Open Graph / Facebook */}
            <meta property="og:type" content={type} />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={metaDescription} />
            <meta property="og:image" content={image || defaultImage} />
            <meta property="og:url" content={window.location.href} />
            <meta property="og:site_name" content={siteName} />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={metaDescription} />
            <meta name="twitter:image" content={image || defaultImage} />

            {/* Structured Data */}
            {jsonLd && (
                <script type="application/ld+json">
                    {JSON.stringify(jsonLd)}
                </script>
            )}
        </Helmet>
    );
}
