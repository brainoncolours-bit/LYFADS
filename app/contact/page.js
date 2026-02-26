import { PAGE_METADATA } from "@/lib/seo";
import ContactPage from "./ContactPage";

export const metadata = {
  ...PAGE_METADATA.CONTACT,
  keywords: [
    "contact Lyf Ads",
    "get in touch",
    "start a project",
    "video production inquiry",
    "brand film quote",
    "content creation collaboration",
    "Bangalore video agency contact",
  ],
};

export default function Contact() {
  return <ContactPage />;
}
