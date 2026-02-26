const SITE_URL = "https://lyfads.com"; // TODO: Update with your actual domain

export const generateMetadata = ({
  title,
  description,
  path = "",
  images = [],
  type = "website",
}) => {
  const url = path ? `${SITE_URL}${path}` : SITE_URL;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      siteName: "Lyf Ads",
      images: images.length
        ? images
        : [
            {
              url: "/og-image.png",
              width: 1200,
              height: 630,
              alt: title,
            },
          ],
      locale: "en_IN",
      type,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: images.length ? images.map((img) => img.url) : ["/og-image.png"],
      creator: "@lyfads",
    },
  };
};

// Pre-configured metadata for common pages
export const PAGE_METADATA = {
  HOME: {
    title: "Lyf Ads - Video Production & Content Creation Agency in Bangalore",
    description:
      "Bangalore-based video production and content creation agency. We create brand films, promotional videos, social media content, and ad creatives that strengthen brand identity and build audience connections.",
    path: "/",
  },
  WORKS: {
    title: "Our Work - Brand Films & Video Production Portfolio",
    description:
      "Explore our portfolio of brand films, promotional videos, social media content, and ad creatives. Visual storytelling that drives engagement and business growth.",
    path: "/works",
  },
  ABOUT: {
    title: "About Lyf Ads - Bangalore Video Production Agency",
    description:
      "Learn about Lyf Ads, a Bangalore-based video production and content creation agency with 4+ years of experience in visual storytelling and brand content.",
    path: "/about",
  },
  CONTACT: {
    title: "Contact Lyf Ads - Start Your Video Production Project",
    description:
      "Ready to elevate your brand with compelling visual content? Contact Lyf Ads for video production, brand films, and content creation services in Bangalore.",
    path: "/contact",
  },
  FAQ: {
    title: "FAQ - Video Production Services | Lyf Ads",
    description:
      "Find answers to common questions about our video production process, pricing, timelines, and content creation services.",
    path: "/faq",
  },
};
