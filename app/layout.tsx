import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Group Ordering - Share Meals Together",
  description: "Collaborative meal ordering for groups",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
