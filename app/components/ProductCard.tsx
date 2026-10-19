import {Link} from 'react-router';
import type {Product} from '~/lib/commerce/types';
import {useLocale} from '~/lib/i18n';
import {ProductMedia} from './ProductMedia';
import {Price} from './Price';
import {AddToBag} from './AddToBag';

export function ProductCard({product, quickAdd = false}: {product: Product; quickAdd?: boolean}) {
  const {t, path} = useLocale();
  const variant = product.variants[0];
  const onSale =
    product.compareAtPrice &&
    Number(product.compareAtPrice.amount) > Number(product.price.amount);

  return (
    <article className="product-card">
      <Link to={path(`/products/${product.handle}`)} prefetch="intent" className="product-card__link">
        <div className="product-card__media">
          <ProductMedia image={product.image} art={product.art} title={product.title} />
          {!product.availableForSale && <span className="badge badge--muted">{t('product.soldOut')}</span>}
          {product.availableForSale && onSale && <span className="badge">{t('product.sale')}</span>}
        </div>
        <h3 className="product-card__title">{product.title}</h3>
        <Price price={product.price} compareAtPrice={product.compareAtPrice} />
      </Link>
      {quickAdd && variant && (
        <AddToBag variantId={variant.id} available={variant.availableForSale} compact />
      )}
    </article>
  );
}

export function ProductGrid({products, quickAdd}: {products: Product[]; quickAdd?: boolean}) {
  return (
    <div className="product-grid">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} quickAdd={quickAdd} />
      ))}
    </div>
  );
}
