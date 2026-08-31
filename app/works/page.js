import { PAGE_METADATA } from "@/lib/seo";
import WorksPage from "./WorksPage";

export const metadata = {
  ...PAGE_METADATA.WORKS,
  keywords: [
    "video production portfolio",
    "brand films",
    "promotional videos",
    "social media content",
    "ad creatives",
    "commercial videos",
    "content creation work",
    "Lyf Ads portfolio",
    "Bangalore video production",
  ],
};

export default function Works() {
  return <WorksPage />;
}