import { Metadata } from 'next'

interface SEOConfig {
  title: string
  description: string
  keywords?: string[]
  image?: string
  url?: string
  type?: 'website' | 'article' | 'profile'
  publishedTime?: string
  modifiedTime?: string
  author?: string
  section?: string
  tags?: string[]
}

const defaultConfig = {
  siteName: 'PLantum',
  siteUrl: process.env.NEXT_PUBLIC_APP_URL || 'https://plantum.co.za',
  defaultImage: '/og-image.png',
  twitterHandle: '@plantum_sa',
}

export function generateMetadata(config: SEOConfig): Metadata {
  const {
    title,
    description,
    keywords = [],
    image,
    url,
    type = 'website',
    publishedTime,
    modifiedTime,
    author,
    section,
    tags = [],
  } = config

  const fullTitle = title.includes(defaultConfig.siteName) 
    ? title 
    : `${title} | ${defaultConfig.siteName}`
  
  const fullUrl = url ? `${defaultConfig.siteUrl}${url}` : defaultConfig.siteUrl
  const fullImage = image ? `${defaultConfig.siteUrl}${image}` : `${defaultConfig.siteUrl}${defaultConfig.defaultImage}`

  return {
    title: fullTitle,
    description,
    keywords: keywords.join(', '),
    authors: author ? [{ name: author }] : undefined,
    creator: author,
    publisher: defaultConfig.siteName,
    
    // Open Graph
    openGraph: {
      type,
      locale: 'en_ZA',
      url: fullUrl,
      title: fullTitle,
      description,
      siteName: defaultConfig.siteName,
      images: [
        {
          url: fullImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      publishedTime,
      modifiedTime,
      section,
      tags,
    },
    
    // Twitter
    twitter: {
      card: 'summary_large_image',
      site: defaultConfig.twitterHandle,
      creator: defaultConfig.twitterHandle,
      title: fullTitle,
      description,
      images: [fullImage],
    },
    
    // Additional meta tags
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    
    // Canonical URL
    alternates: {
      canonical: fullUrl,
    },
    
    // Verification tags (add your actual verification codes)
    verification: {
      google: process.env.GOOGLE_SITE_VERIFICATION,
      yandex: process.env.YANDEX_VERIFICATION,
      yahoo: process.env.YAHOO_VERIFICATION,
    },
  }
}

// Predefined SEO configurations for common pages
export const seoConfigs = {
  home: {
    title: 'PLantum - Connect African Startups with Global Investors',
    description: 'The ultimate platform connecting African startups and businesses with investors worldwide. Discover investment opportunities, showcase your startup, and grow your business.',
    keywords: [
      'African startups',
      'investment platform',
      'startup funding',
      'venture capital',
      'South African startups',
      'business investment',
      'startup ecosystem',
      'investor network',
    ],
  },
  
  startups: {
    title: 'Discover African Startups',
    description: 'Explore innovative startups across Africa. Find the next big opportunity and connect with entrepreneurs building the future.',
    keywords: [
      'African startups',
      'startup directory',
      'innovation',
      'entrepreneurship',
      'startup discovery',
    ],
  },
  
  investors: {
    title: 'Investor Network',
    description: 'Connect with verified investors looking for African startup opportunities. Access exclusive deals and investment opportunities.',
    keywords: [
      'investors',
      'venture capital',
      'angel investors',
      'investment opportunities',
      'startup funding',
    ],
  },
  
  leaderboard: {
    title: 'Startup Leaderboard',
    description: 'See the top-performing startups and investors on PLantum. Track growth, funding, and success metrics.',
    keywords: [
      'startup rankings',
      'top startups',
      'success metrics',
      'growth tracking',
      'startup performance',
    ],
  },
  
  map: {
    title: 'Startup Map',
    description: 'Explore startups and investors by location across Africa. Discover regional startup ecosystems and investment opportunities.',
    keywords: [
      'startup map',
      'geographic distribution',
      'regional ecosystems',
      'location-based discovery',
    ],
  },
  
  resources: {
    title: 'Startup Resources',
    description: 'Essential resources for startups and investors. Guides, templates, and tools to help you succeed.',
    keywords: [
      'startup resources',
      'business guides',
      'investment tools',
      'startup templates',
    ],
  },
}

// Structured data generators
export function generateStructuredData(type: 'Organization' | 'WebSite' | 'WebPage' | 'Article', data: any) {
  const baseStructuredData = {
    '@context': 'https://schema.org',
    '@type': type,
  }

  switch (type) {
    case 'Organization':
      return {
        ...baseStructuredData,
        name: defaultConfig.siteName,
        url: defaultConfig.siteUrl,
        logo: `${defaultConfig.siteUrl}/logo.png`,
        description: 'The ultimate platform connecting African startups with global investors',
        sameAs: [
          'https://twitter.com/plantum_sa',
          'https://linkedin.com/company/plantum',
          'https://facebook.com/plantum',
        ],
        contactPoint: {
          '@type': 'ContactPoint',
          telephone: '+27-XXX-XXXX',
          contactType: 'customer service',
          areaServed: 'ZA',
          availableLanguage: 'English',
        },
      }
    
    case 'WebSite':
      return {
        ...baseStructuredData,
        name: defaultConfig.siteName,
        url: defaultConfig.siteUrl,
        description: 'Connect African startups with global investors',
        potentialAction: {
          '@type': 'SearchAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: `${defaultConfig.siteUrl}/search?q={search_term_string}`,
          },
          'query-input': 'required name=search_term_string',
        },
      }
    
    case 'WebPage':
      return {
        ...baseStructuredData,
        name: data.title,
        description: data.description,
        url: data.url,
        isPartOf: {
          '@type': 'WebSite',
          name: defaultConfig.siteName,
          url: defaultConfig.siteUrl,
        },
        breadcrumb: data.breadcrumb,
      }
    
    case 'Article':
      return {
        ...baseStructuredData,
        headline: data.title,
        description: data.description,
        image: data.image,
        datePublished: data.publishedTime,
        dateModified: data.modifiedTime,
        author: {
          '@type': 'Person',
          name: data.author,
        },
        publisher: {
          '@type': 'Organization',
          name: defaultConfig.siteName,
          logo: {
            '@type': 'ImageObject',
            url: `${defaultConfig.siteUrl}/logo.png`,
          },
        },
      }
    
    default:
      return baseStructuredData
  }
}
