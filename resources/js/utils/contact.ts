/**
 * Single source of truth for the phone numbers behind every call / WhatsApp button.
 *
 * Rule:
 *  - Call buttons always dial the central hotline: 09638-000505.
 *  - WhatsApp buttons always use the WhatsApp line: 01400-786162.
 */

export const HOTLINE = "09638000505";
export const HOTLINE_DISPLAY = "09638-000505";
export const HOTLINE_TEL = "tel:+8809638000505";

export const WHATSAPP = "01400786162";
export const WHATSAPP_DISPLAY = "01400-786162";
export const WHATSAPP_INTL = "8801400786162";
export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_INTL}`;

/** Normalise any stored number (e.g. "01400786162", "+8801400786162") to wa.me format. */
export const toWhatsAppNumber = (raw?: string | null): string => {
  const digits = String(raw || "").replace(/[^0-9]/g, "");
  if (!digits) return WHATSAPP_INTL;
  if (digits.startsWith("880")) return digits;
  if (digits.startsWith("01")) return `88${digits}`;
  if (digits.startsWith("1") && digits.length === 10) return `880${digits}`;
  return digits;
};

/** Build a wa.me link from a stored number, keeping full links untouched. */
export const buildWhatsAppUrl = (raw?: string | null, text?: string): string => {
  const value = String(raw || "").trim();
  if (/^https?:\/\//i.test(value)) return value;
  const url = `https://wa.me/${toWhatsAppNumber(value)}`;
  return text ? `${url}?text=${encodeURIComponent(text)}` : url;
};
