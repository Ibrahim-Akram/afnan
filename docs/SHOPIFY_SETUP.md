# Connecting a Shopify store

The storefront switches from mock data to the Storefront API as soon as
`PUBLIC_STORE_DOMAIN` and `PUBLIC_STOREFRONT_API_TOKEN` are set. Keep the
handles below so both modes behave the same (they live in
`app/lib/store-config.ts`).

## 1. Credentials

1. Create a development store from the Shopify Partner dashboard.
2. Install the **Hydrogen** (or **Headless**) sales channel and create a
   storefront. Copy the public Storefront API token.
3. Put the values in `.env` locally (or in the Oxygen environment). Never
   commit them:
   ```
   PUBLIC_STORE_DOMAIN="your-store.myshopify.com"
   PUBLIC_STOREFRONT_API_TOKEN="..."
   ```
   `npx shopify hydrogen link` followed by `npx shopify hydrogen env pull`
   fills these in automatically, including the Customer Account API values.
4. Settings → General → Store defaults: set the store currency to **AED**.
   Development stores can't add a second currency, so AED has to be the
   main one. Then Settings → Markets: add the United Arab Emirates. The
   storefront queries with country `AE`, so prices come back in AED.
5. Settings → Shipping and delivery: add a UAE shipping zone. Without one,
   tracked products report as sold out to `AE` buyers.
6. Settings → Languages: add Arabic and translate products with
   *Translate & Adapt*. `/ar` pages query with language `AR`.

## 2. Products and collections

| Handle | Type | Notes |
| --- | --- | --- |
| `femme-collection` | Collection | Buy X of the free-gift offer |
| `homme`, `oud` | Collections | Navigation |
| `gift-sets` | Collection | Grid on the gifting page, split by price into the budget tabs |
| `gift-box-perfumes` | Collection | Perfumes that can go in the build-your-own box |
| `build-your-own-gift-box` | Product, AED 449, tag `hidden` | One line per box; the three picks are line properties |
| `gift-wrap` | Product, AED 15, tag `hidden` | Added and removed by the cart gift options |
| `femme-free-gift` | Product, tag `hidden` | The free gift; track inventory so it can sell out |

The mock catalogue in `app/lib/commerce/mock-data.ts` lists sample titles and
AED prices to copy.

## 3. Ramadan switch (no developer needed)

Settings → Custom data → Metaobjects → add definition:

- Type `afnan_settings`, Storefront API access **on**.
- Fields: `ramadan_mode` (True or false), `eid_date` (Date and time).

Create one entry with handle `storefront`. Merchandisers then flip
`ramadan_mode` in Content → Metaobjects and the header, announcement bar,
colours and home banner change on the next page load. Turning it off
returns the normal look.

## 4. Free gift with purchase (Buy X Get Y)

Discounts → Create discount → **Buy X get Y**, method **Automatic**:

- Customer buys: minimum quantity 1, items from collection `femme-collection`.
- Customer gets: quantity 1 of product `femme-free-gift`, **Free**.
- Maximum number of uses per order: **1**.

The storefront (`app/lib/gifting.ts`) adds the gift line when a Femme product
is in the cart, removes it when the last one goes, keeps it at quantity 1,
and shows a message instead of adding it when the gift is out of stock. The
discount makes it free at checkout.

## 5. Gift options on the order

The cart saves these cart attributes, which show on the order under
**Additional details** and on packing slips that print `attributes`:

- `Gift`: Yes or No
- `Gift message`: up to 150 characters (validated on the server too)
- `Gift wrap`: Yes or No, plus a `gift-wrap` line at AED 15

The gift box line carries `Perfume 1`, `Perfume 2` and `Perfume 3` as line
properties, so the warehouse knows what to pack.

A note on stock: with this approach the three picked perfumes are not
decremented by Shopify. On Shopify Plus, a Cart Transform function can
expand the box into its components so inventory tracks properly; the
storefront code stays the same.

## 6. Loyalty: theme vs app

Install one free loyalty app (for example Smile, Rivo or Joy on its free
plan) and match its rules to the flow diagram (`public/loyalty-flow.svg`).

**The theme (this storefront) owns presentation:**

- The loyalty landing page: how it works, tier table, ways to earn, sign-up.
- The account widget: balance, tier and progress bar, read from customer
  metafields (`loyalty.points`) that the app keeps in sync.
- Brand, Arabic copy and RTL layout, which apps' embedded widgets rarely get
  right.

**The app owns anything that must be correct and secure:**

- The points ledger and history, including refunds and cancellations.
- Earning rules triggered by back-end events: orders, approved reviews,
  birthdays and referrals.
- Tier calculation, upgrades and yearly downgrades.
- Redemption: issuing one-time discount codes at checkout and deducting
  points.
- Fraud checks (self-referrals, review abuse) and customer emails.

Why: points are money-like, so they belong in a system with an audit trail
and webhooks, not in front-end code a customer can tamper with. Keeping the
display in the storefront means the experience stays on-brand, fast and
bilingual, and the app can be swapped without redesigning pages.
