// Deployment settings. Override any of them with Vite env vars (see .env.example).

// Rajyotsav certificate service: generates the winner's PDF certificate and its QR code
export const CERTIFICATE_API_URL =
  import.meta.env.VITE_CERTIFICATE_API_URL || 'https://cggeomap.cgstate.gov.in/rajyotsav/api/certificate';

// This game's name as printed on the winner's certificate, so plain words (no underscores)
export const GAME_NAME = import.meta.env.VITE_GAME_NAME || 'Document Dash';

// Game selection screen that opens this game. When set, the kiosk returns there between
// players; when empty, it returns to this game's own start screen.
export const LAUNCHER_URL = import.meta.env.VITE_LAUNCHER_URL || '';
