import type {Money} from '~/lib/commerce/types';
import {useLocale} from '~/lib/i18n';

export function Price({
  price,
  compareAtPrice,
  className = 'price',
}: {
  price: Money;
  compareAtPrice?: Money | null;
  className?: string;
}) {
  const {money} = useLocale();
  const onSale =
    compareAtPrice && Number(compareAtPrice.amount) > Number(price.amount);

  return (
    <span className={className}>
      <span className={onSale ? 'price__sale' : undefined}>{money(price)}</span>
      {onSale && <s className="price__compare">{money(compareAtPrice)}</s>}
    </span>
  );
}
