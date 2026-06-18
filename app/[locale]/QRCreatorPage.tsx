"use client";
import { useState, useCallback, useMemo } from "react";
import type { QRTab, QRFormState, AppearanceState } from "@/types/qr";
import { defaultForm, defaultAppearance } from "@/lib/defaults";
import { buildQRContent } from "@/lib/buildContent";
import QRForm from "@/components/QRForm";
import AppearancePanel from "@/components/AppearancePanel";
import QRPreview from "@/components/QRPreview";
import { Divider } from "@/components/ui";

interface Props {
  locale: string;
  t: {
    tabs: Record<string, string>;
    fields: Record<string, string>;
    appearance: Record<string, string>;
    logo: Record<string, string>;
    preview: Record<string, string>;
    download: Record<string, string>;
    palettes: Record<string, string>;
    chooseType: string;
    customField: Record<string, string>;
  };
}

// Build flat translation map for child components
function flatT(t: Props["t"]): Record<string, string> {
  const map: Record<string, string> = {};
  // Tab labels
  Object.entries(t.tabs).forEach(([k, v]) => { map[k] = v; });
  // Field labels — map to short keys used in QRForm
  const f = t.fields;
  map.urlLabel = f.url; map.textLabel = f.text;
  map.emailLabel = f.email; map.subjectLabel = f.subject; map.bodyLabel = f.body;
  map.phoneLabel = f.phone; map.smsPhoneLabel = f.smsPhone; map.smsMessageLabel = f.smsMessage;
  map.wifiSsidLabel = f.wifiSsid; map.wifiPasswordLabel = f.wifiPassword;
  map.wifiSecurityLabel = f.wifiSecurity; map.wifiHiddenLabel = f.wifiHidden;
  map.firstNameLabel = f.firstName; map.lastNameLabel = f.lastName;
  map.orgLabel = f.organisation; map.titleLabel = f.jobTitle;
  map.websiteLabel = f.website; map.streetLabel = f.street;
  map.cityLabel = f.city; map.countryLabel = f.country; map.postcodeLabel = f.postcode;
  map.birthdayLabel = f.birthday; map.noteLabel = f.note;
  map.latLabel = f.latitude; map.lngLabel = f.longitude;
  map.placeNameLabel = f.placeName; map.zoomLabel = f.zoomLevel;
  map.eventTitleLabel = f.eventTitle; map.startLabel = f.startDateTime; map.endLabel = f.endDateTime;
  map.locationLabel = f.locationOrUrl; map.organiserNameLabel = f.organiserName;
  map.organiserEmailLabel = f.organiserEmail; map.descriptionLabel = f.description;
  map.allDayLabel = f.allDay;
  map.cryptoCoinLabel = f.cryptocurrency; map.walletLabel = f.walletAddress;
  map.amountLabel = f.amount; map.labelLabel = f.label; map.messageLabel = f.message;
  map.platformLabel = f.platform; map.usernameLabel = f.username;
  map.appIosLabel = f.appStoreIos; map.appAndroidLabel = f.googlePlay; map.appFallbackLabel = f.fallbackUrl;
  // Appearance
  map.colours = t.appearance.title; map.foreground = t.appearance.foreground;
  map.background = t.appearance.background; map.size = t.appearance.size;
  map.margin = t.appearance.margin; map.errorCorrection = t.appearance.errorCorrection;
  // Logo
  map.logoTitle = t.logo.title; map.uploadLogo = t.logo.upload;
  map.uploadHint = t.logo.hint; map.removeLogo = t.logo.remove;
  map.logoSize = t.logo.sizeLabel; map.ecBumped = t.logo.ecBumped;
  // Preview
  map.waiting = t.preview.waiting; map.tooLong = t.preview.tooLong;
  // Download
  map.png = t.download.png; map.svg = t.download.svg; map.pdf = t.download.pdf;
  map.copy = t.download.copy; map.copied = t.download.copied;
  map.pngSaved = t.download.pngSaved; map.svgSaved = t.download.svgSaved; map.pdfSaved = t.download.pdfSaved;
  // Custom fields
  map.customTitle = t.customField.title; map.addField = t.customField.addField;
  return map;
}

export default function QRCreatorPage({ locale, t }: Props) {
  const [activeTab, setActiveTab] = useState<QRTab>("url");
  const [form, setForm] = useState<QRFormState>(defaultForm);
  const [appearance, setAppearance] = useState<AppearanceState>(defaultAppearance);
  const isRtl = locale === "ar";

  const patchForm = useCallback((patch: Partial<QRFormState>) => {
    setForm((f) => ({ ...f, ...patch }));
  }, []);

  const patchAppearance = useCallback((patch: Partial<AppearanceState>) => {
    setAppearance((a) => ({ ...a, ...patch }));
  }, []);

  const content = useMemo(() => buildQRContent(activeTab, form), [activeTab, form]);
  const flatted = useMemo(() => flatT(t), [t]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8" dir={isRtl ? "rtl" : "ltr"}>

      {/* Hero */}
      <div className="text-center space-y-2 pt-2">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[var(--text)]">
          {isRtl ? (
            <>أنشئ <span className="text-[var(--accent)]">رمز QR</span> في ثوانٍ</>
          ) : (
            <>Generate <span className="text-[var(--accent)]">QR codes</span> in seconds</>
          )}
        </h1>
        <p className="text-sm text-[var(--muted)] max-w-lg mx-auto">
          {isRtl
            ? "12 نوعاً من الرموز، مع دعم الحقول المتعددة والشعارات وتنزيل PNG/SVG/PDF"
            : "12 QR types · multi-value fields · logos · download PNG, SVG or PDF"}
        </p>
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6 items-start">

        {/* Left: Form + Appearance */}
        <div className="space-y-5">
          {/* Form card */}
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-sm space-y-5">
            <p className="text-xs font-semibold uppercase tracking-widest text-[var(--faint)]">
              {t.chooseType}
            </p>
            <QRForm
              activeTab={activeTab}
              onTabChange={setActiveTab}
              form={form}
              onChange={patchForm}
              t={flatted}
              locale={locale}
            />
          </div>

          {/* Appearance card */}
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-widest text-[var(--faint)] mb-4">
              {t.appearance.title}
            </p>
            <AppearancePanel
              state={appearance}
              onChange={patchAppearance}
              t={flatted}
              locale={locale}
            />
          </div>
        </div>

        {/* Right: Preview (sticky) */}
        <div className="lg:sticky lg:top-[76px]">
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-widest text-[var(--faint)] mb-4">
              {t.preview.title}
            </p>
            <QRPreview
              content={content}
              appearance={appearance}
              t={flatted}
              locale={locale}
            />
          </div>
        </div>

      </div>
    </div>
  );
}
