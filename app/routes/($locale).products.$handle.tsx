import {useLoaderData} from 'react-router';
import type {Route} from './+types/($locale).products.$handle';
import {assertLocaleParam, useLocale} from '~/lib/i18n';
import {ProductMedia} from '~/components/ProductMedia';
import {Price} from '~/components/Price';
import {AddToBag} from '~/components/AddToBag';
import {FreeGiftNotice} from '~/components/FreeGiftNotice';
import {STORE} from '~/lib/store-config';

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
  const variant = product.variants.find((v) => v.availableForSale) ?? product.variants[0];
  const qualifies = product.collections.includes(STORE.collections.femme);

  return (
    <div className="container page product">
      <div className="product__media">
        <ProductMedia
          image={product.image}
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
        <p className="product__description">{product.description}</p>
        <FreeGiftNotice promo={qualifies} />
        {variant && <AddToBag variantId={variant.id} available={variant.availableForSale} />}
      </div>
    </div>
  );
}
