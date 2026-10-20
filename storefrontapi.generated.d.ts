/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable eslint-comments/no-unlimited-disable */
/* eslint-disable */
import type * as StorefrontAPI from '@shopify/hydrogen/storefront-api-types';

export type AfnanProductFragment = Pick<
  StorefrontAPI.Product,
  | 'id'
  | 'handle'
  | 'title'
  | 'description'
  | 'vendor'
  | 'productType'
  | 'tags'
  | 'availableForSale'
> & {
  featuredImage?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.Image, 'url' | 'altText'>
  >;
  collections: {nodes: Array<Pick<StorefrontAPI.Collection, 'handle'>>};
  priceRange: {
    minVariantPrice: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
  };
  compareAtPriceRange: {
    minVariantPrice: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
  };
  options: Array<
    Pick<StorefrontAPI.ProductOption, 'name'> & {
      optionValues: Array<Pick<StorefrontAPI.ProductOptionValue, 'name'>>;
    }
  >;
  variants: {
    nodes: Array<
      Pick<
        StorefrontAPI.ProductVariant,
        'id' | 'title' | 'availableForSale'
      > & {
        price: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
        compareAtPrice?: StorefrontAPI.Maybe<
          Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
        >;
        selectedOptions: Array<
          Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>
        >;
        image?: StorefrontAPI.Maybe<
          Pick<StorefrontAPI.Image, 'url' | 'altText'>
        >;
      }
    >;
  };
};

export type AfnanProductByHandleQueryVariables = StorefrontAPI.Exact<{
  handle: StorefrontAPI.Scalars['String']['input'];
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
}>;

export type AfnanProductByHandleQuery = {
  product?: StorefrontAPI.Maybe<
    Pick<
      StorefrontAPI.Product,
      | 'id'
      | 'handle'
      | 'title'
      | 'description'
      | 'vendor'
      | 'productType'
      | 'tags'
      | 'availableForSale'
    > & {
      featuredImage?: StorefrontAPI.Maybe<
        Pick<StorefrontAPI.Image, 'url' | 'altText'>
      >;
      collections: {nodes: Array<Pick<StorefrontAPI.Collection, 'handle'>>};
      priceRange: {
        minVariantPrice: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
      };
      compareAtPriceRange: {
        minVariantPrice: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
      };
      options: Array<
        Pick<StorefrontAPI.ProductOption, 'name'> & {
          optionValues: Array<Pick<StorefrontAPI.ProductOptionValue, 'name'>>;
        }
      >;
      variants: {
        nodes: Array<
          Pick<
            StorefrontAPI.ProductVariant,
            'id' | 'title' | 'availableForSale'
          > & {
            price: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
            compareAtPrice?: StorefrontAPI.Maybe<
              Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
            >;
            selectedOptions: Array<
              Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>
            >;
            image?: StorefrontAPI.Maybe<
              Pick<StorefrontAPI.Image, 'url' | 'altText'>
            >;
          }
        >;
      };
    }
  >;
};

export type AfnanProductsQueryVariables = StorefrontAPI.Exact<{
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
}>;

export type AfnanProductsQuery = {
  products: {
    nodes: Array<
      Pick<
        StorefrontAPI.Product,
        | 'id'
        | 'handle'
        | 'title'
        | 'description'
        | 'vendor'
        | 'productType'
        | 'tags'
        | 'availableForSale'
      > & {
        featuredImage?: StorefrontAPI.Maybe<
          Pick<StorefrontAPI.Image, 'url' | 'altText'>
        >;
        collections: {nodes: Array<Pick<StorefrontAPI.Collection, 'handle'>>};
        priceRange: {
          minVariantPrice: Pick<
            StorefrontAPI.MoneyV2,
            'amount' | 'currencyCode'
          >;
        };
        compareAtPriceRange: {
          minVariantPrice: Pick<
            StorefrontAPI.MoneyV2,
            'amount' | 'currencyCode'
          >;
        };
        options: Array<
          Pick<StorefrontAPI.ProductOption, 'name'> & {
            optionValues: Array<Pick<StorefrontAPI.ProductOptionValue, 'name'>>;
          }
        >;
        variants: {
          nodes: Array<
            Pick<
              StorefrontAPI.ProductVariant,
              'id' | 'title' | 'availableForSale'
            > & {
              price: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
              compareAtPrice?: StorefrontAPI.Maybe<
                Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
              >;
              selectedOptions: Array<
                Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>
              >;
              image?: StorefrontAPI.Maybe<
                Pick<StorefrontAPI.Image, 'url' | 'altText'>
              >;
            }
          >;
        };
      }
    >;
  };
};

export type AfnanCollectionQueryVariables = StorefrontAPI.Exact<{
  handle: StorefrontAPI.Scalars['String']['input'];
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
}>;

export type AfnanCollectionQuery = {
  collection?: StorefrontAPI.Maybe<
    Pick<
      StorefrontAPI.Collection,
      'id' | 'handle' | 'title' | 'description'
    > & {
      products: {
        nodes: Array<
          Pick<
            StorefrontAPI.Product,
            | 'id'
            | 'handle'
            | 'title'
            | 'description'
            | 'vendor'
            | 'productType'
            | 'tags'
            | 'availableForSale'
          > & {
            featuredImage?: StorefrontAPI.Maybe<
              Pick<StorefrontAPI.Image, 'url' | 'altText'>
            >;
            collections: {
              nodes: Array<Pick<StorefrontAPI.Collection, 'handle'>>;
            };
            priceRange: {
              minVariantPrice: Pick<
                StorefrontAPI.MoneyV2,
                'amount' | 'currencyCode'
              >;
            };
            compareAtPriceRange: {
              minVariantPrice: Pick<
                StorefrontAPI.MoneyV2,
                'amount' | 'currencyCode'
              >;
            };
            options: Array<
              Pick<StorefrontAPI.ProductOption, 'name'> & {
                optionValues: Array<
                  Pick<StorefrontAPI.ProductOptionValue, 'name'>
                >;
              }
            >;
            variants: {
              nodes: Array<
                Pick<
                  StorefrontAPI.ProductVariant,
                  'id' | 'title' | 'availableForSale'
                > & {
                  price: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
                  compareAtPrice?: StorefrontAPI.Maybe<
                    Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
                  >;
                  selectedOptions: Array<
                    Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>
                  >;
                  image?: StorefrontAPI.Maybe<
                    Pick<StorefrontAPI.Image, 'url' | 'altText'>
                  >;
                }
              >;
            };
          }
        >;
      };
    }
  >;
};

export type AfnanCollectionsQueryVariables = StorefrontAPI.Exact<{
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
}>;

export type AfnanCollectionsQuery = {
  collections: {
    nodes: Array<
      Pick<StorefrontAPI.Collection, 'id' | 'handle' | 'title' | 'description'>
    >;
  };
};

export type CartApiQueryFragment = Pick<
  StorefrontAPI.Cart,
  'id' | 'checkoutUrl' | 'totalQuantity' | 'note'
> & {
  attributes: Array<Pick<StorefrontAPI.Attribute, 'key' | 'value'>>;
  cost: {
    subtotalAmount: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
    totalAmount: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
  };
  lines: {
    nodes: Array<
      | (Pick<StorefrontAPI.CartLine, 'id' | 'quantity'> & {
          attributes: Array<Pick<StorefrontAPI.Attribute, 'key' | 'value'>>;
          cost: {
            totalAmount: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
            subtotalAmount: Pick<
              StorefrontAPI.MoneyV2,
              'amount' | 'currencyCode'
            >;
          };
          merchandise: {__typename: 'ProductVariant'} & Pick<
            StorefrontAPI.ProductVariant,
            'id' | 'title' | 'availableForSale'
          > & {
              price: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
              image?: StorefrontAPI.Maybe<
                Pick<StorefrontAPI.Image, 'url' | 'altText'>
              >;
              product: Pick<StorefrontAPI.Product, 'handle' | 'title'> & {
                collections: {
                  nodes: Array<Pick<StorefrontAPI.Collection, 'handle'>>;
                };
              };
            };
        })
      | (Pick<StorefrontAPI.ComponentizableCartLine, 'id' | 'quantity'> & {
          attributes: Array<Pick<StorefrontAPI.Attribute, 'key' | 'value'>>;
          cost: {
            totalAmount: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
            subtotalAmount: Pick<
              StorefrontAPI.MoneyV2,
              'amount' | 'currencyCode'
            >;
          };
          merchandise: {__typename: 'ProductVariant'} & Pick<
            StorefrontAPI.ProductVariant,
            'id' | 'title' | 'availableForSale'
          > & {
              price: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
              image?: StorefrontAPI.Maybe<
                Pick<StorefrontAPI.Image, 'url' | 'altText'>
              >;
              product: Pick<StorefrontAPI.Product, 'handle' | 'title'> & {
                collections: {
                  nodes: Array<Pick<StorefrontAPI.Collection, 'handle'>>;
                };
              };
            };
        })
    >;
  };
};

export type AfnanGiftOfferQueryVariables = StorefrontAPI.Exact<{
  [key: string]: never;
}>;

export type AfnanGiftOfferQuery = {
  metaobject?: StorefrontAPI.Maybe<{
    buyCollection?: StorefrontAPI.Maybe<{
      reference?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Collection, 'handle'>>;
    }>;
    getProduct?: StorefrontAPI.Maybe<{
      reference?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Product, 'handle'>>;
    }>;
    getCollection?: StorefrontAPI.Maybe<{
      reference?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Collection, 'handle'>>;
    }>;
  }>;
};

export type AfnanRamadanSettingsQueryVariables = StorefrontAPI.Exact<{
  [key: string]: never;
}>;

export type AfnanRamadanSettingsQuery = {
  metaobject?: StorefrontAPI.Maybe<{
    ramadanMode?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.MetaobjectField, 'value'>
    >;
    eidDate?: StorefrontAPI.Maybe<Pick<StorefrontAPI.MetaobjectField, 'value'>>;
  }>;
};

interface GeneratedQueryTypes {
  '#graphql\n  query AfnanProductByHandle($handle: String!, $country: CountryCode, $language: LanguageCode)\n  @inContext(country: $country, language: $language) {\n    product(handle: $handle) { ...AfnanProduct }\n  }\n  #graphql\n  fragment AfnanProduct on Product {\n    id\n    handle\n    title\n    description\n    vendor\n    productType\n    tags\n    availableForSale\n    featuredImage { url altText }\n    collections(first: 20) { nodes { handle } }\n    priceRange { minVariantPrice { amount currencyCode } }\n    compareAtPriceRange { minVariantPrice { amount currencyCode } }\n    options(first: 3) { name optionValues { name } }\n    variants(first: 50) {\n      nodes {\n        id\n        title\n        availableForSale\n        price { amount currencyCode }\n        compareAtPrice { amount currencyCode }\n        selectedOptions { name value }\n        image { url altText }\n      }\n    }\n  }\n\n': {
    return: AfnanProductByHandleQuery;
    variables: AfnanProductByHandleQueryVariables;
  };
  '#graphql\n  query AfnanProducts($country: CountryCode, $language: LanguageCode)\n  @inContext(country: $country, language: $language) {\n    products(first: 100, sortKey: BEST_SELLING) { nodes { ...AfnanProduct } }\n  }\n  #graphql\n  fragment AfnanProduct on Product {\n    id\n    handle\n    title\n    description\n    vendor\n    productType\n    tags\n    availableForSale\n    featuredImage { url altText }\n    collections(first: 20) { nodes { handle } }\n    priceRange { minVariantPrice { amount currencyCode } }\n    compareAtPriceRange { minVariantPrice { amount currencyCode } }\n    options(first: 3) { name optionValues { name } }\n    variants(first: 50) {\n      nodes {\n        id\n        title\n        availableForSale\n        price { amount currencyCode }\n        compareAtPrice { amount currencyCode }\n        selectedOptions { name value }\n        image { url altText }\n      }\n    }\n  }\n\n': {
    return: AfnanProductsQuery;
    variables: AfnanProductsQueryVariables;
  };
  '#graphql\n  query AfnanCollection($handle: String!, $country: CountryCode, $language: LanguageCode)\n  @inContext(country: $country, language: $language) {\n    collection(handle: $handle) {\n      id\n      handle\n      title\n      description\n      products(first: 100) { nodes { ...AfnanProduct } }\n    }\n  }\n  #graphql\n  fragment AfnanProduct on Product {\n    id\n    handle\n    title\n    description\n    vendor\n    productType\n    tags\n    availableForSale\n    featuredImage { url altText }\n    collections(first: 20) { nodes { handle } }\n    priceRange { minVariantPrice { amount currencyCode } }\n    compareAtPriceRange { minVariantPrice { amount currencyCode } }\n    options(first: 3) { name optionValues { name } }\n    variants(first: 50) {\n      nodes {\n        id\n        title\n        availableForSale\n        price { amount currencyCode }\n        compareAtPrice { amount currencyCode }\n        selectedOptions { name value }\n        image { url altText }\n      }\n    }\n  }\n\n': {
    return: AfnanCollectionQuery;
    variables: AfnanCollectionQueryVariables;
  };
  '#graphql\n  query AfnanCollections($country: CountryCode, $language: LanguageCode)\n  @inContext(country: $country, language: $language) {\n    collections(first: 20) { nodes { id handle title description } }\n  }\n': {
    return: AfnanCollectionsQuery;
    variables: AfnanCollectionsQueryVariables;
  };
  '#graphql\n  query AfnanGiftOffer {\n    metaobject(handle: {type: "afnan_settings", handle: "storefront"}) {\n      buyCollection: field(key: "gift_buy_collection") {\n        reference { ... on Collection { handle } }\n      }\n      getProduct: field(key: "gift_product") {\n        reference { ... on Product { handle } }\n      }\n      getCollection: field(key: "gift_collection") {\n        reference { ... on Collection { handle } }\n      }\n    }\n  }\n': {
    return: AfnanGiftOfferQuery;
    variables: AfnanGiftOfferQueryVariables;
  };
  '#graphql\n  query AfnanRamadanSettings {\n    metaobject(handle: {type: "afnan_settings", handle: "storefront"}) {\n      ramadanMode: field(key: "ramadan_mode") { value }\n      eidDate: field(key: "eid_date") { value }\n    }\n  }\n': {
    return: AfnanRamadanSettingsQuery;
    variables: AfnanRamadanSettingsQueryVariables;
  };
}

interface GeneratedMutationTypes {}

declare module '@shopify/hydrogen' {
  interface StorefrontQueries extends GeneratedQueryTypes {}
  interface StorefrontMutations extends GeneratedMutationTypes {}
}
