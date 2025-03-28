# E-shop Frontend

Detta är frontend-delen av e-handelsapplikationen, byggd med Next.js, TypeScript och Tailwind CSS.

## Förutsättningar

- Node.js (version 18 eller senare)
- npm eller yarn
- Backend-API:et måste vara igång (se backend-projektets README)

## Installation

1. Klona projektet
```bash
git clone <repository-url>
cd webbshopfrontend
```

2. Installera dependencies
```bash
npm install
# eller
yarn install
```

3. Skapa en .env.local fil i projektets rot med följande innehåll:
```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

## Starta utvecklingsservern

```bash
npm run dev
# eller
yarn dev
```

Applikationen kommer nu vara tillgänglig på [http://localhost:3001](http://localhost:3001)

## Funktioner

- Produktlistning
- Varukorg
- Checkout med Stripe integration
- Orderbekräftelse
- Kundhantering

## Struktur

- `/src/app` - Next.js app router och huvudkomponenter
- `/src/components` - Återanvändbara komponenter
- `/lib` - Tjänster och utilities
- `/public` - Statiska filer

## För utvecklare

### Viktig information

- Stripe är konfigurerat i testläge
- För att testa betalningar, använd Stripes test-kort:
  - Kortnummer: 4242 4242 4242 4242
  - Utgångsdatum: Valfritt framtida datum
  - CVC: Valfri tresiffrig kod

### Kända begränsningar

- Backend-API:et måste vara igång för att frontend ska fungera
- Stripe webhooks måste vara korrekt konfigurerade för full funktionalitet

### Testa webhooks lokalt

För att testa Stripe webhooks lokalt behöver du:

1. Installera Stripe CLI
2. Kör följande kommando:
```bash
stripe listen --forward-to localhost:3000/stripe/webhook
```

## Scripts

- `npm run dev` - Starta utvecklingsservern
- `npm run build` - Bygg projektet
- `npm start` - Starta produktionsservern
- `npm run lint` - Kör linting
