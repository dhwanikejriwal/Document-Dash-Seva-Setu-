import { CERTIFICATE_API_URL, GAME_NAME } from '../config';

// Give up on a slow or unreachable certificate service after this long
const TIMEOUT_MS = 20000;

// "m:ss", as the certificate service expects (e.g. 1:45, 0:43)
export const formatTimeTaken = seconds =>
  `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;

// Asks the certificate service to generate the winner's certificate.
// Resolves to { certificateUrl, qrCode }, where qrCode is a PNG data URL that opens the PDF.
// Every call creates a new certificate on the server, so call it once per won game.
export async function requestCertificate({ username, timeTakenSeconds }) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const res = await fetch(CERTIFICATE_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username,
        gameName: GAME_NAME,
        timeTaken: formatTimeTaken(timeTakenSeconds)
      }),
      signal: controller.signal
    });
    if (!res.ok) throw new Error(`Certificate service responded with ${res.status}`);

    const data = await res.json();
    if (typeof data.qrCode !== 'string' || !data.qrCode.startsWith('data:image/')) {
      throw new Error('Certificate service did not return a QR code');
    }
    return { certificateUrl: data.certificateUrl, qrCode: data.qrCode };
  } finally {
    clearTimeout(timeout);
  }
}
