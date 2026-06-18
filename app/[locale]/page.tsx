import { notFound } from "next/navigation";
import QRCreatorPage from "./QRCreatorPage";

const LOCALES = ["en", "ar"];

interface PageProps {
  params: Promise<{ locale: string }>;
}

async function getMessages(locale: string) {
  try {
    const messages = await import(`@/messages/${locale}.json`);
    return messages.default;
  } catch {
    return null;
  }
}

export async function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: PageProps) {
  const { locale } = await params;
  const messages = await getMessages(locale);
  if (!messages) return {};
  return {
    title: messages.meta.title,
    description: messages.meta.description,
  };
}

export default async function LocalePage({ params }: PageProps) {
  const { locale } = await params;
  if (!LOCALES.includes(locale)) notFound();

  const messages = await getMessages(locale);
  if (!messages) notFound();

  return (
    <QRCreatorPage
      locale={locale}
      t={{
        tabs: messages.tabs,
        fields: messages.fields,
        appearance: messages.appearance,
        logo: messages.logo,
        preview: messages.preview,
        download: messages.download,
        palettes: messages.palettes,
        chooseType: messages.chooseType,
        customField: messages.customField,
      }}
    />
  );
}
