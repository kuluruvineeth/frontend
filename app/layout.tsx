// These styles apply to every route in the application
import "@/styles/globals.css";
import { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const title = "Organize Simple";
const description =
  "Organize Simple is a web application that helps you to extract organzied data from unorganized text.";

export const metadata: Metadata = {
  title,
  description,
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.variable}>
        <Toaster />

        {children}
      </body>
    </html>
  );
}
