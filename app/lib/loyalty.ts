/**
 * Programme rules shown on the storefront. In production the loyalty app
 * owns the ledger (points, tiers, redemptions); the theme only displays it.
 */
export const TIERS = [
  {id: 'silver', min: 0, multiplier: 1, birthday: true, shipping: false, early: false, samples: false},
  {id: 'gold', min: 1000, multiplier: 1.25, birthday: true, shipping: true, early: false, samples: true},
  {id: 'platinum', min: 2500, multiplier: 1.5, birthday: true, shipping: true, early: true, samples: true},
] as const;

export type TierId = (typeof TIERS)[number]['id'];

/** 100 points = AED 10 off at checkout. */
export const POINT_VALUE_AED = 0.1;

export function tierFor(points: number) {
  return [...TIERS].reverse().find((t) => points >= t.min) ?? TIERS[0];
}

export function progressFor(points: number) {
  const tier = tierFor(points);
  const index = TIERS.findIndex((t) => t.id === tier.id);
  const next = TIERS[index + 1];
  if (!next) return {tier, next: null, percent: 100, remaining: 0};
  const percent = Math.round(((points - tier.min) / (next.min - tier.min)) * 100);
  return {tier, next, percent, remaining: next.min - points};
}

/** Dummy balance until a loyalty app writes real values to the customer. */
export const DEMO_LOYALTY = {name: 'Mariam', points: 1640};
