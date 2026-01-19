
import { Poppins } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/components/ToastProvider";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600", "700"], // Add desired weights
  variable: "--font-poppins", // Custom CSS variable
});

export const metadata = {
  title: "Lyf Ads ",
  description: " We are the best when it comes to Exotic Cars.",
  icons: {
    icon: "/brandLogo.png", 
  },
};
export default function RootLayout({ children }) {
  

  return (
    <html lang="en">
      <body className={`${poppins.variable}`}>
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
