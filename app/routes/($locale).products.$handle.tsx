import {Link, useLoaderData, useRouteLoaderData, useSearchParams} from 'react-router';
import type {Route} from './+types/($locale).products.$handle';
import {assertLocaleParam, useLocale} from '~/lib/i18n';
import {ProductMedia} from '~/components/ProductMedia';
import {Price} from '~/components/Price';
import {AddToBag} from '~/components/AddToBag';
import {FreeGiftNotice} from '~/components/FreeGiftNotice';
import type {RootLoader} from '~/root';

export const meta: Route.MetaFunction = ({data}) => [
  {title: `${data?.product.title ?? ''} | Afnan`},
  {name: 'description', content: data?.product.description ?? ''},
];

export async function loader({params, context}: Route.LoaderArgs) {
  assertLocaleParam(params.locale);
  const product = await context.commerce.getProduct(params.handle);
  // Helper products (gift wrap, free gift, box) are managed by the cart.
  if (!product || product.tags.includes('hidden')) {
    throw new Response('Product not found', {status: 404});
  }
  return {product};
}

export default function ProductPage() {
  const {product} = useLoaderData<typeof loader>();
  const {t} = useLocale();
  const [params] = useSearchParams();
  const options = product.options ?? [];
  const fallback = product.variants.find((v) => v.availableForSale) ?? product.variants[0];

  // Selected options live in the URL (?Volume=100ml), like Shopify themes,
  // so a size can be linked to and survives a refresh.
  const selected = Object.fromEntries(
    options.map((o) => {
      const fromUrl = params.get(o.name);
      const value =
        fromUrl && o.values.includes(fromUrl)
          ? fromUrl
          : fallback?.selectedOptions?.find((so) => so.name === o.name)?.value ?? o.values[0];
      return [o.name, value];
    }),
  );
  const matches = (v: (typeof product.variants)[number], picks: Record<string, string>) =>
    Object.entries(picks).every(([name, value]) =>
      v.selectedOptions?.some((so) => so.name === name && so.value === value),
    );
  const variant = options.length
    ? product.variants.find((v) => matches(v, selected))
    : fallback;
  const valueAvailable = (name: string, value: string) =>
    product.variants.some((v) => v.availableForSale && matches(v, {...selected, [name]: value}));
  const linkFor = (name: string, value: string) => {
    const next = new URLSearchParams(params);
    next.set(name, value);
    return `?${next.toString()}`;
  };
  const offer = useRouteLoaderData<RootLoader>('root')?.giftOffer;
  const qualifies = Boolean(offer && product.collections.includes(offer.buyCollection));

  return (
    <div className="container page product">
      <div className="product__media">
        <ProductMedia
          key={variant?.id}
          image={variant?.image ?? product.image}
          art={product.art}
          title={product.title}
          sizes="(min-width: 48em) 50vw, 100vw"
        />
      </div>
      <div className="product__info">
        <p className="eyebrow">{t('product.vendor')} · {product.productType}</p>
        <h1>{product.title}</h1>
        <Price
          price={variant?.price ?? product.price}
          compareAtPrice={variant?.compareAtPrice}
          className="price price--large"
        />
        {options.map((option) => (
          <fieldset key={option.name} className="variant-picker">
            <legend className="variant-picker__label">
              {option.name}: <strong>{selected[option.name]}</strong>
            </legend>
            <div className="variant-picker__values">
              {option.values.map((value) => {
                const active = selected[option.name] === value;
                const available = valueAvailable(option.name, value);
                return (
                  <Link
                    key={value}
                    to={linkFor(option.name, value)}
                    replace
                    preventScrollReset
                    className={`chip variant-chip${active ? ' chip--active' : ''}${available ? '' : ' variant-chip--soldout'}`}
                    aria-current={active ? 'true' : undefined}
                    aria-label={available ? value : `${value} (${t('product.soldOut')})`}
                  >
                    {value}
                  </Link>
                );
              })}
            </div>
          </fieldset>
        ))}
        <p className="product__description">{product.description}</p>
        <FreeGiftNotice promo={qualifies} />
        {variant ? (
          <AddToBag variantId={variant.id} available={variant.availableForSale} />
        ) : (
          <p className="muted">{t('product.unavailableCombo')}</p>
        )}
      </div>
    </div>
  );
}
