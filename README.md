# Cyber Tech Guardians

An interactive, multilingual cybersecurity education website built from the original **Stay Secure, Surf Sure** concept.

## What it includes

- Nine-language interface with RTL support for Arabic and Urdu
- Real-world scam and digital-ethics guidance
- Animated cybersecurity statistics and navigation
- Private, in-browser password strength checker
- Cryptographically secure password generator
- Interactive phishing quiz and safety checklist
- Full-stack email subscription endpoint with validation, deduplication, and Cloudflare D1 persistence
- Responsive, keyboard-accessible dark cyber interface
- Custom Open Graph preview for social sharing

## Privacy

Passwords entered into the toolkit never leave the browser. They are not stored, logged, or sent to the backend. Only email addresses submitted through the **Notify Me** form are persisted.

## Local development

Requires Node.js 22.13 or newer.

```bash
npm install
npm run dev
```

The local site will be available at the URL printed by the development server.

## Validation

```bash
npm test
```

This creates a production build and runs the server-rendering and backend contract checks.

## Stack

- React 19
- vinext / Vite
- Cloudflare Workers and D1
- Drizzle ORM

## License

Copyright © 2026 Cyber Tech Guardians. All rights reserved.
