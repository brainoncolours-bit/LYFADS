import { PAGE_METADATA } from "@/lib/seo";
import AboutPage from "./AboutPage";

export const metadata = {
  ...PAGE_METADATA.ABOUT,
  keywords: [
    "about Lyf Ads",
    "video production team",
    "content creation agency Bangalore",
    "brand storytelling",
    "visual storytelling experts",
    "Bangalore creative agency",
    "4 years experience",
    "video production company",
  ],
};

export default function About() {
  return <AboutPage />;
}
