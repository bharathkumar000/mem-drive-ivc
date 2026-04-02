import { Inter, Outfit } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata = {
  title: "Skill Forge - Innovators & Visionaries Club",
  description: "Quiz platform for the Innovators & Visionaries Club",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${outfit.variable} antialiased h-full`}
    >
      <body className="min-h-full flex flex-col font-sans bg-page-bg">
        {children}
      </body>
    </html>
  );
}
