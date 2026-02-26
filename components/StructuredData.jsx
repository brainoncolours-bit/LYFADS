"use client";

import { useEffect } from "react";

export default function StructuredData({ data }) {
  useEffect(() => {
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.textContent = JSON.stringify(data);
    document.head.appendChild(script);

    return () => {
      if (script.parentNode) {
        document.head.removeChild(script);
      }
    };
  }, [data]);

  return null;
}

// Pre-configured structured data for Lyf Ads
export const organizationData = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Lyf Ads",
  url: "https://lyfads.com", // TODO: Update with your actual domain
  logo: "https://lyfads.com/brandLogo.png", // TODO: Update with your actual domain
  description:
    "Lyf Ads is a Bangalore-based video production and content creation agency focused on helping brands grow through impactful visual storytelling. We create brand films, promotional videos, social media content, and ad creatives.",
  foundingDate: "2020",
  founders: [
    {
      "@type": "Person",
      name: "Founder Name", // TODO: Update with actual founder name
    },
  ],
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+91-XXXXXXXXXX", // TODO: Update with your phone number
    contactType: "customer service",
    areaServed: "IN",
    availableLanguage: ["English", "Hindi", "Kannada"],
  },
  sameAs: [
    "https://www.instagram.com/lyfads", // TODO: Update with actual social links
    "https://www.facebook.com/lyfads",
    "https://twitter.com/lyfads",
    "https://www.linkedin.com/company/lyfads",
    "https://www.youtube.com/@lyfads",
  ],
  address: {
    "@type": "PostalAddress",
    addressLocality: "Bangalore",
    addressRegion: "Karnataka",
    postalCode: "560001", // TODO: Update with your actual postal code
    addressCountry: "IN",
  },
};

export const localBusinessData = {
  ...organizationData,
  "@type": "LocalBusiness",
  priceRange: "$$$",
  openingHoursSpecification: {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    opens: "09:00",
    closes: "18:00",
  },
};

export const creativeWorkData = {
  "@context": "https://schema.org",
  "@type": "CreativeWork",
  creator: {
    "@type": "Organization",
    name: "Lyf Ads",
    url: "https://lyfads.com",
  },
  description:
    "Professional video production and content creation by Lyf Ads, Bangalore. Brand films, promotional videos, social media content, and ad creatives.",
  keywords: [
    "brand films",
    "promotional videos",
    "social media content",
    "ad creatives",
    "video production",
    "content creation",
    "visual storytelling",
  ],
};
