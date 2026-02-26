import { PAGE_METADATA } from "@/lib/seo";
import FAQPage from "./FAQPage";

export const metadata = {
  ...PAGE_METADATA.FAQ,
  keywords: [
    "FAQ",
    "frequently asked questions",
    "Lyf Ads questions",
    "video production process",
    "content creation pricing",
    "brand film timeline",
    "video editing FAQ",
  ],
};

export default function FAQ() {
  return <FAQPage />;
}
