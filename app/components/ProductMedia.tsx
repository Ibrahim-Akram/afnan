import type {BottleArt as Art, Image} from '~/lib/commerce/types';

/**
 * Product image from Shopify, or a generated bottle illustration for the
 * mock catalogue (so the demo ships without third-party photography).
 */
export function ProductMedia({
  image,
  art,
  title,
  sizes = '(min-width: 48em) 25vw, 50vw',
}: {
  image: Image | null;
  art?: Art;
  title: string;
  sizes?: string;
}) {
  if (image) {
    return (
      <img
        className="product-media"
        src={`${image.url}${image.url.includes('?') ? '&' : '?'}width=800`}
        alt={image.altText || title}
        sizes={sizes}
        loading="lazy"
      />
    );
  }
  return <BottleArt art={art} title={title} />;
}

export function BottleArt({art, title}: {art?: Art; title: string}) {
  const {liquid, cap, shape} = art ?? {liquid: '#d9c7a3', cap: '#1d1d1f', shape: 'round'};
  const body = {
    tall: {x: 70, y: 70, w: 60, h: 110, r: 8},
    round: {x: 55, y: 90, w: 90, h: 90, r: 45},
    square: {x: 55, y: 85, w: 90, h: 95, r: 6},
    oud: {x: 60, y: 80, w: 80, h: 100, r: 28},
  }[shape];
  const capW = shape === 'oud' ? 34 : 28;
  const capH = shape === 'tall' ? 34 : 26;
  const capY = body.y - capH - 6;

  return (
    <svg className="product-media product-media--art" viewBox="0 0 200 220" role="img" aria-label={title}>
      <rect width="200" height="220" fill="var(--media-bg)" />
      <ellipse cx="100" cy="196" rx="58" ry="7" fill="#000" opacity=".08" />
      <rect x={100 - 9} y={body.y - 8} width="18" height="10" fill="#cfc7b8" />
      <rect x={100 - capW / 2} y={capY} width={capW} height={capH} rx="3" fill={cap} />
      <rect
        x={body.x}
        y={body.y}
        width={body.w}
        height={body.h}
        rx={body.r}
        fill={liquid}
        opacity=".92"
      />
      <rect
        x={body.x + 6}
        y={body.y + 6}
        width={Math.max(body.w * 0.18, 8)}
        height={body.h - 12}
        rx={Math.min(body.r, 6)}
        fill="#fff"
        opacity=".22"
      />
      <rect x={100 - 30} y={body.y + body.h / 2 - 11} width="60" height="22" fill="#fff" opacity=".85" />
      <text
        x="100"
        y={body.y + body.h / 2 + 4}
        textAnchor="middle"
        fontSize="11"
        letterSpacing="3"
        fontFamily="Georgia, serif"
        fill="#1d1b19"
      >
        AFNAN
      </text>
    </svg>
  );
}
