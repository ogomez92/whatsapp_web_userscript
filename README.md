# WhatsApp Web Accessibility Enhancer

A lightweight Tampermonkey/Greasemonkey userscript that improves accessibility on WhatsApp Web by adding keyboard shortcuts and better semantics for screen readers.

## What It Does
- Adds an off-screen `aria-live="assertive"` region to announce selected messages.
- Provides hotkeys: `Alt+1`…`Alt+0` speak the last 1–10 visible messages (prefers `aria-label`, falls back to text).
- Wraps each message node in an `<h3>` heading to create a navigable structure for assistive tech.
- Watches the DOM so new messages are wrapped automatically.

## Requirements
- A supported userscript manager: Tampermonkey (Chrome/Edge), Violentmonkey, or Greasemonkey.
- Access to `https://web.whatsapp.com/`.

## Install
1. Install a userscript manager (e.g., Tampermonkey).
2. Open the dashboard and create a “New userscript”.
3. Copy the contents of `whatsapp-web.user.js` from this repo and paste it over the template, then save.
4. Ensure the script is enabled and matches `https://web.whatsapp.com/*`.

## Usage
- Open WhatsApp Web and focus a chat.
- Press `Alt+1` to speak the most recent message, `Alt+2` for the previous, … `Alt+0` for the 10th most recent.
- Screen readers can also pick up announcements via the live region.

## Notes
- WhatsApp’s internal class names can change; if something stops working, update the selectors in `whatsapp-web.user.js`.
- The script uses jQuery via `@require`; your userscript manager fetches it automatically.
- Runs locally; no data is sent anywhere by this script.

---
Version: 1.1 • Author: OpenAI (customized for Oriol)
