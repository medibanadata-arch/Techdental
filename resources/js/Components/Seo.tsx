import React from 'react';
import { Head, usePage } from '@inertiajs/react';

export type SeoAlternates = {
    en?: string;
    bn?: string;
    'x-default'?: string;
};

interface SeoProps {
    /** Page title without the brand suffix (the suffix is added automatically). */
    title: string;
    description?: string;
    /** Canonical path such as "/blog/my-post" (defaults to the current URL path). */
    path?: string;
    /** Fully qualified canonical URL. Wins over `path`. */
    canonical?: string;
    /** Absolute or site-relative social share image. */
    image?: string;
    /** og:type — website, article, profile, etc. */
    type?: string;
    robots?: string;
    alternates?: SeoAlternates;
    schema?: Record<string, any> | Record<string, any>[];
    publishedTime?: string;
    modifiedTime?: string;
    author?: string;
    section?: string;
    /** Set true when `title` is already a complete title. */
    noSuffix?: boolean;
}

const DEFAULT_DESCRIPTION =
    'Tech Dental Care provides advanced, painless dental treatments across Mirpur, Uttara, Badda and Jatrabari in Dhaka, Bangladesh.';
const DEFAULT_IMAGE = '/images/og-default.jpg';

export const trimDescription = (text?: string, max = 158): string => {
    const clean = (text || '')
        .replace(/<[^>]+>/g, ' ')
        .replace(/&nbsp;/gi, ' ')
        .replace(/&amp;/gi, '&')
        .replace(/&#39;|&apos;/gi, "'")
        .replace(/&quot;/gi, '"')
        .replace(/&lt;/gi, '<')
        .replace(/&gt;/gi, '>')
        .replace(/\s+/g, ' ')
        .trim();
    if (!clean) return DEFAULT_DESCRIPTION;
    if (clean.length <= max) return clean;
    const cut = clean.slice(0, max);
    const lastSpace = cut.lastIndexOf(' ');
    return (lastSpace > 60 ? cut.slice(0, lastSpace) : cut).replace(/[.,;:\-–—]$/, '') + '…';
};

export default function Seo({
    title,
    description,
    path,
    canonical,
    image = DEFAULT_IMAGE,
    type = 'website',
    robots = 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
    alternates,
    schema,
    publishedTime,
    modifiedTime,
    author,
    section,
    noSuffix = false,
}: SeoProps) {
    const page = usePage();
    const props = page.props as any;
    const siteUrl = String(props?.site_url || 'https://techdentalcare.com').replace(/\/+$/, '');
    const currentPath = (page.url || '/').split('?')[0];
    const isBn = currentPath === '/bn' || currentPath.startsWith('/bn/');

    const fullTitle = noSuffix || /tech dental/i.test(title)
        ? title
        : `${title} | Tech Dental Care`;

    const desc = trimDescription(description);
    const canonicalUrl = canonical || `${siteUrl}${path || currentPath}`;
    const imageUrl = /^https?:\/\//i.test(image) ? image : `${siteUrl}${image.startsWith('/') ? '' : '/'}${image}`;

    const schemas = schema ? (Array.isArray(schema) ? schema : [schema]) : [];

    return (
        <Head>
            <title>{fullTitle}</title>
            <meta name="description" content={desc} />
            <link rel="canonical" href={canonicalUrl} />
            <meta name="robots" content={robots} />

            {alternates?.en && <link rel="alternate" hrefLang="en" href={alternates.en} />}
            {alternates?.bn && <link rel="alternate" hrefLang="bn" href={alternates.bn} />}
            {alternates?.['x-default'] && (
                <link rel="alternate" hrefLang="x-default" href={alternates['x-default']} />
            )}

            <meta property="og:site_name" content="Tech Dental Care" />
            <meta property="og:locale" content={isBn ? 'bn_BD' : 'en_US'} />
            <meta property="og:type" content={type} />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={desc} />
            <meta property="og:url" content={canonicalUrl} />
            <meta property="og:image" content={imageUrl} />
            <meta property="og:image:alt" content={fullTitle} />

            {publishedTime && <meta property="article:published_time" content={publishedTime} />}
            {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
            {author && <meta property="article:author" content={author} />}
            {section && <meta property="article:section" content={section} />}

            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={desc} />
            <meta name="twitter:image" content={imageUrl} />

            {schemas.map((item, index) => (
                <script
                    key={`seo-schema-${index}`}
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(item) }}
                />
            ))}
        </Head>
    );
}
