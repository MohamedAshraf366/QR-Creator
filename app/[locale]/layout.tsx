import { ThemeProvider } from "next-themes";
import Navbar from "@/components/Navbar";

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

async function getNavMessages(locale: string) {
  try {
    const m = await import(`@/messages/${locale}.json`);
    return m.default;
  } catch {
    return null;
  }
}

export default async function LocaleLayout({ children, params }: LayoutProps) {
  const { locale } = await params;
  const messages = await getNavMessages(locale);
  const brand = messages?.nav?.brand ?? "QR Creator";
  const tagline = messages?.nav?.tagline ?? "Beautiful QR codes in seconds";

  return (
    <>
      <Navbar locale={locale} brand={brand} tagline={tagline} />
      <main>{children}</main>
    </>
  );
}
