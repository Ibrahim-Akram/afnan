import {data, useLoaderData, type HeadersFunction} from 'react-router';
import type {Route} from './+types/($locale).cart';
import {CartView} from '~/components/CartView';
import {syncManagedLines} from '~/lib/gifting';
import {assertLocaleParam, translate} from '~/lib/i18n';
import {CART_ATTR, LINE_ATTR, STORE} from '~/lib/store-config';
import type {Cart, CartLineInput} from '~/lib/commerce/types';

export type CartActionResult = {ok: boolean; error?: string; cart: Cart | null};

export const meta: Route.MetaFunction = ({matches}) => {
  const language = matches[0]?.loaderData?.locale.language ?? 'en';
  return [{title: `${translate(language, 'cart.title')} | Afnan`}];
};

export const headers: HeadersFunction = ({actionHeaders}) => actionHeaders;

export async function loader({params}: Route.LoaderArgs) {
  assertLocaleParam(params.locale);
  // The cart itself comes from the root loader so the header count and
  // this page always agree.
  return {};
}

export async function action({request, context}: Route.ActionArgs) {
  const {commerce, locale} = context;
  const form = await request.formData();
  const intent = String(form.get('intent') ?? '');
  const t = (key: Parameters<typeof translate>[1]) => translate(locale.language, key);
  let error: string | undefined;

  switch (intent) {
    case 'add': {
      const merchandiseId = String(form.get('merchandiseId') ?? '');
      const quantity = Math.max(1, Number(form.get('quantity') ?? 1) || 1);
      if (merchandiseId) await commerce.cart.addLines([{merchandiseId, quantity}]);
      break;
    }
    case 'update': {
      const id = String(form.get('lineId') ?? '');
      const quantity = Math.max(0, Number(form.get('quantity') ?? 0) || 0);
      if (id) await commerce.cart.updateLines([{id, quantity}]);
      break;
    }
    case 'remove': {
      const id = String(form.get('lineId') ?? '');
      if (id) await commerce.cart.removeLines([id]);
      break;
    }
    case 'addBox': {
      const result = await addGiftBox(form.getAll('perfume').map(String), commerce);
      if (result) error = t(result);
      break;
    }
    case 'giftOptions': {
      const isGift = form.get('isGift') === 'on';
      const message = String(form.get('giftMessage') ?? '').trim();
      const wrap = isGift && form.get('giftWrap') === 'on';
      if (message.length > STORE.giftMessageMaxLength) {
        error = t('cart.messageTooLong');
        break;
      }
      await commerce.cart.updateAttributes([
        {key: CART_ATTR.isGift, value: isGift ? 'Yes' : 'No'},
        {key: CART_ATTR.giftMessage, value: isGift ? message : ''},
        {key: CART_ATTR.giftWrap, value: wrap ? 'Yes' : 'No'},
      ]);
      break;
    }
    default:
      throw new Response(`Unknown cart intent "${intent}"`, {status: 400});
  }

  // Free gift and gift wrap lines follow whatever the customer just changed.
  const cart = await syncManagedLines(commerce);

  const headers = commerce.cart.headers();
  const redirectTo = form.get('redirectTo');
  if (typeof redirectTo === 'string' && redirectTo.startsWith('/') && !error) {
    headers.set('Location', redirectTo);
    return data<CartActionResult>({ok: true, cart}, {status: 303, headers});
  }

  return data<CartActionResult>({ok: !error, error, cart}, {headers, status: error ? 400 : 200});
}

/**
 * The box is one line of the box product at its set price, with the three
 * chosen perfumes as line properties so the warehouse can pick them.
 */
async function addGiftBox(
  handles: string[],
  commerce: Route.ActionArgs['context']['commerce'],
) {
  const unique = [...new Set(handles)];
  if (unique.length !== STORE.giftBoxSize) return 'box.pickMore' as const;

  const [box, ...perfumes] = await Promise.all([
    commerce.getProduct(STORE.products.giftBox),
    ...unique.map((h) => commerce.getProduct(h)),
  ]);
  const boxVariant = box?.variants.find((v) => v.availableForSale);
  if (!boxVariant) return 'box.unavailable' as const;

  const valid = perfumes.every(
    (p) =>
      p?.availableForSale &&
      p.collections.includes(STORE.collections.giftBoxPerfumes),
  );
  if (!valid) return 'box.unavailable' as const;

  const line: CartLineInput = {
    merchandiseId: boxVariant.id,
    quantity: 1,
    attributes: [
      {key: LINE_ATTR.giftBox, value: crypto.randomUUID().slice(0, 8)},
      ...perfumes.map((p, i) => ({key: `Perfume ${i + 1}`, value: p!.title})),
    ],
  };
  await commerce.cart.addLines([line]);
  return null;
}

export default function CartPage() {
  useLoaderData<typeof loader>();
  return (
    <div className="container page">
      <CartView />
    </div>
  );
}
