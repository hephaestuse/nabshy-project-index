import "server-only";

const persianDigitOffset = "۰".charCodeAt(0);
const arabicDigitOffset = "٠".charCodeAt(0);

function normalizeDigits(value: string) {
  return value.replace(/[۰-۹٠-٩]/g, (digit) => {
    const codePoint = digit.charCodeAt(0);

    if (codePoint >= persianDigitOffset && codePoint <= persianDigitOffset + 9) {
      return String(codePoint - persianDigitOffset);
    }

    return String(codePoint - arabicDigitOffset);
  });
}

export function normalizePhoneNumber(value: string) {
  const trimmed = normalizeDigits(value.trim());
  const hasLeadingPlus = trimmed.startsWith("+");
  const compact = trimmed.replace(/[^\d+]/g, "");

  if ((compact.match(/\+/g) ?? []).length > 1) {
    return null;
  }

  let phone = compact;

  if (hasLeadingPlus) {
    phone = `+${compact.replace(/\+/g, "")}`;
  } else {
    phone = compact.replace(/\+/g, "");
  }

  if (phone.startsWith("0098")) {
    phone = `+98${phone.slice(4)}`;
  } else if (phone.startsWith("98") && phone.length === 12) {
    phone = `+${phone}`;
  } else if (phone.startsWith("0") && phone.length === 11) {
    phone = `+98${phone.slice(1)}`;
  }

  if (!/^\+[1-9]\d{7,14}$/.test(phone)) {
    return null;
  }

  return phone;
}
