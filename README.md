# Málmon - Frammendi

## Setup

Til að keyra síðu í development þarf .env.local skrá með þessum upplýsingum:
NEXT_PUBLIC_API_URL=http://localhost:3000 **Ef vefþjónn er keyrður á port 3000**

Annars:
NEXT_PUBLIC_API_URL=**slóð á setninga vefþjónustu**\

Svo keyra eftirfarandi skipanir:

```bash
npm run install
npm run dev # keyrir upp development mode
```

Opna [http://localhost:3000](http://localhost:3000) í vafra til að sjá síðu. Eða á [http://localhost:3001](http://localhost:3001) ef vefþjónn er keyrður á port 3000.

Þetta er [Next.js](https://nextjs.org/) verkefni bootstrapped með [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).
