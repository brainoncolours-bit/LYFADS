import { PAGE_METADATA } from "@/lib/seo";
import HomePage from "./HomePage";

export const metadata = {
  ...PAGE_METADATA.HOME,
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
};

export default function Home() {
  return <HomePage />;
}
