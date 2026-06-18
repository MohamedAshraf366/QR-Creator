import type { QRFormState, QRTab } from "@/types/qr";

function esc(s: string) {
  return s.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/:/g, "\\:");
}

function fmtDt(dt: string) {
  return dt ? dt.replace(/[-:T]/g, "").slice(0, 15) + "Z" : "";
}

export function buildQRContent(tab: QRTab, form: QRFormState): string {
  switch (tab) {
    case "url":
      return form.url || "https://example.com";

    case "text":
      return form.text || "Hello World";

    case "email": {
      const addrs = form.emails.map((e) => e.value).filter(Boolean).join(",");
      if (!addrs) return "mailto:user@example.com";
      const p: string[] = [];
      if (form.emailSubject) p.push("subject=" + encodeURIComponent(form.emailSubject));
      if (form.emailBody) p.push("body=" + encodeURIComponent(form.emailBody));
      return "mailto:" + addrs + (p.length ? "?" + p.join("&") : "");
    }

    case "phone": {
      const nums = form.phones
        .map((p) => (p.countryDial + p.number).replace(/\s+/g, ""))
        .filter(Boolean);
      if (!nums.length) return "tel:+441234567890";
      // Multiple numbers: use first for QR (tel: protocol supports one)
      return "tel:" + nums[0];
    }

    case "sms": {
      const nums = form.smsPhones
        .map((p) => (p.countryDial + p.number).replace(/\s+/g, ""))
        .filter(Boolean);
      const n = nums[0] || "+441234567890";
      return "smsto:" + n + (form.smsMessage ? ":" + form.smsMessage : "");
    }

    case "wifi": {
      return `WIFI:T:${form.wifiSecurity};S:${esc(form.wifiSsid)};P:${esc(form.wifiPassword)};H:${form.wifiHidden ? "true" : "false"};;`;
    }

    case "vcard": {
      const fn = form.vcardFirstName;
      const ln = form.vcardLastName;
      let c = "BEGIN:VCARD\nVERSION:3.0\n";
      if (fn || ln) c += `N:${ln};${fn};;;\nFN:${fn} ${ln}\n`;
      if (form.vcardOrg) c += `ORG:${form.vcardOrg}\n`;
      if (form.vcardTitle) c += `TITLE:${form.vcardTitle}\n`;
      form.vcardPhones.forEach((p, i) => {
        const full = (p.countryDial + p.number).replace(/\s+/g, "");
        if (full) c += `TEL;TYPE=${i === 0 ? "WORK" : "CELL"},VOICE:${full}\n`;
      });
      form.vcardEmails.forEach((e, i) => {
        if (e.value) c += `EMAIL;TYPE=${i === 0 ? "WORK" : "HOME"}:${e.value}\n`;
      });
      if (form.vcardWebsite) c += `URL:${form.vcardWebsite}\n`;
      if (form.vcardLinkedin) c += `X-SOCIALPROFILE;type=linkedin:${form.vcardLinkedin}\n`;
      const { vcardStreet: st, vcardCity: ct, vcardCountry: co, vcardPostcode: pc } = form;
      if (st || ct || co || pc) c += `ADR;TYPE=WORK:;;${st};${ct};;${pc};${co}\n`;
      if (form.vcardBirthday) c += `BDAY:${form.vcardBirthday.replace(/-/g, "")}\n`;
      if (form.vcardNote) c += `NOTE:${form.vcardNote}\n`;
      // Custom fields appended as X- properties
      form.customFields.forEach((cf) => {
        if (cf.label && cf.value) c += `X-CUSTOM;type=${cf.label.toUpperCase()}:${cf.value}\n`;
      });
      c += "END:VCARD";
      return c;
    }

    case "location": {
      const la = form.latitude || "51.5074";
      const ln = form.longitude || "-0.1278";
      const zm = form.zoomLevel || "16";
      const nm = form.placeName;
      return `geo:${la},${ln};u=${zm}${nm ? "?q=" + encodeURIComponent(nm) : ""}`;
    }

    case "event": {
      const allDay = form.eventAllDay;
      const startRaw = form.eventStart;
      const endRaw = form.eventEnd;
      const start = allDay ? startRaw.slice(0, 10).replace(/-/g, "") : fmtDt(startRaw);
      const end = allDay ? endRaw.slice(0, 10).replace(/-/g, "") : fmtDt(endRaw);
      let ev = "BEGIN:VCALENDAR\nVERSION:2.0\nBEGIN:VEVENT\n";
      ev += `SUMMARY:${form.eventTitle || "Event"}\n`;
      if (start) ev += allDay ? `DTSTART;VALUE=DATE:${start}\n` : `DTSTART:${start}\n`;
      if (end) ev += allDay ? `DTEND;VALUE=DATE:${end}\n` : `DTEND:${end}\n`;
      if (form.eventLocation) ev += `LOCATION:${form.eventLocation}\n`;
      if (form.eventDescription) ev += `DESCRIPTION:${form.eventDescription}\n`;
      if (form.eventOrganiser) ev += `ORGANIZER;CN=${form.eventOrganiser}:MAILTO:${form.eventOrganiserEmail}\n`;
      ev += "END:VEVENT\nEND:VCALENDAR";
      return ev;
    }

    case "crypto": {
      const coin = form.cryptoCoin || "bitcoin";
      const addr = form.cryptoWallet;
      if (!addr) return `${coin}:WALLET_ADDRESS`;
      const p: string[] = [];
      if (form.cryptoAmount) p.push("amount=" + form.cryptoAmount);
      if (form.cryptoLabel) p.push("label=" + encodeURIComponent(form.cryptoLabel));
      if (form.cryptoMessage) p.push("message=" + encodeURIComponent(form.cryptoMessage));
      return `${coin}:${addr}${p.length ? "?" + p.join("&") : ""}`;
    }

    case "social": {
      const user = form.socialUsername.replace(/^@/, "");
      const urls: Record<string, string> = {
        twitter: `https://twitter.com/${user}`,
        instagram: `https://instagram.com/${user}`,
        facebook: `https://facebook.com/${user}`,
        youtube: `https://youtube.com/@${user}`,
        tiktok: `https://tiktok.com/@${user}`,
        linkedin: `https://linkedin.com/in/${user}`,
        github: `https://github.com/${user}`,
        snapchat: `https://snapchat.com/add/${user}`,
      };
      return urls[form.socialPlatform] || `https://twitter.com/${user || "username"}`;
    }

    case "app":
      return form.appFallback || form.appIos || form.appAndroid || "https://your-app.com";

    default:
      return "https://example.com";
  }
}
