import {NavLink, Link, useLocation, useRouteLoaderData} from 'react-router';
import {useEffect, useRef} from 'react';
import type {RootLoader} from '~/root';
import {switchLocalePath, useLocale, type MessageKey} from '~/lib/i18n';
import {BagIcon, Crescent, MenuIcon, UserIcon} from './Icons';

type NavItem = {key: MessageKey; to: string; ramadanOnly?: boolean};

const NAV: NavItem[] = [
  {key: 'nav.ramadan', to: '/pages/ramadan-gifts', ramadanOnly: true},
  {key: 'nav.women', to: '/collections/femme-collection'},
  {key: 'nav.men', to: '/collections/homme'},
  {key: 'nav.oud', to: '/collections/oud'},
  {key: 'nav.giftSets', to: '/collections/gift-sets'},
  {key: 'nav.buildBox', to: '/gift-box'},
  {key: 'nav.loyalty', to: '/loyalty'},
];

export function Header() {
  const data = useRouteLoaderData<RootLoader>('root');
  const {t, path, locale} = useLocale();
  const {pathname, search} = useLocation();
  const menuRef = useRef<HTMLDetailsElement>(null);
  const ramadan = Boolean(data?.ramadan.enabled);
  const items = NAV.filter((item) => !item.ramadanOnly || ramadan);
  const count = data?.cart?.totalQuantity ?? 0;
  const other = locale.language === 'ar' ? 'en' : 'ar';

  // Close the mobile menu after navigating.
  useEffect(() => {
    menuRef.current?.removeAttribute('open');
  }, [pathname]);

  const links = items.map((item) => (
    <NavLink
      key={item.to}
      to={path(item.to)}
      prefetch="intent"
      className={item.ramadanOnly ? 'nav-link nav-link--ramadan' : 'nav-link'}
    >
      {item.ramadanOnly && <Crescent />}
      {t(item.key)}
    </NavLink>
  ));

  return (
    <header className="header">
      <div className="header__inner container">
        <details className="mobile-menu" ref={menuRef}>
          <summary aria-label={t('nav.menu')}>
            <MenuIcon />
          </summary>
          <nav className="mobile-menu__panel" aria-label={t('nav.menu')}>
            {links}
          </nav>
        </details>

        <Link to={path('/')} className="logo" aria-label="Afnan home">
          {ramadan && <Crescent className="logo__crescent" />}
          <span className="logo__word">AFNAN</span>
          <span className="logo__sub">{t('brand.tagline')}</span>
        </Link>

        <nav className="header__nav" aria-label="Main">
          {links}
        </nav>

        <div className="header__actions">
          <Link
            to={switchLocalePath(pathname, other) + search}
            // A full load: `/` and `/ar` match the same route, so a client
            // navigation would keep the old language's loader data.
            reloadDocument
            className="lang-switch"
            aria-label={t('nav.languageLabel')}
            lang={other}
          >
            {t('nav.language')}
          </Link>
          <Link to={path('/account')} aria-label={t('nav.account')} className="icon-link">
            <UserIcon />
          </Link>
          <Link to={path('/cart')} aria-label={`${t('nav.cart')} (${count})`} className="icon-link">
            <BagIcon />
            {count > 0 && <span className="bag-count">{count}</span>}
          </Link>
        </div>
      </div>
    </header>
  );
}
