import type {HydrogenSession, Storefront} from '@shopify/hydrogen';

/** Eid al-Fitr 1448 AH is expected on 10 March 2027 (UAE time). */
const DEFAULT_EID_DATE = '2027-03-10T00:00:00+04:00';
const PREVIEW_KEY = 'ramadanPreview';

export type RamadanSettings = {
  enabled: boolean;
  eidDate: string;
  /** Where the on/off value came from, shown in the footer demo switch. */
  source: 'shopify' | 'env' | 'preview';
};

/**
 * The merchandiser switch. With a store connected it reads the
 * `afnan_settings` metaobject (Content → Metaobjects in Shopify admin), so
 * the Ramadan look can be turned on and off without a deploy. Without a
 * store it falls back to the RAMADAN_MODE env var. `?ramadan=on|off` sets a
 * per-visitor preview, and `?ramadan=reset` clears it.
 */
export async function getRamadanSettings({
  request,
  session,
  env,
  storefront,
  useShopify,
}: {
  request: Request;
  session: HydrogenSession;
  env: Env;
  storefront: Storefront;
  useShopify: boolean;
}): Promise<RamadanSettings> {
  let enabled = parseBool(env.RAMADAN_MODE) ?? true;
  let eidDate = env.EID_DATE || DEFAULT_EID_DATE;
  let source: RamadanSettings['source'] = 'env';

  if (useShopify) {
    try {
      const {metaobject} = await storefront.query(RAMADAN_SETTINGS_QUERY, {
        cache: storefront.CacheShort(),
      });
      const flag = parseBool(metaobject?.ramadanMode?.value);
      if (flag !== null) {
        enabled = flag;
        source = 'shopify';
      }
      if (metaobject?.eidDate?.value) eidDate = metaobject.eidDate.value;
    } catch (error) {
      console.error('Could not read afnan_settings metaobject', error);
    }
  }

  const param = new URL(request.url).searchParams.get('ramadan');
  if (param === 'reset') session.unset(PREVIEW_KEY);
  else if (param === 'on' || param === 'off') session.set(PREVIEW_KEY, param);

  const preview = session.get(PREVIEW_KEY) as string | undefined;
  if (preview === 'on' || preview === 'off') {
    enabled = preview === 'on';
    source = 'preview';
  }

  return {enabled, eidDate, source};
}

function parseBool(value: string | null | undefined): boolean | null {
  if (value == null || value === '') return null;
  return ['true', '1', 'on', 'yes'].includes(value.toLowerCase());
}

const RAMADAN_SETTINGS_QUERY = `#graphql
  query AfnanRamadanSettings {
    metaobject(handle: {type: "afnan_settings", handle: "storefront"}) {
      ramadanMode: field(key: "ramadan_mode") { value }
      eidDate: field(key: "eid_date") { value }
    }
  }
` as const;
