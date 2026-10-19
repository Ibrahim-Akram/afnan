// NOTE: https://shopify.dev/docs/api/customer/latest/queries/customer
export const CUSTOMER_LOYALTY_QUERY = `#graphql
  query AfnanCustomerLoyalty {
    customer {
      firstName
      points: metafield(namespace: "loyalty", key: "points") { value }
    }
  }
` as const;
