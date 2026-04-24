import twilio from "twilio";

let twilioClient;

function getTwilioClient() {
  const sid = process.env.TWILIO_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;

  if (!sid || !authToken) {
    return null;
  }

  if (!twilioClient) {
    twilioClient = twilio(sid, authToken);
  }

  return twilioClient;
}

function normalizePhone(phone) {
  const raw = String(phone || "").trim();
  if (!raw) return "";
  if (raw.startsWith("+")) return raw;

  const digits = raw.replace(/\D/g, "");
  if (digits.length === 10) return `+91${digits}`;
  if (!digits) return "";

  return `+${digits}`;
}

export async function sendSMS(toOrPayload, maybeMessage) {
  try {
    const to =
      typeof toOrPayload === "object" && toOrPayload !== null
        ? toOrPayload.to
        : toOrPayload;
    const message =
      typeof toOrPayload === "object" && toOrPayload !== null
        ? toOrPayload.message
        : maybeMessage;

    const from = process.env.TWILIO_PHONE;
    const client = getTwilioClient();
    const normalizedTo = normalizePhone(to);

    if (!client) {
      console.error("SMS skipped: Missing TWILIO_SID or TWILIO_AUTH_TOKEN");
      return { success: false, skipped: true };
    }

    if (!from) {
      console.error("SMS skipped: Missing TWILIO_PHONE");
      return { success: false, skipped: true };
    }

    if (!normalizedTo) {
      console.error("SMS skipped: Missing/invalid destination phone number");
      return { success: false, skipped: true };
    }

    if (!message) {
      console.error("SMS skipped: Empty message body");
      return { success: false, skipped: true };
    }

    await client.messages.create({
      from,
      to: normalizedTo,
      body: message,
    });

    return { success: true };
  } catch (error) {
    console.error("SMS send failed:", error);
    return { success: false, error };
  }
}
