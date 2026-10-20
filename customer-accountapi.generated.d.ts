/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable eslint-comments/no-unlimited-disable */
/* eslint-disable */
import type * as CustomerAccountAPI from '@shopify/hydrogen/customer-account-api-types';

export type AfnanCustomerLoyaltyQueryVariables = CustomerAccountAPI.Exact<{
  [key: string]: never;
}>;

export type AfnanCustomerLoyaltyQuery = {
  customer: Pick<
    CustomerAccountAPI.Customer,
    'firstName' | 'lastName' | 'creationDate'
  > & {
    emailAddress?: CustomerAccountAPI.Maybe<
      Pick<CustomerAccountAPI.CustomerEmailAddress, 'emailAddress'>
    >;
    points?: CustomerAccountAPI.Maybe<
      Pick<CustomerAccountAPI.Metafield, 'value'>
    >;
    orders: {
      nodes: Array<
        Pick<
          CustomerAccountAPI.Order,
          | 'id'
          | 'name'
          | 'processedAt'
          | 'cancelledAt'
          | 'financialStatus'
          | 'fulfillmentStatus'
          | 'statusPageUrl'
        > & {
          subtotal?: CustomerAccountAPI.Maybe<
            Pick<CustomerAccountAPI.MoneyV2, 'amount' | 'currencyCode'>
          >;
          totalPrice: Pick<
            CustomerAccountAPI.MoneyV2,
            'amount' | 'currencyCode'
          >;
          lineItems: {
            nodes: Array<
              Pick<CustomerAccountAPI.LineItem, 'title' | 'quantity'>
            >;
          };
        }
      >;
    };
  };
};

interface GeneratedQueryTypes {
  '#graphql\n  query AfnanCustomerLoyalty {\n    customer {\n      firstName\n      lastName\n      creationDate\n      emailAddress { emailAddress }\n      points: metafield(namespace: "loyalty", key: "points") { value }\n      orders(first: 50, sortKey: PROCESSED_AT, reverse: true) {\n        nodes {\n          id\n          name\n          processedAt\n          cancelledAt\n          financialStatus\n          fulfillmentStatus\n          statusPageUrl\n          subtotal { amount currencyCode }\n          totalPrice { amount currencyCode }\n          lineItems(first: 3) { nodes { title quantity } }\n        }\n      }\n    }\n  }\n': {
    return: AfnanCustomerLoyaltyQuery;
    variables: AfnanCustomerLoyaltyQueryVariables;
  };
}

interface GeneratedMutationTypes {}

declare module '@shopify/hydrogen' {
  interface CustomerAccountQueries extends GeneratedQueryTypes {}
  interface CustomerAccountMutations extends GeneratedMutationTypes {}
}
