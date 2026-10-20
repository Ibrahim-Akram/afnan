# Afnan storefront (Shopify Hydrogen)

A Hydrogen storefront for Afnan Perfumes built for the Shopify developer
assignment (Part A). Prices are in AED and the store works in English and
Arabic (right-to-left, under `/ar`).

It runs in two modes:

- **Mock mode** (default): no Shopify credentials needed. A built-in dummy
  Afnan catalogue in AED and a session cart drive every feature, and
  `/checkout-preview` shows the order the warehouse would receive.
- **Shopify mode**: set `PUBLIC_STORE_DOMAIN` and `PUBLIC_STOREFRONT_API_TOKEN`
  and the same pages read products and the cart from the Storefront API.
  See [docs/SHOPIFY_SETUP.md](docs/SHOPIFY_SETUP.md) for the admin setup.

## Run it

```bash
npm install
cp .env.example .env   # set SESSION_SECRET; leave Shopify values empty for mock mode
npm run dev            # http://localhost:3000
```

`npm run typecheck`, `npm run lint` and `npm run build` are the checks.

## What is where

| Assignment item | Where |
| --- | --- |
| Ramadan on/off (header, announcement bar, colours, banner) | `app/lib/ramadan.ts`, `app/styles/app.css` (`html[data-ramadan='on']`), `app/components/RamadanBanner.tsx` |
| Gifting landing page (Eid countdown, budget tabs, gift-set grid, FAQ) | `app/routes/($locale).pages.ramadan-gifts.tsx` → `/pages/ramadan-gifts` |
| Build-your-own gift box (any 3, set price AED 449) | `app/routes/($locale).gift-box.tsx` → `/gift-box` |
| Cart gift options (gift checkbox, 150-char message, AED 15 wrap) | `app/components/CartView.tsx`, `app/routes/($locale).cart.tsx` |
| Arabic RTL | `app/lib/i18n.ts`, every page also at `/ar/...` |
| Free gift with purchase (Femme Collection) | `app/lib/gifting.ts`, `app/components/FreeGiftNotice.tsx` |
| Loyalty landing page | `app/routes/($locale).loyalty.tsx` → `/loyalty` |
| Account loyalty widget | `app/components/LoyaltyWidget.tsx` → `/account` |
| Loyalty flow diagram | `public/loyalty-flow.svg` |
| Theme vs app split for loyalty | [docs/SHOPIFY_SETUP.md](docs/SHOPIFY_SETUP.md#loyalty-theme-vs-app) |

## Demo switches

- `?ramadan=on` / `?ramadan=off` previews the Ramadan look for your browser
  (also in the footer); `?ramadan=reset` returns to the store setting.
- `MOCK_SOLD_OUT=femme-free-gift` in `.env` makes the free gift sold out, to
  show the out-of-stock message.
- `EID_DATE` overrides the countdown target (default 10 March 2027, UAE time).
