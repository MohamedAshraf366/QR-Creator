"use client";
import { clsx } from "clsx";
import type { QRFormState, QRTab } from "@/types/qr";
import { Field, Input, Textarea, Select, Row, Hint, Divider } from "./ui";
import MultiPhoneInput from "./MultiPhoneInput";
import MultiTextInput from "./MultiTextInput";
import CustomFieldsPanel from "./CustomFieldsPanel";
import { nanoid } from "@/lib/nanoid";

// Tab icons as inline SVG strings for performance
const TAB_ICONS: Record<QRTab, React.ReactNode> = {
  url: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg>,
  text: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14,2 14,8 20,8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
  email: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>,
  phone: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.08 1.18 2 2 0 012.08 0h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L6.91 7.91a16 16 0 006.06 6.06l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/></svg>,
  sms: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>,
  wifi: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M5 12.55a11 11 0 0114.08 0"/><path d="M1.42 9a16 16 0 0121.16 0"/><path d="M8.53 16.11a6 6 0 016.95 0"/><line x1="12" y1="20" x2="12.01" y2="20"/></svg>,
  vcard: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  location: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>,
  event: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  crypto: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>,
  social: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>,
  app: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>,
};

const TABS: QRTab[] = ["url","text","email","phone","sms","wifi","vcard","location","event","crypto","social","app"];

interface Props {
  activeTab: QRTab;
  onTabChange: (tab: QRTab) => void;
  form: QRFormState;
  onChange: (patch: Partial<QRFormState>) => void;
  t: Record<string, string>;
  locale: string;
}

export default function QRForm({ activeTab, onTabChange, form, onChange, t, locale }: Props) {
  const isRtl = locale === "ar";

  const tab = (key: string) => t[key] ?? key;

  return (
    <div className="space-y-5">
      {/* Tab grid */}
      <div className="grid grid-cols-4 sm:grid-cols-6 gap-1.5">
        {TABS.map((tb) => (
          <button
            key={tb}
            type="button"
            onClick={() => onTabChange(tb)}
            className={clsx(
              "flex flex-col items-center gap-1.5 py-3 px-1 rounded-xl border text-[10px] font-semibold uppercase tracking-wider transition-all",
              activeTab === tb
                ? "bg-[var(--accent)]/15 border-[var(--accent)] text-[var(--accent)]"
                : "border-[var(--border)] text-[var(--muted)] hover:border-[var(--accent)]/50 hover:text-[var(--accent)] hover:bg-[var(--accent)]/5"
            )}
          >
            {TAB_ICONS[tb]}
            {tab(tb)}
          </button>
        ))}
      </div>

      {/* Tab panels */}
      <div className="space-y-4">

        {/* URL */}
        {activeTab === "url" && (
          <Field label={t.urlLabel ?? "Website URL"}>
            <Input type="url" value={form.url} onChange={(e) => onChange({ url: e.target.value })} placeholder="https://your-website.com" />
          </Field>
        )}

        {/* Text */}
        {activeTab === "text" && (
          <Field label={t.textLabel ?? "Plain text"}>
            <Textarea value={form.text} onChange={(e) => onChange({ text: e.target.value })} placeholder={isRtl ? "أدخل أي نص…" : "Enter any text…"} rows={5} />
          </Field>
        )}

        {/* Email */}
        {activeTab === "email" && (
          <>
            <MultiTextInput
              entries={form.emails}
              onChange={(emails) => onChange({ emails })}
              label={t.emailLabel ?? "Email address(es)"}
              placeholder={t.emailPlaceholder ?? "hello@example.com"}
              addLabel={isRtl ? "إضافة بريد آخر" : "Add another email"}
              type="email"
              locale={locale}
            />
            <Field label={t.subjectLabel ?? "Subject"}>
              <Input type="text" value={form.emailSubject} onChange={(e) => onChange({ emailSubject: e.target.value })} placeholder={isRtl ? "موضوع البريد (اختياري)" : "Email subject (optional)"} />
            </Field>
            <Field label={t.bodyLabel ?? "Message body"}>
              <Textarea value={form.emailBody} onChange={(e) => onChange({ emailBody: e.target.value })} placeholder={isRtl ? "نص مسبق الملء…" : "Pre-filled body text…"} rows={3} />
            </Field>
          </>
        )}

        {/* Phone */}
        {activeTab === "phone" && (
          <>
            <MultiPhoneInput
              entries={form.phones}
              onChange={(phones) => onChange({ phones })}
              locale={locale}
              label={t.phoneLabel ?? "Phone number(s)"}
              placeholder={isRtl ? "رقم الهاتف" : "Phone number"}
              addLabel={isRtl ? "إضافة رقم آخر" : "Add another number"}
            />
            <Hint>{isRtl ? "سيُطلب من المستخدم الاتصال بالرقم الأول عند مسح الرمز." : "Scanning this QR will prompt a call to the first number."}</Hint>
          </>
        )}

        {/* SMS */}
        {activeTab === "sms" && (
          <>
            <MultiPhoneInput
              entries={form.smsPhones}
              onChange={(smsPhones) => onChange({ smsPhones })}
              locale={locale}
              label={t.smsPhoneLabel ?? "Recipient number(s)"}
              placeholder={isRtl ? "رقم الهاتف" : "Phone number"}
              addLabel={isRtl ? "إضافة رقم آخر" : "Add another number"}
            />
            <Field label={t.smsMessageLabel ?? "Pre-filled message"}>
              <Textarea value={form.smsMessage} onChange={(e) => onChange({ smsMessage: e.target.value })} placeholder={isRtl ? "نص الرسالة (اختياري)…" : "Message text (optional)…"} rows={3} />
            </Field>
          </>
        )}

        {/* WiFi */}
        {activeTab === "wifi" && (
          <>
            <Field label={t.wifiSsidLabel ?? "Network name (SSID)"}>
              <Input type="text" value={form.wifiSsid} onChange={(e) => onChange({ wifiSsid: e.target.value })} placeholder={isRtl ? "اسم الشبكة" : "MyHomeNetwork"} />
            </Field>
            <Field label={t.wifiPasswordLabel ?? "Password"}>
              <Input type="text" value={form.wifiPassword} onChange={(e) => onChange({ wifiPassword: e.target.value })} placeholder={isRtl ? "كلمة المرور" : "yourpassword123"} />
            </Field>
            <Field label={t.wifiSecurityLabel ?? "Security type"}>
              <Select value={form.wifiSecurity} onChange={(e) => onChange({ wifiSecurity: e.target.value as "WPA" | "WEP" | "" })}>
                <option value="WPA">WPA / WPA2</option>
                <option value="WEP">WEP</option>
                <option value="">{isRtl ? "لا يوجد" : "None"}</option>
              </Select>
            </Field>
            <label className="flex items-center gap-2.5 text-sm text-[var(--text)] cursor-pointer select-none">
              <input type="checkbox" checked={form.wifiHidden} onChange={(e) => onChange({ wifiHidden: e.target.checked })} />
              {t.wifiHiddenLabel ?? "Hidden network"}
            </label>
          </>
        )}

        {/* vCard */}
        {activeTab === "vcard" && (
          <>
            <Row>
              <Field label={t.firstNameLabel ?? "First name"}>
                <Input type="text" value={form.vcardFirstName} onChange={(e) => onChange({ vcardFirstName: e.target.value })} placeholder={isRtl ? "محمد" : "Jane"} />
              </Field>
              <Field label={t.lastNameLabel ?? "Last name"}>
                <Input type="text" value={form.vcardLastName} onChange={(e) => onChange({ vcardLastName: e.target.value })} placeholder={isRtl ? "أحمد" : "Smith"} />
              </Field>
            </Row>
            <Row>
              <Field label={t.orgLabel ?? "Organisation"}>
                <Input type="text" value={form.vcardOrg} onChange={(e) => onChange({ vcardOrg: e.target.value })} placeholder={isRtl ? "اسم الشركة" : "Acme Ltd"} />
              </Field>
              <Field label={t.titleLabel ?? "Job title"}>
                <Input type="text" value={form.vcardTitle} onChange={(e) => onChange({ vcardTitle: e.target.value })} placeholder={isRtl ? "المسمى الوظيفي" : "Designer"} />
              </Field>
            </Row>
            <MultiPhoneInput
              entries={form.vcardPhones}
              onChange={(vcardPhones) => onChange({ vcardPhones })}
              locale={locale}
              label={t.phoneLabel ?? "Phone number(s)"}
              addLabel={isRtl ? "إضافة رقم آخر" : "Add another phone"}
            />
            <MultiTextInput
              entries={form.vcardEmails}
              onChange={(vcardEmails) => onChange({ vcardEmails })}
              label={t.emailLabel ?? "Email(s)"}
              placeholder="email@example.com"
              addLabel={isRtl ? "إضافة بريد آخر" : "Add another email"}
              type="email"
              locale={locale}
            />
            <Field label={t.websiteLabel ?? "Website"}>
              <Input type="url" value={form.vcardWebsite} onChange={(e) => onChange({ vcardWebsite: e.target.value })} placeholder="https://jane.com" />
            </Field>
            <Field label="LinkedIn">
              <Input type="url" value={form.vcardLinkedin} onChange={(e) => onChange({ vcardLinkedin: e.target.value })} placeholder="https://linkedin.com/in/jane" />
            </Field>
            <Divider label={isRtl ? "العنوان" : "Address"} />
            <Field label={t.streetLabel ?? "Street"}>
              <Input type="text" value={form.vcardStreet} onChange={(e) => onChange({ vcardStreet: e.target.value })} placeholder={isRtl ? "اسم الشارع" : "10 Downing Street"} />
            </Field>
            <Row cols={3}>
              <Field label={t.cityLabel ?? "City"}>
                <Input type="text" value={form.vcardCity} onChange={(e) => onChange({ vcardCity: e.target.value })} placeholder={isRtl ? "المدينة" : "London"} />
              </Field>
              <Field label={t.countryLabel ?? "Country"}>
                <Input type="text" value={form.vcardCountry} onChange={(e) => onChange({ vcardCountry: e.target.value })} placeholder={isRtl ? "الدولة" : "UK"} />
              </Field>
              <Field label={t.postcodeLabel ?? "Postcode"}>
                <Input type="text" value={form.vcardPostcode} onChange={(e) => onChange({ vcardPostcode: e.target.value })} placeholder="SW1A" />
              </Field>
            </Row>
            <Field label={t.birthdayLabel ?? "Birthday (YYYY-MM-DD)"}>
              <Input type="text" value={form.vcardBirthday} onChange={(e) => onChange({ vcardBirthday: e.target.value })} placeholder="1990-06-15" />
            </Field>
            <Field label={t.noteLabel ?? "Note"}>
              <Textarea value={form.vcardNote} onChange={(e) => onChange({ vcardNote: e.target.value })} placeholder={isRtl ? "ملاحظة اختيارية…" : "Optional note…"} rows={2} />
            </Field>
          </>
        )}

        {/* Location */}
        {activeTab === "location" && (
          <>
            <Row>
              <Field label={t.latLabel ?? "Latitude"}>
                <Input type="number" value={form.latitude} onChange={(e) => onChange({ latitude: e.target.value })} placeholder="51.5074" step="any" dir="ltr" />
              </Field>
              <Field label={t.lngLabel ?? "Longitude"}>
                <Input type="number" value={form.longitude} onChange={(e) => onChange({ longitude: e.target.value })} placeholder="-0.1278" step="any" dir="ltr" />
              </Field>
            </Row>
            <Field label={t.placeNameLabel ?? "Place name (optional)"}>
              <Input type="text" value={form.placeName} onChange={(e) => onChange({ placeName: e.target.value })} placeholder={isRtl ? "اسم المكان" : "Buckingham Palace, London"} />
            </Field>
            <Field label={t.zoomLabel ?? "Zoom level (1–21)"}>
              <Input type="number" value={form.zoomLevel} onChange={(e) => onChange({ zoomLevel: e.target.value })} min={1} max={21} dir="ltr" />
            </Field>
          </>
        )}

        {/* Event */}
        {activeTab === "event" && (
          <>
            <Field label={t.eventTitleLabel ?? "Event title"}>
              <Input type="text" value={form.eventTitle} onChange={(e) => onChange({ eventTitle: e.target.value })} placeholder={isRtl ? "عنوان الحدث" : "Team kickoff meeting"} />
            </Field>
            <Row>
              <Field label={t.startLabel ?? "Start"}>
                <Input type="datetime-local" value={form.eventStart} onChange={(e) => onChange({ eventStart: e.target.value })} dir="ltr" />
              </Field>
              <Field label={t.endLabel ?? "End"}>
                <Input type="datetime-local" value={form.eventEnd} onChange={(e) => onChange({ eventEnd: e.target.value })} dir="ltr" />
              </Field>
            </Row>
            <label className="flex items-center gap-2.5 text-sm text-[var(--text)] cursor-pointer select-none">
              <input type="checkbox" checked={form.eventAllDay} onChange={(e) => onChange({ eventAllDay: e.target.checked })} />
              {t.allDayLabel ?? "All-day event"}
            </label>
            <Field label={t.locationLabel ?? "Location / URL"}>
              <Input type="text" value={form.eventLocation} onChange={(e) => onChange({ eventLocation: e.target.value })} placeholder={isRtl ? "المكان أو الرابط" : "Room B or https://meet.google.com/…"} />
            </Field>
            <Row>
              <Field label={t.organiserNameLabel ?? "Organiser name"}>
                <Input type="text" value={form.eventOrganiser} onChange={(e) => onChange({ eventOrganiser: e.target.value })} placeholder={isRtl ? "اسم المنظم" : "Jane Smith"} />
              </Field>
              <Field label={t.organiserEmailLabel ?? "Organiser email"}>
                <Input type="email" value={form.eventOrganiserEmail} onChange={(e) => onChange({ eventOrganiserEmail: e.target.value })} placeholder="jane@co.com" />
              </Field>
            </Row>
            <Field label={t.descriptionLabel ?? "Description"}>
              <Textarea value={form.eventDescription} onChange={(e) => onChange({ eventDescription: e.target.value })} placeholder={isRtl ? "تفاصيل اختيارية…" : "Optional details…"} rows={3} />
            </Field>
          </>
        )}

        {/* Crypto */}
        {activeTab === "crypto" && (
          <>
            <Field label={t.cryptoCoinLabel ?? "Cryptocurrency"}>
              <Select value={form.cryptoCoin} onChange={(e) => onChange({ cryptoCoin: e.target.value })}>
                {["bitcoin","ethereum","litecoin","dogecoin","dash","monero","zcash"].map((c) => (
                  <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                ))}
              </Select>
            </Field>
            <Field label={t.walletLabel ?? "Wallet address"}>
              <Input type="text" value={form.cryptoWallet} onChange={(e) => onChange({ cryptoWallet: e.target.value })} placeholder="1A1zP1eP5QGefi2DMPTfTL5…" dir="ltr" />
            </Field>
            <Row>
              <Field label={t.amountLabel ?? "Amount (optional)"}>
                <Input type="number" value={form.cryptoAmount} onChange={(e) => onChange({ cryptoAmount: e.target.value })} placeholder="0.001" step="any" dir="ltr" />
              </Field>
              <Field label={t.labelLabel ?? "Label (optional)"}>
                <Input type="text" value={form.cryptoLabel} onChange={(e) => onChange({ cryptoLabel: e.target.value })} placeholder={isRtl ? "تبرع" : "Donation"} />
              </Field>
            </Row>
            <Field label={t.messageLabel ?? "Message (optional)"}>
              <Input type="text" value={form.cryptoMessage} onChange={(e) => onChange({ cryptoMessage: e.target.value })} placeholder={isRtl ? "شكراً لك!" : "Thanks!"} />
            </Field>
          </>
        )}

        {/* Social */}
        {activeTab === "social" && (
          <>
            <Field label={t.platformLabel ?? "Platform"}>
              <Select value={form.socialPlatform} onChange={(e) => onChange({ socialPlatform: e.target.value })}>
                {["twitter","instagram","facebook","youtube","tiktok","linkedin","github","snapchat","pinterest","reddit"].map((p) => (
                  <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>
                ))}
              </Select>
            </Field>
            <Field label={t.usernameLabel ?? "Username / handle"}>
              <Input type="text" value={form.socialUsername} onChange={(e) => onChange({ socialUsername: e.target.value })} placeholder="@username" dir="ltr" />
            </Field>
            <Hint>{isRtl ? "سيرتبط رمز QR مباشرة بصفحة الملف الشخصي على المنصة المختارة." : "The QR code links directly to this profile on the selected platform."}</Hint>
          </>
        )}

        {/* App Link */}
        {activeTab === "app" && (
          <>
            <Field label={t.appIosLabel ?? "App Store (iOS)"}>
              <Input type="url" value={form.appIos} onChange={(e) => onChange({ appIos: e.target.value })} placeholder="https://apps.apple.com/app/id…" dir="ltr" />
            </Field>
            <Field label={t.appAndroidLabel ?? "Google Play (Android)"}>
              <Input type="url" value={form.appAndroid} onChange={(e) => onChange({ appAndroid: e.target.value })} placeholder="https://play.google.com/store/apps/details?id=…" dir="ltr" />
            </Field>
            <Field label={t.appFallbackLabel ?? "Fallback URL (desktop)"}>
              <Input type="url" value={form.appFallback} onChange={(e) => onChange({ appFallback: e.target.value })} placeholder="https://your-app-website.com" dir="ltr" />
            </Field>
            <Hint>{isRtl ? "سيُستخدم الرابط الاحتياطي (أو رابط iOS إذا لم يُحدَّد احتياطي). لاكتشاف نظام التشغيل الحقيقي، استخدم خدمة مثل branch.io." : "The fallback URL is used as the QR target. For true OS detection, use a smart link service like branch.io."}</Hint>
          </>
        )}

      </div>

      {/* Custom fields — always visible */}
      <div className="pt-1">
        <div className="h-px bg-[var(--border)] mb-4" />
        <CustomFieldsPanel
          fields={form.customFields}
          onChange={(customFields) => onChange({ customFields })}
          locale={locale}
          title={isRtl ? "حقول مخصصة" : "Custom Fields"}
          addLabel={isRtl ? "إضافة حقل" : "Add Field"}
          fieldLabelLabel={isRtl ? "اسم الحقل" : "Field label"}
          fieldValueLabel={isRtl ? "القيمة" : "Value"}
          fieldTypeLabel={isRtl ? "النوع" : "Type"}
          removeLabel={isRtl ? "حذف" : "Remove"}
        />
      </div>
    </div>
  );
}
