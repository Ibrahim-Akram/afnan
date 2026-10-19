/// <reference types="vite/client" />
/// <reference types="react-router" />
/// <reference types="@shopify/oxygen-workers-types" />
/// <reference types="@shopify/hydrogen/react-router-types" />

// Enhance TypeScript's built-in typings.
import '@total-typescript/ts-reset';

declare global {
  interface Env {
    /** "true"/"false": Ramadan look when no Shopify setting is available. */
    RAMADAN_MODE?: string;
    /** ISO date-time of Eid for the countdown, e.g. 2027-03-10T00:00:00+04:00. */
    EID_DATE?: string;
    /** Mock mode only: comma-separated product handles to treat as sold out. */
    MOCK_SOLD_OUT?: string;
  }
}
