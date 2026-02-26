import { PAGE_METADATA } from "@/lib/seo";
import HomePage from "./HomePage";

export const metadata = {
  ...PAGE_METADATA.HOME,
  keywords: [
    "exotic cars",
    "luxury cars",
    "car marketing",
    "motion design",
    "automotive advertising",
    "brand elevation",
    "video production",
    "creative agency",
    "supercars",
    "hypercars",
    "Lyf Ads",
  ],
};

export default function Home() {
  return <HomePage />;
}
