import type { Metadata } from "next";
import { Geist } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geist = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "상상우리 매칭",
  description: "시니어 일자리 자동 매칭 시스템",
};

const navLinks = [
  { href: "/register", label: "프로필 등록" },
  { href: "/recommendations", label: "추천 일자리" },
  { href: "/admin", label: "담당자 대시보드" },
];

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko" className={`${geist.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-background text-foreground text-lg">
        <header className="border-b bg-white shadow-sm">
          <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold text-gray-900 hover:text-gray-700">
              상상우리
            </Link>
            <nav className="flex gap-6">
              {navLinks.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className="text-lg font-medium text-gray-700 hover:text-gray-900 hover:underline underline-offset-4"
                >
                  {label}
                </Link>
              ))}
            </nav>
          </div>
        </header>

        <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-8">
          {children}
        </main>

        <footer className="border-t bg-gray-50 text-center py-4 text-base text-gray-500">
          © 2026 상상우리 — 시니어 일자리 매칭 서비스
        </footer>
      </body>
    </html>
  );
}
