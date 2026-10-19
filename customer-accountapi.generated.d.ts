/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable eslint-comments/no-unlimited-disable */
/* eslint-disable */
import type * as CustomerAccountAPI from '@shopify/hydrogen/customer-account-api-types';

export type AfnanCustomerLoyaltyQueryVariables = CustomerAccountAPI.Exact<{
  [key: string]: never;
}>;

export type AfnanCustomerLoyaltyQuery = {
  customer: Pick<CustomerAccountAPI.Customer, 'firstName'> & {
    points?: CustomerAccountAPI.Maybe<
      Pick<CustomerAccountAPI.Metafield, 'value'>
    >;
  };
};

interface GeneratedQueryTypes {
  '#graphql\n  query AfnanCustomerLoyalty {\n    customer {\n      firstName\n      points: metafield(namespace: "loyalty", key: "points") { value }\n    }\n  }\n': {
    return: AfnanCustomerLoyaltyQuery;
    variables: AfnanCustomerLoyaltyQueryVariables;
  };
}

interface GeneratedMutationTypes {}

declare module '@shopify/hydrogen' {
  interface CustomerAccountQueries extends GeneratedQueryTypes {}
  interface CustomerAccountMutations extends GeneratedMutationTypes {}
}
