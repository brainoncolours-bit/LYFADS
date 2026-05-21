import { Poppins } from "next/font/google";
import "./globals.css";
import AntdReactPatch from "@/components/AntdReactPatch";
import { ToastProvider } from "@/components/ToastProvider";
import StructuredData, { organizationData } from "@/components/StructuredData";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-poppins",
});

const SITE_URL = "https://lyfads.com"; // TODO: Update with your actual domain

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Lyf Ads - Video Production & Motion Systems Agency",
    template: "%s | Lyf Ads",
  },
  description:
    "Lyf Ads specializes in high-end video production, motion design, and brand storytelling. We create stunning visual experiences that elevate your brand to the next level.",
  keywords: [
    "video production",
    "motion design",
    "brand storytelling",
    "creative agency",
    "cinematography",
    "visual effects",
    "commercial video",
    "brand elevation",
    "digital content",
    "Lyf Ads",
  ],
  authors: [{ name: "Lyf Ads" }],
  creator: "Lyf Ads",
  publisher: "Lyf Ads",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/bg.png",
    apple: "/bg.png",
    shortcut: "/bg.png",
  },
  manifest: "/manifest.json",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: "Lyf Ads",
    title: "Lyf Ads - Video Production & Motion Systems Agency",
    description:
      "Lyf Ads specializes in high-end video production, motion design, and brand storytelling.",
    images: [
      {
        url: "/og-image.png", // TODO: Add og-image.png to /public folder (1200x630px)
        width: 1200,
        height: 630,
        alt: "Lyf Ads - Video Production & Motion Systems Agency",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Lyf Ads - Video Production & Motion Systems Agency",
    description:
      "Lyf Ads specializes in high-end video production, motion design, and brand storytelling.",
    images: ["/og-image.png"], // TODO: Add og-image.png to /public folder
    creator: "@lyfads", // TODO: Update with your Twitter handle
  },
  verification: {
    // TODO: Add your verification codes
    // google: "your-google-verification-code",
    // yandex: "your-yandex-verification-code",
    // yahoo: "your-yahoo-verification-code",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth">
      <head>
        <link rel="canonical" href={SITE_URL} />
      </head>
      <body className={`${poppins.variable} antialiased`}>
        <AntdReactPatch />
        <StructuredData data={organizationData} />
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
