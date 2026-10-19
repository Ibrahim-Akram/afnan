import {Link, useFetcher, useRouteLoaderData} from 'react-router';
import {useState} from 'react';
import type {RootLoader} from '~/root';
import type {Cart, CartLine} from '~/lib/commerce/types';
import type {CartActionResult} from '~/routes/($locale).cart';
import {useLocale} from '~/lib/i18n';
import {
  cartAttr,
  isFreeGiftLine,
  isGiftBoxLine,
  isGiftWrapLine,
  isManagedLine,
} from '~/lib/gifting';
import {CART_ATTR, STORE} from '~/lib/store-config';
import {ProductMedia} from './ProductMedia';
import {Price} from './Price';
import {FreeGiftNotice} from './FreeGiftNotice';

export function CartView() {
  const data = useRouteLoaderData<RootLoader>('root');
  const {t, path} = useLocale();
  const cart = data?.cart;
  const hasItems = Boolean(cart?.lines.some((l) => !isManagedLine(l)));

  if (!cart || !hasItems) {
    return (
      <section className="cart cart--empty">
        <h1>{t('cart.title')}</h1>
        <p>{t('cart.empty')}</p>
        <Link className="button" to={path('/collections')}>
          {t('cart.continue')}
        </Link>
      </section>
    );
  }

  const checkoutUrl =
    data?.mode === 'mock' ? path(cart.checkoutUrl) : cart.checkoutUrl;

  return (
    <section className="cart">
      <h1>{t('cart.title')}</h1>
      <div className="cart__layout">
        <div>
          <FreeGiftNotice />
          <ul className="cart__lines">
            {cart.lines.map((line) => (
              <CartLineItem key={line.id} line={line} />
            ))}
          </ul>
        </div>
        <aside className="cart__summary">
          <GiftOptions cart={cart} />
          <dl className="cart__totals">
            <div>
              <dt>{t('cart.subtotal')}</dt>
              <dd>
                <Price price={cart.cost.subtotal} />
              </dd>
            </div>
            <div className="cart__total">
              <dt>{t('cart.total')}</dt>
              <dd>
                <Price price={cart.cost.total} />
              </dd>
            </div>
          </dl>
          <p className="muted small">{t('cart.taxes')}</p>
          <a className="button button--block" href={checkoutUrl}>
            {t('cart.checkout')}
          </a>
        </aside>
      </div>
    </section>
  );
}

function CartLineItem({line}: {line: CartLine}) {
  const {t, path} = useLocale();
  const fetcher = useFetcher<CartActionResult>();
  const busy = fetcher.state !== 'idle';
  const free = isFreeGiftLine(line);
  const wrap = isGiftWrapLine(line);
  const box = isGiftBoxLine(line);
  const managed = free || wrap;
  const contents = box
    ? line.attributes.filter((a) => !a.key.startsWith('_'))
    : [];

  return (
    <li className={`cart-line${busy ? ' is-busy' : ''}${free ? ' cart-line--gift' : ''}`}>
      <div className="cart-line__media">
        <ProductMedia
          image={line.merchandise.image}
          art={line.merchandise.art}
          title={line.merchandise.product.title}
          sizes="96px"
        />
      </div>
      <div className="cart-line__body">
        {free && <span className="badge">{t('gwp.label')}</span>}
        {managed ? (
          <p className="cart-line__title">{line.merchandise.product.title}</p>
        ) : (
          <Link className="cart-line__title" to={path(`/products/${line.merchandise.product.handle}`)}>
            {line.merchandise.product.title}
          </Link>
        )}
        {wrap && <p className="muted small">{t('cart.giftWrapLine')}</p>}
        {box && (
          <div className="cart-line__box">
            <p className="small">{t('box.contents')}</p>
            <ul>
              {contents.map((a) => (
                <li key={a.key}>{a.value}</li>
              ))}
            </ul>
          </div>
        )}

        {!managed && (
          <div className="cart-line__controls">
            <fetcher.Form method="post" action="/cart" className="qty">
              <input type="hidden" name="intent" value="update" />
              <input type="hidden" name="lineId" value={line.id} />
              <button
                name="quantity"
                value={line.quantity - 1}
                aria-label={t('cart.decrease')}
                disabled={busy}
              >
                −
              </button>
              <span aria-label={t('cart.quantity')}>{line.quantity}</span>
              <button
                name="quantity"
                value={line.quantity + 1}
                aria-label={t('cart.increase')}
                disabled={busy}
              >
                +
              </button>
            </fetcher.Form>
            <fetcher.Form method="post" action="/cart">
              <input type="hidden" name="intent" value="remove" />
              <input type="hidden" name="lineId" value={line.id} />
              <button className="link-button" disabled={busy}>
                {t('cart.remove')}
              </button>
            </fetcher.Form>
          </div>
        )}
      </div>
      <div className="cart-line__price">
        {free ? (
          <span className="price">
            <span className="price__sale">{t('gwp.free')}</span>
            {line.cost.compareAtTotal && <Price price={line.cost.compareAtTotal} className="price__compare" />}
          </span>
        ) : (
          <Price price={line.cost.total} compareAtPrice={line.cost.compareAtTotal} />
        )}
      </div>
    </li>
  );
}

function GiftOptions({cart}: {cart: Cart}) {
  const {t, money} = useLocale();
  const fetcher = useFetcher<CartActionResult>({key: 'gift-options'});
  const savedGift = cartAttr(cart, CART_ATTR.isGift) === 'Yes';
  const [isGift, setIsGift] = useState(savedGift);
  const [message, setMessage] = useState(cartAttr(cart, CART_ATTR.giftMessage));
  const busy = fetcher.state !== 'idle';
  const left = STORE.giftMessageMaxLength - message.length;

  return (
    <fetcher.Form method="post" action="/cart" className="gift-options">
      <input type="hidden" name="intent" value="giftOptions" />
      <fieldset>
        <legend>{t('cart.giftOptions')}</legend>
        <label className="checkbox">
          <input
            type="checkbox"
            name="isGift"
            checked={isGift}
            onChange={(e) => setIsGift(e.target.checked)}
          />
          {t('cart.isGift')}
        </label>

        {isGift && (
          <>
            <label className="field">
              <span>{t('cart.message')}</span>
              <textarea
                name="giftMessage"
                maxLength={STORE.giftMessageMaxLength}
                rows={3}
                value={message}
                placeholder={t('cart.messagePlaceholder')}
                onChange={(e) => setMessage(e.target.value)}
                aria-describedby="gift-message-count"
              />
              <span id="gift-message-count" className="muted small" aria-live="polite">
                {t('cart.charsLeft', {count: left})}
              </span>
            </label>
            <label className="checkbox">
              <input
                type="checkbox"
                name="giftWrap"
                defaultChecked={cartAttr(cart, CART_ATTR.giftWrap) === 'Yes'}
              />
              {t('cart.wrap', {price: money({amount: STORE.giftWrapPrice, currencyCode: STORE.currency})})}
            </label>
          </>
        )}

        <button className="button button--outline button--block" disabled={busy}>
          {busy ? t('cart.saving') : t('cart.saveGift')}
        </button>
        <p role="status" aria-live="polite" className="small">
          {fetcher.state === 'idle' && fetcher.data?.ok && t('cart.saved')}
          {fetcher.data?.error && <span className="error">{fetcher.data.error}</span>}
        </p>
      </fieldset>
    </fetcher.Form>
  );
}
