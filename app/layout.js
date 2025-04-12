import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ClientWrapper from "./components/ClientWrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Ultimate Todo | Boost Your Productivity",
  description:
    "The most powerful todo list application to organize your tasks, increase efficiency, and achieve more every day. Get started for free!",
  keywords: [
    "todo app",
    "productivity",
    "task management",
    "organize tasks",
    "time management",
    "ultimate todo",
    "get things done",
  ],
  openGraph: {
    title: "Ultimate Todo | Boost Your Productivity",
    description:
      "Organize your life and get more done with our powerful todo application",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ClientWrapper>{children}</ClientWrapper>
      </body>
    </html>
  );
}
