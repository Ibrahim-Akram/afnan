import type {BottleArt} from './types';
import {MOCK_PRODUCTS} from './mock-data';

const PALETTE: BottleArt[] = [
  {liquid: '#f2a7c3', cap: '#1d1d1f', shape: 'round'},
  {liquid: '#7a4a24', cap: '#c9a24a', shape: 'oud'},
  {liquid: '#1f5aa6', cap: '#c9a24a', shape: 'tall'},
  {liquid: '#c0c6cf', cap: '#3a3f47', shape: 'square'},
  {liquid: '#b23a5b', cap: '#d8c7a0', shape: 'tall'},
  {liquid: '#f7d9a8', cap: '#c9a24a', shape: 'square'},
];

/**
 * Bottle illustration for a product without a photo. Products that share a
 * handle with the mock catalogue keep its colours; anything else gets a
 * stable pick from the palette, so the grid never shows identical bottles.
 */
export function artFor(handle: string): BottleArt {
  const known = MOCK_PRODUCTS.find((p) => p.handle === handle);
  if (known) return known.art;
  let hash = 0;
  for (const ch of handle) hash = (hash * 31 + ch.charCodeAt(0)) | 0;
  return PALETTE[Math.abs(hash) % PALETTE.length];
}
