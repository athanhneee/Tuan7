import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Bài thực hành Form Zod",
  description: "Form đăng ký thành viên với React Hook Form, Zod và Next.js Server Actions"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  );
}
