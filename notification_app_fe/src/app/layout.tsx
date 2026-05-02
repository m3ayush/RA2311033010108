import type { Metadata } from "next";
import ThemeRegistry from "@/components/ThemeRegistry";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "Campus Notifications",
  description: "Priority-based campus notification management system",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body style={{ margin: 0 }}>
        <ThemeRegistry>
          <Navbar />
          <main>{children}</main>
        </ThemeRegistry>
      </body>
    </html>
  );
}
