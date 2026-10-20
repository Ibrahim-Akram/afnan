import {Link, useRouteLoaderData} from 'react-router';
import {motion} from 'framer-motion';
import type {RootLoader} from '~/root';
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
  const ramadan = Boolean(useRouteLoaderData<RootLoader>('root')?.ramadan.enabled);
  if (!ramadan) {
    return (
      <div className="product-grid">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} quickAdd={quickAdd} />
        ))}
      </div>
    );
  }
  // Ramadan: cards rise in one after another as they scroll into view.
  return (
    <div className="product-grid">
      {products.map((product, i) => (
        <motion.div
          key={product.id}
          className="product-grid__cell"
          initial={{opacity: 0, y: 28}}
          whileInView={{opacity: 1, y: 0}}
          viewport={{once: true, margin: '0px 0px -40px 0px'}}
          transition={{duration: 0.55, delay: (i % 4) * 0.08, ease: [0.16, 1, 0.3, 1]}}
          whileHover={{y: -6}}
        >
          <ProductCard product={product} quickAdd={quickAdd} />
        </motion.div>
      ))}
    </div>
  );
}
