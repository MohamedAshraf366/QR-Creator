export type QRTab =
  | "url" | "text" | "email" | "phone" | "sms"
  | "wifi" | "vcard" | "location" | "event"
  | "crypto" | "social" | "app";

export type ECLevel = "L" | "M" | "Q" | "H";

export interface PhoneEntry {
  id: string;
  countryDial: string;
  number: string;
}

export interface EmailEntry {
  id: string;
  value: string;
}

export interface UrlEntry {
  id: string;
  value: string;
}

export interface CustomField {
  id: string;
  label: string;
  value: string;
  type: "text" | "url" | "email" | "phone" | "number" | "date" | "textarea";
}

export interface QRFormState {
  // URL
  url: string;
  // Text
  text: string;
  // Email
  emails: EmailEntry[];
  emailSubject: string;
  emailBody: string;
  // Phone
  phones: PhoneEntry[];
  // SMS
  smsPhones: PhoneEntry[];
  smsMessage: string;
  // WiFi
  wifiSsid: string;
  wifiPassword: string;
  wifiSecurity: "WPA" | "WEP" | "";
  wifiHidden: boolean;
  // vCard
  vcardFirstName: string;
  vcardLastName: string;
  vcardOrg: string;
  vcardTitle: string;
  vcardPhones: PhoneEntry[];
  vcardEmails: EmailEntry[];
  vcardWebsite: string;
  vcardLinkedin: string;
  vcardStreet: string;
  vcardCity: string;
  vcardCountry: string;
  vcardPostcode: string;
  vcardBirthday: string;
  vcardNote: string;
  // Location
  latitude: string;
  longitude: string;
  placeName: string;
  zoomLevel: string;
  // Event
  eventTitle: string;
  eventStart: string;
  eventEnd: string;
  eventLocation: string;
  eventOrganiser: string;
  eventOrganiserEmail: string;
  eventDescription: string;
  eventAllDay: boolean;
  // Crypto
  cryptoCoin: string;
  cryptoWallet: string;
  cryptoAmount: string;
  cryptoLabel: string;
  cryptoMessage: string;
  // Social
  socialPlatform: string;
  socialUsername: string;
  // App
  appIos: string;
  appAndroid: string;
  appFallback: string;
  // Custom fields
  customFields: CustomField[];
}

export interface AppearanceState {
  fg: string;
  bg: string;
  size: number;
  margin: number;
  ec: ECLevel;
  logoDataUrl: string | null;
  logoSize: number;
}
